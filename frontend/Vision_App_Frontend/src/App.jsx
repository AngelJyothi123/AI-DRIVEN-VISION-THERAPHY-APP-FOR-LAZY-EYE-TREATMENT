import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import RegisterDoctor from './pages/auth/RegisterDoctor';
import RegisterPatient from './pages/auth/RegisterPatient';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import Patients from './pages/doctor/Patients';
import Recommendations from './pages/doctor/Recommendations';
import Progress from './pages/doctor/Progress';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import Exercises from './pages/patient/Exercises';
import Session from './pages/patient/Session';
import History from './pages/patient/History';
import Appointments from './pages/patient/Appointments';
import VirtualMeeting from './pages/common/VirtualMeeting';
import ChatWidget from './components/Chat/ChatWidget';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/doctor" element={<RegisterDoctor />} />
              <Route path="/register/patient" element={<RegisterPatient />} />

              {/* Protected Routes for DOCTOR */}
              <Route element={<ProtectedRoute allowedRole="DOCTOR" />}>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/patients" element={<Patients />} />
                <Route path="/doctor/recommendations" element={<Recommendations />} />
                <Route path="/doctor/patient/:id/progress" element={<Progress />} />
              </Route>

              {/* Protected Routes for PATIENT */}
              <Route element={<ProtectedRoute allowedRole="PATIENT" />}>
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/exercises" element={<Exercises />} />
                <Route path="/patient/session" element={<Session />} />
                <Route path="/patient/history" element={<History />} />
                <Route path="/patient/appointments" element={<Appointments />} />
              </Route>
              
              {/* Common Protected Routes */}
              <Route element={<ProtectedRoute allowedRole={['DOCTOR', 'PATIENT']} />}>
                <Route path="/meeting/:roomId" element={<VirtualMeeting />} />
              </Route>
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <ChatWidget />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
