"""
AI Triage Module
=================
`run_ai_triage(case, candidate_organisations)` decides, for a submitted case:
  - urgency: "High" | "Medium" | "Low"
  - urgency_reason: short plain-language explanation
  - matches: 2-3 organisations from the candidates list, each with a reason
  - letter: a drafted referral letter (150-220 words)

It calls the Groq API when GROQ_API_KEY is set, and otherwise falls back to a
deterministic rule-based engine so the app works fully offline / without a key.
The return shape (TriageResult) is the CONTRACT the rest of the backend depends
on — keep it stable (or update routers/referrals.py if it changes).
"""

import json
import os
import re
from typing import List, TypedDict
from groq import Groq
import httpx

from app.models import Case, Organisation

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL_NAME = "llama-3.3-70b-versatile"


class OrgMatch(TypedDict):
    organisation_id: int
    name: str
    why: str


class TriageResult(TypedDict):
    urgency: str
    urgency_reason: str
    matches: List[OrgMatch]
    letter: str


# ---- Configuration ---------------------------------------------------------

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

VALID_URGENCY = {"High", "Medium", "Low"}

# Keyword signals used both to help the model and to drive the offline fallback.
HIGH_SIGNALS = [
    "no food", "no meal", "not eaten", "haven't eaten", "havent eaten",
    "starving", "starvation", "days without", "no cooked meal", "infant",
    "newborn", "baby", "pregnant", "sick", "ill", "hospital", "disabled",
    "elderly", "emergency", "urgent", "malnourished", "malnutrition",
]
MEDIUM_SIGNALS = [
    "lost job", "unemployed", "no income", "cannot afford", "can't afford",
    "cant afford", "rent", "debt", "struggling", "widow", "widowed", "alone",
]


# ---- Public entrypoint -----------------------------------------------------

def run_ai_triage(case: Case, candidate_organisations: List[Organisation]) -> TriageResult:
    """Triage a case. Uses Groq when configured, else the rule-based fallback."""
    if GROQ_API_KEY:
        try:
            return _run_groq_triage(case, candidate_organisations)
        except Exception as exc:  # noqa: BLE001 — never fail the request over AI
            print(f"[ai_triage] Groq call failed ({exc!r}); using rule-based fallback.")
    return _run_rule_based_triage(case, candidate_organisations)


# ---- Groq implementation ---------------------------------------------------

def _build_prompt(case: Case, orgs: List[Organisation]) -> str:
    org_lines = "\n".join(
        f"- id={o.id} | {o.name} | area={o.area or 'N/A'} | focus={o.focus or 'general food relief'}"
        for o in orgs
    )
    return (
        "You are a triage officer for a Pakistani food-insecurity relief network. "
        "Assess the case below and pick the best matching organisations from the list.\n\n"
        f"CASE {case.case_code}\n"
        f"City: {case.city}\n"
        f"Area: {case.area or 'N/A'}\n"
        f"Household size: {case.household_size or 'unknown'}\n"
        f"Beneficiary: {case.beneficiary_name or 'anonymous'}\n"
        f"Situation: {case.situation_notes}\n\n"
        "CANDIDATE ORGANISATIONS (only pick organisation_id values from here):\n"
        f"{org_lines}\n\n"
        "Respond with ONLY a JSON object, no markdown, in exactly this shape:\n"
        "{\n"
        '  "urgency": "High" | "Medium" | "Low",\n'
        '  "urgency_reason": "one or two sentences",\n'
        '  "matches": [{"organisation_id": <int>, "name": "<name>", "why": "<short reason>"}],\n'
        '  "letter": "a 150-220 word referral letter addressed to the top organisation, '
        "signed by the volunteer, referencing the case code and the household need\"\n"
        "}\n"
        "Pick 2-3 matches, best first. Urgency High = immediate hunger / vulnerable "
        "members (infants, sick, elderly, pregnant). Medium = income loss, at risk soon. "
        "Low = general assistance."
    )


def _run_groq_triage(case: Case, orgs: List[Organisation]) -> TriageResult:
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are a precise triage assistant that replies only with valid JSON.",
            },
            {"role": "user", "content": _build_prompt(case, orgs)},
        ],
        "temperature": 0.3,
        "response_format": {"type": "json_object"},
    }
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    with httpx.Client(timeout=30.0) as client:
        resp = client.post(GROQ_URL, json=payload, headers=headers)
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]

    data = json.loads(content)
    return _sanitise_result(data, case, orgs)


