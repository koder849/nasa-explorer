from fastapi import APIRouter, Query
from utils.nasa_api import fetch_mars_photos

router = APIRouter(prefix="/mars", tags=["Mars"])

@router.get("/photos")
def mars_photos(sol: int = Query(1000), camera: str = Query(None)):
    return fetch_mars_photos(sol=sol, camera=camera)
