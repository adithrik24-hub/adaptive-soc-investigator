from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.database.supabase import get_supabase
from backend.memory.hindsight import recall_relevant_memories


app = FastAPI(
    title="Adaptive SOC Investigator",
    version="0.4.0",
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