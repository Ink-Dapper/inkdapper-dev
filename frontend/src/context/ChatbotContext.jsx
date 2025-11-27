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
      content: 'Hello! 👋 Welcome to Ink Dapper. I\'m here to help you with any questions about our t-shirts, orders, shipping, returns, or anything else. How can I assist you today?',
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
      return '📦 Order tracking information:\n\nTo check your order status:\n\n1. Go to the Orders section in your account profile\n2. Use your order number to track the order\n3. Check your email for tracking links\n4. Watch for SMS updates with delivery details\n\nOrder status usually moves from Processing, to Shipped, to Out for delivery, to Delivered.\n\nNeed help with a specific order? You can share your order number.';
    }

    if (message.includes('product') || message.includes('size') || message.includes('material')) {
      return '👕 Product information and size guide:\n\nAvailable sizes:\n- XS (34–36" chest) – slim fit\n- S (36–38" chest) – regular fit\n- M (38–40" chest) – regular fit\n- L (40–42" chest) – regular fit\n- XL (42–44" chest) – comfortable fit\n- XXL (44–46" chest) – comfortable fit\n\nMaterial and quality:\n- Fabric: 100% premium cotton\n- Weight: around 180 GSM, comfortable for all seasons\n- Features: breathable, soft and durable\n- Designs: unique artistic prints with vibrant colors\n\nYou can ask for help with measurements or size recommendations.';
    }

    if (message.includes('shipping') || message.includes('delivery')) {
      return '🚚 Shipping and delivery information:\n\nStandard delivery:\n- Time: 3–5 business days\n- Cost: free on orders above ₹999\n- Tracking: real-time updates\n\nExpress delivery:\n- Time: 1–2 business days\n- Cost: additional ₹200\n- Priority handling\n\nCash on delivery (COD):\n- Available up to ₹2000\n- Secure payment on delivery\n- SMS confirmation\n\nReal-time tracking is included with all orders.';
    }

    if (message.includes('return') || message.includes('refund')) {
      return '🔄 Return and refund policy:\n\nReturn window: 7 days from delivery date.\nFree returns are available for defective items.\nYou can start a return from your account.\n\nReturn process steps:\n1. Go to your Orders section\n2. Select the item you want to return\n3. Choose a return reason\n4. Print the return label (if provided)\n5. Pack the item securely\n6. Drop it at the nearest pickup point\n\nRefunds are usually processed in 3–5 business days.';
    }

    if (message.includes('contact') || message.includes('support')) {
      return '📞 Contact support information:\n\nEmail support:\n- Address: support@inkdapper.com\n- Typical response time: within 24 hours\n\nPhone support:\n- Number: +91 9994005696\n- Hours: Monday to Saturday, 9 AM – 6 PM\n\nLive chat:\n- Available 24/7 here on the website\n- Best for quick questions\n\nWhatsApp support:\n- Number: +91 9994005696\n- Hours: Monday to Saturday, 9 AM – 6 PM\n\nWe are here to help you.';
    }

    if (message.includes('price') || message.includes('cost')) {
      return '💰 Pricing information:\n\nT-shirt price range:\n- Regular designs: about ₹599 – ₹899\n- Premium designs: about ₹799 – ₹1299\n- Custom designs: about ₹999 – ₹1499\n- Limited edition: about ₹899 – ₹1599\n\nShipping costs:\n- Free shipping on orders above ₹999\n- Standard delivery: ₹99 for orders below ₹999\n- Express delivery: +₹200\n- COD: no additional charge\n\nDiscounts and offers may be available depending on current promotions.';
    }

    if (message.includes('account') || message.includes('profile')) {
      return '👤 Account and profile management:\n\nProfile settings:\n- Update your name, email and phone number\n- Change your password securely\n- Manage your delivery addresses\n- Adjust communication preferences\n\nOrder management:\n- View your full order history\n- Download invoices\n- Track active orders\n- Save favourite items using the wishlist\n\nAccount features:\n- Receive notifications about orders and offers\n- Save payment methods such as cards or UPI\n- Earn loyalty-style discounts when available\n\nYou can ask for help with any specific account task.';
    }

    return 'Thank you for your message. I am your Ink Dapper virtual assistant and I can help with:\n\n📦 Order tracking and status\n👕 Product information and sizes\n🚚 Shipping and delivery\n🔄 Returns and refunds\n📞 Contacting support\n💰 Pricing and offers\n👤 Account management\n\nTell me what you want to know more about, or ask a specific question.';
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: Date.now(),
        type: 'bot',
        content: 'Hello! 👋 Welcome to Ink Dapper. I\'m here to help you with any questions about our t-shirts, orders, shipping, returns, or anything else. How can I assist you today?',
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
