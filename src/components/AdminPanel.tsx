import React, { useState, useEffect } from 'react';
import { BarChart, Users, MessageSquare, Trash2 } from 'lucide-react';
import DatabaseService from '../services/dbService';

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMessages: 0,
    avgMessagesPerSession: 0
  });
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const db = DatabaseService.getInstance();

  useEffect(() => {
    loadStats();
    loadSessions();
  }, []);

  const loadStats = async () => {
    const chatStats = await db.getSessionStats();
    setStats(chatStats);
  };

  const loadSessions = async () => {
    const messages = await db.getSessionMessages('all');
    const uniqueSessions = [...new Set(messages.map(msg => msg.sessionId))];
    setSessions(uniqueSessions);
    setIsLoading(false);
  };

  const handleSessionSelect = async (sessionId: string) => {
    setSelectedSession(sessionId);
    const messages = await db.getSessionMessages(sessionId);
    setSessionMessages(messages);
  };

  const handleClearSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      await db.clearSession(sessionId);
      loadStats();
      loadSessions();
      if (selectedSession === sessionId) {
        setSelectedSession(null);
        setSessionMessages([]);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-notion p-6">
      <h2 className="text-2xl font-bold mb-6">Chat Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="text-accent mr-2" />
            <h3 className="font-semibold">Total Sessions</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalSessions}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <MessageSquare className="text-accent mr-2" />
            <h3 className="font-semibold">Total Messages</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalMessages}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <BarChart className="text-accent mr-2" />
            <h3 className="font-semibold">Avg Messages/Session</h3>
          </div>
          <p className="text-2xl font-bold">
            {stats.avgMessagesPerSession.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h3 className="font-semibold mb-4">Chat Sessions</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sessions.map((sessionId) => (
              <div
                key={sessionId}
                className={`flex items-center justify-between p-3 rounded cursor-pointer ${
                  selectedSession === sessionId
                    ? 'bg-accent text-primary'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <button
                  onClick={() => handleSessionSelect(sessionId)}
                  className="flex-grow text-left"
                >
                  {new Date(parseInt(sessionId.split('_')[1])).toLocaleString()}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearSession(sessionId);
                  }}
                  className="p-1 hover:text-red-500"
                  aria-label="Delete session"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <h3 className="font-semibold mb-4">Chat History</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedSession ? (
              sessionMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    msg.isUser
                      ? 'bg-accent text-primary ml-auto max-w-[80%]'
                      : 'bg-gray-50 max-w-[80%]'
                  }`}
                >
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                  <p>{msg.message}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                Select a session to view chat history
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;