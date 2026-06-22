from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ReportBase(BaseModel):
    vessel_id: int
    market_data_id: int
    title: str
    summary: Optional[str] = None


class ReportCreate(ReportBase):
    pass


class ReportUpdate(BaseModel):
    vessel_id: Optional[int] = None
    market_data_id: Optional[int] = None
    title: Optional[str] = None
    summary: Optional[str] = None


class ReportResponse(ReportBase):
    id: int
    created_at: datetime
    created_by: int

    class Config:
        from_attributes = True