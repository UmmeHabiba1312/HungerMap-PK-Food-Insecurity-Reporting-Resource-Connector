"""
AI Triage Module
=================
THIS FILE IS THE AI DEVELOPER'S RESPONSIBILITY — not part of core backend work.

`run_ai_triage()` below is a STUB. It currently returns fake/placeholder data so
the rest of the backend (and the frontend) can be built and tested against a
stable contract, without waiting on the real AI integration.

When the AI developer is ready, they should replace the body of
`run_ai_triage()` with a real call to the Claude API (or whichever model),
using the case details + list of candidate organisations to decide:
  - urgency: "High" | "Medium" | "Low"
  - urgency_reason: short plain-language explanation
  - matches: 2-3 organisations from the candidates list, each with a reason
  - letter: a drafted referral letter (150-220 words)

The function signature and return shape below is the CONTRACT the rest of the
backend depends on — please keep it the same (or update the callers in
routers/referrals.py if it changes).
"""

from typing import List, TypedDict

from app.models import Case, Organisation


class OrgMatch(TypedDict):
    organisation_id: int
    name: str
    why: str


class TriageResult(TypedDict):
    urgency: str            # "High" | "Medium" | "Low"
    urgency_reason: str
    matches: List[OrgMatch]
    letter: str


def run_ai_triage(case: Case, candidate_organisations: List[Organisation]) -> TriageResult:
    """
    STUB — replace with a real Claude API call.

    Example of what the real implementation will need to do:
      1. Build a prompt from `case` fields (situation_notes, household_size, etc.)
         and the list of `candidate_organisations` (name, focus, area).
      2. Call the Claude API (see Anthropic docs / API integration notes shared
         separately) asking for urgency + matches + referral letter as JSON.
      3. Parse and return that JSON in the TriageResult shape below.

    For now this just returns deterministic placeholder data so the API
    contract can be tested end-to-end.
    """
    top_candidates = candidate_organisations[:2]

    return {
        "urgency": "Medium",
        "urgency_reason": (
            "PLACEHOLDER — real urgency assessment not yet implemented. "
            "This is stub data from run_ai_triage()."
        ),
        "matches": [
            {"organisation_id": org.id, "name": org.name, "why": "PLACEHOLDER match reason."}
            for org in top_candidates
        ],
        "letter": (
            f"[PLACEHOLDER LETTER]\n\nTo Whom It May Concern,\n\n"
            f"This is a placeholder referral letter for case {case.case_code}. "
            f"Real letter generation will be implemented by the AI developer.\n\n"
            f"Regards,\n{case.volunteer_name}"
        ),
    }
