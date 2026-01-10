# Mobius BugTracker

A comprehensive web application for managing software bugs and project workflows. Designed to facilitate communication between Project Managers (MPs) and Testers (TSTs).

## 🚀 Features

### User Roles & Permissions
- **Project Managers (MP)**:
  - Create and manage projects (Git repository integration).
  - Add team members and testers.
  - Allocate bugs to themselves for fixing.
  - Update bug status (Open -> In Progress -> Resolved -> Closed) and link commit hashes.
- **Testers (TST)**:
  - Join projects to perform testing.
  - Report new bugs with severity, priority, and description.
  - View bug status and history.
- **Admin**:
  - Global dashboard to view all users and projects.
  - Ability to delete projects or users for maintenance.

### Core Functionality
- **Authentication**: Secure Login and Registration using JWT (JSON Web Tokens).
- **Project Discovery**: Browse available projects and join as a tester.
- **Bug Management**: Full lifecycle management of bugs.
- **Responsive Design**: Modern UI built with React, ensuring compatibility across desktops and tablets.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Context API, CSS3 (Modern Variables & Grid).
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (via Sequelize ORM).
- **Infrastructure**: Docker & Docker Compose.

## 🏁 Getting Started

The easiest way to run the application is using Docker.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Application Setup (Docker)

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/plesaandrei23/Mobius.git
    cd Mobius
    ```

2.  **Start the Application**:
    Run the following command in the project root:
    ```bash
    docker-compose up --build
    ```

3.  **Access the App**:
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **Backend API**: [http://localhost:8080](http://localhost:8080)

### Local Development (Optional)

If you prefer to run without Docker:

**Backend**:
```bash
cd backend
npm install
npm start
# Runs on localhost:8080
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
# Runs on localhost:5173 (Note: Port is different from Docker mapping)
```

## 📂 Project Structure

```
Mobius/
├── backend/                # Node.js/Express API
│   ├── controllers/        # Route logic
│   ├── models/             # Sequelize database models
│   ├── routes/             # API endpoint definitions
│   └── src/server.js       # Entry point
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth state management
│   │   └── pages/          # Full page views
├── docker-compose.yml      # Container orchestration
└── README.md               # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new account.
- `POST /api/auth/login` - Authenticate and receive JWT.

### Projects
- `GET /api/projects` - List all projects.
- `POST /api/projects` - Create a new project.
- `GET /api/projects/:id` - Get project details.

### Bugs
- `GET /api/projects/:id/bugs` - List bugs for a project.
- `POST /api/projects/:id/bugs` - Report a bug.
- `PATCH /api/bugs/:bugId` - Update bug status/assignee.

## 🔮 Future Improvements
- **Comments System**: Allow discussion threads on bugs.
- **Notifications**: Email alerts for bug assignments.
- **Analytics Dashboard**: Graphical view of bug resolution rates.
