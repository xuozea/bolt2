import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { chatService } from '../../services/chatService';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: any;
  type: 'text' | 'image' | 'file';
  read: boolean;
}

interface ChatWindowProps {
  businessId: string;
  businessName: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ businessId, businessName, onClose }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = chatService.subscribeToMessages(
      currentUser.uid,
      businessId,
      setMessages
    );

    return unsubscribe;
  }, [currentUser, businessId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    setLoading(true);
    try {
      await chatService.sendMessage({
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email || 'User',
        receiverId: businessId,
        message: newMessage.trim(),
        type: 'text'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'HH:mm');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-4 right-4 w-96 h-[500px] apple-glass-card flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {businessName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {businessName}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-blue-100 transition-colors">
            <Phone className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          </button>
          <button className="p-2 rounded-lg hover:bg-blue-100 transition-colors">
            <Video className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          </button>
          <button className="p-2 rounded-lg hover:bg-blue-100 transition-colors">
            <MoreVertical className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.senderId === currentUser?.uid
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
              style={{
                color: message.senderId === currentUser?.uid ? 'white' : 'var(--text-primary)'
              }}
            >
              <p className="text-sm">{message.message}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === currentUser?.uid ? 'text-white/70' : 'opacity-60'
              }`}>
                {formatMessageTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Paperclip className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="apple-input w-full pr-10"
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Smile className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatWindow;