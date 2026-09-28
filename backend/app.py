from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.database.supabase import get_supabase
from backend.memory.hindsight import recall_relevant_memories, get_hindsight


app = FastAPI(
    title="Adaptive SOC Investigator",
    version="0.5.0",
)


# Allow the Next.js frontend to communicate with FastAPI.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InvestigationRequest(BaseModel):
    incident_id: str
    query: str


class AnalystFeedback(BaseModel):
    incident_id: str
    decision: str
    reason: str
    outcome: str


@app.get("/")
def root():
    return {
        "message": "Adaptive SOC Investigator API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/api/incidents")
def get_incidents():
    supabase = get_supabase()

    result = (
        supabase
        .table("incidents")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return {
        "incidents": result.data
    }


@app.post("/api/investigate")
def investigate(request: InvestigationRequest):
    """
    Investigate a security alert using organizational memory.
    """

    memories = recall_relevant_memories(request.query)

    return {
        "incident_id": request.incident_id,

        "initial_hypothesis": (
            "Possible brute-force attack"
        ),

        "hindsight_memory": memories.model_dump(),

        "updated_hypothesis": (
            "Potential credential compromise. "
            "The alert is more concerning because repeated failed "
            "logins were followed by successful access from a new "
            "endpoint, with PowerShell activity also observed."
        ),

        "recommendation": [
            "Verify the new endpoint against the user's device history.",
            "Review the successful login location and session activity.",
            "Inspect the PowerShell command and parent process.",
            "Check whether other accounts were targeted from the same source.",
        ],
    }

@app.get("/api/memories")
def get_memories(query: str = "security investigation"):
    """
    Retrieve relevant organizational experiences from Hindsight
    for the Memory Explorer.
    """
    memories = recall_relevant_memories(query)

    return {
        "query": query,
        "memories": memories.model_dump(),
    }
@app.post("/api/feedback")
def record_feedback(feedback: AnalystFeedback):
    """
    Record the analyst's decision and teach Hindsight from the outcome.
    """

    timestamp = datetime.utcnow().isoformat()

    memory_content = f"""
Security investigation learning event.

Incident:
{feedback.incident_id}

Analyst decision:
{feedback.decision}

Analyst reason:
{feedback.reason}

Investigation outcome:
{feedback.outcome}

Timestamp:
{timestamp}

Future investigation guidance:
Use this analyst decision and outcome when investigating similar
authentication, endpoint, PowerShell, or credential-related alerts.
Pay attention to the evidence that caused the analyst to confirm,
reject, or modify the investigation hypothesis.
"""

    hindsight = get_hindsight()

    document_id = (
        f"FEEDBACK-{feedback.incident_id}-{timestamp.replace(':', '-')}"
    )

    hindsight_result = hindsight.retain(
        bank_id="adaptive-soc",
        content=memory_content,
        document_id=document_id,
        retain_async=False,
    )

    return {
        "status": "recorded",
        "incident_id": feedback.incident_id,
        "decision": feedback.decision,
        "message": (
            "Analyst decision recorded and added to "
            "organizational memory."
        ),
        "memory_id": document_id,
        "hindsight_result": str(hindsight_result),
    }