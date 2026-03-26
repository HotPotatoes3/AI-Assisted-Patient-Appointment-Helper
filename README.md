# AI-Assisted Patient Appointment Helper

---

## Project Overview

`AI-Assisted-Patient-Appointment-Helper` is a Java Spring Boot backend that manages doctors and appointments for a patient scheduling system.

- Backend stack:
  - Spring Boot
  - Spring Data JPA
  - Embedded DB (default config, could be H2)
- Frontend:
  - React app not yet completed (in development)
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

- [x] Backend: implemented
- [ ] Frontend (React): in development
- [ ] Deploy/production readiness: pending config and frontend completion

---

## Next steps

1. Finish React frontend and connect to backend API
2. Add input validation for all endpoints
3. Add OpenAPI/Swagger docs
4. Add tests (unit, integration)
5. Add security (JWT, role checks)
6. Add persistence config (PostgreSQL or equivalent)

---

## Notes

- For now, this repository is backend-first.
- React UI is promised but not yet shipped.
- Keep expanding `service` and `controller` as more domain requirements appear.
