from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.lead_application import LeadApplication, LeadApplicationCRUD
from schemas.lead_application import LeadApplicationCreate, LeadApplicationRead, LeadApplicationUpdate

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=LeadApplicationRead, status_code=status.HTTP_201_CREATED)
def create_lead(payload: LeadApplicationCreate, db: Session = Depends(get_db)) -> LeadApplication:
    entity = LeadApplication(**payload.model_dump())
    return LeadApplicationCRUD.create(db, obj=entity)


@router.get("", response_model=list[LeadApplicationRead])
def list_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> list[LeadApplication]:
    return LeadApplicationCRUD.list_all(db, skip=skip, limit=limit)


@router.get("/{lead_id}", response_model=LeadApplicationRead)
def get_lead(lead_id: int, db: Session = Depends(get_db)) -> LeadApplication:
    row = LeadApplicationCRUD.get_by_id(db, lead_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return row


@router.put("/{lead_id}", response_model=LeadApplicationRead)
def update_lead(
    lead_id: int, payload: LeadApplicationUpdate, db: Session = Depends(get_db)
) -> LeadApplication:
    row = LeadApplicationCRUD.get_by_id(db, lead_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    return LeadApplicationCRUD.update(db, row)


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(lead_id: int, db: Session = Depends(get_db)) -> None:
    row = LeadApplicationCRUD.get_by_id(db, lead_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    LeadApplicationCRUD.delete(db, row)
