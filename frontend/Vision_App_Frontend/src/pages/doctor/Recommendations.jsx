import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { exerciseService } from '../../services/exerciseService';
import Loader from '../../components/Loader';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    patientId: '',
    exerciseId: '',
    durationMinutes: 5 // Default UI in minutes
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recsData, patsData, exData] = await Promise.all([
          doctorService.getRecommendations(),
          doctorService.getPatients(),
          exerciseService.getAll()
        ]);
        setRecommendations(Array.isArray(recsData) ? recsData : []);
        setPatients(Array.isArray(patsData) ? patsData : []);
        setExercises(Array.isArray(exData) ? exData : []);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      // Backend expects duration in seconds (e.g. 5 minutes = 300 seconds)
      const payload = {
        patientId: parseInt(formData.patientId, 10),
        exerciseId: parseInt(formData.exerciseId, 10),
        duration: parseInt(formData.durationMinutes, 10) * 60 
      };

      await doctorService.recommendExercise(payload);
      
      const updatedRecs = await doctorService.getRecommendations();
      setRecommendations(Array.isArray(updatedRecs) ? updatedRecs : []);
      
      setFormData({
        patientId: '',
        exerciseId: '',
        durationMinutes: 5
      });
      alert('Recommendation added successfully');
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setError(Object.values(err.response.data.validationErrors).join(', '));
      } else {
        setError(err.response?.data?.message || 'Failed to create recommendation.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPatientName = (id) => patients.find(p => p.id === id)?.name || `Patient ID: ${id}`;
  const getExerciseName = (id) => exercises.find(e => e.id === id)?.name || `Exercise ID: ${id}`;

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Exercise Recommendations</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Recommendation</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient</label>
                <select name="patientId" required value={formData.patientId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 border focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select a Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Exercise</label>
                <select name="exerciseId" required value={formData.exerciseId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 border focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select an Exercise</option>
                  {exercises.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (Minutes)</label>
                <input type="number" name="durationMinutes" required min="1" value={formData.durationMinutes} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 border focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700">
                {isSubmitting ? 'Creating...' : 'Assign Exercise'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Assigned Recommendations</h2>
          </div>
          {recommendations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No recommendations assigned yet.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recommendations.map(rec => (
                <li key={rec.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                    <div>
                      <h3 className="text-lg font-medium text-blue-600">{getExerciseName(rec.exerciseId)}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold">Assigned To:</span> {getPatientName(rec.patientId)}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded">
                      {Math.round(rec.duration / 60)} minutes
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
