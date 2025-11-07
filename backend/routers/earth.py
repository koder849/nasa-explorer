from fastapi import APIRouter, Query
from utils.nasa_api import fetch_epic

router = APIRouter(prefix="/earth", tags=["Earth"])

@router.get("/epic")
def epic(date: str = Query(None, description="YYYY-MM-DD (optional)")):
    return fetch_epic(date)
