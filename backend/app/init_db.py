"""
Initialize database with sample data
"""
from sqlalchemy.orm import Session
from uuid import uuid4
from app.database import SessionLocal, engine, Base
from app import models
from app.auth import get_password_hash


def init_db():
    """Initialize database with tables and sample data"""
    print("🔨 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_users = db.query(models.User).count()
        if existing_users > 0:
            print("ℹ️  Database already has data. Skipping seed...")
            return
        
        print("🌱 Seeding database...")
        
        # Create sports
        football = models.Sport(
            id=str(uuid4()),
            name="Football",
            description="Soccer field"
        )
        tennis = models.Sport(
            id=str(uuid4()),
            name="Tennis",
            description="Tennis court"
        )
        basketball = models.Sport(
            id=str(uuid4()),
            name="Basketball",
            description="Basketball court"
        )
        
        db.add_all([football, tennis, basketball])
        db.commit()
        print("✅ Sports created")
        
        # Create admin user
        admin = models.User(
            id=str(uuid4()),
            email="admin@courts.com",
            hashed_password=get_password_hash("admin123"),
            first_name="Admin",
            last_name="User",
            phone="+1234567890",
            role=models.UserRole.ADMIN
        )
        
        # Create regular user
        user = models.User(
            id=str(uuid4()),
            email="user@example.com",
            hashed_password=get_password_hash("user123"),
            first_name="John",
            last_name="Doe",
            phone="+0987654321",
            role=models.UserRole.USER
        )
        
        db.add_all([admin, user])
        db.commit()
        print("✅ Users created")
        
        # Create courts
        courts = [
            models.Court(
                id=str(uuid4()),
                name="Football Field 1",
                description="Professional size football field with artificial grass",
                sport_id=football.id,
                location="Main Complex - North",
                price_per_hour=50.0,
                capacity=22,
                is_active=True
            ),
            models.Court(
                id=str(uuid4()),
                name="Football Field 2",
                description="Standard football field with natural grass",
                sport_id=football.id,
                location="Main Complex - South",
                price_per_hour=45.0,
                capacity=22,
                is_active=True
            ),
            models.Court(
                id=str(uuid4()),
                name="Tennis Court 1",
                description="Clay tennis court",
                sport_id=tennis.id,
                location="Tennis Area - Court 1",
                price_per_hour=30.0,
                capacity=4,
                is_active=True
            ),
            models.Court(
                id=str(uuid4()),
                name="Tennis Court 2",
                description="Hard tennis court",
                sport_id=tennis.id,
                location="Tennis Area - Court 2",
                price_per_hour=30.0,
                capacity=4,
                is_active=True
            ),
            models.Court(
                id=str(uuid4()),
                name="Basketball Court 1",
                description="Indoor basketball court",
                sport_id=basketball.id,
                location="Indoor Complex",
                price_per_hour=40.0,
                capacity=10,
                is_active=True
            ),
        ]
        
        db.add_all(courts)
        db.commit()
        print("✅ Courts created")
        
        print("🎉 Database seeded successfully!")
        print("\n📝 Login credentials:")
        print("Admin: admin@courts.com / admin123")
        print("User: user@example.com / user123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
