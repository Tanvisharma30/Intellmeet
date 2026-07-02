IntellMeet – AI-Powered Meeting & Collaboration Platform

A real-time AI-assisted meeting and collaboration platform with transcription, task scheduling, notifications, and live communication built using the MERN stack. 

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Express](https://img.shields.io/badge/Backend-Express.js-000000)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-010101)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![AI](https://img.shields.io/badge/AI-Gemini-blueviolet)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
![Render](https://img.shields.io/badge/API-Render-7B42BC)

🚀 Live Demo
🌐 Frontend: https://intellmeet-frontend-qo7iq80qg-tanvis136-6694s-projects.vercel.app/
⚙️ Backend API: https://intellmeet-backend-vgkg.onrender.com/
🧠 Project Overview

IntellMeet is a full-stack real-time collaboration platform designed to enhance online meetings using AI features.

It enables users to:

Create and join meetings instantly
Schedule meetings
Get AI-based transcription assistance
Manage tasks in real-time
Receive live notifications
Collaborate using socket-based communication

The goal of this project is to simulate a modern enterprise-level meeting system with AI integration and real-time capabilities.

1. Key Features
ID	Feature	Description
F1	User Authentication	Secure login and registration system using JWT
F2	Real-time Meetings	Create and join meetings instantly using Socket.IO
F3	AI Transcription	AI-assisted meeting transcription and processing
F4	Task Management	Create and track tasks during meetings
F5	Meeting Scheduling	Schedule future meetings with participants
F6	Notifications	Real-time updates for meetings and tasks
F7	Participant Management	Display active participants in meetings
F8	Dashboard Analytics	View meeting history and activity 

2. Tech Stack
Layer	Technology	Purpose
Frontend	React + Vite + TypeScript	UI development
Backend	Node.js + Express	API & server logic
Database	MongoDB	Data storage
Real-time	Socket.IO	Live communication
Auth	JWT	Authentication
Deployment	Vercel (frontend), Render (backend)	Hosting 

3. Architecture Overview
System Flow
User (Frontend - React)
        ↓
API Requests (Axios / Fetch)
        ↓
Backend (Node.js + Express)
        ↓
MongoDB (Database)
        ↓
Socket.IO (Real-time layer)
        ↓
AI Services (Transcription / Processing)
4. Architecture Explanation 

The system follows a client-server architecture:

 Frontend Layer
Built using React + Vite
Handles UI rendering, routing, and state management
Communicates with backend using REST APIs and Socket.IO
 Backend Layer
Node.js + Express server
Handles authentication, meeting logic, tasks, and notifications
Provides REST APIs for frontend consumption
 Database Layer
MongoDB stores:
Users
Meetings
Tasks
Notifications
History logs
 Real-Time Layer
Socket.IO enables:
Live participant updates
Real-time messaging/events
Meeting room synchronization
 AI Layer
AI transcription module processes meeting input
Generates structured text output for users
5. Development Timeline
Week 1
Project setup
Authentication system
Basic frontend UI
Week 2
Meeting creation & joining
Backend API integration
MongoDB schema design
Week 3
Socket.IO integration
Real-time communication system
Dashboard creation
Week 4
AI transcription integration
Notifications system
Deployment (Vercel + Render)
6. Installation & Setup
  Clone repository
git clone https://github.com/your-username/intellmeet.git
  Backend setup
cd backend
npm install
npm run dev
  Frontend setup
cd frontend
npm install
npm run dev
 Environment Variables
Backend .env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
SENTRY_DSN=your_sentry_dsn
Frontend .env
VITE_API_URL=https://intellmeet-backend-vgkg.onrender.com

7. Technical Highlights
Real-time communication using Socket.IO
Secure JWT authentication
AI-assisted transcription workflow
RESTful API design
Scalable MERN architecture
Cloud deployment using Vercel & Render
8. Challenges Faced
Handling real-time socket disconnections
CORS configuration between frontend & backend
Deployment environment variable issues
Syncing AI transcription with live meetings
9. Future Improvements
Video calling integration (WebRTC)
Advanced AI summarization
Calendar integration (Google Calendar API)
Role-based access control
Mobile app version 

👩‍💻 Author

Tanvi Sharma
@harsadash
B.Tech CSE (AIML)

📌 License

This project is for academic submission and internship evaluation purposes.