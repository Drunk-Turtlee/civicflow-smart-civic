from typing import Any, Dict, List

from pydantic import BaseModel, Field

from config import settings


class Recommendation(BaseModel):
    priority: str = Field(description="Immediate, Short Term, or Long Term")
    action: str
    reason: str


class AIReport(BaseModel):
    executive_summary: str
    key_findings: List[str]
    hotspot_insights: List[str]
    priority_concerns: List[str]
    recommendations: List[Recommendation]
    conclusion: str


async def generate_ai_report(analytics: Dict[str, Any]) -> Dict[str, Any]:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured in smart-civic-backend/.env")

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    prompt = f"""
You are CivicFlow's municipal intelligence analyst.

Create a professional municipal operations report from the VERIFIED analytics JSON below.
The statistics in the JSON are official application values. Never invent, alter, estimate,
round, or replace those numbers. Do not introduce facts that are not supported by the data.
Your role is to interpret patterns and turn them into concise operational insights.

Reporting period: {analytics.get('period_label', analytics.get('period', 'Selected period'))}

VERIFIED ANALYTICS JSON:
{analytics}

Write:
1. A concise executive summary.
2. 3-6 key findings grounded in the data.
3. 2-5 hotspot insights grounded in the hotspot data.
4. 2-5 priority concerns grounded in priority/status/aging data.
5. 3-6 actionable recommendations. Label each Immediate, Short Term, or Long Term.
6. A concise conclusion for a municipal administrator.

Do not mention that you are an AI. Do not claim a cause unless the data supports it.
"""

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.25,
            response_mime_type="application/json",
            response_schema=AIReport,
        ),
    )

    if not response.text:
        raise RuntimeError("Gemini returned an empty report")

    report = AIReport.model_validate_json(response.text)
    return report.model_dump()
