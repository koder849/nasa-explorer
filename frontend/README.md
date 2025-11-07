## Setup
- Set up and run the backend (FastAPI) on port 8000
- Set up and run the frontend (Vite + React) on port 5173
- Optionally configure the frontend’s API base URL

## Prerequisites
- Python 3.10+ (recommended: 3.11)
- Node.js 18+ (recommended: 20+)
- A NASA API key (optional; DEMO_KEY works but is rate-limited): https://api.nasa.gov/

## 1) Backend (FastAPI)

- Create a virtual environment and install dependencies:
```zsh
cd /Users/rav/Desktop/Komal/nasa-explorer/backend

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
```

- Configure your environment:
```zsh
cp .env.example .env
# Edit .env and set your real NASA API key if you have one
# NASA_API_KEY=YOUR_REAL_KEY
```

- Run the FastAPI server:
```zsh
uvicorn main:app --reload --port 8000
```

- Quick checks (optional):
  - Open http://127.0.0.1:8000/ in your browser — should return a welcome JSON.
  - Test an endpoint:
    - http://127.0.0.1:8000/apod/
    - http://127.0.0.1:8000/mars/photos?sol=1000
    - http://127.0.0.1:8000/earth/epic
    - http://127.0.0.1:8000/asteroids/feed

## 2) Frontend (Vite + React)

- Install dependencies and start the dev server:
```zsh
cd /Users/rav/Desktop/Komal/nasa-explorer/frontend

npm install
npm run dev
```

- Open the app at the URL Vite prints (usually http://localhost:5173).

- By default, the frontend points to the backend at http://127.0.0.1:8000 via api.js. If you need to change this, create a `.env` in the frontend folder:
```zsh
# /Users/rav/Desktop/Komal/nasa-explorer/frontend/.env
VITE_API_BASE_URL=http://127.0.0.1:8000
```
