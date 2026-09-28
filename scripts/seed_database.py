from backend.database.supabase import get_supabase


supabase = get_supabase()


incidents = [
    {
        "incident_number": "INC-2026-0001",
        "title": "Repeated VPN Authentication Failures",
        "description": "Multiple failed logins were observed from a known corporate VPN address.",
        "severity": "medium",
        "alert_type": "authentication",
        "status": "closed",
        "user": "anita",
        "hostname": "LAPTOP-ANITA",
        "source_ip": "10.20.30.40",
        "attack_type": "unknown",
        "root_cause": "Corporate VPN authentication issue",
        "verdict": "false_positive",
        "resolution": "No malicious activity confirmed",
        "analyst": "analyst_01",
    },
    {
        "incident_number": "INC-2026-0002",
        "title": "Credential Compromise Investigation",
        "description": "Failed logins were followed by a successful login from a new device and unusual location.",
        "severity": "high",
        "alert_type": "authentication",
        "status": "closed",
        "user": "rahul",
        "hostname": "LAPTOP-RAHUL",
        "source_ip": "185.71.22.14",
        "attack_type": "credential_compromise",
        "root_cause": "Compromised credentials",
        "verdict": "true_positive",
        "resolution": "Password reset and session revocation",
        "analyst": "analyst_02",
    },
    {
        "incident_number": "INC-2026-0003",
        "title": "Password Spraying Activity",
        "description": "A single external source attempted authentication against multiple user accounts.",
        "severity": "high",
        "alert_type": "authentication",
        "status": "closed",
        "user": "multiple",
        "hostname": "AUTH-SERVER",
        "source_ip": "185.91.44.8",
        "attack_type": "password_spraying",
        "root_cause": "External password spraying campaign",
        "verdict": "true_positive",
        "resolution": "Source blocked and affected credentials reset",
        "analyst": "analyst_03",
    },
    {
        "incident_number": "INC-2026-0004",
        "title": "Suspicious PowerShell Execution",
        "description": "Encoded PowerShell was executed by an unusual parent process.",
        "severity": "high",
        "alert_type": "endpoint",
        "status": "closed",
        "user": "meera",
        "hostname": "DESKTOP-MEERA",
        "source_ip": "10.10.5.21",
        "attack_type": "powershell_attack",
        "root_cause": "Malicious PowerShell execution",
        "verdict": "true_positive",
        "resolution": "Endpoint isolated and malicious process removed",
        "analyst": "analyst_01",
    },
]


def seed_incidents():
    for incident in incidents:
        existing = (
            supabase
            .table("incidents")
            .select("id")
            .eq("incident_number", incident["incident_number"])
            .execute()
        )

        if existing.data:
            print(f"Already exists: {incident['incident_number']}")
            continue

        result = (
            supabase
            .table("incidents")
            .insert(incident)
            .execute()
        )

        print(f"Inserted: {result.data[0]['incident_number']}")


if __name__ == "__main__":
    seed_incidents()