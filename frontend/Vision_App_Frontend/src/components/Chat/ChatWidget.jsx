import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, User, ShieldCheck } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';

const ChatWidget = () => {
    const { role, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showLabel, setShowLabel] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastKnownMessageCount, setLastKnownMessageCount] = useState(0);
    const scrollRef = useRef(null);

    // Initial Load: Fetch contacts
    useEffect(() => {
        if (!isAuthenticated || !role) return;
        const loadContacts = async () => {
            try {
                if (role === 'DOCTOR') {
                    const patients = await doctorService.getPatients();
                    setContacts(patients);
                    if (patients.length > 0) setSelectedContact(patients[0]);
                } else {
                    const profile = await patientService.getProfile();
                    // For patient, contact is their doctor
                    if (profile.doctorId) {
                        setContacts([{ id: profile.doctorId, name: 'My Doctor' }]);
                        setSelectedContact({ id: profile.doctorId, name: 'My Doctor' });
                    }
                }
            } catch (err) {
                console.error('Failed to load chat contacts:', err);
            }
        };
        loadContacts();

        // Welcome label timer
        const timer = setTimeout(() => setShowLabel(false), 5000);
        return () => clearTimeout(timer);
    }, [isAuthenticated, role]);

    // Polling for messages
    useEffect(() => {
        if (!isOpen || !selectedContact) return;

        const fetchMessages = async () => {
            try {
                const data = await chatService.getConversation(selectedContact.id);
                setMessages(data);
            } catch (err) {
                console.error('Chat poll error:', err);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [isOpen, selectedContact]);

    // Track unread messages
    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
            setLastKnownMessageCount(messages.length);
        } else {
            if (messages.length > lastKnownMessageCount) {
                const newMessages = messages.filter((m, i) => i >= lastKnownMessageCount);
                const othersMessages = newMessages.filter(m => (role === 'DOCTOR' && m.senderRole === 'PATIENT') || (role === 'PATIENT' && m.senderRole === 'DOCTOR'));
                if (othersMessages.length > 0) {
                    setUnreadCount(prev => prev + othersMessages.length);
                }
                setLastKnownMessageCount(messages.length);
            }
        }
    }, [messages, isOpen, role, lastKnownMessageCount]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        try {
            await chatService.sendMessage(selectedContact.id, newMessage);
            setNewMessage('');
            const data = await chatService.getConversation(selectedContact.id);
            setMessages(data);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Clinical Chat</h3>
                                <div className="flex items-center space-x-1">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                    <span className="text-[10px] text-blue-100 uppercase tracking-tighter">Secure & Encrypted</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Contact Selector (if Doctor) */}
                    {role === 'DOCTOR' && contacts.length > 1 && (
                        <div className="p-2 border-b bg-gray-50 flex space-x-2 overflow-x-auto no-scrollbar">
                            {contacts.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedContact(c)}
                                    className={`text-[10px] whitespace-nowrap px-3 py-1 rounded-full border transition ${
                                        selectedContact?.id === c.id 
                                        ? 'bg-blue-600 text-white border-blue-600' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                                    }`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Message List */}
                    <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-3">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-2">
                                <ShieldCheck className="w-12 h-12" />
                                <p className="text-xs italic">Start a secure clinical conversation</p>
                            </div>
                        ) : (
                            messages.map((m) => {
                                const isMe = (role === 'DOCTOR' && m.senderRole === 'DOCTOR') || 
                                             (role === 'PATIENT' && m.senderRole === 'PATIENT');
                                return (
                                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                                            isMe 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                        }`}>
                                            <p>{m.content}</p>
                                            <p className={`text-[9px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 border-t bg-white flex items-center space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type health query..."
                            className="flex-grow text-sm border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 p-2.5 transition"
                        />
                        <button 
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition shadow-lg shadow-blue-200"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                title="Clinical Support"
                className={`flex items-center p-4 rounded-2xl border transition shadow-2xl transform active:scale-95 group relative ${
                    isOpen 
                    ? 'bg-gray-800 text-white border-gray-700 translate-y-[-10px]' 
                    : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 hovr:translate-y-[-5px]'
                }`}
            >
                <div className="relative">
                    {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                    {!isOpen && unreadCount > 0 && (
                        <div className="absolute -top-6 -right-5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-bounce">
                            {unreadCount}
                        </div>
                    )}
                </div>
                
                {!isOpen && (
                    <div className={`overflow-hidden transition-all duration-700 ease-in-out flex items-center ${showLabel ? 'max-w-xs' : 'max-w-0 group-hover:max-w-xs'}`}>
                        <span className="font-bold text-sm pr-2 whitespace-nowrap pl-2">Clinical Support</span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
