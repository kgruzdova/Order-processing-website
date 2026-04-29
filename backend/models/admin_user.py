from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func, select
from sqlalchemy.orm import Mapped, Session, mapped_column

from core.database import Base


class AdminUser(Base):
    """
    Администратор панели (логин/пароль, пароль в виде хеша bcrypt).

    SQL: см. итоговый CREATE TABLE в документации / миграциях.
    """

    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class AdminUserCRUD:
    @staticmethod
    def create(db: Session, *, obj: AdminUser) -> AdminUser:
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> AdminUser | None:
        return db.get(AdminUser, user_id)

    @staticmethod
    def get_by_username(db: Session, username: str) -> AdminUser | None:
        stmt = select(AdminUser).where(AdminUser.username == username)
        return db.scalars(stmt).first()

    @staticmethod
    def count_all(db: Session) -> int:
        stmt = select(func.count()).select_from(AdminUser)
        return int(db.scalar(stmt) or 0)

    @staticmethod
    def list_all(db: Session, skip: int = 0, limit: int = 100) -> list[AdminUser]:
        stmt = select(AdminUser).order_by(AdminUser.id.asc()).offset(skip).limit(limit)
        return list(db.scalars(stmt).all())

    @staticmethod
    def update(db: Session, user: AdminUser) -> AdminUser:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete(db: Session, user: AdminUser) -> None:
        db.delete(user)
        db.commit()
