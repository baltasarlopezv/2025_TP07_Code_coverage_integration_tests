from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List
from uuid import uuid4
from datetime import datetime
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/reservations", tags=["Reservations"])


@router.post("", response_model=schemas.ReservationResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.ReservationResponse, status_code=status.HTTP_201_CREATED)
def create_reservation(
    reservation_data: schemas.ReservationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new reservation"""
    # Verify court exists
    court = db.query(models.Court).filter(
        and_(
            models.Court.id == reservation_data.court_id,
            models.Court.is_active == True
        )
    ).first()
    
    if not court:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Court not found or not active"
        )
    
    # Check for overlapping reservations
    overlapping = db.query(models.Reservation).filter(
        and_(
            models.Reservation.court_id == reservation_data.court_id,
            models.Reservation.date == reservation_data.date,
            models.Reservation.status != models.ReservationStatus.CANCELLED,
            or_(
                and_(
                    models.Reservation.start_time <= reservation_data.start_time,
                    models.Reservation.end_time > reservation_data.start_time
                ),
                and_(
                    models.Reservation.start_time < reservation_data.end_time,
                    models.Reservation.end_time >= reservation_data.end_time
                )
            )
        )
    ).first()
    
    if overlapping:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This time slot is already reserved"
        )
    
    # Calculate total price
    duration_hours = (reservation_data.end_time - reservation_data.start_time).total_seconds() / 3600
    total_price = duration_hours * court.price_per_hour
    
    # Create reservation
    new_reservation = models.Reservation(
        id=str(uuid4()),
        user_id=current_user.id,
        court_id=reservation_data.court_id,
        date=reservation_data.date,
        start_time=reservation_data.start_time,
        end_time=reservation_data.end_time,
        total_price=total_price,
        status=models.ReservationStatus.CONFIRMED,
        notes=reservation_data.notes
    )
    
    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)
    
    return new_reservation


@router.get("/my-reservations", response_model=List[schemas.ReservationWithDetails])
def get_my_reservations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get current user's reservations"""
    reservations = db.query(models.Reservation).filter(
        models.Reservation.user_id == current_user.id
    ).order_by(models.Reservation.date.desc()).all()
    
    return reservations


@router.get("/all", response_model=List[schemas.ReservationWithDetails])
def get_all_reservations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Get all reservations (Admin only)"""
    reservations = db.query(models.Reservation).order_by(
        models.Reservation.date.desc()
    ).all()
    
    return reservations


@router.get("/{reservation_id}", response_model=schemas.ReservationWithDetails)
def get_reservation(
    reservation_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get reservation by ID"""
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id
    ).first()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )
    
    # Check permissions
    if reservation.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this reservation"
        )
    
    return reservation


@router.delete("/{reservation_id}", status_code=status.HTTP_200_OK)
def cancel_reservation(
    reservation_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Cancel a reservation"""
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id
    ).first()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )
    
    # Check permissions
    if reservation.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this reservation"
        )
    
    reservation.status = models.ReservationStatus.CANCELLED
    db.commit()
    
    return {"message": "Reservation cancelled successfully"}
