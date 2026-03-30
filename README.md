# AI-Assisted Patient Appointment Helper

A full-stack web application for managing doctor and patient appointments with an AI-powered chatbot assistant.

---

## 🎯 Project Overview

**AI-Assisted Patient Appointment Helper** is a modern patient scheduling system that combines:
- **Backend**: Spring Boot 3.4.0 REST API with flexible database support
- **Frontend**: React 18.3.1 app with TypeScript
- **AI Integration**: OpenRouter API-powered chatbot with AI reasoning capabilities
- **Databases**: H2 embedded (default) or MySQL 8.0 (optional Docker)

**Key Features:**
- 👨‍⚕️ Doctor management (list, create, filter by specialty)
- 🧑‍⚕️ Patient management (register, view, manage appointments)
- 📅 Appointment booking (book appointments with patients, doctors, time slots, and visit reasons)
- 🤖 AI Assistant chatbot with real-time responses and reasoning explanations
- ⚡ Dual database configuration (zero-setup H2 or persistent MySQL)
- 🔄 Real-time API integration between frontend and backend

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Quick Start](#quick-start)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [AI Chatbot Setup](#ai-chatbot-setup)
7. [API Endpoints](#api-endpoints)
8. [Technology Stack](#technology-stack)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

---

## 📦 Prerequisites

### Required
- **Java 17+** (for backend)
- **Node.js 16+** and **npm** (for frontend)
- **Git**

### Optional (for MySQL database)
- **Docker** and **Docker Compose**

### Required for AI Chatbot
- **OpenRouter API key** (get free one at https://openrouter.ai)

---

## 📂 Project Structure

```
AI-Assisted-Patient-Appointment-Helper/
├── src/main/java/com/example/demo/          # Backend (Spring Boot)
│   ├── controller/
│   │   ├── DoctorController.java
│   │   ├── PatientController.java
│   │   └── AppointmentController.java
│   ├── model/
│   │   ├── Appointment.java
│   │   ├── Doctor.java
│   │   └── Patient.java
│   ├── repository/
│   │   ├── AppointmentRepository.java
│   │   ├── DoctorRepository.java
│   │   └── PatientRepository.java
│   ├── service/
│   │   ├── DoctorService.java
│   │   ├── PatientService.java
│   │   └── AppointmentService.java
│   └── PatientAppointmentMain.java
├── frontend/                                  # Frontend (React)
│   ├── src/
│   │   ├── AIAssistant.tsx                  # AI chatbot component
│   │   ├── AIAssistant.css
│   │   ├── App.jsx                          # Main app with navigation
│   │   ├── App.css
│   │   ├── DoctorForm.jsx                   # Doctor registration
│   │   ├── PatientForm.jsx                  # Patient registration
│   │   ├── AppointmentForm.jsx              # Appointment booking
│   │   ├── main.jsx
│   │   ├── vite-env.d.ts                    # TypeScript config
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── src/main/resources/
│   ├── application.properties                # Default config
│   ├── application-h2.properties             # H2 database config
│   └── application-mysql.properties          # MySQL config
├── build.gradle                              # Gradle build config
├── CHATBOT_DEBUG.md                          # Debugging guide
└── README.md                                 # This file
```

---

## 🚀 Quick Start

### Option 1: Full Stack (Fastest - H2 Database)

**Terminal 1: Backend**
```bash
./gradlew bootRun
# Backend runs on http://localhost:8080
```

**Terminal 2: Frontend**
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3002 (or next available port)
```

**In Browser:**
- Open `http://localhost:3002`
- Click **Doctors** or **Patients** tab to manage data
- Click 🤖 button to open AI Assistant (requires API key setup)

### Option 2: Backend Only (API Testing)

```bash
./gradlew bootRun
# API available at http://localhost:8080/api/...
```

Current port detection: The frontend will use the next available port (3000, 3001, 3002, etc.) if lower ports are occupied.

---

## 🔧 Backend Setup

### Database Configuration

The backend defaults to **H2 embedded database** (zero setup required). To use **MySQL**, follow the Docker setup below.

### Option 1: H2 Embedded Database (DEFAULT - No Setup Required)

No configuration needed! H2 automatically starts with the application.

```bash
./gradlew bootRun
```

**Features:**
- ✅ No Docker/external DB required
- ✅ Perfect for development and testing
- ✅ In-memory storage (data resets on app restart)

**H2 Console (Optional):**
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:patientdb`
- Username: `sa`
- Password: (leave empty)

### Option 2: MySQL Database (Requires Docker)

For persistent data storage, use MySQL in Docker.

**Step 1: Start MySQL Container**
```bash
docker run --name mysql-patient \
  -e MYSQL_ROOT_PASSWORD=root \
  -p 3306:3306 \
  -d mysql:8.0
```

**Step 2: Create Database & User**
```bash
docker exec mysql-patient mysql -u root -proot -e \
  "CREATE DATABASE patientdb; \
   CREATE USER 'myuser'@'%' IDENTIFIED BY 'mypassword'; \
   GRANT ALL PRIVILEGES ON patientdb.* TO 'myuser'@'%'; \
   FLUSH PRIVILEGES;"
```

**Step 3: Run Backend with MySQL Profile**

**Windows (PowerShell):**
```powershell
$env:SPRING_PROFILES_ACTIVE = "mysql"
./gradlew bootRun
```

**Linux/Mac:**
```bash
export SPRING_PROFILES_ACTIVE=mysql
./gradlew bootRun
```

**Or via command line (all platforms):**
```bash
./gradlew bootRun --args='--spring.profiles.active=mysql'
```

**Verify Connection:**
```bash
docker exec mysql-patient mysql -u myuser -pmypassword patientdb -e "SHOW TABLES;"
```

---

## 🎨 Frontend Setup

### Installation & Development

```bash
cd frontend
npm install          # Install dependencies (one-time)
npm run dev          # Start development server
```

**Development Server:**
- Runs on `http://localhost:3002` (or next available port if lower ports occupied)
- Auto-reloads on file changes
- Proxies `/api` to `http://localhost:8080/api`

### Frontend Features

**Tab Navigation:**
- **Doctors Tab**: View all doctors, filter by specialty, add new doctors
- **Patients Tab**: View all patients, register new patients, manage patient info
- **Appointments Tab**: Book new appointments, view all booked appointments

**Components:**
- `DoctorForm.jsx`: Create/register doctors
- `PatientForm.jsx`: Register new patients with validation (name, email, phone)
- `AppointmentForm.jsx`: Book appointments with patient/doctor selection and time slot entry
- `AIAssistant.tsx`: AI chatbot with side panel UI
- `App.jsx`: Main router and state management

---

## 🤖 AI Chatbot Setup

### Overview

The AI Assistant provides an intelligent chatbot using the **OpenRouter API** with the **nvidia/nemotron-3-super-120b-a12b** model. It includes reasoning explanations for transparency.

### Setup Steps

**Step 1: Get OpenRouter API Key**

1. Visit https://openrouter.ai
2. Sign up for a free account
3. Go to **API Keys** section
4. Copy your API key

**Step 2: Configure Environment Variables**

In the `frontend/` directory, create `.env.local`:

```bash
VITE_OPENROUTER_API_KEY=your_api_key_here
VITE_API_BASE=/api
```

**⚠️ Important:** `.env.local` is in `.gitignore` for security. Never commit real API keys.

**Template:** See `frontend/.env.example` for the required structure.

**Step 3: Start Frontend**

```bash
cd frontend
npm run dev
```

**Step 4: Test Chatbot**

1. Open `http://localhost:3002`
2. Click the 🤖 button (bottom-right)
3. Type a message and press Enter or click Send
4. Chatbot responds with AI assistance
5. Click "View reasoning" to see how the AI arrived at its answer

### Chatbot Features

- **Real-time Responses**: Waits for AI reasoning to complete
- **Reasoning Display**: Toggle "View reasoning" to see AI thought process
- **Conversation History**: Maintains context across multiple messages
- **Error Handling**: Displays connection errors clearly
- **Loading Indicator**: Shows when waiting for API response

### Debugging Chatbot Issues

If the chatbot isn't working, see **[CHATBOT_DEBUG.md](CHATBOT_DEBUG.md)** for:
- Common error messages and solutions
- Browser console debugging tips
- API key configuration verification
- Network request troubleshooting

---

## 🔌 API Endpoints

### Doctor Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/doctors/all` | Get all doctors |
| `GET` | `/api/doctors/{id}` | Get doctor by ID |
| `GET` | `/api/doctors/specialty/{specialty}` | Filter doctors by specialty |
| `POST` | `/api/doctors` | Create new doctor |
| `PUT` | `/api/doctors/{id}` | Update doctor |
| `DELETE` | `/api/doctors/{id}` | Delete doctor |

**Example Request:**
```bash
curl http://localhost:8080/api/doctors/all
```

### Patient Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/patients/all` | Get all patients |
| `GET` | `/api/patients/{id}` | Get patient by ID |
| `GET` | `/api/patients/email/{email}` | Get patient by email |
| `POST` | `/api/patients` | Register new patient |
| `PUT` | `/api/patients/{id}` | Update patient |
| `DELETE` | `/api/patients/{id}` | Delete patient |
### Appointment Endpoints

| Method | Endpoint | Purpose |
|--------|----------|----------|
| `GET` | `/api/appointments/all` | Get all appointments |
| `GET` | `/api/appointments/{id}` | Get appointment by ID |
| `POST` | `/api/appointments` | Book new appointment |
| `PUT` | `/api/appointments/{id}` | Update appointment |
| `DELETE` | `/api/appointments/{id}` | Cancel appointment |
**Example Patient Registration:**
```json
POST /api/patients
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1-555-0123"
}
```

**Example Appointment Booking:**
```json
POST /api/appointments
Content-Type: application/json

{
  "patientId": 1,
  "patientName": "John Doe",
  "doctorId": 1,
  "doctor": {
    "id": 1,
    "name": "Dr. Smith",
    "specialty": "Cardiology"
  },
  "timeSlot": "9:00 - 9:15",
  "reason": "Annual checkup and blood pressure screening"
}
```

### Response Format

All endpoints return JSON:

**Success Response (2xx):**
```json
{
  "id": 1,
  "name": "Dr. Smith",
  "specialty": "Cardiology",
  "email": "smith@hospital.com",
  "phoneNumber": "+1-555-0100"
}
```

**Error Response (4xx/5xx):**
```json
{
  "error": "Doctor not found",
  "status": 404
}
```

---

## 🛠 Technology Stack

### Backend
- **Spring Boot 3.4.0** - Web framework
- **Spring Data JPA** - ORM layer
- **Hibernate** - Database mapping
- **H2 1.4.200** - Embedded database (default)
- **MySQL 8.0** - Optional persistent database
- **Gradle 8.x** - Build tool
- **Java 17** - Language version

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.x** - Type safety
- **Vite 5.4.1** - Dev server and bundler
- **CSS3** - Styling (custom, no frameworks)
- **Fetch API** - HTTP client

### AI Integration
- **OpenRouter API** - AI model provider
- **nvidia/nemotron-3-super-120b-a12b** - Model for responses with reasoning

### Build & Development
- **Gradle** (backend)
- **npm/Node.js** (frontend)
- **Git** (version control)
- **Docker** (optional MySQL)

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot start application - port 8080 in use"**
```bash
# Kill process on port 8080 (Windows PowerShell)
$proc = Get-Process | Where-Object { $_.ProcessName -match "java" }
Stop-Process -Process $proc -Force

# Or use a different port
./gradlew bootRun --args='--server.port=8081'
```

**"H2 console not accessible"**
- Ensure backend is running: `http://localhost:8080`
- Check H2 is enabled in `application-h2.properties`
- Try clearing browser cache

**"MySQL connection refused"**
- Verify Docker container is running: `docker ps`
- Check MySQL is accessible: `docker exec mysql-patient mysql -u root -proot -e "SELECT 1"`
- Confirm `application-mysql.properties` has correct credentials

### Frontend Issues

**"Port 3000/3001 already in use"**
- Frontend auto-detects next available port (3002, 3003, etc.)
- Check terminal output for actual port: "Local: http://localhost:PORT/"

**"Blank page or Cannot GET /"**
- Ensure backend is running on `http://localhost:8080`
- Check browser console for errors (F12 → Console tab)
- Try hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

**"API calls return 404"**
- Verify backend is running and API endpoints are accessible
- Check network tab in browser DevTools (F12 → Network)
- Ensure correct endpoint paths and spelling

### Chatbot Issues

**"Chatbot window shows blank or white page"**
- Check browser console for errors (F12 → Console)
- Verify `.env.local` exists with valid `VITE_OPENROUTER_API_KEY`
- Restart frontend dev server: `Ctrl+C` then `npm run dev`
- See **[CHATBOT_DEBUG.md](CHATBOT_DEBUG.md)** for detailed debugging

**"'Failed to load resource: 404' for API key"**
- `.env.local` file missing or path incorrect
- Restart dev server after creating `.env.local`
- Verify key is set: Check Network tab in DevTools

**"ChatBot says 'Error: API key not configured'"**
- `VITE_OPENROUTER_API_KEY` not set or invalid
- Verify `.env.local` exists in `frontend/` directory
- Ensure key starts with `sk-or-v1-`
- Restart frontend: `Ctrl+C` then `npm run dev`

**For more chatbot issues, see [CHATBOT_DEBUG.md](CHATBOT_DEBUG.md)**

---

## 📚 Project Status

### ✅ Completed
- [x] Doctor management (CRUD operations)
- [x] Patient management (registration and CRUD)
- [x] Appointment booking (full workflow with patient/doctor selection and time slots)
- [x] React frontend with tab navigation (Doctors, Patients, Appointments)
- [x] Form validation and error handling
- [x] Dual database configuration (H2 + MySQL)
- [x] AI Assistant chatbot with OpenRouter integration
- [x] TypeScript support in frontend
- [x] Responsive UI design
- [x] Browser-based debugging guide

### 🚧 In Progress
- [ ] Email notifications
- [ ] User authentication and authorization
- [ ] Role-based access control (doctor vs patient)

### 📋 Future Enhancements
- [ ] OpenAPI/Swagger documentation
- [ ] Unit and integration tests
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] Caching layer (Redis)
- [ ] Cloud deployment (AWS/Azure)
- [ ] Mobile app
- [ ] Calendar UI for appointments
- [ ] Payment integration

---

## 📖 Additional Resources

- **[CHATBOT_DEBUG.md](CHATBOT_DEBUG.md)** - Comprehensive AI Assistant debugging guide
- **[Spring Boot Docs](https://spring.io/projects/spring-boot)** - Backend framework
- **[React Docs](https://react.dev)** - Frontend framework
- **[OpenRouter Docs](https://openrouter.ai/docs)** - AI API documentation
- **[Vite Docs](https://vitejs.dev)** - Frontend build tool

---

## 📝 Notes

### Database Flexibility
- **H2** (default): Perfect for development. No setup needed. Data resets on app restart.
- **MySQL** (optional): For production or persistent data. Requires Docker setup.

### Architecture Pattern
- **Service Layer**: All business logic in `*Service` classes
- **Repository Layer**: Data access via Spring Data JPA `*Repository` interfaces
- **Controller Layer**: REST endpoints in `*Controller` classes
- **Model Layer**: JPA entities with `@Entity` annotations

### Frontend Architecture
- **Component-Based**: Reusable React components
- **State Management**: React hooks (useState, useEffect, useRef)
- **Type Safety**: TypeScript interfaces and type definitions
- **Environment Configuration**: Vite environment variables in `.env.local`

### API Communication
- **CORS**: Enabled on backend for frontend requests
- **Base URL**: Frontend proxies `/api` to `http://localhost:8080/api`
- **Error Handling**: Backend returns appropriate HTTP status codes and error messages
- **Content Type**: All requests/responses use `application/json`

---

## 👨‍💻 Development Workflow

1. **Backend Changes**: Run `./gradlew bootRun`, backend auto-compiles on file save
2. **Frontend Changes**: Run `npm run dev`, frontend hot-reloads on file save
3. **Database Changes**: Restart backend (Ctrl+C then `./gradlew bootRun`)
4. **Environment Variables**: Restart frontend after updating `.env.local`
5. **Debugging**: Use browser DevTools (F12) for frontend, backend console for logs

---

## 📄 License

This project is open source and available under the MIT License.

---

**Happy coding! 🎉**
- Spring Boot profiles (`application-h2.properties` and `application-mysql.properties`) handle database switching
- Spring Boot DevTools enabled for hot reload during development
- React frontend communicates with backend via REST API
- Keep expanding `service` and `controller` as more domain requirements appear
