import os
from dotenv import load_dotenv
import requests

load_dotenv()  # loads .env in backend/
NASA_API_KEY = os.getenv("NASA_API_KEY", "DEMO_KEY")
BASE_URL = "https://api.nasa.gov"

def fetch_apod(date=None):
    try:
        params = {"api_key": NASA_API_KEY}
        if date:
            params["date"] = date
        r = requests.get(f"{BASE_URL}/planetary/apod", params=params, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        return {"error": str(e)}

def fetch_mars_photos(sol=1000, camera=None):
    try:
        params = {"sol": sol, "api_key": NASA_API_KEY}
        if camera:
            params["camera"] = camera
        r = requests.get(f"{BASE_URL}/mars-photos/api/v1/rovers/curiosity/photos", params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        photos = data.get("photos", [])
        if not photos:
            return {"message": "No photos found for this sol/camera. Try other sol values or remove camera param."}
        return photos[:12]  # limit to 12
    except Exception as e:
        return {"error": str(e)}

def fetch_epic(date=None):
    try:
        if date:
            url = f"{BASE_URL}/EPIC/api/natural/date/{date}"
        else:
            url = f"{BASE_URL}/EPIC/api/natural"
        params = {"api_key": NASA_API_KEY}
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        return {"error": str(e)}

def fetch_neo(start_date=None, end_date=None):
    try:
        params = {"api_key": NASA_API_KEY}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        r = requests.get(f"{BASE_URL}/neo/rest/v1/feed", params=params, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        return {"error": str(e)}
