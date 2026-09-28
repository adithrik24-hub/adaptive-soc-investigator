from hindsight_client import Hindsight


HINDSIGHT_URL = "http://localhost:8888"
BANK_ID = "adaptive-soc"


def get_hindsight():
    """
    Create a connection to our local Hindsight memory bank.
    """
    return Hindsight(HINDSIGHT_URL)


def recall_relevant_memories(query: str):
    """
    Search Hindsight for previous security investigation experiences
    that are relevant to the current alert.
    """
    client = get_hindsight()

    result = client.recall(
        bank_id=BANK_ID,
        query=query,
    )

    return result