def _sanitise_result(data: dict, case: Case, orgs: List[Organisation]) -> TriageResult:
    """Validate/repair a model response so callers always get a safe TriageResult."""
    valid_ids = {o.id: o for o in orgs}

    urgency = str(data.get("urgency", "")).capitalize()
    if urgency not in VALID_URGENCY:
        urgency = "Medium"

    matches: List[OrgMatch] = []
    for m in data.get("matches", []) or []:
        try:
            oid = int(m.get("organisation_id"))
        except (TypeError, ValueError):
            continue
        if oid in valid_ids and not any(x["organisation_id"] == oid for x in matches):
            org = valid_ids[oid]
            matches.append(
                {
                    "organisation_id": oid,
                    "name": org.name,
                    "why": str(m.get("why") or "Matched on location and focus."),
                }
            )
    if not matches:  # model gave no usable ids — fall back to first candidates
        matches = _fallback_matches(orgs)

    reason = str(data.get("urgency_reason") or "Assessed from the reported situation.")
    letter = str(data.get("letter") or "").strip()
    if len(letter) < 40:
        letter = _draft_letter(case, valid_ids[matches[0]["organisation_id"]], urgency)

    return f"""
You are an AI humanitarian aid coordinator for HungerMap PK.

Your job is to analyze food insecurity cases, determine urgency, recommend the best organisations, and generate a professional referral letter.

CASE DETAILS
-------------
City: {case.city}
Area: {case.area or "N/A"}
Household Size: {case.household_size or "Unknown"}
Beneficiary: {case.beneficiary_name or "N/A"}

Situation:
{case.situation_notes}

AVAILABLE ORGANISATIONS
-----------------------
{org_lines}

Instructions:

1. Classify urgency as ONLY one of:
   - High
   - Medium
   - Low

2. Explain the urgency in 1–2 sentences.

3. Select the 2–3 best organisations ONLY from the list provided.
   Never invent organisations.

4. Generate a professional referral letter (150–200 words).

The referral letter should include:
- Subject line
- Greeting to the selected organisation
- Summary of the family's situation
- Reason for urgency
- Request for food/ration assistance
- Professional closing:
  "Sincerely,
   HungerMap PK AI Triage System"

Return ONLY valid JSON in this exact format:

{{
  "urgency": "High",
  "urgency_reason": "string",
  "matches": [
    {{
      "organisation_id": 1,
      "name": "string",
      "why": "string"
    }}
  ],
  "letter": "string"
}}
"""


def _fallback_result(case: Case, candidates: List[Organisation]) -> TriageResult:
    return {
        "urgency": urgency,
        "urgency_reason": reason,
        "matches": matches[:3],
        "letter": letter,
    }


# ---- Rule-based fallback ---------------------------------------------------

def _run_rule_based_triage(case: Case, orgs: List[Organisation]) -> TriageResult:
    text = (case.situation_notes or "").lower()
    household = case.household_size or 1

    high_hits = [s for s in HIGH_SIGNALS if s in text]
    medium_hits = [s for s in MEDIUM_SIGNALS if s in text]

    score = len(high_hits) * 2 + len(medium_hits)
    if household >= 6:
        score += 2
    elif household >= 4:
        score += 1

    if high_hits or score >= 4:
        urgency = "High"
    elif medium_hits or score >= 2:
        urgency = "Medium"
    else:
        urgency = "Low"

    reason_bits = []
    if high_hits:
        reason_bits.append(f"acute signals detected ({', '.join(high_hits[:3])})")
    if medium_hits:
        reason_bits.append(f"economic hardship indicators ({', '.join(medium_hits[:2])})")
    if household and household >= 4:
        reason_bits.append(f"large household of {household}")
    reason = (
        "Rule-based assessment: " + "; ".join(reason_bits) + "."
        if reason_bits
        else "Rule-based assessment: no acute markers found; routine assistance suggested."
    )

    matches = _fallback_matches(orgs)
    letter = _draft_letter(case, orgs[matches_index(matches, orgs)], urgency)
    return {
        "urgency": urgency,
        "urgency_reason": reason,
        "matches": matches,
        "letter": letter,
    }


def matches_index(matches: List[OrgMatch], orgs: List[Organisation]) -> int:
    top_id = matches[0]["organisation_id"]
    for i, o in enumerate(orgs):
        if o.id == top_id:
            return i
    return 0


def _fallback_matches(orgs: List[Organisation]) -> List[OrgMatch]:
    picked = orgs[:3]
    return [
        {
            "organisation_id": o.id,
            "name": o.name,
            "why": f"Operates in the same city; focus: {o.focus or 'general food relief'}.",
        }
        for o in picked
    ]


def _draft_letter(case: Case, org: Organisation, urgency: str) -> str:
    household = case.household_size or "an unspecified number of"
    beneficiary = case.beneficiary_name or "a household"
    location = f"{case.area + ', ' if case.area else ''}{case.city}"
    return (
        f"To the team at {org.name},\n\n"
        f"I am writing to refer an urgent food-assistance case (Ref: {case.case_code}) "
        f"identified in {location}. The affected household of {household} people "
        f"is currently facing food insecurity. Reported situation: {case.situation_notes.strip()}\n\n"
        f"Based on our triage this case is rated {urgency.upper()} priority. Given your "
        f"work in {org.focus or 'food relief'}, I believe your organisation is well placed "
        f"to provide timely support to {beneficiary}. We would be grateful if your team "
        f"could assess the household for ration assistance or a cooked-meal programme at "
        f"the earliest opportunity.\n\n"
        f"Please contact the reporting volunteer, {case.volunteer_name}"
        f"{', ' + case.volunteer_phone if case.volunteer_phone else ''}, to coordinate "
        f"delivery or verification. Thank you for your continued service to the community.\n\n"
        f"Warm regards,\n{case.volunteer_name}\nHungerMap PK Volunteer"
    )
