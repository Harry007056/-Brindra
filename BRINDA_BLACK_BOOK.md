# A  
## PROJECT REPORT  
### ON  
## "BRINDA"  
### (A Full-Stack Team Collaboration and Project Management Platform)

Submitted By:  
`[Student Name 1] (PRN: [PRN Number 1])`  
`[Student Name 2] (PRN: [PRN Number 2])`  
`(Bachelor of Computer Applications - Semester VI)`

To  
**Tilak Maharashtra Vidyapeeth, Pune**  
`(Academic Year: 2025 - 2026)`

**Onkar Infotech**  
A-205, Sai Arcade Building, Navagaon, Near Ganesh Mandir, Ganesh Mandir Road, Dombivli (East)  
Tel: 9967020815 | Email: onkarinfotech2022@gmail.com  
(TMV University Authorized Information & Facility Center-22105)

---

# CERTIFICATE
This is to certify that `[Student Name 1]` and `[Student Name 2]`, students of T.Y.BCA at Tilak Maharashtra Vidyapeeth, Pune, have satisfactorily completed the project entitled **"BRINDA - A Full-Stack Team Collaboration and Project Management Platform"** and submitted it in partial fulfillment of the requirements for the degree of Bachelor of Computer Applications (BCA), Semester VI, for the academic year **2025-2026**.

The work presented in this project is original and has been carried out under proper guidance and supervision.

Director: ____________________  
Project Guide: ____________________  
External Examiner: ____________________  
Date: ____________________  
Place: ____________________

---

# ACKNOWLEDGEMENT
We sincerely thank **Tilak Maharashtra Vidyapeeth, Pune**, and **Onkar Infotech** for providing us with the opportunity to develop our project, **BRINDA**.

We express heartfelt gratitude to our project guide, faculty members, and mentors for their continuous support, guidance, and encouragement throughout this project. Their valuable suggestions helped us shape this work in a practical and professional manner.

We are also thankful to our family and friends for their motivation and support during the development of this project.

Submitted By:  
`[Student Name 1]`  
`[Student Name 2]`  
Date: ____________________  
Place: ____________________

---

# DIRECTOR RECOMMENDATION
To,  
The Registrar,  
Tilak Maharashtra Vidyapeeth University, Pune.

Subject: Request Approval of BCA III (VI Semester) Project Report

We hereby recommend the project report titled **"BRINDA - A Full-Stack Team Collaboration and Project Management Platform"**, prepared by `[Student Name 1]` and `[Student Name 2]`, as partial fulfillment of the BCA III (Semester VI) degree requirements.

The project has been completed under proper guidance and meets the expected academic standards.

Director  
____________________

---

# ABSTRACT
BRINDA is a full-stack collaborative workspace platform designed to streamline team communication, task execution, project tracking, and file organization in a unified digital environment.

The platform is built using **React + Vite** for the frontend, **Node.js + Express** for backend APIs, **MongoDB** for data persistence, and **Socket.IO** for real-time events. It supports secure authentication using access/refresh JWT tokens, role-aware user actions, notification workflows, and plan-based feature controls.

Key features include:
- User authentication with refresh token lifecycle
- Team member management with role-based access
- Project and task management with due dates and status tracking
- Real-time direct messaging and typing indicators
- Notification system for task assignment/reassignment
- File metadata collaboration module with sharing and folder mapping
- User settings for profile, security, appearance, and language preferences

BRINDA demonstrates how modern web technologies can be integrated to create a scalable, practical solution for collaborative workspaces and organizational productivity.

---

# INDEX
1. Introduction  
2. System Analysis  
3. System Model (Workflow)  
4. System Design  
5. Technology Stack, Testing, and Security  
6. Implementation (Modules, APIs, and Data Models)  
7. User Interface and Experience  
8. Future Enhancements  
9. Conclusion  
10. References

---

# Chapter 1: Introduction
## 1.1 About the Project
BRINDA is a web-based team collaboration platform for managing users, projects, tasks, chats, notifications, and files in a single workspace. Traditional team coordination often depends on disconnected tools (email, chat apps, spreadsheets), causing delays, poor visibility, and communication gaps. BRINDA addresses this by integrating key collaboration operations into one system.

## 1.2 Need for the System
The need for BRINDA arises from:
- Fragmented communication across teams
- Difficulty in tracking tasks and project progress
- Lack of centralized workspace ownership and role control
- Limited real-time visibility on member activities
- Manual and inconsistent update workflows

## 1.3 Objectives
- Build a secure and role-aware team workspace
- Enable centralized project and task planning
- Provide real-time communication between members
- Improve awareness through in-app notifications
- Support plan-based feature availability (Demo/Starter/Growth/Enterprise)

