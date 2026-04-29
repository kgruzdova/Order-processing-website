from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import select
from sqlalchemy.orm import Mapped, Session, mapped_column, relationship

from core.database import Base


class BehaviorMetrics(Base):
    """
    Поведенческие и технические метрики по заявке; связь 1:1 с lead_applications (общий PK).

    SQL:
    CREATE TABLE behavior_metrics (
        application_id INTEGER PRIMARY KEY
            REFERENCES lead_applications(id) ON DELETE CASCADE,
        time_on_page_seconds INTEGER NOT NULL DEFAULT 0,
        button_clicks JSONB NOT NULL DEFAULT '[]'::jsonb,
        cursor_hover_zones JSONB NOT NULL DEFAULT '[]'::jsonb,
        return_visits_count INTEGER NOT NULL DEFAULT 0,
        technical_payload JSONB NOT NULL DEFAULT '{}'::jsonb
    );
    """

    __tablename__ = "behavior_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    application_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("lead_applications.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    time_on_page_seconds: Mapped[int] = mapped_column("time_on_page", Integer, nullable=False, default=0)
    button_clicks: Mapped[list | dict] = mapped_column(
        "buttons_clicked", JSONB, nullable=False, server_default=text("'[]'::jsonb")
    )
    cursor_hover_zones: Mapped[list | dict] = mapped_column(
        "cursor_positions", JSONB, nullable=False, server_default=text("'[]'::jsonb")
    )
    return_visits_count: Mapped[int] = mapped_column("return_frequency", Integer, nullable=False, default=0)
    technical_payload: Mapped[dict] = mapped_column(
        JSONB, nullable=False, server_default=text("'{}'::jsonb")
    )

    application: Mapped["LeadApplication"] = relationship("LeadApplication", back_populates="behavior_metrics")


class BehaviorMetricsCRUD:
    """Набор операций для таблицы поведенческих метрик."""

    @staticmethod
    def create(db: Session, *, obj: BehaviorMetrics) -> BehaviorMetrics:
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def get_by_application_id(db: Session, application_id: int) -> BehaviorMetrics | None:
        stmt = (
            select(BehaviorMetrics)
            .where(BehaviorMetrics.application_id == application_id)
            .order_by(BehaviorMetrics.id.desc())
            .limit(1)
        )
        return db.scalars(stmt).first()

    @staticmethod
    def list_all(db: Session, skip: int = 0, limit: int = 100) -> list[BehaviorMetrics]:
        stmt = select(BehaviorMetrics).order_by(BehaviorMetrics.id.desc()).offset(skip).limit(limit)
        return list(db.scalars(stmt).all())

    @staticmethod
    def update(db: Session, row: BehaviorMetrics) -> BehaviorMetrics:
        db.add(row)
        db.commit()
        db.refresh(row)
        return row

    @staticmethod
    def delete(db: Session, row: BehaviorMetrics) -> None:
        db.delete(row)
        db.commit()
