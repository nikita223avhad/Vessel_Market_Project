
from fastapi import FastAPI
from app.core.config import settings
from app.db.init_db import init
from app.routers import auth, users, vessels, market_data, reports
from fastapi.middleware.cors import CORSMiddleware



app=FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init()

for r in [auth.router, users.router, vessels.router, market_data.router, reports.router]:
    app.include_router(r, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {"message":"Vessel Market API"}
