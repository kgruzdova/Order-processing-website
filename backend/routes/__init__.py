from routes.admin_config import router as admin_config_router
from routes.admin_user import router as admin_user_router
from routes.auth import router as auth_router
from routes.behavior_metrics import router as behavior_metrics_router
from routes.lead_application import router as lead_application_router

__all__ = [
    "admin_config_router",
    "admin_user_router",
    "auth_router",
    "behavior_metrics_router",
    "lead_application_router",
]
