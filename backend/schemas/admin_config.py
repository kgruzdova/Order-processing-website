from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class AdminConfigBase(BaseModel):
    services: list[Any] | dict[str, Any] = Field(default_factory=list)
    budget_range: dict[str, Any] = Field(default_factory=dict)
    extra_ui: dict[str, Any] = Field(default_factory=dict)


class AdminConfigCreate(AdminConfigBase):
    pass


class AdminConfigUpdate(BaseModel):
    services: list[Any] | dict[str, Any] | None = None
    budget_range: dict[str, Any] | None = None
    extra_ui: dict[str, Any] | None = None


class AdminConfigRead(AdminConfigBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    updated_at: datetime
