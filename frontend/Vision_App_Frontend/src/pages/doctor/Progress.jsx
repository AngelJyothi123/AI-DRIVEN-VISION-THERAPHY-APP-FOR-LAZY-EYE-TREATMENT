import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import Loader from '../../components/Loader';
import { Activity, Target, Clock, TrendingUp } from 'lucide-react';

const Progress = () => {
  const { id } = useParams();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await doctorService.getPatientProgress(id);
        setProgressData(data);
      } catch (err) {
        setError('Failed to load patient progress.');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [id]);

  if (loading) return <Loader />;

  if (error || !progressData) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error || 'No data found'}</p>
        <Link to="/doctor/patients" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Patients Directory
        </Link>
      </div>
    );
  }

  const { patientName, averageAccuracy, averageImprovementScore, totalSessions, sessions = [] } = progressData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Progress Report: {patientName || 'Patient'}
        </h1>
        <Link to="/doctor/patients" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          &larr; Back to Patients
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 shadow rounded-lg flex items-center">
          <Activity className="text-blue-500 w-10 h-10 mr-4 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Sessions Done</p>
            <p className="text-2xl font-bold text-gray-900">{totalSessions || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 shadow rounded-lg flex items-center">
          <Target className="text-green-500 w-10 h-10 mr-4 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Average Accuracy</p>
            <p className="text-2xl font-bold text-gray-900">
              {averageAccuracy != null ? averageAccuracy.toFixed(1) : 0}%
            </p>
          </div>
        </div>
        <div className="bg-white p-6 shadow rounded-lg flex items-center">
          <TrendingUp className="text-indigo-500 w-10 h-10 mr-4 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Average Improvement</p>
            <p className="text-2xl font-bold text-gray-900">
              {averageImprovementScore != null ? averageImprovementScore.toFixed(1) : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Session History</h2>
        </div>
        {sessions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No session data recorded yet.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.sessionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(session.startTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.exerciseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.round(session.focusDuration / 60)} min</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.accuracy}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.movementScore}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`px-2 py-1 rounded inline-flex text-xs leading-5 font-semibold ${session.improvementScore > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                       {session.improvementScore > 0 ? '+' : ''}{session.improvementScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Progress;
