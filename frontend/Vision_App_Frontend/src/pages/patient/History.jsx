import React, { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import { Award, Clock, Target, TrendingUp } from 'lucide-react';

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await patientService.getHistory();
        // The endpoint returns { patientId, history: [...] }
        setSessions(data.history && Array.isArray(data.history) ? data.history : []);
      } catch (err) {
        setError('Failed to load session history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return '00:00';
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Session History</h1>
        <Link to="/patient/exercises" className="mt-3 sm:mt-0 text-blue-600 hover:text-blue-800 font-medium">
          Start a new exercise &rarr;
        </Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {sessions.length === 0 && !error ? (
        <div className="bg-white p-6 shadow rounded-lg text-center text-gray-500">
          You haven't completed any sessions yet.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <ul className="divide-y divide-gray-200">
            {sessions.map((session, index) => (
              <li key={session.sessionId || index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center">
                  
                  <div className="flex-1 mb-4 xl:mb-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-blue-700">
                        {session.exerciseName || 'Vision Exercise'}
                      </h3>
                      {session.exerciseType && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
                          {session.exerciseType}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Completed: {new Date(session.endTime || session.startTime).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 xl:ml-6">
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded border border-gray-100">
                      <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Duration</p>
                        <p className="text-sm font-bold text-gray-900">{formatTime(session.focusDuration)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded border border-gray-100">
                      <Target className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Accuracy</p>
                        <p className="text-sm font-bold text-gray-900">{session.accuracy?.toFixed(1) || 0}%</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded border border-gray-100">
                      <Award className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Movement</p>
                        <p className="text-sm font-bold text-gray-900">{session.movementScore?.toFixed(1) || 0}/100</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-blue-50 px-3 py-2 rounded border border-blue-100">
                      <TrendingUp className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold text-right">Imp. Score</p>
                        <p className="text-lg font-bold text-blue-800 text-right">
                          {session.improvementScore > 0 ? '+' : ''}{session.improvementScore?.toFixed(1) || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default History;
