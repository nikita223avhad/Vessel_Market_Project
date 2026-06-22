
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.report import ReportCreate,ReportResponse
from app.services import report_service
from app.core.dependencies import require_admin
from app.routers.auth import get_current_user

router=APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/", response_model=ReportResponse)
def create(data:ReportCreate, db:Session=Depends(get_db), admin=Depends(require_admin)):
    return report_service.create(db,data,admin.id)

@router.get("/", response_model=list[ReportResponse])
def all(db:Session=Depends(get_db), user=Depends(get_current_user)):
    return report_service.get_all(db)
