import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import Loader from '../../components/Loader';
import { Calendar, Clock, PlusCircle } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingError('');
    
    if (!date || !time) {
      setBookingError('Please select both a date and time.');
      return;
    }

    // Combine date and time
    const appointmentTime = `${date}T${time}:00`;

    try {
      await patientService.bookAppointment({
        appointmentTime,
        status: 'PENDING',
        notes
      });
      
      setShowForm(false);
      setDate('');
      setTime('');
      setNotes('');
      fetchAppointments();
    } catch (err) {
      if (err.response?.status === 409) {
        setBookingError('The doctor is already booked at this specific time. Please select another slot.');
      } else if (err.response?.status === 400) {
        setBookingError(err.response?.data?.message || 'Cannot book an appointment in the past.');
      } else {
        setBookingError('Failed to book appointment. Are you assigned to a doctor?');
      }
    }
  };

  if (loading && appointments.length === 0) return <Loader />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="mt-4 sm:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {showForm ? 'Cancel Booking' : 'Book New Session'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 shadow-lg border border-blue-100 rounded-lg animate-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Request an Appointment</h2>
          {bookingError && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{bookingError}</div>}
          
          <form onSubmit={handleBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Notes</label>
              <textarea 
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any visual strains or specific therapy goals..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition">
              Confirm Booking Request
            </button>
          </form>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You don't have any appointments scheduled.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {appointments.sort((a,b) => new Date(b.appointmentTime) - new Date(a.appointmentTime)).map(appt => {
              const dt = new Date(appt.appointmentTime);
              return (
              <li key={appt.id} className="p-6 hover:bg-gray-50 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${
                    appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' :
                    appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      Session with your Doctor
                    </h3>
                    <div className="text-gray-500 mt-1 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {dt.toLocaleString()}
                    </div>
                    {appt.notes && <p className="text-sm text-gray-600 italic mt-2">"{appt.notes}"</p>}
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-center">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                    appt.status === 'CONFIRMED' ? 'bg-green-50 border-green-200 text-green-700' :
                    appt.status === 'COMPLETED' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                    appt.status === 'CANCELLED' ? 'bg-red-50 border-red-200 text-red-700' :
                    'bg-yellow-50 border-yellow-200 text-yellow-700'
                  }`}>
                    {appt.status}
                  </span>

                  {appt.meetingUrl && appt.status === 'CONFIRMED' && (
                    <Link
                      to={`/meeting/${appt.meetingUrl.split('/').pop()}`}
                      className="mt-2 text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-full transition shadow-sm font-medium flex items-center gap-1"
                    >
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Join Session
                    </Link>
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

export default Appointments;
