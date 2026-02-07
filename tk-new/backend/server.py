from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import resend
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-this')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60

resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@example.com')

class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminUserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class AdminUserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: AdminUser

class PortfolioItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image_url: str
    category: str
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PortfolioItemCreate(BaseModel):
    title: str
    description: str
    image_url: str
    category: str
    featured: bool = False

class GalleryImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_url: str
    caption: Optional[str] = None
    category: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GalleryImageCreate(BaseModel):
    image_url: str
    caption: Optional[str] = None
    category: str

class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    price: Optional[str] = None
    features: List[str] = []
    image_url: Optional[str] = None
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ServiceCreate(BaseModel):
    title: str
    description: str
    price: Optional[str] = None
    features: List[str] = []
    image_url: Optional[str] = None
    active: bool = True

class TeamMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    bio: str
    image_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TeamMemberCreate(BaseModel):
    name: str
    role: str
    bio: str
    image_url: str

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    content: str
    rating: int
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TestimonialCreate(BaseModel):
    client_name: str
    content: str
    rating: int
    image_url: Optional[str] = None

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    excerpt: str
    image_url: Optional[str] = None
    category: str
    author: str
    published: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    image_url: Optional[str] = None
    category: str
    author: str
    published: bool = False

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    published: Optional[bool] = None

class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    country: str
    event_details: str
    venue_address: str
    number_of_guests: str
    additional_requirements: str
    date: str
    time: str
    how_did_you_hear: str
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InquiryCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    country: str
    event_details: str
    venue_address: str
    number_of_guests: str
    additional_requirements: str
    date: str
    time: str
    how_did_you_hear: str

