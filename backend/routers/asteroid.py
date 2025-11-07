from fastapi import APIRouter, Query
from utils.nasa_api import fetch_neo

router = APIRouter(prefix="/asteroids", tags=["Asteroids"])

@router.get("/feed")
def neo_feed(start_date: str = Query(None), end_date: str = Query(None)):
    return fetch_neo(start_date=start_date, end_date=end_date)
