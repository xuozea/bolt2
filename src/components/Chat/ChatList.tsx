import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { chatService } from '../../services/chatService';
import { format } from 'date-fns';

interface Chat {
  id: string;
  businessId: string;
  businessName: string;
  lastMessage: string;
  lastMessageTime: any;
  unreadCount: number;
}

interface ChatListProps {
  onChatSelect: (businessId: string, businessName: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = chatService.subscribeToUserChats(currentUser.uid, setChats);
    return unsubscribe;
  }, [currentUser]);

  const filteredChats = chats.filter(chat =>
    chat.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else {
      return format(date, 'MMM dd');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="apple-glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Messages
          </h2>
          <MessageCircle className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                 style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="apple-input w-full pl-10"
          />
        </div>

        {/* Chat List */}
        <div className="space-y-2">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChatSelect(chat.businessId, chat.businessName)}
                className="p-4 rounded-lg cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {chat.businessName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {chat.businessName}
                      </h3>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No conversations yet</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Start chatting with businesses to see them here
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ChatList;