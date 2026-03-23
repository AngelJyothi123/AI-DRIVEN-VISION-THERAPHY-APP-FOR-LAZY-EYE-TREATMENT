import React, { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

const Exercises = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [exercisesData, setExercisesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const [recs, allEx] = await Promise.all([
          patientService.getRecommendations(),
          patientService.getExercises()
        ]);
        setRecommendations(Array.isArray(recs) ? recs : []);
        setExercisesData(Array.isArray(allEx) ? allEx : []);
      } catch (err) {
        setError('Failed to load exercises.');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const getExerciseDetails = (id) => exercisesData.find(e => e.id === id) || {};

  const handleStartSession = (exerciseId, exerciseName, durationMinutes = 60) => {
    navigate('/patient/session', { 
      state: { 
        exerciseId, 
        exerciseName,
        durationMinutes
      } 
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Recommended Exercises</h1>
        <p className="mt-2 text-sm text-gray-600 sm:mt-0">
          Complete these exercises as prescribed by your doctor.
        </p>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.length === 0 && !error ? (
          <div className="col-span-full bg-white p-6 shadow rounded-lg text-center text-gray-500">
            You currently have no assigned exercises.
          </div>
        ) : (
          recommendations.map((rec) => {
            const exDetails = getExerciseDetails(rec.exerciseId);
            return (
              <div key={rec.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 flex flex-col">
                <div className="px-4 py-5 sm:p-6 flex-grow">
                  <h3 className="text-lg font-medium text-gray-900 truncate flex items-center justify-between">
                    {exDetails.name || `Exercise ID: ${rec.exerciseId}`}
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase tracking-wider">{exDetails.type || 'Standard'}</span>
                  </h3>
                  <div className="mt-4 text-sm text-gray-500 space-y-2">
                    <p><span className="font-semibold text-gray-600">Assigned Duration:</span> {Math.round(rec.duration / 60)} minutes</p>
                    {exDetails.description && (
                      <p className="text-gray-600 border-l-2 border-gray-300 pl-3">
                        {exDetails.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6 bg-gray-50">
                  <button
                    onClick={() => handleStartSession(rec.exerciseId, exDetails.name || `Exercise ID: ${rec.exerciseId}`, Math.round(rec.duration / 60))}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Assigned Session
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-12 sm:flex sm:items-center sm:justify-between border-t border-gray-200 pt-8">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Explore AI Therapy Modules</h2>
           <p className="mt-2 text-sm text-gray-600">Train your vision with our global deep learning catalog.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {exercisesData.map((ex) => (
             <div key={`global-${ex.id}`} className="bg-white overflow-hidden shadow-md rounded-2xl flex flex-col border border-gray-100 hover:shadow-xl transition-shadow">
               <div className="p-6 flex-grow bg-gradient-to-br from-gray-50 to-white">
                 <h3 className="text-lg font-bold text-gray-900 flex flex-col gap-2">
                   {ex.name}
                   <span className="text-xs self-start bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">{ex.type || 'Standard'}</span>
                 </h3>
                 <p className="mt-4 text-sm text-gray-500 leading-relaxed font-medium">
                   {ex.description || 'Interactive cognitive vision exercise.'}
                 </p>
               </div>
               <div className="p-4 bg-white border-t border-gray-100">
                 <button
                   onClick={() => handleStartSession(ex.id, ex.name, 1)}
                   className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-200 shadow-sm text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
                 >
                   <Play className="h-4 w-4 mr-2" />
                   Start Freeplay
                 </button>
               </div>
             </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;
