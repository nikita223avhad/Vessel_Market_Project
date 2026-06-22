
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.core.dependencies import require_admin

router=APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def get_users(db:Session=Depends(get_db), current=Depends(require_admin)):
    return db.query(User).all()
