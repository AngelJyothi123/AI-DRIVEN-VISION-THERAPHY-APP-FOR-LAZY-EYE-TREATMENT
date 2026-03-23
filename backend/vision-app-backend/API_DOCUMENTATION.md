# Vision Therapy App - API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### Register Doctor
```http
POST /auth/register/doctor
Content-Type: application/json

{
    "name": "Dr. John Smith",
    "email": "john.smith@hospital.com",
    "phone": "1234567890",
    "password": "password123",
    "qualification": "MD - Ophthalmologist",
    "hospital": "City General Hospital"
}
```

**Response:**
```json
{
    "id": 1,
    "name": "Dr. John Smith",
    "email": "john.smith@hospital.com",
    "phone": "1234567890",
    "qualification": "MD - Ophthalmologist",
    "hospital": "City General Hospital",
    "createdAt": "2024-01-15T10:30:00"
}
```

### Register Patient
```http
POST /auth/register/patient
Content-Type: application/json

{
    "name": "Alice Brown",
    "email": "alice.brown@email.com",
    "phone": "5551234567",
    "age": 25,
    "password": "password123",
    "doctorId": 1
}
```

**Response:**
```json
{
    "id": 1,
    "name": "Alice Brown",
    "email": "alice.brown@email.com",
    "phone": "5551234567",
    "age": 25,
    "doctorId": 1,
    "createdAt": "2024-01-15T10:35:00"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "john.smith@hospital.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "DOCTOR"
}
```

## Doctor Endpoints (Protected - DOCTOR role required)

### Get Doctor Profile
```http
GET /doctor/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
    "id": 1,
    "name": "Dr. John Smith",
    "email": "john.smith@hospital.com",
    "phone": "1234567890",
    "qualification": "MD - Ophthalmologist",
    "hospital": "City General Hospital",
    "createdAt": "2024-01-15T10:30:00"
}
```

### Get Doctor's Patients
```http
GET /doctor/patients
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "id": 1,
        "name": "Alice Brown",
        "email": "alice.brown@email.com",
        "phone": "5551234567",
        "age": 25,
        "doctorId": 1,
        "createdAt": "2024-01-15T10:35:00"
    }
]
```

### Create Recommendation
```http
POST /doctor/recommend
Authorization: Bearer <token>
Content-Type: application/json

{
    "patientId": 1,
    "exerciseId": 1,
    "duration": 300
}
```

**Response:**
```json
{
    "id": 1,
    "doctorId": 1,
    "patientId": 1,
    "exerciseId": 1,
    "duration": 300,
    "createdAt": "2024-01-15T11:00:00",
    "updatedAt": "2024-01-15T11:00:00"
}
```

### Get Patient Progress
```http
GET /doctor/patient/1/progress
Authorization: Bearer <token>
```

**Response:**
```json
{
    "patientId": 1,
    "patientName": "Alice Brown",
    "averageAccuracy": 85.5,
    "averageImprovementScore": 78.2,
    "totalSessions": 5,
    "sessions": [
        {
            "sessionId": 1,
            "exerciseName": "Eye Tracking Exercise",
            "startTime": "2024-01-15T10:00:00",
            "endTime": "2024-01-15T10:05:00",
            "accuracy": 85.5,
            "focusDuration": 240,
            "movementScore": 78.2,
            "improvementScore": 82.5
        }
    ]
}
```

## Patient Endpoints (Protected - PATIENT role required)

### Get Patient Profile
```http
GET /patient/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
    "id": 1,
    "name": "Alice Brown",
    "email": "alice.brown@email.com",
    "phone": "5551234567",
    "age": 25,
    "doctorId": 1,
    "createdAt": "2024-01-15T10:35:00"
}
```

### Get All Exercises
```http
GET /patient/exercises
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "id": 1,
        "name": "Eye Tracking Exercise",
        "type": "camera",
        "duration": 300,
        "description": "Follow moving objects with your eyes to improve tracking ability",
        "createdAt": "2024-01-15T09:00:00",
        "updatedAt": "2024-01-15T09:00:00"
    }
]
```

### Start Exercise Session
```http
POST /patient/start-session
Authorization: Bearer <token>
Content-Type: application/json

{
    "exerciseId": 1
}
```

**Response:**
```json
{
    "sessionId": 1,
    "exerciseId": 1,
    "startTime": "2024-01-15T10:00:00"
}
```

