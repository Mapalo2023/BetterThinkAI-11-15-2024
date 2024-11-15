import React, { createContext, useContext, useCallback } from 'react';

interface ChatMessage {
  type: string;
  data: Record<string, any>;
}

interface ChatContextType {
  sendMessage: (message: ChatMessage) => void;
  subscribeToMessages: (callback: (message: ChatMessage) => void) => () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const subscribers = React.useRef<((message: ChatMessage) => void)[]>([]);

  const sendMessage = useCallback((message: ChatMessage) => {
    subscribers.current.forEach(callback => callback(message));
  }, []);

  const subscribeToMessages = useCallback((callback: (message: ChatMessage) => void) => {
    subscribers.current.push(callback);
    return () => {
      subscribers.current = subscribers.current.filter(cb => cb !== callback);
    };
  }, []);

  return (
    <ChatContext.Provider value={{ sendMessage, subscribeToMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}