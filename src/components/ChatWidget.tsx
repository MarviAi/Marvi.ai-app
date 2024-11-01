import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { sendMessage } from '../services/chatService';
import DatabaseService from '../services/dbService';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const db = DatabaseService.getInstance();

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 2000);

    setSessionId(`chat_${Date.now()}`);

    return () => clearTimeout(timer);
  }, []);

  const toggleChat = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    if (!isOpen && messages.length === 0) {
      const welcomeMessage = "Hi there! 👋 I'm MΛRVI, your AI assistant. How can I help you today?";
      setMessages([{ text: welcomeMessage, isUser: false }]);
      db.addMessage(sessionId, welcomeMessage, false);
    }
  };

  const simulateTyping = async (text: string, delay: number = 50) => {
    const words = text.split(' ');
    let currentText = '';

    for (const word of words) {
      currentText += (currentText ? ' ' : '') + word;
      setStreamingMessage(currentText);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return currentText;
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = { text: inputMessage, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    await db.addMessage(sessionId, inputMessage, true);
    setInputMessage('');
    setIsLoading(true);
    setStreamingMessage('');

    try {
      const response = await sendMessage(inputMessage);
      setStreamingMessage('');
      await simulateTyping(response);
      setMessages(prevMessages => [...prevMessages, { text: response, isUser: false }]);
      await db.addMessage(sessionId, response, false);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = "I apologize, but I'm having trouble processing your request. Please try again later.";
      setStreamingMessage('');
      await simulateTyping(errorMessage);
      setMessages(prevMessages => [...prevMessages, { text: errorMessage, isUser: false }]);
      await db.addMessage(sessionId, errorMessage, false);
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className={`bg-accent text-primary p-3 rounded-full shadow-notion hover:opacity-90 transition-opacity ${hasAnimated ? 'animate-chatbot-grow' : 'opacity-0'}`}
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-notion w-[85vw] sm:w-[350px] h-[80vh] max-h-[600px] flex flex-col chat-widget">
          <div className="bg-gray-800 p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold text-[#DAFF00]">Chat with MΛRVI</h3>
            <button onClick={toggleChat} aria-label="Close chat" className="text-[#DAFF00] hover:text-accent">
              <X size={20} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.isUser ? 'text-right' : 'text-left flex items-start'
                }`}
              >
                {!message.isUser && (
                  <img
                    src="https://dl.dropboxusercontent.com/scl/fi/86il34hz641dbh825gsda/marvi-logo-Black.svg?rlkey=xlpb3uynr6k1wu1jht3fjjcn9&st=vbqxvvle&dl=0"
                    alt="Marvi Logo"
                    className="w-6 h-6 mr-2 mt-1 flex-shrink-0"
                  />
                )}
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.isUser
                      ? 'bg-accent text-primary'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
            {streamingMessage && (
              <div className="mb-2 text-left flex items-start">
                <img
                  src="https://dl.dropboxusercontent.com/scl/fi/86il34hz641dbh825gsda/marvi-logo-Black.svg?rlkey=xlpb3uynr6k1wu1jht3fjjcn9&st=vbqxvvle&dl=0"
                  alt="Marvi Logo"
                  className="w-6 h-6 mr-2 mt-1 flex-shrink-0"
                />
                <span className="inline-block p-2 rounded-lg bg-gray-200 text-gray-800">
                  {streamingMessage}
                  <span className="inline-block w-1 h-4 bg-gray-500 ml-1 animate-blink"></span>
                </span>
              </div>
            )}
            {isLoading && !streamingMessage && (
              <div className="text-center text-gray-500 flex items-center justify-start">
                <img
                  src="https://dl.dropboxusercontent.com/scl/fi/86il34hz641dbh825gsda/marvi-logo-Black.svg?rlkey=xlpb3uynr6k1wu1jht3fjjcn9&st=vbqxvvle&dl=0"
                  alt="Marvi Logo"
                  className="w-6 h-6 mr-2"
                />
                <span>MΛRVI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t">
            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-grow input-field mr-2"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="btn-gray p-2"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;