import asyncio
import os
from datetime import datetime, timezone
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_admin():
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if admin already exists
    existing = await db.admin_users.find_one({"email": "admin@example.com"})
    if existing:
        print("Admin user already exists!")
        print("Email: admin@example.com")
        print("Password: admin123")
        client.close()
        return
    
    # Create admin user
    hashed_password = pwd_context.hash("admin123")
    admin_user = {
        "id": "admin-001",
        "email": "admin@example.com",
        "name": "Admin",
        "password": hashed_password,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.admin_users.insert_one(admin_user)
    print("✅ Admin user created successfully!")
    print("📧 Email: admin@example.com")
    print("🔑 Password: admin123")
    print("")
    print("You can now login at: http://localhost:3000/admin/login")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_admin())