import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sessionService } from '../../services/sessionService';
import { Play, Square, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import EyeTrackingExercise from './exercises/EyeTrackingExercise';
import PatternMatchingExercise from './exercises/PatternMatchingExercise';
import NearFarFocusExercise from './exercises/NearFarFocusExercise';
import ContrastSensitivityExercise from './exercises/ContrastSensitivityExercise';

const Session = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { exerciseId, exerciseName, durationMinutes } = location.state || {};

  const [sessionState, setSessionState] = useState('idle'); // idle, active, ending, finished
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (!exerciseId) {
      navigate('/patient/exercises');
    }
    return () => clearInterval(timerRef.current);
  }, [exerciseId, navigate]);

  const handleStart = async () => {
    setError('');
    setSessionState('active');
    setElapsedSeconds(0);
    
    try {
      const data = await sessionService.startSession({ exerciseId });
      setSessionId(data.sessionId || data.id || 'mock-id-if-not-returned');
      
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Failed to start session. Please try again.');
      setSessionState('idle');
    }
  };

  const handleExerciseComplete = async (metrics) => {
    setSessionState('ending');
    setError('');
    if (timerRef.current) {
        clearInterval(timerRef.current);
    }

    try {
      const payload = {
        sessionId,
        exerciseId,
        accuracy: metrics.accuracy,
        focusDuration: metrics.focusDuration,
        movementScore: metrics.movementScore
      };
      
      const response = await sessionService.endSession(payload);
      setResult(response);
      setSessionState('finished');
    } catch (err) {
      setError('Failed to save session data to database.');
      setSessionState('idle');
    }
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          {exerciseName || 'Vision Exercise'}
        </h1>
        {durationMinutes && (
          <p className="text-center text-gray-500 mb-8">
            Recommended Duration: {durationMinutes} minutes
          </p>
        )}

        {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-6 text-center">{error}</div>}

        {sessionState === 'idle' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-6">
            <div className="w-48 h-48 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-100 overflow-hidden relative">
               <EyeAnimation />
            </div>
            <p className="text-gray-600 text-center max-w-md">
              Position yourself comfortably in front of the camera and click start when you are ready to begin the exercise.
            </p>
            <button
              onClick={handleStart}
              className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Play className="mr-2 h-6 w-6" /> Start Session
            </button>
          </div>
        )}

        {sessionState === 'active' && (
          <div className="py-2 animate-in zoom-in duration-300">
            {(() => {
                const name = exerciseName?.toLowerCase() || '';
                if (name.includes('tracking') || name.includes('movement') || name.includes('target pursuit')) {
                    return <EyeTrackingExercise onComplete={handleExerciseComplete} />;
                } else if (name.includes('near') || name.includes('focus')) {
                    return <NearFarFocusExercise onComplete={handleExerciseComplete} />;
                } else if (name.includes('contrast')) {
                    return <ContrastSensitivityExercise onComplete={handleExerciseComplete} />;
                } else {
                    return <PatternMatchingExercise onComplete={handleExerciseComplete} />;
                }
            })()}
            
            <button
               onClick={() => handleExerciseComplete({ 
                   accuracy: 85.0, focusDuration: 30, movementScore: 90.0
               })}
               className="mt-6 mx-auto flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-full text-white bg-red-600 hover:bg-red-700 transition-all opacity-80 hover:opacity-100"
            >
              <Square className="mr-2 h-4 w-4" /> Bail & Submit Default Metrics
            </button>
          </div>
        )}

        {sessionState === 'ending' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <p className="text-xl text-gray-600">Analyzing ML metrics and saving session...</p>
          </div>
        )}

        {sessionState === 'finished' && result && (
          <div className="flex flex-col items-center justify-center py-8 space-y-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900">Session Complete!</h2>
            
            <div className="w-full max-w-lg bg-gray-50 rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-200">
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Duration</span>
                <span className="text-gray-900 font-bold text-xl">{formatTime(elapsedSeconds)}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Accuracy</span>
                <span className="text-blue-600 font-bold text-xl">{result?.accuracy || 0}%</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Movement Score</span>
                <span className="text-purple-600 font-bold text-xl">{result?.movementScore || 0}/10</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center bg-blue-50">
                <span className="text-blue-800 font-bold">Improvement Score</span>
                <span className="text-blue-800 font-bold text-2xl">
                  {result?.improvementScore > 0 ? '+' : ''}{result?.improvementScore || 0}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-4 w-full max-w-lg">
              <button
                onClick={() => navigate('/patient/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/patient/exercises')}
                className="flex-1 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
              >
                More Exercises
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple aesthetic SVG animation for the idle state
const EyeAnimation = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 text-blue-500 opacity-70">
    <path 
      d="M10 50 C30 20, 70 20, 90 50 C70 80, 30 80, 10 50 Z" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="6" 
    />
    <circle 
      cx="50" cy="50" r="15" 
      fill="currentColor" 
      className="animate-pulse"
    />
  </svg>
);

export default Session;