class InquiryStatusUpdate(BaseModel):
    status: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.admin_users.find_one({"email": email}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        if isinstance(user['created_at'], str):
            user['created_at'] = datetime.fromisoformat(user['created_at'])
        return AdminUser(**user)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: AdminUserCreate):
    existing_user = await db.admin_users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user_data.password)
    user = AdminUser(email=user_data.email, name=user_data.name)
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['password'] = hashed_password
    
    await db.admin_users.insert_one(user_dict)
    
    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: AdminUserLogin):
    user = await db.admin_users.find_one({"email": user_data.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(user_data.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    user_obj = AdminUser(**{k: v for k, v in user.items() if k != 'password'})
    access_token = create_access_token(data={"sub": user_obj.email})
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@api_router.get("/auth/me", response_model=AdminUser)
async def get_me(current_user: AdminUser = Depends(get_current_user)):
    return current_user

@api_router.post("/portfolio", response_model=PortfolioItem)
async def create_portfolio_item(item: PortfolioItemCreate, current_user: AdminUser = Depends(get_current_user)):
    portfolio_item = PortfolioItem(**item.model_dump())
    item_dict = portfolio_item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    await db.portfolio.insert_one(item_dict)
    return portfolio_item

@api_router.get("/portfolio", response_model=List[PortfolioItem])
async def get_portfolio_items(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category:
        query['category'] = category
    if featured is not None:
        query['featured'] = featured
    
    items = await db.portfolio.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for item in items:
        if isinstance(item['created_at'], str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    return items

@api_router.get("/portfolio/{item_id}", response_model=PortfolioItem)
async def get_portfolio_item(item_id: str):
    item = await db.portfolio.find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if isinstance(item['created_at'], str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    return item

@api_router.put("/portfolio/{item_id}", response_model=PortfolioItem)
async def update_portfolio_item(item_id: str, item_update: PortfolioItemCreate, current_user: AdminUser = Depends(get_current_user)):
    item_dict = item_update.model_dump()
    item_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.portfolio.update_one({"id": item_id}, {"$set": item_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    updated_item = await db.portfolio.find_one({"id": item_id}, {"_id": 0})
    if isinstance(updated_item['created_at'], str):
        updated_item['created_at'] = datetime.fromisoformat(updated_item['created_at'])
    return updated_item

@api_router.delete("/portfolio/{item_id}")
async def delete_portfolio_item(item_id: str, current_user: AdminUser = Depends(get_current_user)):
    result = await db.portfolio.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted successfully"}

@api_router.post("/gallery", response_model=GalleryImage)
async def create_gallery_image(image: GalleryImageCreate, current_user: AdminUser = Depends(get_current_user)):
    gallery_image = GalleryImage(**image.model_dump())
    image_dict = gallery_image.model_dump()
    image_dict['created_at'] = image_dict['created_at'].isoformat()
    await db.gallery.insert_one(image_dict)
    return gallery_image

@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery_images(category: Optional[str] = None):
    query = {}
    if category:
        query['category'] = category
    
    images = await db.gallery.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for image in images:
        if isinstance(image['created_at'], str):
            image['created_at'] = datetime.fromisoformat(image['created_at'])
    return images

@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str, current_user: AdminUser = Depends(get_current_user)):
    result = await db.gallery.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted successfully"}

@api_router.post("/services", response_model=Service)
async def create_service(service: ServiceCreate, current_user: AdminUser = Depends(get_current_user)):
    service_obj = Service(**service.model_dump())
    service_dict = service_obj.model_dump()
    service_dict['created_at'] = service_dict['created_at'].isoformat()
    await db.services.insert_one(service_dict)
    return service_obj

@api_router.get("/services", response_model=List[Service])
async def get_services(active: Optional[bool] = None):
    query = {}
    if active is not None:
        query['active'] = active
    
    services = await db.services.find(query, {"_id": 0}).to_list(1000)
    for service in services:
        if isinstance(service['created_at'], str):
            service['created_at'] = datetime.fromisoformat(service['created_at'])
    return services

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    service = await db.services.find_one({"id": service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    if isinstance(service['created_at'], str):
        service['created_at'] = datetime.fromisoformat(service['created_at'])
    return service

@api_router.put("/services/{service_id}", response_model=Service)
async def update_service(service_id: str, service_update: ServiceCreate, current_user: AdminUser = Depends(get_current_user)):
    service_dict = service_update.model_dump()
    service_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.services.update_one({"id": service_id}, {"$set": service_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    updated_service = await db.services.find_one({"id": service_id}, {"_id": 0})
    if isinstance(updated_service['created_at'], str):
        updated_service['created_at'] = datetime.fromisoformat(updated_service['created_at'])
    return updated_service

@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str, current_user: AdminUser = Depends(get_current_user)):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted successfully"}

@api_router.post("/team", response_model=TeamMember)
async def create_team_member(member: TeamMemberCreate, current_user: AdminUser = Depends(get_current_user)):
    team_member = TeamMember(**member.model_dump())
    member_dict = team_member.model_dump()
    member_dict['created_at'] = member_dict['created_at'].isoformat()
    await db.team.insert_one(member_dict)
    return team_member

@api_router.get("/team", response_model=List[TeamMember])
async def get_team_members():
    members = await db.team.find({}, {"_id": 0}).to_list(1000)
    for member in members:
        if isinstance(member['created_at'], str):
            member['created_at'] = datetime.fromisoformat(member['created_at'])
    return members

@api_router.put("/team/{member_id}", response_model=TeamMember)
async def update_team_member(member_id: str, member_update: TeamMemberCreate, current_user: AdminUser = Depends(get_current_user)):
    member_dict = member_update.model_dump()
    result = await db.team.update_one({"id": member_id}, {"$set": member_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    updated_member = await db.team.find_one({"id": member_id}, {"_id": 0})
    if isinstance(updated_member['created_at'], str):
        updated_member['created_at'] = datetime.fromisoformat(updated_member['created_at'])
    return updated_member

@api_router.delete("/team/{member_id}")
async def delete_team_member(member_id: str, current_user: AdminUser = Depends(get_current_user)):
    result = await db.team.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"message": "Member deleted successfully"}

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate, current_user: AdminUser = Depends(get_current_user)):
    testimonial_obj = Testimonial(**testimonial.model_dump())
    testimonial_dict = testimonial_obj.model_dump()
    testimonial_dict['created_at'] = testimonial_dict['created_at'].isoformat()
    await db.testimonials.insert_one(testimonial_dict)
    return testimonial_obj

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for testimonial in testimonials:
        if isinstance(testimonial['created_at'], str):
            testimonial['created_at'] = datetime.fromisoformat(testimonial['created_at'])
    return testimonials

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, current_user: AdminUser = Depends(get_current_user)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}

@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate, current_user: AdminUser = Depends(get_current_user)):
    blog_post = BlogPost(**post.model_dump())
    post_dict = blog_post.model_dump()
    post_dict['created_at'] = post_dict['created_at'].isoformat()
    post_dict['updated_at'] = post_dict['updated_at'].isoformat()
    await db.blog_posts.insert_one(post_dict)
    return blog_post

@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts(published: Optional[bool] = None):
    query = {}
    if published is not None:
        query['published'] = published
    
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for post in posts:
        if isinstance(post['created_at'], str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
        if isinstance(post['updated_at'], str):
            post['updated_at'] = datetime.fromisoformat(post['updated_at'])
    return posts

@api_router.get("/blog/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if isinstance(post['created_at'], str):
        post['created_at'] = datetime.fromisoformat(post['created_at'])
    if isinstance(post['updated_at'], str):
        post['updated_at'] = datetime.fromisoformat(post['updated_at'])
    return post

@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post_update: BlogPostUpdate, current_user: AdminUser = Depends(get_current_user)):
    update_data = {k: v for k, v in post_update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    updated_post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if isinstance(updated_post['created_at'], str):
        updated_post['created_at'] = datetime.fromisoformat(updated_post['created_at'])
    if isinstance(updated_post['updated_at'], str):
        updated_post['updated_at'] = datetime.fromisoformat(updated_post['updated_at'])
    return updated_post

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, current_user: AdminUser = Depends(get_current_user)):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry: InquiryCreate):
    inquiry_obj = Inquiry(**inquiry.model_dump())
    inquiry_dict = inquiry_obj.model_dump()
    inquiry_dict['created_at'] = inquiry_dict['created_at'].isoformat()
    await db.inquiries.insert_one(inquiry_dict)
    
    if resend.api_key:
        try:
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #C5A059;">New Inquiry Received</h2>
                    <p><strong>Name:</strong> {inquiry_obj.first_name} {inquiry_obj.last_name}</p>
                    <p><strong>Email:</strong> {inquiry_obj.email}</p>
                    <p><strong>Phone:</strong> {inquiry_obj.phone}</p>
                    <p><strong>Country:</strong> {inquiry_obj.country}</p>
                    <p><strong>Event Details:</strong> {inquiry_obj.event_details}</p>
                    <p><strong>Venue Address:</strong> {inquiry_obj.venue_address}</p>
                    <p><strong>Number of Guests:</strong> {inquiry_obj.number_of_guests}</p>
                    <p><strong>Date:</strong> {inquiry_obj.date}</p>
                    <p><strong>Time:</strong> {inquiry_obj.time}</p>
                    <p><strong>Additional Requirements:</strong> {inquiry_obj.additional_requirements}</p>
                    <p><strong>How Did You Hear About Us:</strong> {inquiry_obj.how_did_you_hear}</p>
                </body>
            </html>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": [ADMIN_EMAIL],
                "subject": f"New Inquiry from {inquiry_obj.first_name} {inquiry_obj.last_name}",
                "html": html_content
            }
            
            await asyncio.to_thread(resend.Emails.send, params)
        except Exception as e:
            logging.error(f"Failed to send email: {str(e)}")
    
    return inquiry_obj

@api_router.get("/inquiries", response_model=List[Inquiry])
async def get_inquiries(status: Optional[str] = None, current_user: AdminUser = Depends(get_current_user)):
    query = {}
    if status:
        query['status'] = status
    
    inquiries = await db.inquiries.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for inquiry in inquiries:
        if isinstance(inquiry['created_at'], str):
            inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
    return inquiries

@api_router.get("/inquiries/{inquiry_id}", response_model=Inquiry)
async def get_inquiry(inquiry_id: str, current_user: AdminUser = Depends(get_current_user)):
    inquiry = await db.inquiries.find_one({"id": inquiry_id}, {"_id": 0})
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    if isinstance(inquiry['created_at'], str):
        inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
    return inquiry

@api_router.patch("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, status_update: InquiryStatusUpdate, current_user: AdminUser = Depends(get_current_user)):
    result = await db.inquiries.update_one({"id": inquiry_id}, {"$set": {"status": status_update.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Status updated successfully"}

@api_router.delete("/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, current_user: AdminUser = Depends(get_current_user)):
    result = await db.inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Inquiry deleted successfully"}

@api_router.get("/stats")
async def get_stats(current_user: AdminUser = Depends(get_current_user)):
    portfolio_count = await db.portfolio.count_documents({})
    gallery_count = await db.gallery.count_documents({})
    services_count = await db.services.count_documents({})
    inquiries_count = await db.inquiries.count_documents({})
    new_inquiries = await db.inquiries.count_documents({"status": "new"})
    blog_posts_count = await db.blog_posts.count_documents({})
    
    return {
        "portfolio_items": portfolio_count,
        "gallery_images": gallery_count,
        "services": services_count,
        "total_inquiries": inquiries_count,
        "new_inquiries": new_inquiries,
        "blog_posts": blog_posts_count
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
