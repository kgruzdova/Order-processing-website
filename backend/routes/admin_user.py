from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_admin
from core.security import hash_password
from models.admin_user import AdminUser, AdminUserCRUD
from schemas.admin_user import AdminUserCreate, AdminUserRead, AdminUserUpdate

router = APIRouter(
    prefix="/admins",
    tags=["admins"],
    dependencies=[Depends(get_current_admin)],
    responses={status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized"}},
)


@router.post("", response_model=AdminUserRead, status_code=status.HTTP_201_CREATED)
def create_admin(
    payload: AdminUserCreate,
    db: Session = Depends(get_db),
) -> AdminUser:
    if AdminUserCRUD.get_by_username(db, payload.username) is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Имя пользователя занято")
    user = AdminUser(
        username=payload.username,
        password_hash=hash_password(payload.password),
    )
    return AdminUserCRUD.create(db, obj=user)


@router.get("", response_model=list[AdminUserRead])
def list_admins(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[AdminUser]:
    return AdminUserCRUD.list_all(db, skip=skip, limit=limit)


@router.get("/{admin_id}", response_model=AdminUserRead)
def get_admin(
    admin_id: int,
    db: Session = Depends(get_db),
) -> AdminUser:
    row = AdminUserCRUD.get_by_id(db, admin_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return row


@router.put("/{admin_id}", response_model=AdminUserRead)
def update_admin(
    admin_id: int,
    payload: AdminUserUpdate,
    db: Session = Depends(get_db),
) -> AdminUser:
    row = AdminUserCRUD.get_by_id(db, admin_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    data = payload.model_dump(exclude_unset=True)
    if "username" in data and data["username"] is not None:
        other = AdminUserCRUD.get_by_username(db, data["username"])
        if other is not None and other.id != row.id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Имя пользователя занято")
        row.username = data["username"]
    if "password" in data and data["password"] is not None:
        row.password_hash = hash_password(data["password"])
    return AdminUserCRUD.update(db, row)


@router.delete("/{admin_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
) -> None:
    if AdminUserCRUD.count_all(db) <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Нельзя удалить единственного администратора",
        )
    row = AdminUserCRUD.get_by_id(db, admin_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    AdminUserCRUD.delete(db, row)
