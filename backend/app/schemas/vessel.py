
from pydantic import BaseModel
from typing import Optional

class VesselBase(BaseModel):
    vessel_name:str
    vessel_type:str
    price:float
    location:str
    description: Optional[str]=None

class VesselCreate(VesselBase): pass

class VesselResponse(VesselBase):
    id:int
    owner_id:int
    class Config: from_attributes=True
