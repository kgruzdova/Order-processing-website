from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Integer, func, select, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, Session, mapped_column

from core.database import Base


class AdminConfig(Base):
    """
    Административные данные для динамической сборки UI (услуги, диапазон бюджета и пр.).

    SQL:
    CREATE TABLE admin_config (
        id SERIAL PRIMARY KEY,
        services JSONB NOT NULL DEFAULT '[]'::jsonb,
        budget_range JSONB NOT NULL DEFAULT '{}'::jsonb,
        extra_ui JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    """

    __tablename__ = "admin_config"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    services: Mapped[list | dict] = mapped_column(
        JSONB, nullable=False, server_default=text("'[]'::jsonb")
    )
    budget_range: Mapped[dict] = mapped_column(
        JSONB, nullable=False, server_default=text("'{}'::jsonb")
    )
    extra_ui: Mapped[dict] = mapped_column(
        JSONB, nullable=False, server_default=text("'{}'::jsonb")
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


class AdminConfigCRUD:
    """Набор операций для таблицы админ-конфигурации."""

    @staticmethod
    def create(db: Session, *, obj: AdminConfig) -> AdminConfig:
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def get_by_id(db: Session, config_id: int) -> AdminConfig | None:
        return db.get(AdminConfig, config_id)

    @staticmethod
    def list_all(db: Session, skip: int = 0, limit: int = 100) -> list[AdminConfig]:
        stmt = (
            select(AdminConfig).order_by(AdminConfig.id.desc()).offset(skip).limit(limit)
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def update(db: Session, row: AdminConfig) -> AdminConfig:
        db.add(row)
        db.commit()
        db.refresh(row)
        return row

    @staticmethod
    def delete(db: Session, row: AdminConfig) -> None:
        db.delete(row)
        db.commit()
