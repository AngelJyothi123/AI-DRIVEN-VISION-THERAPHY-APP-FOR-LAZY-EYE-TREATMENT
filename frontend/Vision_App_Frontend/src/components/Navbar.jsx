import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, LogOut, User, Activity } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? (role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard') : '/'} className="flex items-center gap-2">
              <Eye className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">VisionTherapy AI</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {role === 'DOCTOR' && (
                  <>
                    <Link to="/doctor/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    <Link to="/doctor/patients" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Patients</Link>
                    <Link to="/doctor/recommendations" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Recommendations</Link>
                  </>
                )}
                
                {role === 'PATIENT' && (
                  <>
                    <Link to="/patient/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    <Link to="/patient/exercises" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Exercises</Link>
                    <Link to="/patient/history" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">History</Link>
                    <Link to="/patient/appointments" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Appointments</Link>
                  </>
                )}

                <div className="border-l border-gray-200 h-6 mx-2"></div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register/patient" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
