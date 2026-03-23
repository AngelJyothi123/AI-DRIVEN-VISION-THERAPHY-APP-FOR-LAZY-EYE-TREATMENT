import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Crosshair } from 'lucide-react';

const LETTERS = ['C', 'O', 'E', 'H', 'D', 'N', 'Z', 'V'];
const TARGET = 'E';

export default function NearFarFocusExercise({ onComplete }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentLetter, setCurrentLetter] = useState('?');
    const [letterStyles, setLetterStyles] = useState({});
    
    const metrics = useRef({ clicks: 0, hits: 0, misses: 0 });

    const spawnNextLetter = () => {
        const randLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        
        // Simulates near-far focus shifting by rapidly alternating size and screen position
        const size = Math.floor(Math.random() * 80) + 16; // Random size from 16px to 96px
        const blur = Math.random() > 0.7 ? 'blur-[1px]' : ''; // Occasional astigmatism simulation
        const top = Math.floor(Math.random() * 70) + 10;
        const left = Math.floor(Math.random() * 80) + 10;
        
        setLetterStyles({ fontSize: `${size}px`, top: `${top}%`, left: `${left}%`, blurClass: blur });
        setCurrentLetter(randLetter);
    };

    useEffect(() => {
        let spawnInterval;
        let timer;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            
            // Letters spawn every 1.2 seconds, forcing the eye to quickly adjust focus
            spawnInterval = setInterval(spawnNextLetter, 1200);
        } else if (timeLeft <= 0 && isPlaying) {
            endSession();
        }
        return () => {
            clearInterval(timer);
            clearInterval(spawnInterval);
        };
    }, [isPlaying, timeLeft]);

    const handleTargetClick = () => {
        metrics.current.clicks++;
        if (currentLetter === TARGET) {
            metrics.current.hits++;
            spawnNextLetter(); // Reward with immediate transition
        } else {
            metrics.current.misses++;
        }
    };

    const startSession = () => {
        metrics.current = { clicks: 0, hits: 0, misses: 0 };
        setTimeLeft(60);
        setIsPlaying(true);
        spawnNextLetter();
    };

    const endSession = () => {
        setIsPlaying(false);
        const { hits, misses, clicks } = metrics.current;
        const total = hits + misses;
        const accuracy = total > 0 ? (hits / total) * 100 : 0;
        
        // Near-Far drill evaluates cognitive reaction accuracy rather than pure gaze
        if (onComplete) {
            onComplete({
                accuracy: parseFloat(accuracy.toFixed(2)),
                focusDuration: 60 - timeLeft,
                movementScore: 80.0,
                responseTime: clicks > 0 ? (60 / clicks) * 1000 : 0,
                errorRate: total > 0 ? (misses / total) * 100 : 0,
                fatigueLevel: misses > 5 ? 1 : 0
            });
        }
    };

    return (
        <div className="bg-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-full max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <Crosshair className="w-6 h-6 text-blue-300" />
                    <h2 className="text-xl font-bold">Dynamic Near-Far Focus Drill</h2>
                </div>
                {isPlaying ? (
                    <div className="bg-black/30 px-4 py-2 rounded-lg font-mono tracking-widest text-xl">
                        {timeLeft}s
                    </div>
                ) : (
                    <button 
                        onClick={startSession}
                        className="bg-white text-blue-900 px-6 py-2 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        Commence Drill
                    </button>
                )}
            </div>
            
            <div className="relative w-full aspect-video bg-white">
                {!isPlaying ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-8 text-center text-gray-500">
                        <p className="text-lg mb-4">You are searching for the target letter: <strong className="text-blue-900 text-3xl font-black"> {TARGET} </strong></p>
                        <p className="max-w-md mx-auto">The letters will appear at random sizes and depths around the screen. Focus clearly on each letter and rapidly click it <span className="underline">ONLY</span> if it matches the target.</p>
                    </div>
                ) : (
                    <div className="absolute inset-0 cursor-crosshair">
                        <div 
                            onClick={handleTargetClick}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 font-black select-none transition-all duration-300 ${letterStyles.blurClass} ${currentLetter === TARGET ? 'text-blue-900' : 'text-gray-800'}`}
                            style={{ 
                                fontSize: letterStyles.fontSize, 
                                top: letterStyles.top, 
                                left: letterStyles.left,
                            }}
                        >
                            {currentLetter}
                        </div>
                        
                        {/* Live Score Hud */}
                        <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-xl shadow border border-gray-100 text-sm font-medium text-gray-600">
                            <p>Hits: <span className="text-green-600">{metrics.current.hits}</span></p>
                            <p>Errors: <span className="text-red-500">{metrics.current.misses}</span></p>
                        </div>
                    </div>
                )}
            </div>
            
            {isPlaying && (
                <div className="bg-gray-100 p-4 flex justify-end">
                    <button 
                        onClick={endSession}
                        className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Square className="w-4 h-4" /> Terminate Session
                    </button>
                </div>
            )}
        </div>
    );
}
