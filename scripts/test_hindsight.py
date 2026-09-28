print("SCRIPT STARTED")
import os
import time

from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

client = Hindsight(
    base_url=os.getenv("HINDSIGHT_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY"),
)

BANK_ID = "adaptive-soc"

print("1. Hindsight client created")

client.retain(
    bank_id=BANK_ID,
    content=(
        "SOC investigation INC-2026-0002: "
        "Failed logins were followed by a successful login "
        "from a new device and unusual location. "
        "The investigation concluded this was a true positive "
        "credential compromise. "
        "Resolution: password reset and session revocation. "
        "Lesson: a successful login combined with a new device "
        "after repeated failures is a strong signal of credential compromise."
    ),
)

print("2. Memory retained")

time.sleep(5)

result = client.recall(
    bank_id=BANK_ID,
    query="What evidence previously indicated a credential compromise?",
)

print("3. Recall completed")
print("4. Memories found:", len(result.results))

for memory in result.results:
    print("-", memory.text)

client.close()
print("5. Hindsight test complete")