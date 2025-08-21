import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! 👋 Welcome to Ink Dapper. I\'m here to help you with any questions about our t-shirts, orders, shipping, returns, or anything else. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const quickReplies = [
    'Order Status',
    'Product Information',
    'Shipping & Delivery',
    'Returns & Refunds',
    'Contact Support'
  ];

  const handleQuickReply = (reply) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: reply,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    handleBotResponse(reply);
  };

  const handleBotResponse = (userMessage) => {
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      let botResponse = '';

      switch (userMessage.toLowerCase()) {
        case 'order status':
          botResponse = '📦 **Order Tracking Information:**\n\nTo check your order status:\n\n1️⃣ **Profile Section** → Go to "Orders" in your account\n2️⃣ **Order Number** → Use your order number to track\n3️⃣ **Email Updates** → Check your email for tracking links\n4️⃣ **SMS Updates** → Receive real-time delivery updates\n\n**Order Status Flow:**\n🔄 Processing → 📤 Shipped → 🚚 Out for Delivery → ✅ Delivered\n\nNeed help with a specific order? Just share your order number!';
          break;
        case 'product information':
          botResponse = '👕 **Product Information:**\n\n**Available Sizes:**\n• XS (34-36" chest)\n• S (36-38" chest)\n• M (38-40" chest)\n• L (40-42" chest)\n• XL (42-44" chest)\n• XXL (44-46" chest)\n\n**Material:** 100% Premium Cotton\n**Features:** Unique artistic designs, comfortable fit\n\nBrowse our collection on the main page or search for specific styles. Need size recommendations?';
          break;
        case 'shipping & delivery':
          botResponse = '🚚 **Shipping Options:**\n\n**Standard Delivery:**\n⏱️ 3-5 business days\n💰 Free on orders above ₹999\n\n**Express Delivery:**\n⚡ 1-2 business days\n💰 Additional ₹200\n\n**Cash on Delivery:**\n💵 Available up to ₹2000\n\n**Real-time tracking** included with all orders! 📍';
          break;
        case 'returns & refunds':
          botResponse = '🔄 **Return Policy:**\n\n**Return Window:** 7 days from delivery\n**Free Returns:** For defective items\n**Easy Process:** Through your account\n\n**Steps:**\n1. Go to Orders section\n2. Select item to return\n3. Choose reason\n4. Print label\n5. Drop at pickup point\n\n**Refunds:** Processed in 3-5 business days 💰';
          break;
        case 'contact support':
          botResponse = '📞 **Contact Information:**\n\n**Email:** support@inkdapper.com\n**Phone:** +91 9994005696\n**Live Chat:** Available 24/7 (you\'re using it now!)\n\n**Support Hours:**\n📅 Mon-Sat: 9 AM - 6 PM\n📅 Sunday: 10 AM - 4 PM\n\n**Response Times:**\n📧 Email: Within 24 hours\n📞 Phone: Immediate during hours\n💬 Chat: Instant (like now!)';
          break;
        default:
          if (userMessage.toLowerCase().includes('order') || userMessage.toLowerCase().includes('track')) {
            botResponse = '📦 **Order Tracking:**\n\nTo track your order:\n1. Visit your profile → Orders section\n2. Enter your order number\n3. Check email for updates\n\nNeed your order number? Check your order confirmation email!';
          } else if (userMessage.toLowerCase().includes('size') || userMessage.toLowerCase().includes('fit')) {
            botResponse = '👕 **Size Guide:**\n\n**How to choose:**\n• Measure your chest circumference\n• Compare with our size chart\n• Consider your preferred fit (slim/regular)\n\n**Available:** XS, S, M, L, XL, XXL\n\nNeed help measuring? I can guide you through it!';
          } else if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('cost')) {
            botResponse = '💰 **Pricing Information:**\n\n**T-shirt Prices:**\n• Regular designs: ₹599-899\n• Premium designs: ₹799-1299\n• Custom designs: ₹999-1499\n\n**Free Shipping:** On orders above ₹999\n**Discounts:** Check our current offers!\n\nPrices may vary based on design complexity.';
          } else if (userMessage.toLowerCase().includes('delivery') || userMessage.toLowerCase().includes('shipping')) {
            botResponse = '🚚 **Delivery Information:**\n\n**Standard:** 3-5 days (Free above ₹999)\n**Express:** 1-2 days (+₹200)\n**COD:** Available up to ₹2000\n\n**Tracking:** Real-time updates via email\n**Insurance:** All packages insured\n\nWhere are you located? I can give you specific delivery times!';
          } else {
            botResponse = 'Thank you for your message! 🤗 I\'m here to help with:\n\n📦 Order tracking & status\n👕 Product information & sizes\n🚚 Shipping & delivery\n🔄 Returns & refunds\n📞 Contact support\n💰 Pricing & offers\n\nWhat would you like to know more about?';
          }
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    handleBotResponse(inputMessage);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button - Only show when chat is closed */}
      {!isOpen && (
        <div className="fixed bottom-16 left-2 md:bottom-16 md:right-5 md:left-auto z-50">
          <button
            onClick={toggleChat}
            className="w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-4 top-16 md:top-auto bottom-4 md:bottom-24 md:right-6 md:inset-auto md:w-80 md:h-[70vh] w-[80%] h-[calc(80vh-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 md:p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm truncate">Ink Dapper Support</h3>
                  <p className="text-xs text-orange-100 truncate">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to="/chatbot"
                  className="hidden md:block text-xs text-orange-100 hover:text-white transition-colors duration-200 underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Full Chat
                </Link>
                <button
                  onClick={closeChat}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white transition-all duration-200 flex items-center justify-center rounded-full hover:scale-110"
                >
                  <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-xs px-3 py-2 md:px-4 md:py-2 rounded-2xl ${message.type === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  <div className="whitespace-pre-line text-sm leading-relaxed break-words">{message.content}</div>
                  <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && !isTyping && (
            <div className="px-3 md:px-4 pb-2 flex-shrink-0">
              <div className="flex flex-wrap gap-1 md:gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-2 py-1 md:px-3 md:py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors duration-200 whitespace-nowrap"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 md:p-4 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
