from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class BehaviorMetricsBase(BaseModel):
    application_id: int
    time_on_page_seconds: int = 0
    button_clicks: list[Any] | dict[str, Any] = Field(default_factory=list)
    cursor_hover_zones: list[Any] | dict[str, Any] = Field(default_factory=list)
    return_visits_count: int = 0
    technical_payload: dict[str, Any] = Field(default_factory=dict)


class BehaviorMetricsCreate(BehaviorMetricsBase):
    pass


class BehaviorMetricsUpdate(BaseModel):
    time_on_page_seconds: int | None = None
    button_clicks: list[Any] | dict[str, Any] | None = None
    cursor_hover_zones: list[Any] | dict[str, Any] | None = None
    return_visits_count: int | None = None
    technical_payload: dict[str, Any] | None = None


class BehaviorMetricsRead(BehaviorMetricsBase):
    model_config = ConfigDict(from_attributes=True)
