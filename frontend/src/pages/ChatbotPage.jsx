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
          botResponse = '📦 **Order Tracking Information:**\n\n**How to Track Your Order:**\n\n1️⃣ **Profile Section** → Go to "Orders" in your account\n2️⃣ **Order Number** → Use your order number to track\n3️⃣ **Email Updates** → Check your email for tracking links\n4️⃣ **SMS Updates** → Receive real-time delivery updates\n\n**Order Status Flow:**\n🔄 Processing → 📤 Shipped → 🚚 Out for Delivery → ✅ Delivered\n\n**Need Help?**\n• Can\'t find your order? Check your email for order confirmation\n• Order number starts with "ID" followed by numbers\n• Contact us if you need assistance with tracking\n\nNeed help with a specific order? Just share your order number!';
          suggestions = ['What if my order is delayed?', 'Can I change my delivery address?', 'How long does processing take?', 'What if my package is lost?'];
          break;
        case 'products':
        case 'what sizes do you offer?':
          botResponse = '👕 **Product Information & Size Guide:**\n\n**Available Sizes:**\n• **XS** (34-36" chest) - Slim fit\n• **S** (36-38" chest) - Regular fit\n• **M** (38-40" chest) - Regular fit\n• **L** (40-42" chest) - Regular fit\n• **XL** (42-44" chest) - Comfortable fit\n• **XXL** (44-46" chest) - Comfortable fit\n\n**Material & Quality:**\n• **Fabric:** 100% Premium Cotton\n• **Weight:** 180 GSM (comfortable for all seasons)\n• **Features:** Breathable, soft, durable\n• **Designs:** Unique artistic prints, vibrant colors\n\n**How to Choose Your Size:**\n1. Measure your chest circumference\n2. Compare with our size chart\n3. Consider your preferred fit (slim/regular)\n4. Check customer reviews for fit feedback\n\n**Special Features:**\n• Pre-shrunk fabric\n• Reinforced stitching\n• Fade-resistant prints\n• Eco-friendly materials\n\nNeed help measuring or size recommendations?';
          suggestions = ['What materials do you use?', 'Do you have plus sizes?', 'How do I choose the right size?', 'Are your t-shirts pre-shrunk?'];
          break;
        case 'shipping':
        case 'what are your shipping options?':
          botResponse = '🚚 **Shipping & Delivery Information:**\n\n**Available Shipping Options:**\n\n**Standard Delivery:**\n⏱️ **Time:** 3-5 business days\n💰 **Cost:** Free on orders above ₹999\n📦 **Tracking:** Real-time updates\n\n**Express Delivery:**\n⚡ **Time:** 1-2 business days\n💰 **Cost:** Additional ₹200\n📦 **Priority handling**\n\n**Cash on Delivery (COD):**\n💵 **Available:** Up to ₹2000\n🔒 **Secure:** Pay on delivery\n📱 **SMS confirmation**\n\n**Delivery Coverage:**\n📍 **Pan India:** All major cities and towns\n🌍 **Remote areas:** 5-7 business days\n🏪 **Pickup points:** Available in select locations\n\n**What\'s Included:**\n✅ Real-time tracking\n✅ SMS/Email updates\n✅ Insurance coverage\n✅ Secure packaging\n✅ Contactless delivery\n\n**Delivery Times:**\n• **Metro cities:** 1-3 days\n• **Tier 2 cities:** 3-5 days\n• **Small towns:** 5-7 days\n\nNeed specific delivery time for your location?';
          suggestions = ['What if my package is lost?', 'Do you ship internationally?', 'Can I change delivery address?', 'What about rural areas?'];
          break;
        case 'returns':
        case 'how do i return an item?':
          botResponse = '🔄 **Return & Refund Policy:**\n\n**Return Window:** 7 days from delivery date\n**Free Returns:** For defective items\n**Easy Process:** Through your account\n\n**Return Reasons Accepted:**\n✅ Wrong size received\n✅ Defective product\n✅ Damaged during shipping\n✅ Not as described\n✅ Quality issues\n\n**Return Process Steps:**\n1️⃣ Go to your Orders section\n2️⃣ Select the item to return\n3️⃣ Choose return reason\n4️⃣ Print return label\n5️⃣ Pack item securely\n6️⃣ Drop at nearest pickup point\n\n**Return Conditions:**\n• Item must be unworn\n• Original tags attached\n• No stains or damage\n• Original packaging preferred\n\n**Refund Information:**\n💰 **Processing Time:** 3-5 business days\n💳 **Method:** Original payment method\n📧 **Confirmation:** Email notification\n\n**Exchange Options:**\n🔄 **Size Exchange:** Available\n🎨 **Design Change:** Subject to availability\n💰 **Refund:** Full amount minus shipping\n\n**What\'s Not Returnable:**\n❌ Worn or washed items\n❌ Items without tags\n❌ Custom/personalized items\n❌ Sale/clearance items\n\nNeed help with your return?';
          suggestions = ['What if item is damaged?', 'Can I exchange for different size?', 'How long do refunds take?', 'What about international returns?'];
          break;
        case 'support':
        case 'how can i contact support?':
          botResponse = '📞 **Contact Support Information:**\n\n**Multiple Ways to Reach Us:**\n\n**📧 Email Support:**\n• **Address:** support@inkdapper.com\n• **Response Time:** Within 24 hours\n• **Best for:** Detailed inquiries, complaints\n\n**📞 Phone Support:**\n• **Number:** +91 9994005696\n• **Hours:** Mon-Sat 9 AM - 6 PM\n• **Best for:** Urgent issues, immediate help\n\n**💬 Live Chat:**\n• **Available:** 24/7 (you\'re using it now!)\n• **Response:** Instant\n• **Best for:** Quick questions, general info\n\n**📱 WhatsApp Support:**\n• **Number:** +91 9994005696\n• **Hours:** Mon-Sat 9 AM - 6 PM\n• **Best for:** Order updates, quick queries\n\n**Support Hours:**\n📅 **Monday - Saturday:** 9:00 AM - 6:00 PM\n📅 **Sunday:** 10:00 AM - 4:00 PM\n📅 **Holidays:** Limited support available\n\n**Response Time Guarantees:**\n• **Email:** Within 24 hours\n• **Phone:** Immediate during business hours\n• **Chat:** Instant (like now!)\n• **WhatsApp:** Within 2 hours\n\n**What to Include in Your Message:**\n• Order number (if applicable)\n• Clear description of issue\n• Screenshots (if needed)\n• Your contact information\n\n**Escalation Process:**\n1. Contact support team\n2. If not resolved in 24 hours\n3. Escalate to senior support\n4. Manager review if needed\n\nWe\'re here to help! 🎯';
          suggestions = ['What if I need urgent help?', 'Can I speak to a manager?', 'Do you have a FAQ section?', 'What about after-hours support?'];
          break;
        case 'account':
          botResponse = '👤 **Account & Profile Management:**\n\n**Profile Settings:**\n• **Personal Information:** Update name, email, phone\n• **Password:** Change password securely\n• **Addresses:** Manage delivery addresses\n• **Preferences:** Communication preferences\n\n**Order Management:**\n📋 **Order History:** View all past orders\n📄 **Invoices:** Download order invoices\n📦 **Current Orders:** Track active orders\n❤️ **Wishlist:** Save favorite items\n\n**Account Features:**\n🔔 **Notifications:** Order updates, offers\n💳 **Payment Methods:** Saved cards, UPI\n🎁 **Rewards:** Loyalty points, discounts\n📱 **Mobile App:** Download our app\n\n**Security Features:**\n🔒 **Two-Factor Authentication:** Available\n📧 **Email Verification:** Required\n🔐 **Secure Login:** OTP verification\n\n**Privacy Settings:**\n• **Data Sharing:** Control marketing communications\n• **Profile Visibility:** Manage public profile\n• **Data Export:** Download your data\n• **Account Deletion:** Permanent removal option\n\n**Troubleshooting:**\n• **Can\'t Login:** Use forgot password\n• **Email Issues:** Check spam folder\n• **Account Locked:** Contact support\n• **Data Issues:** Request data export\n\nNeed help with your account?';
          suggestions = ['How do I change my password?', 'Can I delete my account?', 'How do I update my address?', 'What about data privacy?'];
          break;
        default:
          if (userMessage.toLowerCase().includes('order') || userMessage.toLowerCase().includes('track')) {
            botResponse = '📦 **Order Tracking Help:**\n\nTo track your order:\n1. Visit your profile → Orders section\n2. Enter your order number\n3. Check email for updates\n4. Use SMS tracking link\n\nNeed your order number? Check your order confirmation email!';
            suggestions = ['What if my order is delayed?', 'Can I change delivery address?', 'How long does processing take?'];
          } else if (userMessage.toLowerCase().includes('size') || userMessage.toLowerCase().includes('fit')) {
            botResponse = '👕 **Size Guide & Fit Information:**\n\n**How to Choose Your Size:**\n• Measure your chest circumference\n• Compare with our size chart\n• Consider your preferred fit (slim/regular)\n• Check customer reviews for fit feedback\n\n**Available Sizes:** XS, S, M, L, XL, XXL\n\n**Fit Types:**\n• **Slim Fit:** XS, S (tighter fit)\n• **Regular Fit:** M, L (standard fit)\n• **Comfortable Fit:** XL, XXL (looser fit)\n\nNeed help measuring? I can guide you through it!';
            suggestions = ['How do I measure my chest?', 'What if size doesn\'t fit?', 'Do you have size charts?'];
          } else if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('cost')) {
            botResponse = '💰 **Pricing Information:**\n\n**T-shirt Price Range:**\n• **Regular Designs:** ₹599 - ₹899\n• **Premium Designs:** ₹799 - ₹1299\n• **Custom Designs:** ₹999 - ₹1499\n• **Limited Edition:** ₹899 - ₹1599\n\n**Shipping Costs:**\n• **Free Shipping:** On orders above ₹999\n• **Standard Delivery:** ₹99 (below ₹999)\n• **Express Delivery:** +₹200\n• **COD:** No additional charge\n\n**Discounts & Offers:**\n• **First Order:** 10% off\n• **Bulk Orders:** 15% off (5+ items)\n• **Student Discount:** 5% off\n• **Seasonal Sales:** Up to 50% off\n\n**Payment Options:**\n💳 Credit/Debit Cards\n📱 UPI\n🏦 Net Banking\n💵 Cash on Delivery\n\nPrices may vary based on design complexity and current offers!';
            suggestions = ['Do you have student discounts?', 'What about bulk orders?', 'Are there seasonal sales?'];
          } else if (userMessage.toLowerCase().includes('delivery') || userMessage.toLowerCase().includes('shipping')) {
            botResponse = '🚚 **Delivery Information:**\n\n**Delivery Options:**\n• **Standard:** 3-5 days (Free above ₹999)\n• **Express:** 1-2 days (+₹200)\n• **COD:** Available up to ₹2000\n\n**Coverage:**\n📍 Pan India delivery\n🌍 Remote areas: 5-7 days\n🏪 Pickup points available\n\n**Tracking:** Real-time updates via email/SMS\n**Insurance:** All packages insured\n**Secure:** Contactless delivery available\n\nWhere are you located? I can give you specific delivery times!';
            suggestions = ['What about rural areas?', 'Do you have pickup points?', 'Is contactless delivery safe?'];
          } else {
            botResponse = 'Thank you for your message! 🤗 I\'m here to help with:\n\n📦 **Order tracking & status**\n👕 **Product information & sizes**\n🚚 **Shipping & delivery**\n🔄 **Returns & refunds**\n📞 **Contact support**\n💰 **Pricing & offers**\n👤 **Account management**\n🎁 **Discounts & promotions**\n\nWhat would you like to know more about? Feel free to ask anything specific!';
            suggestions = ['Tell me about your products', 'How do I place an order?', 'What\'s your return policy?', 'Do you have discounts?'];
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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
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

              {/* Quick Replies */}
              {messages.length === 1 && !isTyping && (
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
              <div className="border-t border-gray-200 p-6 flex-shrink-0">
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
