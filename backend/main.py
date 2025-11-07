from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import apod, mars, earth, asteroid

app = FastAPI(title="NASA Explorer API")

# very permissive CORS for local dev (tighten for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(apod.router)
app.include_router(mars.router)
app.include_router(earth.router)
app.include_router(asteroid.router)


@app.get("/")
def root():
    return {"message": "Welcome to NASA Explorer API!"}
