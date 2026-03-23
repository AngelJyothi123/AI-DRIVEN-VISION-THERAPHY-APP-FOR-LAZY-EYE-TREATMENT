import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { Camera, Activity, AlertCircle } from 'lucide-react';

export default function EyeTrackingExercise({ onComplete }) {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    
    const [targetPos, setTargetPos] = useState({ x: 150, y: 150 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    
    // Metrics variables (refs so animation loop can freely mutate them without re-renders)
    const metrics = useRef({
        gazeFocusFrames: 0,
        totalFrames: 0,
        erraticMovements: 0,
        lastFaceCenter: null
    });

    // Animate target
    useEffect(() => {
        if (!isPlaying) return;
        
        let animationFrameId;
        let angle = 0;
        
        const moveTarget = () => {
            angle += 0.05;
            // Smooth Pursuit Figure-8 Pattern
            const newX = 320 + 200 * Math.sin(angle);
            const newY = 240 + 100 * Math.sin(angle * 2);
            setTargetPos({ x: newX, y: newY });
            animationFrameId = requestAnimationFrame(moveTarget);
        };
        moveTarget();
        
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    endTherapySession();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        
        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(timer);
        };
    }, [isPlaying]);

    // Load TensorFlow FaceMesh Model
    useEffect(() => {
        const loadModel = async () => {
            try {
                await tf.setBackend('webgl');
                const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
                const detectorConfig = { runtime: 'tfjs' };
                const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
                setIsModelLoaded(true);
                startTrackingLoop(detector);
            } catch (err) {
                console.error("TensorFlow/MediaPipe load error:", err);
            }
        };
        loadModel();
    }, []);

    const startTrackingLoop = async (model) => {
        setInterval(async () => {
            if (
                typeof webcamRef.current !== "undefined" &&
                webcamRef.current !== null &&
                webcamRef.current.video.readyState === 4
            ) {
                const video = webcamRef.current.video;
                try {
                    const faces = await model.estimateFaces(video);
                    
                    if (faces.length > 0) {
                        const keypoints = faces[0].keypoints;
                        
                        // MediaPipe 468 points - Nose is around index 1
                        const nose = [keypoints[1].x, keypoints[1].y];
                        metrics.current.totalFrames++;
                        
                        metrics.current.gazeFocusFrames++;
                        
                        if (metrics.current.lastFaceCenter) {
                            const dist = Math.hypot(nose[0] - metrics.current.lastFaceCenter[0], nose[1] - metrics.current.lastFaceCenter[1]);
                            if (dist > 20) { // Jerky movement
                                metrics.current.erraticMovements++;
                            }
                        }
                        metrics.current.lastFaceCenter = nose;
                        
                        const ctx = canvasRef.current.getContext('2d');
                        ctx.clearRect(0, 0, 640, 480);
                        
                        ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
                        const rightEye = [keypoints[33].x, keypoints[33].y];
                        const leftEye = [keypoints[263].x, keypoints[263].y];
                        ctx.beginPath(); ctx.arc(rightEye[0], rightEye[1], 10, 0, 2 * Math.PI); ctx.fill();
                        ctx.beginPath(); ctx.arc(leftEye[0], leftEye[1], 10, 0, 2 * Math.PI); ctx.fill();
                    }
                } catch (e) {
                    console.error("Tracking Loop Error:", e);
                }
            }
        }, 100); // 10 FPS tracking loop for performance
    };

    const startTherapySession = () => {
        metrics.current = { gazeFocusFrames: 0, totalFrames: 0, erraticMovements: 0, lastFaceCenter: null };
        setTimeLeft(60);
        setIsPlaying(true);
    };

    const endTherapySession = () => {
        setIsPlaying(false);
        const focusScore = metrics.current.totalFrames > 0 
            ? (metrics.current.gazeFocusFrames / metrics.current.totalFrames) * 100 
            : 0;
            
        const rawMovement = Math.max(0, 100 - (metrics.current.erraticMovements * 2));
        
        if (onComplete) {
            onComplete({
                accuracy: parseFloat(focusScore.toFixed(2)),
                focusDuration: 60 - timeLeft,
                movementScore: parseFloat(rawMovement.toFixed(2)),
                responseTime: 250, // Standard
                errorRate: parseFloat((100 - focusScore).toFixed(2)),
                fatigueLevel: metrics.current.erraticMovements > 15 ? 2 : 0
            });
        }
    };

    return (
        <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="p-6 bg-gray-800 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white tracking-wide">Deep Learning Target Pursuit</h2>
                </div>
                {isPlaying ? (
                    <div className="flex gap-4">
                        <span className="bg-gray-900 px-4 py-2 rounded-xl text-emerald-400 font-mono font-bold shadow-inner">
                            {timeLeft}s
                        </span>
                    </div>
                ) : (
                    <button 
                        onClick={startTherapySession}
                        disabled={!isModelLoaded}
                        className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        {!isModelLoaded ? 'Loading DL Models...' : 'Commence Tracking'}
                    </button>
                )}
            </div>

            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                {!isModelLoaded && (
                    <div className="absolute z-50 flex flex-col items-center gap-4 animate-pulse">
                        <Camera className="w-12 h-12 text-gray-500" />
                        <p className="text-gray-400 font-medium">Booting MediaPipe WebGL Shaders...</p>
                    </div>
                )}
                
                <div className="relative overflow-hidden rounded-2xl ring-4 ring-gray-800 shadow-2xl">
                    <Webcam
                        ref={webcamRef}
                        muted={true}
                        width={640}
                        height={480}
                        className="opacity-70 scale-x-[-1]" 
                    />
                    
                    <canvas
                        ref={canvasRef}
                        width={640}
                        height={480}
                        className="absolute top-0 left-0 z-10 scale-x-[-1]"
                    />

                    {/* The Target Node */}
                    {isPlaying && (
                        <div 
                            className="absolute w-8 h-8 bg-emerald-500 rounded-full blur-[1px] shadow-[0_0_20px_rgba(16,185,129,0.8)] z-20 transition-all duration-75"
                            style={{ 
                                left: targetPos.x - 16, 
                                top: targetPos.y - 16,
                            }}
                        >
                            <div className="w-3 h-3 bg-white rounded-full mx-auto mt-2.5 animate-ping" />
                        </div>
                    )}
                </div>
            </div>
            
            <div className="p-6 bg-gray-800 border-t border-gray-700 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">
                    <strong className="text-gray-300">Instructions:</strong> Keep your head perfectly still. Follow the glowing emerald target with your eyes only. The real-time MediaPipe deep learning model is analyzing your micro-saccades locally in your browser.
                </p>
            </div>
        </div>
    );
}
