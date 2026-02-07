ADMIN SETUP INSTRUCTIONS
=========================

The MongoDB connection is failing because the password placeholder needs to be replaced.

CURRENT ISSUE:
- Your .env file has: MONGO_URL="mongodb+srv://shivamkshatriyapurposebuddy_db_user:<db_password>@cluster0.ogoklh0.mongodb.net/"
- The <db_password> needs to be replaced with your actual MongoDB Atlas password

TO CREATE ADMIN USER:
1. Update tk-new/backend/.env file with your actual MongoDB password:
   MONGO_URL="mongodb+srv://shivamkshatriyapurposebuddy_db_user:YOUR_PASSWORD@cluster0.ogoklh0.mongodb.net/"

2. Run the seed script:
   cd tk-new/backend
   python seed_admin.py

3. This will create admin user:
   - Email: admin@example.com
   - Password: admin123

4. Then login at: http://localhost:3000/admin/login

If you don't know your MongoDB Atlas password:
1. Go to https://cloud.mongodb.com
2. Click "Database Access"
3. Edit the user "shivamkshatriyapurposebuddy_db_user"
4. Reset/create a new password
5. Update the .env file with the new password