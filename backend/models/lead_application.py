from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func, select
from sqlalchemy.orm import Mapped, Session, mapped_column, relationship

from core.database import Base


class LeadApplication(Base):
    """
    Заявка «тёплого» клиента с контактами и параметрами бизнес-задачи.

    SQL:
    CREATE TABLE lead_applications (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        patronymic VARCHAR(255),
        business_info TEXT NOT NULL,
        business_niche VARCHAR(512) NOT NULL,
        company_size VARCHAR(255) NOT NULL,
        task_volume VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        business_size VARCHAR(255) NOT NULL,
        need_volume VARCHAR(255) NOT NULL,
        result_deadline VARCHAR(255) NOT NULL,
        task_type VARCHAR(255) NOT NULL,
        interested_product VARCHAR(512) NOT NULL,
        budget VARCHAR(255) NOT NULL,
        preferred_contact_method VARCHAR(255) NOT NULL,
        convenient_time VARCHAR(255) NOT NULL,
        comments TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    """

    __tablename__ = "lead_applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    patronymic: Mapped[str | None] = mapped_column(String(255), nullable=True)
    business_info: Mapped[str] = mapped_column(Text, nullable=False)
    business_niche: Mapped[str] = mapped_column(String(512), nullable=False)
    company_size: Mapped[str] = mapped_column(String(255), nullable=False)
    task_volume: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    business_size: Mapped[str] = mapped_column(String(255), nullable=False)
    need_volume: Mapped[str] = mapped_column(String(255), nullable=False)
    result_deadline: Mapped[str] = mapped_column(String(255), nullable=False)
    task_type: Mapped[str] = mapped_column(String(255), nullable=False)
    interested_product: Mapped[str] = mapped_column(String(512), nullable=False)
    budget: Mapped[str] = mapped_column(String(255), nullable=False)
    preferred_contact_method: Mapped[str] = mapped_column(String(255), nullable=False)
    convenient_time: Mapped[str] = mapped_column(String(255), nullable=False)
    comments: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    behavior_metrics: Mapped["BehaviorMetrics | None"] = relationship(
        "BehaviorMetrics",
        back_populates="application",
        uselist=False,
        cascade="all, delete-orphan",
    )


class LeadApplicationCRUD:
    """Набор операций для таблицы заявок клиентов."""

    @staticmethod
    def create(db: Session, *, obj: LeadApplication) -> LeadApplication:
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def get_by_id(db: Session, lead_id: int) -> LeadApplication | None:
        return db.get(LeadApplication, lead_id)

    @staticmethod
    def list_all(db: Session, skip: int = 0, limit: int = 100) -> list[LeadApplication]:
        stmt = (
            select(LeadApplication)
            .order_by(LeadApplication.id.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def update(db: Session, lead: LeadApplication) -> LeadApplication:
        db.add(lead)
        db.commit()
        db.refresh(lead)
        return lead

    @staticmethod
    def delete(db: Session, lead: LeadApplication) -> None:
        db.delete(lead)
        db.commit()
