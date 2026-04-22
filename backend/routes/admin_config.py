from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.admin_config import AdminConfig, AdminConfigCRUD
from schemas.admin_config import AdminConfigCreate, AdminConfigRead, AdminConfigUpdate

router = APIRouter(prefix="/admin-config", tags=["admin-config"])


@router.post("", response_model=AdminConfigRead, status_code=status.HTTP_201_CREATED)
def create_admin_config(payload: AdminConfigCreate, db: Session = Depends(get_db)) -> AdminConfig:
    entity = AdminConfig(**payload.model_dump())
    return AdminConfigCRUD.create(db, obj=entity)


@router.get("", response_model=list[AdminConfigRead])
def list_admin_config(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> list[AdminConfig]:
    return AdminConfigCRUD.list_all(db, skip=skip, limit=limit)


@router.get("/{config_id}", response_model=AdminConfigRead)
def get_admin_config(config_id: int, db: Session = Depends(get_db)) -> AdminConfig:
    row = AdminConfigCRUD.get_by_id(db, config_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Config not found")
    return row


@router.put("/{config_id}", response_model=AdminConfigRead)
def update_admin_config(
    config_id: int, payload: AdminConfigUpdate, db: Session = Depends(get_db)
) -> AdminConfig:
    row = AdminConfigCRUD.get_by_id(db, config_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Config not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    return AdminConfigCRUD.update(db, row)


@router.delete("/{config_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin_config(config_id: int, db: Session = Depends(get_db)) -> None:
    row = AdminConfigCRUD.get_by_id(db, config_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Config not found")
    AdminConfigCRUD.delete(db, row)
