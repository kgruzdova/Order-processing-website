from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LeadApplicationBase(BaseModel):
    first_name: str = Field(..., max_length=255)
    last_name: str = Field(..., max_length=255)
    patronymic: str | None = Field(None, max_length=255)
    business_info: str
    business_niche: str = Field(..., max_length=512)
    company_size: str = Field(..., max_length=255)
    task_volume: str = Field(..., max_length=255)
    role: str = Field(..., max_length=255)
    business_size: str = Field(..., max_length=255)
    need_volume: str = Field(..., max_length=255)
    result_deadline: str = Field(..., max_length=255)
    task_type: str = Field(..., max_length=255)
    interested_product: str = Field(..., max_length=512)
    budget: str = Field(..., max_length=255)
    preferred_contact_method: str = Field(..., max_length=255)
    convenient_time: str = Field(..., max_length=255)
    comments: str = ""


class LeadApplicationCreate(LeadApplicationBase):
    pass


class LeadApplicationUpdate(BaseModel):
    first_name: str | None = Field(None, max_length=255)
    last_name: str | None = Field(None, max_length=255)
    patronymic: str | None = Field(None, max_length=255)
    business_info: str | None = None
    business_niche: str | None = Field(None, max_length=512)
    company_size: str | None = Field(None, max_length=255)
    task_volume: str | None = Field(None, max_length=255)
    role: str | None = Field(None, max_length=255)
    business_size: str | None = Field(None, max_length=255)
    need_volume: str | None = Field(None, max_length=255)
    result_deadline: str | None = Field(None, max_length=255)
    task_type: str | None = Field(None, max_length=255)
    interested_product: str | None = Field(None, max_length=512)
    budget: str | None = Field(None, max_length=255)
    preferred_contact_method: str | None = Field(None, max_length=255)
    convenient_time: str | None = Field(None, max_length=255)
    comments: str | None = None


class LeadApplicationRead(LeadApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
