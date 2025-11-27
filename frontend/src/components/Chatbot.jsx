import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import apiInstance from '../utils/axios';
import { ShopContext } from '../context/ShopContext';

const Chatbot = () => {
  const { products } = useContext(ShopContext) || { products: [] };
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! 👋 I\'m iD Bot, your AI assistant. I\'m here to help you with any questions about our t-shirts, orders, shipping, returns, or anything else. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingOrderQuery, setPendingOrderQuery] = useState(null); // store context like "waiting for order id"
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
    'Latest Order Status',
    'Product Information',
    'Shipping & Delivery',
    'Returns & Refunds',
    'Contact Support'
  ];

  const extractOrderIdentifier = (message) => {
    const lower = message.toLowerCase();

    if (lower.includes('latest order') || lower.includes('recent order')) {
      return { type: 'latest' };
    }

    // Try to find something that looks like an order id / last 6–10 chars
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

    msg += `\nYou can see full details and track this order live in the My Orders section of your account.`;
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
      console.error('Error fetching order details in chatbot:', error);
      return 'Sorry, I had trouble fetching your order details right now. Please open the My Orders page or try again in a moment.';
    }
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

    // Simulate typing delay
    setTimeout(async () => {
      let botResponse = '';
      const lower = userMessage.toLowerCase();

      // If we asked for an order ID previously, treat this as the identifier response
      if (pendingOrderQuery) {
        const identifier = extractOrderIdentifier(userMessage);
        botResponse = await fetchOrderFromBackend(identifier);
        setPendingOrderQuery(null);
      } else if (lower === 'order status' || lower === 'latest order status' || lower.includes('track my order')) {
        const identifier = extractOrderIdentifier(userMessage);

        if (!identifier) {
          setPendingOrderQuery({ reason: 'order-status' });
          botResponse =
            'To help you with order status, please reply with:\n\n' +
            '- Your order ID (for example, the last 8 characters shown as #XXXXXXXX in My Orders), or\n' +
            '- Type: latest order, to see the status of your most recent order.';
        } else {
          botResponse = await fetchOrderFromBackend(identifier);
        }
      } else {
        switch (lower) {
          case 'product information':
            botResponse =
              '👕 Product information:\n\n' +
              'Available sizes: XS, S, M, L, XL, XXL\n' +
              'Material: 100% premium cotton (around 180 GSM)\n' +
              'Fit: Regular, comfortable everyday fit\n\n' +
              'Each product page shows detailed fabric, fit and care info. You can ask me about sizes, material, or a specific product if you need more help.';
            break;
          case 'shipping & delivery':
            botResponse =
              '🚚 Shipping options:\n\n' +
              'Standard delivery: 3–5 business days (free above ₹999)\n' +
              'Express delivery: 1–2 business days (+₹200)\n' +
              'Cash on delivery (COD): available up to ₹2000\n\n' +
              'All orders come with tracking, SMS or email updates and secure packaging.';
            break;
          case 'returns & refunds':
            botResponse =
              '🔄 Returns and refunds:\n\n' +
              'Return window: usually 7 days from delivery (see your order card for the exact date)\n' +
              'Return status: you can see live status in My Orders after you select the order\n' +
              'Refund time: typically 3–5 business days after the return is approved\n\n' +
              'If you share your order ID or type: latest order, I can check the current return or cancel status for you.';
            break;
          case 'contact support':
            botResponse =
              '📞 Contact support:\n\n' +
              'Email: support@inkdapper.com\n' +
              'Phone or WhatsApp: +91 9994005696\n' +
              'Support hours: Monday to Saturday, 9 AM – 6 PM, Sunday 10 AM – 4 PM\n\n' +
              'You can also continue here in live chat and I will guide you as much as possible.';
            break;
          default:
            if (lower.includes('order') || lower.includes('track')) {
              const identifier = extractOrderIdentifier(userMessage);
              if (!identifier) {
                setPendingOrderQuery({ reason: 'order-status' });
                botResponse =
                  '📦 To check your order details or tracking, please reply with:\n\n' +
                  '- Your order ID as shown in My Orders, or\n' +
                  '- Type: latest order, to see the most recent order on your account.';
              } else {
                botResponse = await fetchOrderFromBackend(identifier);
              }
            } else if (lower.includes('size') || lower.includes('fit')) {
              botResponse =
                '👕 Size and fit guide:\n\n' +
                '- Measure your chest circumference and compare it with our size chart\n' +
                '- Choose your usual size for a regular fit, or one size up for a relaxed fit\n' +
                '- Sizes available: XS, S, M, L, XL, XXL\n\n' +
                'If you tell me your height, weight and preferred fit, I can suggest a size.';
            } else if (lower.includes('price') || lower.includes('cost')) {
              botResponse =
                '💰 Pricing overview:\n\n' +
                '- Regular designs: around ₹599–₹899\n' +
                '- Premium or detailed designs: around ₹799–₹1299\n' +
                '- Custom or special editions may be higher\n\n' +
                'Look out for offers and coupons shown on the homepage and product pages.';
            } else if (lower.includes('delivery') || lower.includes('shipping')) {
              botResponse =
                '🚚 Delivery information:\n\n' +
                '- Standard: 3–5 working days (free above ₹999)\n' +
                '- Express: 1–2 working days (+₹200)\n' +
                '- COD: available up to ₹2000\n\n' +
                'You can always see your live tracking and exact dates in the My Orders section.';
            } else if (lower.includes('return') || lower.includes('refund')) {
              const identifier = extractOrderIdentifier(userMessage);
              if (!identifier) {
                setPendingOrderQuery({ reason: 'return-status' });
                botResponse =
                  '🔄 To check return or refund status, please reply with your order ID or type: latest order, so I can look it up.';
              } else {
                botResponse = await fetchOrderFromBackend(identifier);
              }
            } else if (lower.includes('support') || lower.includes('contact')) {
              botResponse =
                'You can reach support via email (support@inkdapper.com) or phone or WhatsApp (+91 9994005696) during business hours.\n\n' +
                'Tell me briefly what the issue is (order problem, product question, refund, etc.) and I’ll guide you before you contact them.';
            } else {
              // Check if user mentioned a product name
              const matchedProduct = searchProductByName(userMessage);
              
              if (matchedProduct) {
                const productLink = generateProductLink(matchedProduct);
                botResponse = `I found the product "${matchedProduct.name}"! 🎉\n\nClick the link below to view the product page:\n\n[View ${matchedProduct.name}](${productLink})\n\nPrice: ₹${matchedProduct.price || 'N/A'}\n\nWould you like to know more about this product or need help with something else?`;
                
                // Store product link in message for rendering
                const botMessage = {
                  id: Date.now() + 1,
                  type: 'bot',
                  content: botResponse,
                  timestamp: new Date(),
                  productLink: productLink,
                  productName: matchedProduct.name
                };
                
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);
                return; // Exit early since we've handled the product search
              }
              
              // Fallback to AI assistant for any other kind of question
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
              } catch (error) {
                console.error('AI chat error (floating chatbot):', error);
                console.error('Error details:', {
                  message: error.message,
                  response: error.response?.data,
                  status: error.response?.status,
                });
                
                // More helpful error message
                if (error.response?.status === 500) {
                  botResponse = error.response?.data?.message || 
                    'The AI assistant is temporarily unavailable. Please try again in a moment, or ask about orders, products, shipping or returns.';
                } else if (error.response?.status === 401) {
                  botResponse = 'AI service configuration issue. Please contact support.';
                } else {
                  botResponse = 'I had trouble connecting to the AI assistant. Please try again in a moment, or ask about orders, products, shipping or returns.';
                }
              }
            }
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
            className="w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 relative group"
          >
            {/* Animated Bot Icon */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 animate-pulse opacity-75"></div>
            <div className="relative z-10 flex items-center justify-center">
              <svg className="w-6 h-6 text-white animate-bounce group-hover:animate-none" style={{ animationDuration: '2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            {/* Pulsing notification ring */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window fixed inset-0 md:inset-auto md:bottom-24 md:right-6 md:w-80 md:h-[70vh] bg-white md:rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 md:p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 relative">
                  {/* Animated Bot Avatar */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 animate-pulse"></div>
                  <div className="relative z-10 flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white animate-bounce" style={{ animationDuration: '2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  {/* Pulsing ring animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h3 className="font-semibold text-sm truncate">iD Bot</h3>
                  <p className="text-xs text-orange-100 truncate">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
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
                  <div className="whitespace-pre-line text-sm leading-relaxed break-words overflow-hidden">
                    {message.content}
                    {message.productLink && (
                      <div className="mt-3">
                        <Link
                          to={message.productLink}
                          onClick={() => {
                            setIsOpen(false);
                            navigate(message.productLink);
                          }}
                          className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          View {message.productName} →
                        </Link>
                      </div>
                    )}
                  </div>
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

          {/* Quick Replies - always visible when not typing */}
          {!isTyping && (
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
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
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
