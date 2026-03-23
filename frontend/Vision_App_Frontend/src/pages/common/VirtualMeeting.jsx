import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, X } from 'lucide-react';

const VirtualMeeting = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const jitsiUrl = `https://meet.jit.si/${roomId}`;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800">
            {/* Toolbar */}
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="bg-purple-600 p-2 rounded-lg">
                        <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold">Secure Tele-Therapy Session</h1>
                        <p className="text-xs text-gray-400">Room: {roomId}</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition border border-red-500/20"
                >
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">Leave & Close</span>
                </button>
            </div>

            {/* Video Content */}
            <div className="flex-grow relative">
                <iframe
                    allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; speaker"
                    src={jitsiUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Jitsi Virtual Meeting"
                />
            </div>

            {/* Footer / Branding */}
            <div className="bg-gray-800 px-4 py-2 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Powered by VisionTherapy AI Secure Video Engine
                </p>
            </div>
        </div>
    );
};

export default VirtualMeeting;
