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

The backend supports two database configurations:

### Option 1: Run with Embedded H2 Database (Default - No Setup Required)

H2 is an in-memory database that requires no external setup. Perfect for development and testing.

1. Build:
   - `./gradlew clean build`
2. Run:
   - `./gradlew bootRun`
3. Access backend:
   - `http://localhost:8080`
4. View H2 console (optional):
   - `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:patientdb`
   - Username: `sa`
   - Password: (leave blank)

**Note:** Data is reset when the application restarts.

### Option 2: Run with MySQL Database (Requires Docker)

For persistent data storage using MySQL in a Docker container.

1. Start MySQL:
   ```bash
   docker run --name mysql-patient -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
   ```

2. Create database and user:
   ```bash
   docker exec mysql-patient mysql -u root -proot -e "CREATE DATABASE patientdb; CREATE USER 'myuser'@'%' IDENTIFIED BY 'mypassword'; GRANT ALL PRIVILEGES ON patientdb.* TO 'myuser'@'%'; FLUSH PRIVILEGES;"
   ```

3. Build and run with MySQL profile:
   ```bash
   ./gradlew clean build
   ./gradlew bootRun --args='--spring.profiles.active=mysql'
   ```

4. Access backend:
   - `http://localhost:8080`

**Switching Profiles Programmatically:**

Set the environment variable before running:
```bash
# On PowerShell:
$env:SPRING_PROFILES_ACTIVE = "mysql"
./gradlew bootRun

# On Linux/Mac:
export SPRING_PROFILES_ACTIVE=mysql
./gradlew bootRun
```

---

## Data Flow

1. Client (eventually React) sends HTTP request
2. `Controller` receives request
3. `Service` handles logic + validation (`DoctorService` etc.)
4. `Repository` persists/fetches with JPA
5. Response sent back JSON

---

## Current Status

- [x] Backend: implemented with flexible database support (H2 or MySQL)
- [x] Frontend (React): implemented & running on port 3000
- [x] Database: H2 embedded (default) or MySQL 8.0 (optional Docker container)
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
## Database Setup (MySQL with Docker - Optional)

The application uses **H2 embedded database by default** and requires no setup. If you prefer persistent data storage with MySQL, follow the steps below.

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

### Run Backend with MySQL

```bash
./gradlew bootRun --args='--spring.profiles.active=mysql'
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

- **Database Flexibility**: Backend supports both H2 (embedded, default) and MySQL (Docker, optional)
  - H2: No setup required, perfect for development/testing. Data resets on restart.
  - MySQL: Requires Docker. Use for persistent data in production.
- Spring Boot profiles (`application-h2.properties` and `application-mysql.properties`) handle database switching
- Spring Boot DevTools enabled for hot reload during development
- React frontend communicates with backend via REST API
- Keep expanding `service` and `controller` as more domain requirements appear
