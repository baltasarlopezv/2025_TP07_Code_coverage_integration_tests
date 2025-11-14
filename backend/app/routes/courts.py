from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4
from app.database import get_db
from app import models, schemas
from app.auth import get_current_admin_user

router = APIRouter(prefix="/api/courts", tags=["Courts"])


@router.get("", response_model=List[schemas.CourtResponse])
@router.get("/", response_model=List[schemas.CourtResponse])
def get_all_courts(db: Session = Depends(get_db)):
    """Get all active courts"""
    courts = db.query(models.Court).filter(models.Court.is_active == True).all()
    return courts


@router.get("/{court_id}/available-slots")
def get_available_slots(
    court_id: str,
    date: str,
    db: Session = Depends(get_db)
):
    """Get available time slots for a court on a specific date"""
    from datetime import datetime
    from sqlalchemy import cast, Date
    
    # Verify court exists
    court = db.query(models.Court).filter(models.Court.id == court_id).first()
    if not court:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Court not found"
        )
    
    # Parse the date
    try:
        reservation_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    
    # Define all possible time slots (12:00 to 20:00)
    all_slots = [
        {"start": "12:00", "end": "13:00", "label": "12:00 - 13:00"},
        {"start": "13:00", "end": "14:00", "label": "13:00 - 14:00"},
        {"start": "14:00", "end": "15:00", "label": "14:00 - 15:00"},
        {"start": "15:00", "end": "16:00", "label": "15:00 - 16:00"},
        {"start": "16:00", "end": "17:00", "label": "16:00 - 17:00"},
        {"start": "17:00", "end": "18:00", "label": "17:00 - 18:00"},
        {"start": "18:00", "end": "19:00", "label": "18:00 - 19:00"},
        {"start": "19:00", "end": "20:00", "label": "19:00 - 20:00"},
    ]
    
    # Get all reservations for this court with CONFIRMED or PENDING status
    all_reservations = db.query(models.Reservation).filter(
        models.Reservation.court_id == court_id,
        models.Reservation.status.in_(["CONFIRMED", "PENDING"])
    ).all()
    
    # Filter reservations for the specific date manually (more reliable)
    reservations = []
    for res in all_reservations:
        # Handle both datetime and date objects
        res_date = res.date.date() if hasattr(res.date, 'date') else res.date
        if res_date == reservation_date:
            reservations.append(res)
    
    # Create a set of reserved slots
    reserved_slots = set()
    for reservation in reservations:
        # Ensure we're working with datetime objects
        start_dt = reservation.start_time
        end_dt = reservation.end_time
        
        # Handle both datetime and string formats
        if isinstance(start_dt, str):
            start_dt = datetime.fromisoformat(start_dt.replace('Z', '+00:00'))
        if isinstance(end_dt, str):
            end_dt = datetime.fromisoformat(end_dt.replace('Z', '+00:00'))
        
        start_time = start_dt.strftime("%H:%M")
        end_time = end_dt.strftime("%H:%M")
        reserved_slots.add(f"{start_time}-{end_time}")
    
    # Filter out reserved slots
    available_slots = [
        slot for slot in all_slots
        if f"{slot['start']}-{slot['end']}" not in reserved_slots
    ]
    
    return {
        "court_id": court_id,
        "date": date,
        "available_slots": available_slots,
        "reserved_count": len(reserved_slots)
    }


@router.get("/{court_id}", response_model=schemas.CourtResponse)
def get_court(court_id: str, db: Session = Depends(get_db)):
    """Get court by ID"""
    court = db.query(models.Court).filter(models.Court.id == court_id).first()
    if not court:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Court not found"
        )
    return court


@router.post("", response_model=schemas.CourtResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.CourtResponse, status_code=status.HTTP_201_CREATED)
def create_court(
    court_data: schemas.CourtCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Create a new court (Admin only)"""
    # Verify sport exists
    sport = db.query(models.Sport).filter(models.Sport.id == court_data.sport_id).first()
    if not sport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sport not found"
        )
    
    new_court = models.Court(
        id=str(uuid4()),
        **court_data.model_dump()
    )
    
    db.add(new_court)
    db.commit()
    db.refresh(new_court)
    
    return new_court


@router.put("/{court_id}", response_model=schemas.CourtResponse)
def update_court(
    court_id: str,
    court_data: schemas.CourtUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Update court (Admin only)"""
    court = db.query(models.Court).filter(models.Court.id == court_id).first()
    if not court:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Court not found"
        )
    
    # Update fields
    update_data = court_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(court, field, value)
    
    db.commit()
    db.refresh(court)
    
    return court


@router.delete("/{court_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_court(
    court_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Delete court (Admin only)"""
    court = db.query(models.Court).filter(models.Court.id == court_id).first()
    if not court:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Court not found"
        )
    
    db.delete(court)
    db.commit()
    
    return None
