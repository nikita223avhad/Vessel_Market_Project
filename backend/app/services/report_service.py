from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.report import Report
from app.models.vessel import Vessel
from app.models.market_data import MarketData
from app.schemas.report import ReportCreate


def create(db: Session, data: ReportCreate, user_id: int):
    vessel = db.query(Vessel).filter(
        Vessel.id == data.vessel_id
    ).first()

    if not vessel:
        raise HTTPException(
            status_code=404,
            detail="Vessel not found"
        )

    market_data = db.query(MarketData).filter(
        MarketData.id == data.market_data_id
    ).first()

    if not market_data:
        raise HTTPException(
            status_code=404,
            detail="Market data not found"
        )

    report = Report(
        vessel_id=data.vessel_id,
        market_data_id=data.market_data_id,
        title=data.title,
        summary=data.summary,
        created_by=user_id
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report


def get_all(db: Session):
    return db.query(Report).all()


def get_by_id(db: Session, report_id: int):
    report = db.query(Report).filter(
        Report.id == report_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return report


def delete(db: Session, report_id: int):
    report = db.query(Report).filter(
        Report.id == report_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    db.delete(report)
    db.commit()

    return {"message": "Report deleted successfully"}