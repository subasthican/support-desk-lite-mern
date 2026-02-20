Support Desk Lite

A support ticket system where customers can raise tickets, agents can manage them, and admins can oversee everything.

What you need before starting

- Node.js
- MongoDB
- npm

How to run this project

1. Clone the repo and go into the folder

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

cd backend
npm test

API docs

http://localhost:5001/api-docs