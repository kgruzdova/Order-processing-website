from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_admin
from core.security import create_access_token, hash_password, verify_password
from models.admin_user import AdminUser, AdminUserCRUD
from schemas.admin_user import (
    AdminUserCreate,
    AdminUserRead,
    LoginRequest,
    RegistrationOpenResponse,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/registration-open", response_model=RegistrationOpenResponse)
def registration_open(db: Session = Depends(get_db)) -> RegistrationOpenResponse:
    return RegistrationOpenResponse(registration_open=AdminUserCRUD.count_all(db) == 0)


@router.post("/register", response_model=AdminUserRead, status_code=status.HTTP_201_CREATED)
def register_bootstrap(payload: AdminUserCreate, db: Session = Depends(get_db)) -> AdminUser:
    if AdminUserCRUD.count_all(db) > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Регистрация доступна только при отсутствии администраторов",
        )
    if AdminUserCRUD.get_by_username(db, payload.username) is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Имя пользователя занято")
    user = AdminUser(
        username=payload.username,
        password_hash=hash_password(payload.password),
    )
    return AdminUserCRUD.create(db, obj=user)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = AdminUserCRUD.get_by_username(db, payload.username.strip())
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
        )
    token = create_access_token(sub=str(user.id))
    return TokenResponse(access_token=token, token_type="bearer")


@router.get(
    "/me",
    response_model=AdminUserRead,
    responses={status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized"}},
)
def me(current: AdminUser = Depends(get_current_admin)) -> AdminUser:
    return current
