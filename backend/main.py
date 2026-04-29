from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI

from core.database import Base, engine
import models  # noqa: F401 — регистрация ORM-моделей в metadata
from routes import (
    admin_config_router,
    admin_user_router,
    auth_router,
    behavior_metrics_router,
    lead_application_router,
)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Autello Backend API", lifespan=lifespan)

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(admin_user_router)
api_router.include_router(lead_application_router)
api_router.include_router(behavior_metrics_router)
api_router.include_router(admin_config_router)
app.include_router(api_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
