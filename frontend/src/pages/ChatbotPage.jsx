import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import apiInstance from '../utils/axios';

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
  const [pendingOrderQuery, setPendingOrderQuery] = useState(null);
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
    'Order status of my latest order',
    'How do I track my order?',
    'What are your shipping options?',
    'How do I return an item?',
    'What sizes do you offer?',
    'How can I contact support?'
  ];

  const extractOrderIdentifier = (message) => {
    const lower = message.toLowerCase();

    if (lower.includes('latest order') || lower.includes('recent order')) {
      return { type: 'latest' };
    }

    const idMatch = message.match(/([a-f0-9]{6,24})/i);
    if (idMatch) {
      return { type: 'id', value: idMatch[1] };
    }

    return null;
  };

  const buildOrderStatusMessage = (order) => {
    if (!order) {
      return 'I could not find an order with that ID in your account. Please double-check the order ID shown in your My Orders section or in your confirmation email.';
    }

    const shortId = order._id?.slice(-8) || '';
    const status = order.status || 'Not available';
    const expectedDelivery = order.expectedDeliveryDate
      ? new Date(order.expectedDeliveryDate).toLocaleDateString()
      : null;
    const deliveryDate = order.deliveryDate
      ? new Date(order.deliveryDate).toLocaleDateString()
      : null;
    const returnStatus = order.returnOrderStatus || 'No return/cancel request found';

    let msg = `📦 Order details for #${shortId}\n\n`;
    msg += `Current status: ${status}\n`;

    if (deliveryDate) {
      msg += `Delivered on: ${deliveryDate}\n`;
    } else if (expectedDelivery) {
      msg += `Expected delivery: ${expectedDelivery}\n`;
    }

    if (order.paymentMethod) {
      msg += `Payment method: ${order.paymentMethod}\n`;
    }

    if (order.amount) {
      msg += `Order amount: ₹${order.amount}\n`;
    }

    msg += `\nReturn / cancel status: ${returnStatus}\n`;

    if (order.returnDate) {
      const returnBy = new Date(order.returnDate).toLocaleDateString();
      msg += `Return window until: ${returnBy}\n`;
    }

    msg += `\nYou can see full order details and live tracking in the My Orders section of your account.`;
    return msg;
  };

  const fetchOrderFromBackend = async (identifier) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return 'To check your order status, please log in first. Once logged in, open the My Orders page or ask me again with your order ID.';
      }

      const response = await apiInstance.post('/order/user-details', {});
      const orders = response.data?.orders || [];

      if (!orders.length) {
        return 'I could not find any orders on your account yet. Once you place an order, you can ask me to track it using the order ID.';
      }

      let targetOrder = null;

      if (!identifier || identifier.type === 'latest') {
        targetOrder = orders[orders.length - 1];
      } else if (identifier.type === 'id') {
        const id = identifier.value;
        targetOrder =
          orders.find((o) => o._id === id) ||
          orders.find((o) => o._id && o._id.toLowerCase().endsWith(id.toLowerCase()));
      }

      return buildOrderStatusMessage(targetOrder);
    } catch (error) {
      console.error('Error fetching order details in chatbot page:', error);
      return 'Sorry, I had trouble fetching your order details right now. Please open the My Orders page or try again in a moment.';
    }
  };

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

    setTimeout(async () => {
      let botResponse = '';
      let suggestions = [];
      const lower = userMessage.toLowerCase();

      if (pendingOrderQuery) {
        const identifier = extractOrderIdentifier(userMessage);
        botResponse = await fetchOrderFromBackend(identifier);
        suggestions = ['What if my order is delayed?', 'How do I return this order?', 'How can I contact support?'];
        setPendingOrderQuery(null);
      } else if (lower.includes('order status') || lower.includes('track my order') || lower.includes('latest order')) {
        const identifier = extractOrderIdentifier(userMessage);
        if (!identifier) {
          setPendingOrderQuery({ reason: 'order-status' });
          botResponse =
            'To check your order status or tracking, please reply with:\n\n' +
            '- Your order ID (for example, the last 8 characters shown as #XXXXXXXX), or\n' +
            '- Type: latest order, to see the status of your most recent order.';
          suggestions = ['latest order', 'Where can I see my order ID?'];
        } else {
          botResponse = await fetchOrderFromBackend(identifier);
          suggestions = ['What if my order is delayed?', 'How do I return this order?', 'How can I contact support?'];
        }
      } else {
        switch (lower) {
          case 'orders':
          case 'how do i track my order?':
            botResponse =
              '📦 Order tracking information:\n\n' +
              'Best way to track:\n' +
              '1. Go to My Orders in your profile\n' +
              '2. Select the order (ID like #XXXXXXXX)\n' +
              '3. View live status and tracking timeline\n\n' +
              'You can also tell me your order ID or say: latest order, and I will fetch the status for you.';
            suggestions = ['latest order', 'Where can I see my order ID?'];
            break;
          case 'products':
          case 'what sizes do you offer?':
            botResponse =
              '👕 Product information and size guide:\n\n' +
              'Available sizes: XS, S, M, L, XL, XXL\n' +
              'Fabric: 100% premium cotton (around 180 GSM)\n' +
              'Fit: Regular and comfortable for daily wear\n\n' +
              'For each design, the product page shows detailed fabric, fit and care instructions.\n' +
              'Tell me your height, weight and fit preference and I can suggest a size.';
            suggestions = ['How do I choose the right size?', 'Are your t-shirts pre-shrunk?', 'Do you have plus sizes?'];
            break;
          case 'shipping':
          case 'what are your shipping options?':
            botResponse =
              '🚚 Shipping and delivery information:\n\n' +
              'Standard delivery: 3–5 business days (free above ₹999)\n' +
              'Express delivery: 1–2 business days (+₹200)\n' +
              'COD: available up to ₹2000\n\n' +
              'Coverage: pan India with tracking, SMS or email updates and secure packaging.';
            suggestions = ['Do you ship to my city?', 'What if my package is delayed?', 'Can I change my delivery address?'];
            break;
          case 'returns':
          case 'how do i return an item?':
            botResponse =
              '🔄 Return and refund policy:\n\n' +
              'Return window: usually 7 days from delivery (check your order card for the exact date)\n' +
              'How to start a return:\n' +
              '1. Go to My Orders\n' +
              '2. Select the order\n' +
              '3. Choose Return and fill in the reason\n\n' +
              'If you want me to check your return or refund status, share your order ID or type: latest order.';
            suggestions = ['Check return status of latest order', 'How long do refunds take?', 'What items are not returnable?'];
            break;
          case 'support':
          case 'how can i contact support?':
            botResponse =
              '📞 Contact support:\n\n' +
              'Email: support@inkdapper.com (reply within 24 hours)\n' +
              'Phone or WhatsApp: +91 9994005696 (Mon–Sat 9 AM – 6 PM)\n' +
              'Live chat: you are already here\n\n' +
              'Tell me your issue (order, product, refund, payment and so on) and I will guide you before you reach support.';
            suggestions = ['I have an issue with my order', 'Payment related issue', 'Refund not received'];
            break;
          case 'account':
            botResponse =
              '👤 Account and profile management:\n\n' +
              'You can update your name, email, phone, addresses and password from your profile.\n' +
              'In My Orders, you can see all past orders, invoices and live tracking.\n\n' +
              'If you tell me what you want to change (address, password and so on), I will give you exact steps.';
            suggestions = ['How do I change my password?', 'How do I update my address?', 'How can I see my past orders?'];
            break;
          default:
            if (lower.includes('order') || lower.includes('track')) {
              const identifier = extractOrderIdentifier(userMessage);
              if (!identifier) {
                setPendingOrderQuery({ reason: 'order-status' });
                botResponse =
                  '📦 To help with order details or tracking, please reply with your order ID or simply say: latest order, so I can look it up.';
                suggestions = ['latest order', 'Where can I see my order ID?'];
              } else {
                botResponse = await fetchOrderFromBackend(identifier);
                suggestions = ['What if my order is delayed?', 'How do I return this order?', 'How can I contact support?'];
              }
            } else if (lower.includes('size') || lower.includes('fit')) {
              botResponse =
                '👕 Size guide and fit:\n\n' +
                '- Measure your chest and compare it with our size chart on the product page\n' +
                '- Pick your usual size for a regular fit, one size up for a relaxed fit\n' +
                '- Sizes: XS, S, M, L, XL, XXL\n\n' +
                'Share your height, weight and fit preference, and I can suggest a size.';
              suggestions = ['How do I measure my chest?', 'What if the size does not fit?', 'Do you have size charts?'];
            } else if (lower.includes('price') || lower.includes('cost')) {
              botResponse =
                '💰 Pricing and offers:\n\n' +
                '- Regular designs: around ₹599–₹899\n' +
                '- Premium designs: around ₹799–₹1299\n' +
                '- Special or custom designs may be higher\n\n' +
                'Check the home page and product pages for active coupons and seasonal offers.';
              suggestions = ['Do you have any discounts?', 'What about bulk order pricing?', 'Is shipping free?'];
            } else if (lower.includes('delivery') || lower.includes('shipping')) {
              botResponse =
                '🚚 Delivery details:\n\n' +
                '- Standard: 3–5 working days (free above ₹999)\n' +
                '- Express: 1–2 working days (+₹200)\n' +
                '- COD: available up to ₹2000\n\n' +
                'You can always see exact dates and live tracking on the order card in My Orders.';
              suggestions = ['Do you deliver to my pincode?', 'What if my package is delayed?', 'Can I change my delivery address?'];
            } else if (lower.includes('return') || lower.includes('refund')) {
              const identifier = extractOrderIdentifier(userMessage);
              if (!identifier) {
                setPendingOrderQuery({ reason: 'return-status' });
                botResponse =
                  '🔄 For return or refund status, please reply with your order ID or type: latest order, and I will check it for you.';
                suggestions = ['Check return status of latest order', 'How long do refunds take?'];
              } else {
                botResponse = await fetchOrderFromBackend(identifier);
                suggestions = ['How long do refunds take?', 'What items are not returnable?'];
              }
            } else if (lower.includes('support') || lower.includes('contact')) {
              botResponse =
                'You can contact support by email (support@inkdapper.com) or phone or WhatsApp (+91 9994005696) during support hours.\n' +
                'Tell me briefly what the problem is (order, refund, payment, product, etc.) and I’ll guide you first.';
              suggestions = ['I have an issue with my order', 'Payment related issue', 'Refund not received'];
            } else {
              // Fallback to AI assistant for any other type of question
              try {
                const history = messages.map(m => ({
                  role: m.type === 'user' ? 'user' : 'assistant',
                  content: m.content,
                }));

                const response = await apiInstance.post('/chat/ai', {
                  message: userMessage,
                  history,
                });

                if (response.data?.success && response.data.reply) {
                  botResponse = response.data.reply;
                } else {
                  botResponse =
                    'I could not generate a detailed answer for that right now. Please try asking again in a moment or rephrase your question.';
                }

                suggestions = ['Ask about your order', 'Ask about products', 'Ask about shipping or returns'];
              } catch (error) {
                console.error('AI chat error (chat page):', error);
                console.error('Error details:', {
                  message: error.message,
                  response: error.response?.data,
                  status: error.response?.status,
                });
                
                // More helpful error message
                if (error.response?.status === 500) {
                  botResponse = error.response?.data?.message || 
                    'The AI assistant is temporarily unavailable. Please try again in a moment, or ask specifically about orders, products, shipping or returns.';
                } else if (error.response?.status === 401) {
                  botResponse = 'AI service configuration issue. Please contact support.';
                } else {
                  botResponse = 'I had trouble connecting to the AI assistant. Please try again in a moment, or ask specifically about orders, products, shipping or returns.';
                }
                suggestions = ['Order status of my latest order', 'What is your return policy?', 'How can I contact support?'];
              }
            }
        }
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
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-semibold text-sm md:text-base">Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">Ink Dapper Support</h1>
                <p className="text-xs md:text-sm text-gray-500 truncate">Live Chat Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 sticky top-24">
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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[500px] md:h-[600px]">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex-shrink-0">
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
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                      <div className="whitespace-pre-line text-sm leading-relaxed">{message.content}</div>
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

              {/* Quick Replies - always visible when not typing */}
              {!isTyping && (
                <div className="px-6 pb-4 flex-shrink-0">
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
              <div className="border-t border-gray-200 p-4 md:p-6 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex space-x-2 md:space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                    disabled={isTyping}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="sentences"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 md:space-x-2 text-sm md:text-base"
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
