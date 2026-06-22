
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.vessel import VesselCreate,VesselResponse
from app.services import vessel_service
from app.routers.auth import get_current_user

router=APIRouter(prefix="/vessels", tags=["Vessels"])

@router.post("/", response_model=VesselResponse)
def create(data:VesselCreate, db:Session=Depends(get_db), user=Depends(get_current_user)):
    return vessel_service.create_vessel(db,data,user.id)

@router.get("/", response_model=list[VesselResponse])
def all(db:Session=Depends(get_db)): return vessel_service.get_all(db)
