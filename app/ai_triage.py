"""
AI Triage Module (Groq Version)
"""

import json
import os
from typing import List, TypedDict

from groq import Groq
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


VALID_URGENCY = {"High", "Medium", "Low"}


def _build_prompt(case: Case, candidates: List[Organisation]) -> str:
    org_lines = "\n".join(
        f'- id={org.id}, name="{org.name}", focus="{org.focus or "N/A"}", area="{org.area or "N/A"}"'
        for org in candidates
    )

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
        "urgency": "Medium",
        "urgency_reason": "Fallback: AI response unavailable.",
        "matches": [
            {"organisation_id": org.id, "name": org.name, "why": "Fallback match."}
            for org in candidates[:2]
        ],
        "letter": f"Manual review required for case {case.case_code}.",
    }


def run_ai_triage(
    case: Case, candidate_organisations: List[Organisation]
) -> TriageResult:
    prompt = _build_prompt(case, candidate_organisations)

    valid_ids = {org.id for org in candidate_organisations}
    id_to_name = {org.id: org.name for org in candidate_organisations}

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0,
            messages=[{"role": "user", "content": prompt}],
        )

        raw_text = response.choices[0].message.content.strip()

        print("===== GROQ RAW RESPONSE =====")
        print(raw_text)
        print("=============================")

        if raw_text.startswith("```"):
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(raw_text)

        urgency = parsed.get("urgency")
        if urgency not in VALID_URGENCY:
            raise ValueError("Invalid urgency value")

        matches = []
        for m in parsed.get("matches", []):
            org_id = m.get("organisation_id")
            if org_id in valid_ids:
                matches.append(
                    {
                        "organisation_id": org_id,
                        "name": id_to_name[org_id],
                        "why": m.get("why", ""),
                    }
                )

        if not matches:
            raise ValueError("No valid organisation matches")

        return {
            "urgency": urgency,
            "urgency_reason": parsed.get("urgency_reason", ""),
            "matches": matches,
            "letter": parsed.get("letter", ""),
        }

    except Exception as e:
        print(f"[ai_triage] Error: {e}")
        return _fallback_result(case, candidate_organisations)