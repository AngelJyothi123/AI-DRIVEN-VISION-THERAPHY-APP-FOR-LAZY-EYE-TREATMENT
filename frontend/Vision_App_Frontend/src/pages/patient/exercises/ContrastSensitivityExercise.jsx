import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Eye } from 'lucide-react';

export default function ContrastSensitivityExercise({ onComplete }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [difficulty, setDifficulty] = useState(1); // 1 = easy contrast, 10 = almost invisible
    const [targetPos, setTargetPos] = useState({ row: 0, col: 0 });
    
    const metrics = useRef({ successes: 0, failures: 0 });

    const generateTarget = () => {
        setTargetPos({
            row: Math.floor(Math.random() * 5),
            col: Math.floor(Math.random() * 5)
        });
    };

    useEffect(() => {
        let timer;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft <= 0 && isPlaying) {
            endSession();
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft]);

    const handleTileClick = (row, col) => {
        if (!isPlaying) return;
        
        if (row === targetPos.row && col === targetPos.col) {
            metrics.current.successes++;
            // Increase difficulty (lower contrast difference) as they get it right
            setDifficulty(d => Math.min(10, d + 0.5));
            generateTarget();
        } else {
            metrics.current.failures++;
        }
    };

    const startSession = () => {
        metrics.current = { successes: 0, failures: 0 };
        setDifficulty(1);
        setTimeLeft(60);
        setIsPlaying(true);
        generateTarget();
    };

    const endSession = () => {
        setIsPlaying(false);
        const { successes, failures } = metrics.current;
        const total = successes + failures;
        const accuracy = total > 0 ? (successes / total) * 100 : 0;
        
        if (onComplete) {
            onComplete({
                accuracy: parseFloat(accuracy.toFixed(2)),
                focusDuration: 60 - timeLeft,
                movementScore: 85.0, // Fixed logic proxy
                responseTime: total > 0 ? (60 / total) * 1000 : 0, 
                errorRate: total > 0 ? (failures / total) * 100 : 0,
                fatigueLevel: failures > 8 ? 2 : 0
            });
        }
    };

    // Background color is #F3F4F6 (gray-100)
    // Target starts darker and gets progressively closer to the background
    const bgLuminance = 243;
    const targetLuminance = Math.floor(bgLuminance - (40 / difficulty)); 
    const targetColor = `rgb(${targetLuminance}, ${targetLuminance}, ${targetLuminance})`;

    return (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto overflow-hidden border border-gray-100">
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-white flex justify-between items-center border-b border-indigo-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Eye className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Contrast Sensitivity</h2>
                </div>
                
                {isPlaying ? (
                    <div className="flex gap-4 items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Level {Math.floor(difficulty)}</span>
                        <div className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-lg shadow-inner font-mono font-bold">
                            {timeLeft}s
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={startSession}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                    >
                        Start Training
                    </button>
                )}
            </div>

            <div className="p-8 pb-12 bg-gray-50 select-none">
                {!isPlaying ? (
                    <div className="text-center text-gray-500 py-12">
                        <p className="mb-2 font-medium">Spot the faintly shaded square hidden in the grid.</p>
                        <p className="text-sm">As your amblyopic eye successfully identifies the contrast difference, the shade will adaptively fade until it becomes completely imperceptible.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto aspect-square p-2 bg-white rounded-xl shadow-inner border border-gray-100">
                        {Array.from({ length: 5 }).map((_, rowIndex) =>
                            Array.from({ length: 5 }).map((_, colIndex) => {
                                const isTarget = rowIndex === targetPos.row && colIndex === targetPos.col;
                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => handleTileClick(rowIndex, colIndex)}
                                        className="rounded-md transition-colors duration-150 cursor-pointer shadow-sm active:scale-95"
                                        style={{ 
                                            backgroundColor: isTarget ? targetColor : '#F3F4F6' 
                                        }}
                                    />
                                );
                            })
                        )}
                    </div>
                )}
            </div>
            
            {isPlaying && (
                <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center text-sm">
                    <div className="text-gray-500">
                        Accuracy: <span className="font-bold text-gray-800">{metrics.current.successes} / {metrics.current.successes + metrics.current.failures}</span>
                    </div>
                    <button 
                        onClick={endSession}
                        className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                    >
                        <Square className="w-4 h-4" /> End Early
                    </button>
                </div>
            )}
        </div>
    );
}
