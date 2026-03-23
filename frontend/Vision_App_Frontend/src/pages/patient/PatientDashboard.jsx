import React, { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import Loader from '../../components/Loader';
import { Activity, PlayCircle, History, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnalyticsDashboard from '../../components/Analytics/AnalyticsDashboard';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ pending: 0, completed: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileData, recsData, historyData] = await Promise.all([
          patientService.getProfile(),
          patientService.getRecommendations(),
          patientService.getHistory()
        ]);
        
        setProfile(profileData);
        setHistory(historyData?.history || []);
        setStats({
          pending: Array.isArray(recsData) ? recsData.length : 0,
          completed: historyData?.history ? historyData.history.length : 0
        });
      } catch (err) {
        setError('Failed to load profile dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await patientService.downloadCertificate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Vision_Improvement_Certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download certificate.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {profile?.name || 'Patient'}</h1>
        <p className="text-gray-600">Age: {profile?.age || 'N/A'}</p>
        <p className="text-gray-500 mt-1 text-sm">Contact: {profile?.phone}</p>
        <p className="text-gray-500 mt-1 text-sm">Email: {profile?.email}</p>
        
        {error && <p className="text-red-600 mt-2">{error}</p>}

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-semibold"
          >
            <Award className="h-5 w-5 mr-2" />
            {downloading ? 'Preparing Certificate...' : 'Download Progress Certificate'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <PlayCircle className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned Exercises</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/patient/exercises" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Start Practicing &rarr;</Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <History className="h-8 w-8 text-green-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/patient/history" className="text-sm text-green-600 hover:text-green-800 font-medium">View History &rarr;</Link>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Clinical Progress Analytics</h2>
        </div>
        <div className="p-6">
          <AnalyticsDashboard data={history} />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
