from hindsight_client import Hindsight


HINDSIGHT_URL = "http://localhost:8888"
BANK_ID = "adaptive-soc"


MEMORIES = [
    {
        "id": "INC-2026-0001",
        "content": """
Security investigation experience: INC-2026-0001.

Incident type: VPN authentication anomaly.

Evidence:
- Multiple failed login attempts were observed.
- The source IP belonged to known corporate VPN infrastructure.
- The user activity matched expected remote-access behavior.
- No unusual endpoint activity was observed.
- No suspicious process execution was identified.

Investigation outcome:
The alert was determined to be a false positive caused by legitimate corporate VPN authentication behavior.

Analyst lesson:
A high number of failed authentication attempts alone should not be treated as evidence of compromise when the source is trusted corporate VPN infrastructure and there are no supporting endpoint anomalies.

Future investigation guidance:
When a new authentication alert resembles this pattern, check the source IP against known corporate VPN infrastructure and look for endpoint or post-authentication anomalies before escalating.
""",
    },
    {
        "id": "INC-2026-0002",
        "content": """
Security investigation experience: INC-2026-0002.

Incident type: Credential compromise.

Evidence:
- Multiple failed authentication attempts occurred.
- A successful login followed the failed attempts.
- The successful login originated from a new device.
- The access originated from an unusual location.

Investigation outcome:
The incident was treated as a credential compromise.

Analyst lesson:
A successful login after repeated failures becomes more concerning when it is associated with a new device or unusual location.

Future investigation guidance:
For future authentication alerts, compare failed attempts and successful authentication with device history, geographic context, and post-login activity.
""",
    },
    {
        "id": "INC-2026-0003",
        "content": """
Security investigation experience: INC-2026-0003.

Incident type: Password spraying.

Evidence:
- Authentication failures affected multiple users.
- The same source IP generated authentication attempts against several accounts.
- The activity was distributed across accounts rather than concentrated on one user.

Investigation outcome:
The activity was classified as password spraying.

Analyst lesson:
Repeated authentication failures against many different users from the same source are more consistent with password spraying than a single-user password problem.

Future investigation guidance:
When investigating authentication anomalies, examine the number of targeted accounts and whether a common source is responsible for the failures.
""",
    },
    {
        "id": "INC-2026-0004",
        "content": """
Security investigation experience: INC-2026-0004.

Incident type: Suspicious PowerShell activity.

Evidence:
- PowerShell execution was observed.
- The command included suspicious or encoded PowerShell content.
- The execution context was unusual for the affected endpoint.
- Additional endpoint behavior increased concern beyond ordinary administrative PowerShell use.

Investigation outcome:
The activity was treated as suspicious PowerShell execution requiring further investigation.

Analyst lesson:
The presence of PowerShell alone does not establish malicious activity. Investigation should consider command content, encoding, parent process, execution context, and related endpoint behavior.

Future investigation guidance:
For future PowerShell alerts, compare command characteristics and execution context with previous investigations before deciding whether the activity is benign administration or potentially malicious execution.
""",
    },
]


def main():
    client = Hindsight(HINDSIGHT_URL)

    for memory in MEMORIES:
        print(f"\nRetaining {memory['id']}...")

        result = client.retain(
            bank_id=BANK_ID,
            content=memory["content"],
            document_id=memory["id"],
            retain_async=False,
        )

        print(f"Response for {memory['id']}:")
        print(result)
        print(f"Finished {memory['id']}.")

    print("\nMemory seeding complete.")


if __name__ == "__main__":
    main()