## 1.4 Scope
Current scope includes:
- Authentication and session management
- Team member onboarding and deletion
- Project and task lifecycle APIs
- Direct messaging and project-linked messages
- Notification operations (single/read-all/clear)
- File metadata collaboration workflows
- Settings, theme, and preference management

---

# Chapter 2: System Analysis
## 2.1 Existing System Limitations
Common issues in existing manual or semi-digital team workflows:
- Data duplication across tools
- No real-time synchronization
- Weak role-based restrictions
- Hard-to-track deadlines and task accountability
- No integrated notification/assignment loop

## 2.2 Proposed System
BRINDA provides:
- Unified authentication and user context
- Role-based operations (`team_leader`, `manager`, `member`, `admin`)
- REST-based backend with MongoDB persistence
- Socket-driven message and typing events
- Dashboard analytics summaries for projects/tasks/messages
- Personalized settings and theme controls

## 2.3 Feasibility Study
### Technical Feasibility
The chosen stack (React, Express, MongoDB, Socket.IO) is modern, stable, and suitable for real-time collaboration products.

### Economic Feasibility
Open-source technologies reduce licensing costs. Deployment is viable on cloud/free-tier friendly environments.

### Operational Feasibility
The UI is navigation-driven and role-aware; users can adopt the system with minimal training.

---

# Chapter 3: System Model (Workflow)
## 3.1 High-Level Workflow
1. User registers/logs in.
2. Access and refresh tokens are issued.
3. User enters workspace (dashboard/projects/team/messages/files).
4. User creates projects and assigns tasks.
5. Assigned users receive real-time notifications.
6. Members collaborate through direct/project messages.
7. Settings and preferences are persisted via profile APIs.

## 3.2 Actors and Responsibilities
- **Team Leader / Manager / Admin**: Add or remove members, create projects, assign tasks.
- **Member**: Participate in tasks, messaging, and workspace collaboration.
- **System**: Token verification, persistence, socket room routing, notification emission.

## 3.3 Core Data Flow
- Frontend calls backend REST endpoints (`/api/auth`, `/api/collab`).
- Backend validates token and permissions.
- Mongoose models persist and query data from MongoDB.
- Socket rooms (`user:<id>`, `project:<id>`) broadcast real-time events.

## 3.4 Real-Time Events
Client events:
- `join_user`, `leave_user`
- `join_project`, `leave_project`
- `project_typing`, `direct_typing`

Server events:
- `project_typing`, `direct_typing`
- `project_message:new`, `direct_message:new`
- `notification:new`

---

# Chapter 4: System Design
## 4.1 Architecture
BRINDA follows a multi-layer architecture:
- **Presentation Layer**: React UI with route-level access control
- **Application Layer**: Express controllers/routes handling business logic
- **Data Layer**: MongoDB collections via Mongoose schemas
- **Realtime Layer**: Socket.IO for bidirectional event flow

## 4.2 Module Design
- **Authentication Module**: Register/Login/Refresh/Logout/Me/Settings/Change Password
- **Collaboration Module**: Users, Projects, Tasks, Notifications, Messages, Files
- **Analytics Module**: Dashboard charts (project status, activity trends, deadlines)
- **Preferences Module**: Theme, accent color, notification/security/language settings
- **Plan Module**: Feature gating by active plan

## 4.3 Database Design (MongoDB Collections)
Primary collections:
- `users`
- `refreshtokens`
- `projects`
- `tasks`
- `messages`
- `notifications`
- `fileitems`

### Key Relationships
- One user owns/participates in multiple projects/tasks/messages
- A task belongs to one project and optional assignee
- A notification links sender, receiver, task, and project context
- Messages support project channels and direct chats

---

# Chapter 5: Technology Stack, Testing, and Security
## 5.1 Technology Stack
### Frontend
- React 19
- Vite 8
- Tailwind CSS 4
- Framer Motion
- Axios
- React Router
- Recharts
- Socket.IO Client

### Backend
- Node.js
- Express 5
- Mongoose
- bcryptjs
- jsonwebtoken
- Socket.IO

### Database
- MongoDB Atlas / local MongoDB

## 5.2 Testing and Debugging Approach
Current project-level validation includes:
- API health checks (`/api/health`)
- Manual endpoint verification (auth/collab modules)
- UI flow validation for login, routing, and module actions
- Real-time checks for messaging and notification events

## 5.3 Security Measures
- Password hashing with `bcryptjs`
- Access and refresh token strategy
- Protected route middleware (`requireAuth`)
- Role-based access checks for member management
- Token revocation on logout and user deletion paths

## 5.4 Current Limitations
- No full automated test suite configured yet
- File module stores metadata only (binary storage not configured)
- Some pages still include mock/demo content and can be production-hardened further

---

