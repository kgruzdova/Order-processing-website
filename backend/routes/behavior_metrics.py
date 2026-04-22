from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.behavior_metrics import BehaviorMetrics, BehaviorMetricsCRUD
from schemas.behavior_metrics import BehaviorMetricsCreate, BehaviorMetricsRead, BehaviorMetricsUpdate

router = APIRouter(prefix="/behavior-metrics", tags=["behavior-metrics"])


@router.post("", response_model=BehaviorMetricsRead, status_code=status.HTTP_201_CREATED)
def create_behavior_metrics(
    payload: BehaviorMetricsCreate, db: Session = Depends(get_db)
) -> BehaviorMetrics:
    data = payload.model_dump()
    entity = BehaviorMetrics(**data)
    return BehaviorMetricsCRUD.create(db, obj=entity)


@router.get("", response_model=list[BehaviorMetricsRead])
def list_behavior_metrics(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[BehaviorMetrics]:
    return BehaviorMetricsCRUD.list_all(db, skip=skip, limit=limit)


@router.get("/{application_id}", response_model=BehaviorMetricsRead)
def get_behavior_metrics(application_id: int, db: Session = Depends(get_db)) -> BehaviorMetrics:
    row = BehaviorMetricsCRUD.get_by_application_id(db, application_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Metrics not found")
    return row


@router.put("/{application_id}", response_model=BehaviorMetricsRead)
def update_behavior_metrics(
    application_id: int, payload: BehaviorMetricsUpdate, db: Session = Depends(get_db)
) -> BehaviorMetrics:
    row = BehaviorMetricsCRUD.get_by_application_id(db, application_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Metrics not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    return BehaviorMetricsCRUD.update(db, row)


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_behavior_metrics(application_id: int, db: Session = Depends(get_db)) -> None:
    row = BehaviorMetricsCRUD.get_by_application_id(db, application_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Metrics not found")
    BehaviorMetricsCRUD.delete(db, row)
