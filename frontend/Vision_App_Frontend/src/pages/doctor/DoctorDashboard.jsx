import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import Loader from '../../components/Loader';
import { Activity, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [patientCount, setPatientCount] = useState(0);
  const [recommendationsCount, setRecommendationsCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [profileData, patientsData, recsData, apptsData] = await Promise.all([
        doctorService.getProfile(),
        doctorService.getPatients(),
        doctorService.getRecommendations(),
        doctorService.getAppointments()
      ]);
      
      setProfile(profileData);
      setPatientCount(Array.isArray(patientsData) ? patientsData.length : 0);
      setRecommendationsCount(Array.isArray(recsData) ? recsData.length : 0);
      setAppointments(Array.isArray(apptsData) ? apptsData : []);
    } catch (err) {
      console.error('Fetch dashboard error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to load dashboard data.';
      setError(`Dashboard Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await doctorService.updateAppointmentStatus(id, newStatus);
      alert(`Appointment status updated to ${res.status}`);
      fetchDashboardData(); // Refresh the active list natively
    } catch (err) {
      console.error('Status update error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update status';
      alert(`Error: ${msg}`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {profile?.name || 'Doctor'}</h1>
        <p className="text-gray-600">Qualification: {profile?.qualification || 'Not provided'}</p>
        <p className="text-gray-600 mt-1">Hospital: {profile?.hospital || 'Not provided'}</p>
        <p className="text-gray-500 mt-1 text-sm">Contact: {profile?.phone}</p>
        
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-semibold text-gray-900">{patientCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/doctor/patients" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Patients &rarr;</Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Recommendations</p>
              <p className="text-2xl font-semibold text-gray-900">{recommendationsCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/doctor/recommendations" className="text-sm text-green-600 hover:text-green-800 font-medium">Manage Recommendations &rarr;</Link>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border-t-4 border-indigo-500">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
        </div>
        
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">
             You have no appointments scheduled.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {appointments.sort((a,b) => new Date(a.appointmentTime) - new Date(b.appointmentTime)).map(appt => {
              const dateObj = new Date(appt.appointmentTime);
              const isPast = dateObj < new Date() && appt.status !== 'COMPLETED';
              
              return (
              <li key={appt.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-md font-bold text-gray-900">Patient ID: {appt.patientId}</h3>
                  <div className="text-sm text-gray-600 mt-1 flex items-center space-x-2">
                     <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-semibold">
                       {dateObj.toLocaleString()}
                     </span>
                     {isPast && appt.status === 'PENDING' && (
                       <span className="text-red-500 text-xs font-bold">Overdue Request</span>
                     )}
                  </div>
                  {appt.notes && <p className="text-sm text-gray-500 mt-2 italic flex-wrap max-w-md">"{appt.notes}"</p>}
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                    appt.status === 'CONFIRMED' ? 'bg-green-100 border-green-300 text-green-800' :
                    appt.status === 'COMPLETED' ? 'bg-gray-100 border-gray-300 text-gray-800' :
                    appt.status === 'CANCELLED' ? 'bg-red-100 border-red-300 text-red-800' :
                    'bg-yellow-100 border-yellow-300 text-yellow-800'
                  }`}>
                    {appt.status}
                  </span>

                  {appt.meetingUrl && appt.status === 'CONFIRMED' && (
                    <Link
                      to={`/meeting/${appt.meetingUrl.split('/').pop()}`}
                      className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-full transition shadow-sm font-medium flex items-center gap-1"
                    >
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Join Session
                    </Link>
                  )}
                  
                  {appt.status === 'PENDING' && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleStatusChange(appt.id, 'CONFIRMED')} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition">Approve</button>
                      <button onClick={() => handleStatusChange(appt.id, 'CANCELLED')} className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition">Decline</button>
                    </div>
                  )}
                  {appt.status === 'CONFIRMED' && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleStatusChange(appt.id, 'COMPLETED')} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition">Mark Completed</button>
                      <button onClick={() => handleStatusChange(appt.id, 'CANCELLED')} className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition">Cancel</button>
                    </div>
                  )}
                </div>
              </li>
            )})}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