# Chapter 6: Implementation (Modules, APIs, and Data Models)
## 6.1 Backend API Summary
### Auth APIs
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/settings`
- `PUT /api/auth/settings`
- `PUT /api/auth/change-password`

### Collaboration APIs
- Users: `GET/POST /api/collab/users`, `DELETE /api/collab/users/:userId`
- Projects: `GET/POST /api/collab/projects`
- Tasks: `GET/POST /api/collab/tasks`, `PUT /api/collab/tasks/:taskId`
- Notifications: `GET /api/collab/notifications`, `PUT /read-all`, `PUT /:id/read`, `DELETE /api/collab/notifications`
- Messages: `GET/POST /api/collab/messages`
- Files: `GET/POST /api/collab/files`, `GET /api/collab/files/:fileId/download`, `DELETE /api/collab/files/:fileId`

## 6.2 Data Models (Major Fields)
- **User**: name, email, passwordHash, role, workspaceName, settings, isActive
- **Project**: name, description, status, ownerId
- **Task**: projectId, title, assigneeId, dueDate, completed
- **Message**: projectId, senderId, receiverId, body
- **Notification**: receiverId, senderId, projectId, taskId, type, title, message, read
- **FileItem**: projectId, uploaderId, fileName, path, mimeType, sizeBytes
- **RefreshToken**: userId, token, expiresAt

## 6.3 Frontend Implementation Highlights
- Protected routes using auth context and token hydration
- Axios interceptors for automatic token refresh on `401`
- Dashboard analytics with charts and task deadline alerts
- Project cards with computed progress from task completion
- Real-time chat integration with socket connection lifecycle
- Plan-based access control for premium features (e.g., files)

## 6.4 Seed and Demo Data
`backend/seed.js` provides sample users/projects/tasks/messages/files for quick testing and demo setup.

---

# Chapter 7: User Interface and Experience
## 7.1 UI Overview
The BRINDA UI emphasizes readability and productivity, with component-driven pages for:
- Landing and authentication
- Dashboard
- Team members
- Projects and project details
- Messages / chat
- Files
- Notifications
- Settings / profile

## 7.2 UX Principles Applied
- Clear information hierarchy for team operations
- Fast navigation through sidebar + route grouping
- Role and plan context reflected in feature access
- Visual consistency through theme variables and accent control
- Feedback mechanisms via toast notifications and loading states

## 7.3 Responsive and Interactive Elements
- Framer Motion transitions for smoother interactions
- Recharts for project/activity visualization
- Dynamic cards, filters, and status labels
- Real-time updates in messages and notifications

## 7.4 Suggested Screenshot Set for Final Print
1. Login/Register screen  
2. Dashboard charts and KPI cards  
3. Team member management page  
4. Projects listing and progress cards  
5. Chat/messages interface  
6. Notifications module  
7. Settings module  
8. Files module (plan-gated and active states)

---

# Chapter 8: Future Enhancements
Potential roadmap for BRINDA:
- Binary file storage integration (S3/Cloudinary) with signed URL downloads
- Full task CRUD UI with Kanban board and drag-drop
- Role-specific dashboards and approval workflows
- Enterprise-grade audit logs and activity trails
- AI-assisted summaries for projects and meeting notes
- Mobile app version (React Native / Flutter)
- Automated test suite (unit + integration + e2e)
- CI/CD pipeline with lint, test, and deployment gates

---

# Chapter 9: Conclusion
## 9.1 Summary
BRINDA successfully demonstrates a real-world collaboration system built with modern full-stack technologies. The platform integrates authentication, project/task workflows, communication, notifications, and settings management in a unified architecture.

## 9.2 Key Achievements
- Built modular backend APIs with secure auth flow
- Designed scalable MongoDB schema set for collaboration data
- Implemented real-time messaging and notification events
- Delivered a multi-page responsive frontend with route protection
- Added role-aware and plan-aware behavior for practical SaaS-style control

## 9.3 Final Remarks
The project validates practical software engineering principles including modular design, REST architecture, stateful frontend integration, and real-time communication. With incremental enhancements, BRINDA can evolve into a production-ready workspace platform for teams and organizations.

---

# REFERENCES
1. Node.js Documentation - https://nodejs.org/docs/latest/api/  
2. Express.js Documentation - https://expressjs.com/  
3. MongoDB Documentation - https://www.mongodb.com/docs/  
4. Mongoose Documentation - https://mongoosejs.com/docs/  
5. React Documentation - https://react.dev/  
6. Vite Documentation - https://vite.dev/guide/  
7. Socket.IO Documentation - https://socket.io/docs/v4/  
8. Tailwind CSS Documentation - https://tailwindcss.com/docs

---

# APPENDIX (OPTIONAL FOR FINAL SUBMISSION)
- Replace all placeholders: student names, PRN, guide, signatures, date/place.
- Add institution-required diagrams/screenshots from the running project.
- Export this report to `.docx`/PDF according to university formatting rules (font, spacing, margins, page numbering).
