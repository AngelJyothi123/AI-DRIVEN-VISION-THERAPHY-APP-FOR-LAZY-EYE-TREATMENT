import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle } from 'lucide-react';

const SHAPES = ['circle', 'square', 'triangle', 'star'];
const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function PatternMatchingExercise({ onComplete }) {
    const [grid, setGrid] = useState([]);
    const [targetPattern, setTargetPattern] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
    const [isPlaying, setIsPlaying] = useState(false);
    const [totalClicks, setTotalClicks] = useState(0);

    const generateGrid = () => {
        const newGrid = Array(16).fill(null).map((_, i) => ({
            id: i,
            shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }));
        setGrid(newGrid);
        setTargetPattern(newGrid[Math.floor(Math.random() * newGrid.length)]);
    };

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && isPlaying) {
            endExercise();
        }
    }, [isPlaying, timeLeft]);

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setTotalClicks(0);
        setTimeLeft(60);
        generateGrid();
    };

    const handleTileClick = (tile) => {
        if (!isPlaying) return;
        setTotalClicks((c) => c + 1);
        if (tile.shape === targetPattern.shape && tile.color === targetPattern.color) {
            setScore((s) => s + 1);
            generateGrid();
        }
    };

    const endExercise = () => {
        setIsPlaying(false);
        const accuracy = totalClicks > 0 ? (score / totalClicks) * 100 : 0;
        
        // Pass the metrics up to the wrapper
        if (onComplete) {
            onComplete({
                accuracy: parseFloat(accuracy.toFixed(2)),
                focusDuration: 60 - timeLeft,
                movementScore: 85.0, // Simulated for logical game
                responseTime: totalClicks > 0 ? (60 / totalClicks) * 1000 : 0, 
                errorRate: totalClicks > 0 ? ((totalClicks - score) / totalClicks) * 100 : 0,
                fatigueLevel: accuracy < 50 ? 2 : 0
            });
        }
    };

    const renderShape = (tile) => {
        const style = { backgroundColor: tile.color };
        switch (tile.shape) {
            case 'circle': return <div className="w-12 h-12 rounded-full" style={style}></div>;
            case 'square': return <div className="w-12 h-12" style={style}></div>;
            case 'triangle': return (
                <div 
                    className="w-0 h-0" 
                    style={{
                        borderLeft: '24px solid transparent', 
                        borderRight: '24px solid transparent', 
                        borderBottom: `48px solid ${tile.color}`
                    }}>
                </div>
            );
            case 'star': return <div className="w-12 h-12 rotate-45" style={style}></div>; // Simplified star
            default: return <div className="w-12 h-12 rounded-lg" style={style}></div>;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-2xl mx-auto text-center transform transition-all hover:scale-[1.01] duration-300">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Pattern Matching</h2>
                <div className="flex gap-4">
                    <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-semibold shadow-sm">
                        Time: {timeLeft}s
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-lg text-green-700 font-semibold shadow-sm">
                        Score: {score}
                    </div>
                </div>
            </div>

            {!isPlaying ? (
                <div className="py-16 space-y-6 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <CheckCircle className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Ready to test your contrast & memory?</h3>
                    <p className="text-gray-500 max-w-md mx-auto">Find and click the exact matching shape and color before the time runs out. Fast reactions yield better therapy results.</p>
                    <button 
                        onClick={startGame}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                    >
                        <Play className="w-5 h-5" /> Start Exercise
                    </button>
                    {totalClicks > 0 && (
                        <p className="text-sm font-medium text-emerald-600 mt-4 animate-pulse">
                            Previous Accuracy: {((score / Math.max(1, totalClicks)) * 100).toFixed(1)}%
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-inner flex flex-col items-center justify-center">
                        <p className="text-gray-500 font-semibold uppercase tracking-wider text-sm mb-4">Target Pattern</p>
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 transform hover:rotate-3 transition-transform">
                            {renderShape(targetPattern)}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
                        {grid.map((tile) => (
                            <button
                                key={tile.id}
                                onClick={() => handleTileClick(tile)}
                                className="aspect-square bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:scale-105 hover:shadow-md hover:border-blue-200 transition-all active:scale-95"
                            >
                                {renderShape(tile)}
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        onClick={endExercise}
                        className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 mx-auto text-sm font-medium"
                    >
                        <RotateCcw className="w-4 h-4" /> End Early
                    </button>
                </div>
            )}
        </div>
    );
}
