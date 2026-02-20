Support Desk Lite

A support ticket system where customers can raise tickets, agents can manage them, and admins can oversee everything.

What you need before starting  

1. Check if Node.js is installed
   node --version
   If not installed, download from https://nodejs.org

2. Check if MongoDB is installed
   mongod --version
   If not installed, download from https://www.mongodb.com/try/download/community

3. Check if MongoDB is running
   Mac: brew services list
   Windows: check Services app for MongoDB

   If not running:
   Mac: brew services start mongodb-community
   Windows: net start MongoDB

   Note: This project uses its own database called support_desk_lite
   It will not affect any other existing databases on your computer

How to run this project

1. Clone the repo and go into the folder

   git clone https://github.com/subasthican/support-desk-lite-mern
   cd support-desk-lite-mern

2. Open Terminal 1 - Backend

   cd backend
   npm install
   cp .env.example .env
   npm run dev

   You should see MongoDB connected and Server running on port 5001

3. Open Terminal 2 - Seed the database

   cd backend/src
   npm run seed

   This creates test users and sample tickets
////
PORT=5001
MONGO_URI=mongodb://localhost:27017/support_desk_lite
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
NODE_ENV=development
////
4. Open Terminal 3 - Frontend

   cd frontend
   npm install
   npm start

   Go to http://localhost:3000

Login credentials

Admin - admin@test.com / 123456
Agent - agent@test.com / 123456
Customer - customer@test.com / 123456

Running the tests

Backend:
cd backend
npm test

Frontend:
cd frontend
npm test

API docs

http://localhost:5001/api-docs