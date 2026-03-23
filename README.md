# Vision Therapy App - Complete Backend Solution

A comprehensive AI-driven Vision Therapy App backend built with Spring Boot 3, featuring JWT authentication, role-based access control, and ML integration for exercise improvement scoring.

## 🏗️ Architecture Overview

### Technology Stack
- **Backend**: Java 17, Spring Boot 3, Spring Security, JWT
- **Database**: MySQL with JPA/Hibernate
- **ML Service**: Python Flask with scikit-learn
- **Build Tool**: Maven
- **Security**: BCrypt password encoding, JWT tokens
- **API Documentation**: RESTful APIs with comprehensive error handling

### Project Structure
```
vision-therapy-app/
├── backend/
│   └── vision-app-backend/
│       ├── src/main/java/com/vision/vision_app_backend/
│       │   ├── config/          # Security, JWT, Exception handling
│       │   ├── controller/      # REST API controllers
│       │   ├── dto/            # Data Transfer Objects
│       │   ├── entity/         # JPA entities
│       │   ├── repository/     # JPA repositories
│       │   └── service/        # Business logic layer
│       └── src/main/resources/
│           ├── application.yml  # Configuration
│           └── schema.sql      # Database schema with sample data
├── ai-service/
│   ├── src/api/
│   │   └── ml_service.py       # Flask ML service
│   ├── requirements.txt        # Python dependencies
│   └── README.md              # ML service documentation
└── frontend/                   # React frontend (not implemented)
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Python 3.8+

### Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE vision_app_db;
```

2. The application will automatically create tables using the provided schema

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend/vision-app-backend
```

2. **Build the project**:
```bash
mvn clean install
```

3. **Run the application**:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

### ML Service Setup

1. **Navigate to ai-service directory**:
```bash
cd ai-service
```

2. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Run the ML service**:
```bash
python src/api/ml_service.py
```

The ML service will start on `http://localhost:5000`

## 🔐 Authentication & Authorization

### User Roles
- **DOCTOR**: Can manage patients, create recommendations, view progress
- **PATIENT**: Can view exercises, start sessions, track history

### Authentication Flow
1. Register as Doctor or Patient
2. Login to receive JWT token
3. Include token in Authorization header for protected endpoints
4. Token includes role for authorization

### Sample Registration/Login

**Register Doctor:**
```bash
curl -X POST http://localhost:8080/api/auth/register/doctor \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "email": "john.smith@hospital.com",
    "phone": "1234567890",
    "password": "password123",
    "qualification": "MD - Ophthalmologist",
    "hospital": "City General Hospital"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.smith@hospital.com",
    "password": "password123"
  }'
```

## 📊 Database Schema

### Core Entities
- **Doctor**: Medical professionals managing patient therapy
- **Patient**: Users undergoing vision therapy
- **Exercise**: Available therapy exercises (camera/non-camera)
- **ExerciseSession**: Patient exercise sessions
- **ExerciseResult**: Session results with ML-predicted improvement scores
- **Recommendation**: Doctor-prescribed exercise plans
- **Appointment**: Patient-doctor appointments

### Sample Data
The application comes pre-loaded with sample data:
- 2 Doctors (password: `password123`)
- 3 Patients (password: `password123`)
- 5 Exercises
- Sample recommendations and appointments

## 🤖 ML Integration

### ML Service Features
- **Prediction**: Calculates improvement scores based on exercise metrics
- **Fallback Logic**: Rule-based prediction when trained model unavailable
- **Health Checks**: Service health monitoring
- **Error Handling**: Comprehensive error management

### Integration Flow
1. Patient completes exercise session
2. Backend sends metrics to ML service (`accuracy`, `focus_duration`, `movement_score`)
3. ML service returns `improvement_score`
4. Backend stores result in database

### ML Service API
```bash
# Health check
curl http://localhost:5000/health

# Predict improvement score
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "accuracy": 85.5,
    "focus_duration": 240,
    "movement_score": 78.2
  }'
```

## 📚 API Documentation

### Key Endpoints

#### Authentication
- `POST /auth/register/doctor` - Register new doctor
- `POST /auth/register/patient` - Register new patient
- `POST /auth/login` - User login

#### Doctor APIs
- `GET /doctor/profile` - Get doctor profile
- `GET /doctor/patients` - Get doctor's patients
- `POST /doctor/recommend` - Create exercise recommendation
- `GET /doctor/patient/{id}/progress` - Get patient progress

#### Patient APIs
- `GET /patient/profile` - Get patient profile
- `GET /patient/exercises` - Get available exercises
- `POST /patient/start-session` - Start exercise session
- `POST /patient/end-session` - End exercise session with results
- `GET /patient/history` - Get exercise history

#### Exercise APIs
- `GET /exercises` - Get all exercises
- `POST /exercises` - Create new exercise (Doctor/Admin)
- `PUT /exercises/{id}` - Update exercise (Doctor/Admin)
- `DELETE /exercises/{id}` - Delete exercise (Doctor/Admin)

For complete API documentation, see: `backend/vision-app-backend/API_DOCUMENTATION.md`

## 🔧 Configuration

### Application Configuration (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/vision_app_db
    username: root
    password: Angel@123
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

jwt:
  secret: mySecretKey
  expiration: 86400000 # 24 hours

server:
  port: 8080
  servlet:
    context-path: /api
```

### Environment Variables
- `SPRING_DATASOURCE_URL` - Database URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `ML_SERVICE_URL` - ML service URL (default: http://localhost:5000)

## 🧪 Testing

### Running Tests
```bash
cd backend/vision-app-backend
mvn test
```

### Sample Test Data
Use the provided sample users for testing:
- **Doctor**: john.smith@hospital.com / password123
- **Patient**: alice.brown@email.com / password123

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Role-Based Access Control**: DOCTOR/PATIENT roles
- **Password Encryption**: BCrypt hashing
- **CORS Configuration**: Cross-origin request handling
- **Input Validation**: Comprehensive request validation
- **Global Exception Handling**: Centralized error management

## 📈 Monitoring & Logging

### Application Logs
- Location: `logs/vision-app-backend.log`
- Level: DEBUG for development
- Format: Structured logging with timestamps

### Health Checks
- Backend health: `GET /api/actuator/health`
- ML Service health: `GET http://localhost:5000/health`

## 🚀 Deployment

### Docker Deployment (Optional)
```bash
# Build backend
cd backend/vision-app-backend
docker build -t vision-therapy-backend .

# Build ML service
cd ../ai-service
docker build -t vision-therapy-ml .

# Run with docker-compose
docker-compose up -d
```

### Production Considerations
- Use environment variables for sensitive configuration
- Enable HTTPS in production
- Configure database connection pooling
- Set up proper logging and monitoring
- Use production-grade JWT secrets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the API documentation
2. Review the logs for error details
3. Verify ML service connectivity
4. Check database connection and schema

## 🔄 Version History

- **v1.0.0** - Initial release with complete backend functionality
  - JWT authentication
  - Role-based access control
  - ML integration
  - Comprehensive API documentation
  - Sample data and testing setup
