# AI-Assisted Patient Appointment Helper

---

## Project Overview

`AI-Assisted-Patient-Appointment-Helper` is a Java Spring Boot backend that manages doctors and appointments for a patient scheduling system.

- Backend stack:
  - Spring Boot
  - Spring Data JPA
  - Embedded DB (default config, could be H2)
- Frontend:
  - React app completed (in development)
  - This repo currently covers only backend

---

## Architecture (Backend Only)

### Packages

- `com.example.demo.controller`
  - `DoctorController` (API endpoints)
- `com.example.demo.model`
  - `Doctor` (entity)
  - `Appointment` (entity)
- `com.example.demo.repository`
  - `DoctorRepository` (JPA CRUD + specialty queries)
  - `AppointmentRepository` (CRUD for appointments)
- `com.example.demo.service`
  - `DoctorService` (business logic for doctors)

### Main class

- `PatientAppointmentMain.java` (`@SpringBootApplication` entrypoint)

---

## Endpoints (from controllers present)

(Assuming typical structure; adjust if you add more)

- `GET /doctors`
- `GET /doctors/{id}`
- `GET /doctors/specialty/{specialty}`
- `POST /doctors`
- `GET /appointments` / `POST /appointments` etc. based on app design

---

## How to Run Backend

1. Build:
   - `./gradlew clean build`
2. Run:
   - `./gradlew bootRun`
3. Default port:
   - `http://localhost:8080`

---

## Data Flow

1. Client (eventually React) sends HTTP request
2. `Controller` receives request
3. `Service` handles logic + validation (`DoctorService` etc.)
4. `Repository` persists/fetches with JPA
5. Response sent back JSON

---

## Current Status

- [x] Backend: implemented & connected to MySQL database
- [x] Frontend (React): implemented & running on port 3000
- [x] Database: MySQL 8.0 (Docker container setup)
- [x] API integration: backend and frontend communicating
- [ ] Deploy/production readiness: pending final testing & deployment config

---

## Next steps

1. Add input validation for all endpoints
2. Add OpenAPI/Swagger docs
3. Add unit & integration tests
4. Add security (JWT, role-based access control)
5. Add error handling & logging
6. Deploy to production (cloud host, containerization)

---
## Database Setup (MySQL with Docker)

### Prerequisites
- Docker installed and running

### Start MySQL Container

```bash
docker run --name mysql-patient -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```

### Create Database & User

```bash
docker exec mysql-patient mysql -u root -proot -e "CREATE DATABASE patientdb; CREATE USER 'myuser'@'%' IDENTIFIED BY 'mypassword'; GRANT ALL PRIVILEGES ON patientdb.* TO 'myuser'@'%'; FLUSH PRIVILEGES;"
```

### Verify Connection

```bash
docker exec mysql-patient mysql -u myuser -pmypassword patientdb -e "SELECT 1"
```

---
## Frontend Setup (React)

A React frontend has been scaffolded under `frontend/` with the following utilities:
- `GET /api/doctors/all` (doctor list)
- `GET /api/doctors/specialty/{specialty}` (filter by specialty)
- `POST /api/doctors` (create new doctor)

### Run Backend
1. `.\gradlew.bat bootRun` (Windows PowerShell)
   - Or `./gradlew bootRun` (WSL/Linux/Mac)
2. Backend runs on `http://localhost:8080`
3. API endpoints available at `/api/doctors/...`

### Run Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Frontend dev server runs on `http://localhost:3000`
5. Frontend automatically proxies `/api` to `http://localhost:8080`

---

## Notes

- Backend uses MySQL 8.0 (Docker) for persistent data storage
- Spring Boot DevTools enabled for hot reload during development
- React frontend communicates with backend via REST API
- Keep expanding `service` and `controller` as more domain requirements appear
