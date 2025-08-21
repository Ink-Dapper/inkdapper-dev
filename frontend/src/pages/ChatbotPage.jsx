import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! 👋 Welcome to Ink Dapper Support. I\'m here to help you with any questions about our t-shirts, orders, shipping, returns, or anything else. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const categories = [
    {
      id: 'orders',
      title: 'Orders & Tracking',
      icon: '📦',
      description: 'Check order status, track packages, and manage orders'
    },
    {
      id: 'products',
      title: 'Products & Collection',
      icon: '👕',
      description: 'Learn about our t-shirts, sizes, materials, and designs'
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery',
      icon: '🚚',
      description: 'Shipping options, delivery times, and tracking'
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: '🔄',
      description: 'Return policy, refund process, and exchanges'
    },
    {
      id: 'support',
      title: 'Contact Support',
      icon: '📞',
      description: 'Get in touch with our customer support team'
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: '👤',
      description: 'Account management, profile settings, and preferences'
    }
  ];

  const quickReplies = [
    'How do I track my order?',
    'What are your shipping options?',
    'How do I return an item?',
    'What sizes do you offer?',
    'How can I contact support?'
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: `I need help with ${category.title.toLowerCase()}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    handleBotResponse(category.id);
  };

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

    setTimeout(() => {
      let botResponse = '';
      let suggestions = [];

      switch (userMessage.toLowerCase()) {
        case 'orders':
        case 'how do i track my order?':
          botResponse = 'To track your order, you can:\n\n1. **Visit your profile** → Go to "Orders" section\n2. **Use order number** → Enter your order number in the tracking field\n3. **Check email** → We send tracking updates via email\n\nYour order status will show: Processing → Shipped → Out for Delivery → Delivered';
          suggestions = ['What if my order is delayed?', 'Can I change my delivery address?', 'How long does processing take?'];
          break;
        case 'products':
        case 'what sizes do you offer?':
          botResponse = 'We offer t-shirts in the following sizes:\n\n• **XS** (34-36 inches chest)\n• **S** (36-38 inches chest)\n• **M** (38-40 inches chest)\n• **L** (40-42 inches chest)\n• **XL** (42-44 inches chest)\n• **XXL** (44-46 inches chest)\n\nOur t-shirts are made from 100% premium cotton and feature unique, artistic designs. Each design is carefully crafted for comfort and style.';
          suggestions = ['What materials do you use?', 'Do you have plus sizes?', 'How do I choose the right size?'];
          break;
        case 'shipping':
        case 'what are your shipping options?':
          botResponse = 'We offer multiple shipping options:\n\n🚚 **Standard Delivery** (3-5 business days)\n💰 Free on orders above ₹999\n\n⚡ **Express Delivery** (1-2 business days)\n💰 Additional ₹200\n\n📦 **Cash on Delivery**\n💰 Available for orders up to ₹2000\n\nAll orders are shipped with real-time tracking and insurance coverage.';
          suggestions = ['What if my package is lost?', 'Do you ship internationally?', 'Can I change delivery address?'];
          break;
        case 'returns':
        case 'how do i return an item?':
          botResponse = 'Our hassle-free return process:\n\n✅ **7-day return window** from delivery date\n✅ **Free returns** for defective items\n✅ **Easy process** through your account\n\n**Steps to return:**\n1. Go to your Orders section\n2. Select the item to return\n3. Choose return reason\n4. Print return label\n5. Drop at nearest pickup point\n\nRefunds are processed within 3-5 business days.';
          suggestions = ['What if item is damaged?', 'Can I exchange for different size?', 'How long do refunds take?'];
          break;
        case 'support':
        case 'how can i contact support?':
          botResponse = 'We\'re here to help! Contact us through:\n\n📧 **Email:** support@inkdapper.com\n📞 **Phone:** +91 9994005696\n💬 **Live Chat:** Available 24/7 (this chat!)\n\n**Support Hours:**\nMonday - Saturday: 9 AM - 6 PM\nSunday: 10 AM - 4 PM\n\n**Response Time:**\n• Email: Within 24 hours\n• Phone: Immediate during business hours\n• Chat: Instant (like now!)';
          suggestions = ['What if I need urgent help?', 'Can I speak to a manager?', 'Do you have a FAQ section?'];
          break;
        case 'account':
          botResponse = 'Manage your account easily:\n\n👤 **Profile Settings**\n• Update personal information\n• Change password\n• Manage addresses\n\n📋 **Order History**\n• View all past orders\n• Download invoices\n• Track current orders\n\n❤️ **Wishlist**\n• Save favorite items\n• Get notified of restocks\n\n🔔 **Notifications**\n• Order updates\n• New arrivals\n• Special offers';
          suggestions = ['How do I change my password?', 'Can I delete my account?', 'How do I update my address?'];
          break;
        default:
          botResponse = 'Thank you for your message! I\'m here to help with any questions about our products, orders, shipping, returns, or account management. Feel free to ask anything specific or choose from the categories below.';
          suggestions = ['Tell me about your products', 'How do I place an order?', 'What\'s your return policy?'];
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        suggestions: suggestions
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-semibold">Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ink Dapper Support</h1>
                <p className="text-sm text-gray-500">Live Chat Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">How can we help?</h2>
              <div className="space-y-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-orange-700">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Chat with Support</h2>
                    <p className="text-orange-100">We're here to help you 24/7</p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-lg px-4 py-3 rounded-2xl ${message.type === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      <div className="whitespace-pre-line text-sm">{message.content}</div>
                      <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickReply(suggestion)}
                              className="block w-full text-left px-3 py-2 text-xs bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl">
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
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="px-4 py-2 text-sm bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors duration-200"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-200 p-6">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Send</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
