<<<<<<< HEAD
# Quick Staff

Quick Staff is a comprehensive platform connecting clients with service professionals. It features a robust Client App, a Worker App, and an Admin Dashboard for creating, managing, and tracking service bookings.

## 🚀 Features

### **Client Module**
*   **Browse Services**: View a wide range of services like plumbing, cleaning, electrical, etc.
*   **Book Workers**: Select workers based on profile, ratings, and price.
*   **Manage Bookings**: View upcoming, active, and past bookings.
*   **Track Status**: Real-time status updates for bookings (Pending, Accepted, In Progress, Completed).
*   **Reviews**: Rate and review workers after job completion.
*   **Profile Management**: Update personal details and saved addresses.

### **Worker Module**
*   **Job Management**: Accept or reject new booking requests.
*   **Schedule**: View upcoming jobs in a calendar or list view.
*   **Job Tracking**: Update job status (Start, Complete) and view job history.
*   **Earnings**: Track completed jobs and performance metrics.
*   **Profile**: Manage skills, availability, and service details.

### **Admin Module**
*   **Dashboard**: Overview of platform activity, total users, and booking stats.
*   **Analytics**: Visual insights into service popularity, traffic, and user growth.
*   **User Management**: View and manage client and worker accounts.
*   **Service Management**: Add or update available service categories.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), Tailwind CSS
*   **Backend**: Node.js, Express.js
*   **Database**: PostgreSQL
*   **Authentication**: JWT (JSON Web Tokens)
*   **Tools**: `pg` (node-postgres), `cors`, `dotenv`

---

## ⚙️ Setup Instructions

### Prerequisites
*   Node.js (v16 or higher)
*   PostgreSQL installed and running locally

### 1. Database Setup
1.  Create a PostgreSQL database (e.g., `quickstaff_db`).
2.  Navigate to the `backend/database` folder.
3.  The schema and seed data are available in `init.sql`. You can initialize the database using the provided helper script:
    ```bash
    cd backend
    node database/reset-db.js
    ```
    *This will drop existing tables and re-seed the database with sample users and services.*

### 2. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with your database credentials:
    ```env
    PORT=5000
    DATABASE_URL=postgresql://postgres:your_password@localhost:5432/quickstaff_db
    JWT_SECRET=your_jwt_secret_key_here
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```
    *Server runs on http://localhost:5000*

### 3. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *App runs on http://localhost:5173*

---

## 🔑 Default Login Credentials

Use these accounts to test the application immediately after seeding:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@quickstaff.com` | `123456` |
| **Worker** | `john@worker.com` | `123456` |
| **Worker** | `sarah@worker.com` | `123456` |
| **Client** | `alice@client.com` | `123456` |

---

## 📂 Project Structure

```
Quick_Staff_Project/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── config/        # DB configuration
│   │   └── server.js      # Entry point
│   ├── database/
│   │   ├── init.sql       # Schema & Seed data
│   │   └── reset-db.js    # Reset script
│   └── .env               # Environment variables
│
└── frontend/
    ├── src/
    │   ├── apps/
    │   │   ├── client/    # Client-facing pages
    │   │   ├── admin/     # Admin dashboard
    │   │   └── worker/    # Worker dashboard
    │   ├── components/    # Reusable UI components
    │   └── api/           # API integration
    └── index.html
```

---

## 📝 API Overview

*   **Auth**: `/api/auth/login`, `/api/auth/register`
*   **Workers**: `/api/workers`, `/api/workers/:id`
*   **Bookings**: `/api/bookings`, `/api/bookings/client`, `/api/bookings/worker`
*   **Services**: `/api/services`
*   **Admin**: `/api/admin/analytics`, `/api/admin/users`

---
=======
# FrontendAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
>>>>>>> frontend/master