### End Exercise Session
```http
POST /patient/end-session
Authorization: Bearer <token>
Content-Type: application/json

{
    "sessionId": 1,
    "accuracy": 85.5,
    "focusDuration": 240,
    "movementScore": 78.2
}
```

**Response:**
```json
{
    "id": 1,
    "sessionId": 1,
    "accuracy": 85.5,
    "focusDuration": 240,
    "movementScore": 78.2,
    "improvementScore": 82.5,
    "createdAt": "2024-01-15T10:05:00",
    "updatedAt": "2024-01-15T10:05:00"
}
```

### Get Exercise History
```http
GET /patient/history
Authorization: Bearer <token>
```

**Response:**
```json
{
    "patientId": 1,
    "history": [
        {
            "sessionId": 1,
            "exerciseName": "Eye Tracking Exercise",
            "exerciseType": "camera",
            "startTime": "2024-01-15T10:00:00",
            "endTime": "2024-01-15T10:05:00",
            "accuracy": 85.5,
            "focusDuration": 240,
            "movementScore": 78.2,
            "improvementScore": 82.5
        }
    ]
}
```

### Get Patient Recommendations
```http
GET /patient/recommendations
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "id": 1,
        "doctorId": 1,
        "patientId": 1,
        "exerciseId": 1,
        "duration": 300,
        "createdAt": "2024-01-15T11:00:00",
        "updatedAt": "2024-01-15T11:00:00"
    }
]
```

## Exercise Endpoints (Protected - DOCTOR/ADMIN role required)

### Create Exercise
```http
POST /exercises
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "New Exercise",
    "type": "camera",
    "duration": 300,
    "description": "Description of the new exercise"
}
```

**Response:**
```json
{
    "id": 6,
    "name": "New Exercise",
    "type": "camera",
    "duration": 300,
    "description": "Description of the new exercise",
    "createdAt": "2024-01-15T12:00:00",
    "updatedAt": "2024-01-15T12:00:00"
}
```

### Get All Exercises
```http
GET /exercises
Authorization: Bearer <token>
```

### Get Exercise by ID
```http
GET /exercises/1
Authorization: Bearer <token>
```

### Update Exercise
```http
PUT /exercises/1
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Exercise Name",
    "type": "non-camera",
    "duration": 240,
    "description": "Updated description"
}
```

### Delete Exercise
```http
DELETE /exercises/1
Authorization: Bearer <token>
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

### 400 Bad Request
```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed for object='exerciseRequest'. Error count: 1",
    "path": "/api/exercises"
}
```

### 401 Unauthorized
```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 401,
    "error": "Unauthorized",
    "message": "Full authentication is required to access this resource",
    "path": "/api/doctor/profile"
}
```

### 403 Forbidden
```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 403,
    "error": "Forbidden",
    "message": "Access is denied",
    "path": "/api/doctor/patients"
}
```

### 404 Not Found
```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 404,
    "error": "Not Found",
    "message": "Exercise not found",
    "path": "/api/exercises/999"
}
```

### 500 Internal Server Error
```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 500,
    "error": "Internal Server Error",
    "message": "An unexpected error occurred",
    "path": "/api/patient/start-session"
}
```

## ML Service Integration

The Spring Boot backend integrates with the Python ML service for improvement score prediction.

### ML Service Endpoints

#### POST /predict (ML Service)
```http
POST http://localhost:5000/predict
Content-Type: application/json

{
    "accuracy": 85.5,
    "focus_duration": 240,
    "movement_score": 78.2
}
```

**Response:**
```json
{
    "improvement_score": 82.5,
    "input_data": {
        "accuracy": 85.5,
        "focus_duration": 240,
        "movement_score": 78.2
    },
    "model_type": "trained"
}
```

#### GET /health (ML Service)
```http
GET http://localhost:5000/health
```

**Response:**
```json
{
    "status": "healthy",
    "model_loaded": true,
    "scaler_loaded": true
}
```

## Testing with Postman

1. **Import Collection**: Use the provided Postman collection JSON file
2. **Set Environment Variables**: 
   - `baseUrl`: `http://localhost:8080/api`
   - `mlServiceUrl`: `http://localhost:5000`
3. **Authentication Flow**:
   - First register a doctor or patient
   - Use login endpoint to get JWT token
   - Set `authToken` environment variable
   - All subsequent requests will use this token

## Sample Data

The application comes with sample data pre-loaded:
- 2 Doctors
- 3 Patients
- 5 Exercises
- Sample recommendations and appointments

Default passwords for all sample users: `password123`
