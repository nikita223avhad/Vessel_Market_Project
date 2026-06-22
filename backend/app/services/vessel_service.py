
from sqlalchemy.orm import Session
from app.models.vessel import Vessel
from app.schemas.vessel import VesselCreate

def create_vessel(db:Session,data:VesselCreate,owner_id:int):
    obj=Vessel(**data.model_dump(), owner_id=owner_id); db.add(obj); db.commit(); db.refresh(obj); return obj
def get_all(db): return db.query(Vessel).all()
def get_one(db,id): return db.query(Vessel).filter(Vessel.id==id).first()
def delete(db,id):
    obj=get_one(db,id)
    if obj: db.delete(obj); db.commit()
    return obj
