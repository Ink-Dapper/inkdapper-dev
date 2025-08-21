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
      return '📦 **Order Tracking Information:**\n\nTo check your order status:\n\n1️⃣ **Profile Section** → Go to "Orders" in your account\n2️⃣ **Order Number** → Use your order number to track\n3️⃣ **Email Updates** → Check your email for tracking links\n4️⃣ **SMS Updates** → Receive real-time delivery updates\n\n**Order Status Flow:**\n🔄 Processing → 📤 Shipped → 🚚 Out for Delivery → ✅ Delivered\n\nNeed help with a specific order? Just share your order number!';
    }

    if (message.includes('product') || message.includes('size') || message.includes('material')) {
      return '👕 **Product Information & Size Guide:**\n\n**Available Sizes:**\n• **XS** (34-36" chest) - Slim fit\n• **S** (36-38" chest) - Regular fit\n• **M** (38-40" chest) - Regular fit\n• **L** (40-42" chest) - Regular fit\n• **XL** (42-44" chest) - Comfortable fit\n• **XXL** (44-46" chest) - Comfortable fit\n\n**Material & Quality:**\n• **Fabric:** 100% Premium Cotton\n• **Weight:** 180 GSM (comfortable for all seasons)\n• **Features:** Breathable, soft, durable\n• **Designs:** Unique artistic prints, vibrant colors\n\nNeed help measuring or size recommendations?';
    }

    if (message.includes('shipping') || message.includes('delivery')) {
      return '🚚 **Shipping & Delivery Information:**\n\n**Available Shipping Options:**\n\n**Standard Delivery:**\n⏱️ **Time:** 3-5 business days\n💰 **Cost:** Free on orders above ₹999\n📦 **Tracking:** Real-time updates\n\n**Express Delivery:**\n⚡ **Time:** 1-2 business days\n💰 **Cost:** Additional ₹200\n📦 **Priority handling**\n\n**Cash on Delivery (COD):**\n💵 **Available:** Up to ₹2000\n🔒 **Secure:** Pay on delivery\n📱 **SMS confirmation**\n\n**Real-time tracking** included with all orders! 📍';
    }

    if (message.includes('return') || message.includes('refund')) {
      return '🔄 **Return & Refund Policy:**\n\n**Return Window:** 7 days from delivery date\n**Free Returns:** For defective items\n**Easy Process:** Through your account\n\n**Return Process Steps:**\n1️⃣ Go to your Orders section\n2️⃣ Select the item to return\n3️⃣ Choose return reason\n4️⃣ Print return label\n5️⃣ Pack item securely\n6️⃣ Drop at nearest pickup point\n\n**Refunds:** Processed in 3-5 business days 💰';
    }

    if (message.includes('contact') || message.includes('support')) {
      return '📞 **Contact Support Information:**\n\n**Multiple Ways to Reach Us:**\n\n**📧 Email Support:**\n• **Address:** support@inkdapper.com\n• **Response Time:** Within 24 hours\n\n**📞 Phone Support:**\n• **Number:** +91 9994005696\n• **Hours:** Mon-Sat 9 AM - 6 PM\n\n**💬 Live Chat:**\n• **Available:** 24/7 (you\'re using it now!)\n• **Response:** Instant\n\n**📱 WhatsApp Support:**\n• **Number:** +91 9994005696\n• **Hours:** Mon-Sat 9 AM - 6 PM\n\nWe\'re here to help! 🎯';
    }

    if (message.includes('price') || message.includes('cost')) {
      return '💰 **Pricing Information:**\n\n**T-shirt Price Range:**\n• **Regular Designs:** ₹599 - ₹899\n• **Premium Designs:** ₹799 - ₹1299\n• **Custom Designs:** ₹999 - ₹1499\n• **Limited Edition:** ₹899 - ₹1599\n\n**Shipping Costs:**\n• **Free Shipping:** On orders above ₹999\n• **Standard Delivery:** ₹99 (below ₹999)\n• **Express Delivery:** +₹200\n• **COD:** No additional charge\n\n**Discounts & Offers:**\n• **First Order:** 10% off\n• **Bulk Orders:** 15% off (5+ items)\n• **Student Discount:** 5% off\n• **Seasonal Sales:** Up to 50% off\n\nPrices may vary based on design complexity and current offers!';
    }

    if (message.includes('account') || message.includes('profile')) {
      return '👤 **Account & Profile Management:**\n\n**Profile Settings:**\n• **Personal Information:** Update name, email, phone\n• **Password:** Change password securely\n• **Addresses:** Manage delivery addresses\n• **Preferences:** Communication preferences\n\n**Order Management:**\n📋 **Order History:** View all past orders\n📄 **Invoices:** Download order invoices\n📦 **Current Orders:** Track active orders\n❤️ **Wishlist:** Save favorite items\n\n**Account Features:**\n🔔 **Notifications:** Order updates, offers\n💳 **Payment Methods:** Saved cards, UPI\n🎁 **Rewards:** Loyalty points, discounts\n\nNeed help with your account?';
    }

    return 'Thank you for your message! 🤗 I\'m here to help with:\n\n📦 **Order tracking & status**\n👕 **Product information & sizes**\n🚚 **Shipping & delivery**\n🔄 **Returns & refunds**\n📞 **Contact support**\n💰 **Pricing & offers**\n👤 **Account management**\n🎁 **Discounts & promotions**\n\nWhat would you like to know more about? Feel free to ask anything specific!';
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
