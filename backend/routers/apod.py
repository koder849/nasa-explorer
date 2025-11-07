from fastapi import APIRouter, Query
from utils.nasa_api import fetch_apod

router = APIRouter(prefix="/apod", tags=["APOD"])

@router.get("/")
def get_apod(date: str = Query(None, description="YYYY-MM-DD")):
    return fetch_apod(date)
