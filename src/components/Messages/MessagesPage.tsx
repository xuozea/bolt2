import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatList from '../Chat/ChatList';
import ChatWindow from '../Chat/ChatWindow';

const MessagesPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<{ businessId: string; businessName: string } | null>(null);

  const handleChatSelect = (businessId: string, businessName: string) => {
    setSelectedChat({ businessId, businessName });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <ChatList onChatSelect={handleChatSelect} />
        </div>

        {/* Chat Window or Empty State */}
        <div className="lg:col-span-2">
          {selectedChat ? (
            <div className="relative h-[600px]">
              <ChatWindow
                businessId={selectedChat.businessId}
                businessName={selectedChat.businessName}
                onClose={() => setSelectedChat(null)}
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="apple-glass-card h-[600px] flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Select a conversation
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Choose a business from the list to start chatting
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;