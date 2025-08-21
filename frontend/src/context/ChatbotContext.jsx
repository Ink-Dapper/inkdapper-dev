import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! 👋 Welcome to Ink Dapper. I\'m here to help you with any questions about our t-shirts, orders, or anything else. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const openChat = () => {
    setIsChatOpen(true);
    setUnreadCount(0);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    if (isChatOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const addMessage = (message) => {
    setChatMessages(prev => [...prev, message]);
    if (message.type === 'bot' && !isChatOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const sendMessage = async (content) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    addMessage(userMessage);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(content);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      addMessage(botMessage);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    if (message.includes('order') || message.includes('track')) {
      return 'To track your order, please visit the "Orders" section in your profile or provide your order number. You can also track your order in real-time through our tracking system.';
    }

    if (message.includes('product') || message.includes('size') || message.includes('material')) {
      return 'We offer a wide range of high-quality t-shirts in various sizes, colors, and designs. Our products are made from premium cotton and feature unique, artistic designs. You can browse our collection on the main page or use the search function to find specific items.';
    }

    if (message.includes('shipping') || message.includes('delivery')) {
      return 'We offer fast and reliable shipping across India. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days. Free shipping is available on orders above ₹999. You can track your order in real-time once it\'s shipped.';
    }

    if (message.includes('return') || message.includes('refund')) {
      return 'We have a hassle-free return policy. You can return items within 7 days of delivery if they don\'t meet your expectations. Refunds are processed within 3-5 business days. Please ensure the item is in original condition with tags attached.';
    }

    if (message.includes('contact') || message.includes('support')) {
      return 'You can reach our support team at support@inkdapper.com or call us at +91 9994005696. Our team is available Monday to Saturday, 9 AM to 6 PM. We\'re here to help with any questions or concerns!';
    }

    return 'Thank you for your message! I\'m here to help with any questions about our products, orders, shipping, or returns. Feel free to ask anything specific or use the quick reply options below.';
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: Date.now(),
        type: 'bot',
        content: 'Hello! 👋 Welcome to Ink Dapper. I\'m here to help you with any questions about our t-shirts, orders, or anything else. How can I assist you today?',
        timestamp: new Date()
      }
    ]);
    setUnreadCount(0);
  };

  const value = {
    isChatOpen,
    chatMessages,
    isTyping,
    unreadCount,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    clearChat,
    addMessage
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};
