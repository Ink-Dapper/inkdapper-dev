import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "../utils/axios";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

// Custom NavLink component with active state handling
const CustomNavLink = ({ to, children, scrollToTop }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (scrollToTop) {
      scrollToTop();
    }

    // Force navigation using window.location to bypass any React Router issues
    setTimeout(() => {
      window.location.href = to;
    }, 100);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`relative group px-4 py-2.5 transition-all duration-200 ease-out uppercase tracking-[0.1em] text-xs font-black ${isActive
        ? 'text-[#0f0f10]'
        : 'text-slate-300 hover:text-orange-200'
        }`}
      style={isActive
        ? {
          background: 'linear-gradient(135deg, rgba(251,146,60,0.98), rgba(245,158,11,0.92))',
          border: '1px solid rgba(251,146,60,0.9)',
          boxShadow: '0 8px 20px rgba(249,115,22,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
          clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)'
        }
        : {
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(148,163,184,0.18)',
          clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)'
        }}
    >
      <span className="absolute top-1 right-1 w-1 h-1 rounded-full opacity-70"
        style={{ background: isActive ? 'rgba(15,15,16,0.8)' : 'rgba(251,146,60,0.85)' }} />
      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
        style={{ background: isActive ? 'rgba(15,15,16,0.75)' : 'rgba(251,146,60,0.9)' }} />
      <span className="relative z-10 pl-3 text-inherit">{children}</span>
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-orange-500 to-orange-300 transition-all duration-300 ease-out ${isActive ? 'w-8 opacity-0' : 'group-hover:w-8 w-0'
        }`}></div>
      <div className={`absolute inset-0 rounded-[10px] transition-opacity duration-300 pointer-events-none ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
        }`}></div>
    </Link>
  );
};

const Navbar = () => {
  // All hooks MUST be at the top — before any conditional returns (Rules of Hooks)
  const [visible, setVisible] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobMenu, setMobMenu] = useState("hidden");
  const [userNameLetter, setUserNameLetter] = useState("");
  const [fullUserName, setFullUserName] = useState("");

  const location = useLocation();
  const context = useContext(ShopContext);

  const {
    getCartCount,
    navigate,
    token,
    setToken,
    getWishlistCount,
    wishlist,
    usersDetails,
    scrollToTop,
  } = context || {};

  useEffect(() => {
    if (!getWishlistCount) return;
    const fetchCounts = async () => {
      const count = await getWishlistCount();
      setWishlistCount(count);
    };
    fetchCounts();
  }, [getWishlistCount, wishlist]);

  useEffect(() => {
    if (!usersDetails) return;
    usersDetails.forEach((user) => {
      setUserNameLetter(user.users.name[0]);
      setFullUserName(user.users.name);
    });
  }, [usersDetails]);

  // Reset mobile menu when token changes (login/logout)
  useEffect(() => {
    setMobMenu("hidden");
  }, [token]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobMenu === "visible") {
        const isClickInsideDropdown = event.target.closest('.mobile-profile-dropdown');
        const isClickOnProfileIcon = event.target.closest('.mobile-profile-icon');
        if (!isClickInsideDropdown && !isClickOnProfileIcon) {
          setMobMenu("hidden");
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => { document.removeEventListener('click', handleClickOutside); };
  }, [mobMenu]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobMenu("hidden");
  }, [location.pathname]);

  // Conditional renders AFTER all hooks
  if (location.pathname === '/login') return null;
  if (!context) return <div>Loading...</div>;

  const subMenuVisible = () => {
    setMobMenu(prev => prev === "hidden" ? "visible" : "hidden");
  };

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <div className="navbar-container-sticky">
      <div className="navbar-container-sticky-inner flex items-center md:flex-row justify-between flex-row-reverse py-3 md:py-5 font-medium px-[7vw]">
        <Link to="/" className="group">
          <div className="relative flex items-center justify-center p-3 transition-all duration-200 group-active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(251,146,60,0.95) 0%, rgba(245,158,11,0.88) 100%)',
              clipPath: 'polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px)',
              boxShadow: '0 8px 24px rgba(249,115,22,0.5), inset 0 1px 0 rgba(255,255,255,0.25)'
            }}
          >
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/30 pointer-events-none" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-black/20 pointer-events-none" />
            <img src={assets.inkdapper_logo} className="md:w-9 w-7 relative z-10 drop-shadow-md" alt="logo" />
          </div>
        </Link>

        <ul
          className="hidden md:flex h-[56px] items-center gap-1 text-sm px-2 py-2 relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0d0e10 0%, #15161a 60%, #0f1012 100%)',
            border: '1px solid rgba(251,146,60,0.42)',
            clipPath: 'polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,146,60,0.06)'
          }}
        >
          <span className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(251,146,60,0.8) 30%, rgba(245,158,11,1) 50%, rgba(251,146,60,0.8) 70%, transparent 95%)' }} />
          <span className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 24px)', backgroundSize: '36px 36px' }} />
          <CustomNavLink to="/" scrollToTop={scrollToTop}>Home</CustomNavLink>

          <CustomNavLink to="/collection" scrollToTop={scrollToTop}>Collection</CustomNavLink>

          <CustomNavLink to="/ai-designer" scrollToTop={scrollToTop}>AI Design</CustomNavLink>

          <CustomNavLink to="/about" scrollToTop={scrollToTop}>About</CustomNavLink>

          <CustomNavLink to="/contact" scrollToTop={scrollToTop}>Contact</CustomNavLink>
        </ul>

        <div className="hidden md:block">
          <div className="flex h-[56px] items-center gap-3 px-3 py-2 relative"
            style={{
              background: 'linear-gradient(160deg, #0d0e10 0%, #15161a 100%)',
              border: '1px solid rgba(251,146,60,0.42)',
              borderRadius: '4px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.55)'
            }}>

            {/* Cart Icon */}
            <Link to="/cart" className="relative group">
              <div className="w-10 h-10 flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(148,163,184,0.22)',
                  clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)'
                }}>
                <LocalMallOutlinedIcon className="text-slate-300 group-hover:text-orange-300 transition-colors duration-200" sx={{ fontSize: 22 }} />
                {token && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[3px] bg-orange-500 text-white flex items-center justify-center text-[10px] font-black shadow-lg"
                    style={{ clipPath: 'polygon(4px 0%,100% 0%,100% calc(100% - 4px),calc(100% - 4px) 100%,0% 100%,0% 4px)' }}>
                    {getCartCount()}
                  </div>
                )}
              </div>
            </Link>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative group">
              <div className="w-10 h-10 flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(148,163,184,0.22)',
                  clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)'
                }}>
                <FavoriteBorderOutlinedIcon className="text-slate-300 group-hover:text-orange-300 transition-colors duration-200" sx={{ fontSize: 22 }} />
                {token && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[3px] bg-orange-500 text-white flex items-center justify-center text-[10px] font-black shadow-lg"
                    style={{ clipPath: 'polygon(4px 0%,100% 0%,100% calc(100% - 4px),calc(100% - 4px) 100%,0% 100%,0% 4px)' }}>
                    {wishlistCount}
                  </div>
                )}
              </div>
            </Link>

            {/* Profile Section */}
            <div className="group relative">
              <div
                className="w-10 h-10 flex items-center justify-center transition-all duration-200 cursor-pointer group-hover:scale-105"
                style={{
                  background: token ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)',
                  border: token ? '1px solid rgba(251,146,60,0.5)' : '1px solid rgba(148,163,184,0.22)',
                  clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)'
                }}
                onClick={() => {
                  const currentToken = token || localStorage.getItem('token');
                  if (!currentToken) navigate("/login");
                }}
              >
                {token ? (
                  <div className="w-7 h-7 flex items-center justify-center text-white font-black text-sm uppercase"
                    style={{
                      background: 'linear-gradient(135deg, rgba(251,146,60,0.95), rgba(245,158,11,0.9))',
                      clipPath: 'polygon(5px 0%,100% 0%,100% calc(100% - 5px),calc(100% - 5px) 100%,0% 100%,0% 5px)'
                    }}>
                    {userNameLetter}
                  </div>
                ) : (
                  <AccountCircleOutlinedIcon className="text-slate-300 group-hover:text-orange-300 transition-colors duration-200" sx={{ fontSize: 22 }} />
                )}
              </div>

              {/* Dropdown */}
              {token && (
                <div className="desktop-profile-dropdown group-hover:block hidden absolute dropdown-menu right-0 pt-5 z-20">
                  <div className="relative">
                    <div className="absolute top-0 right-4 w-3 h-3 transform rotate-45"
                      style={{ background: '#111214', borderLeft: '1px solid rgba(251,146,60,0.3)', borderTop: '1px solid rgba(251,146,60,0.3)' }} />
                    <div className="overflow-hidden min-w-[200px] shadow-2xl"
                      style={{
                        background: 'linear-gradient(160deg, #0f1012, #161719)',
                        border: '1px solid rgba(251,146,60,0.3)',
                        clipPath: 'polygon(12px 0%,100% 0%,100% calc(100% - 12px),calc(100% - 12px) 100%,0% 100%,0% 12px)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
                      }}>
                      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, rgba(251,146,60,0.9), rgba(245,158,11,0.7), transparent)' }} />
                      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(148,163,184,0.12)' }}>
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-400">Welcome back</p>
                        <p className="text-sm font-bold text-slate-100 capitalize mt-0.5">{fullUserName}</p>
                      </div>
                      <div className="py-1.5">
                        <button
                          onClick={() => navigate("/profile")}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-150"
                          style={{ borderLeft: '3px solid transparent' }}
                          onMouseEnter={e => { e.currentTarget.style.borderLeftColor = 'rgba(251,146,60,0.8)'; e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span className="text-[10px] font-black text-orange-500 w-5">01</span>
                          <span className="text-sm font-bold text-slate-300 uppercase tracking-wide">My Profile</span>
                        </button>
                        <button
                          onClick={() => navigate("/orders")}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-150"
                          style={{ borderLeft: '3px solid transparent' }}
                          onMouseEnter={e => { e.currentTarget.style.borderLeftColor = 'rgba(251,146,60,0.8)'; e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span className="text-[10px] font-black text-orange-500 w-5">02</span>
                          <span className="text-sm font-bold text-slate-300 uppercase tracking-wide">My Orders</span>
                        </button>
                        <div className="mx-4 my-1" style={{ height: '1px', background: 'rgba(148,163,184,0.12)' }} />
                        <button
                          onClick={logout}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-150"
                          style={{ borderLeft: '3px solid transparent' }}
                          onMouseEnter={e => { e.currentTarget.style.borderLeftColor = 'rgba(239,68,68,0.8)'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span className="text-[10px] font-black text-red-500 w-5">—</span>
                          <span className="text-sm font-bold text-red-400 uppercase tracking-wide">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setVisible(true)}
            className="relative flex flex-col justify-center items-center gap-[5px] w-10 h-10 group"
            style={{
              background: 'linear-gradient(135deg, #111214, #18191c)',
              border: '1px solid rgba(251,146,60,0.45)',
              clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)',
              boxShadow: '0 4px 14px rgba(249,115,22,0.25)'
            }}
          >
            <span className="block w-5 h-[2px] bg-orange-400 transition-all duration-200 group-hover:w-6"></span>
            <span className="block w-4 h-[2px] bg-orange-300/70 transition-all duration-200 group-hover:w-6"></span>
            <span className="block w-5 h-[2px] bg-orange-400 transition-all duration-200 group-hover:w-6"></span>
            <span className="absolute top-0 right-0 w-1 h-1 bg-orange-500 rounded-full"></span>
          </button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-30 md:hidden">
        {/* Top glow line */}
        <div className="absolute top-0 left-0 w-full h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(251,146,60,0.95) 30%, rgba(245,158,11,1) 50%, rgba(251,146,60,0.95) 70%, transparent 95%)', boxShadow: '0 0 12px rgba(249,115,22,0.6)' }}
        />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '150px' }}
        />

        {/* Navigation bar */}
        <div className="relative flex items-center justify-around px-3 pb-safe"
          style={{ background: 'linear-gradient(180deg, #0d0d0e 0%, #0f0f11 100%)', borderTop: '1px solid rgba(251,146,60,0.28)', paddingTop: '10px', paddingBottom: '12px' }}
        >
          {/* Home/Logo */}
          <Link to="/" onClick={(e) => { e.preventDefault(); scrollToTop(); setTimeout(() => window.location.href = '/', 100); }} className="group relative flex flex-col items-center gap-[5px]">
            <div className="w-11 h-11 flex items-center justify-center transition-all duration-200 group-active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(251,146,60,0.35)',
                clipPath: 'polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              <img src={assets.logo_white_only} className="w-6 h-6" alt="logo" style={{ filter: 'sepia(1) saturate(3) hue-rotate(5deg) brightness(1.1)' }} />
            </div>
            {/* <span className="text-[9px] font-black uppercase tracking-widest text-orange-400/80">Home</span> */}
          </Link>

          {/* Cart */}
          <Link to="/cart" onClick={(e) => { e.preventDefault(); scrollToTop(); setTimeout(() => window.location.href = '/cart', 100); }} className="group relative flex flex-col items-center gap-[5px]">
            <div className="relative w-11 h-11 flex items-center justify-center transition-all duration-200 group-active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(148,163,184,0.2)',
                clipPath: 'polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              <LocalMallOutlinedIcon className="text-slate-300 group-hover:text-orange-300 transition-colors duration-200" sx={{ fontSize: 24 }} />
              {token && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[3px] bg-orange-500 text-white flex items-center justify-center text-[10px] font-black shadow-lg"
                  style={{ clipPath: 'polygon(4px 0%,100% 0%,100% calc(100% - 4px),calc(100% - 4px) 100%,0% 100%,0% 4px)' }}
                >
                  {getCartCount()}
                </div>
              )}
            </div>
            {/* <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-orange-400/80 transition-colors duration-200">Cart</span> */}
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" onClick={(e) => { e.preventDefault(); scrollToTop(); setTimeout(() => window.location.href = '/wishlist', 100); }} className="group relative flex flex-col items-center gap-[5px]">
            <div className="relative w-11 h-11 flex items-center justify-center transition-all duration-200 group-active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(148,163,184,0.2)',
                clipPath: 'polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              <FavoriteBorderOutlinedIcon className="text-slate-300 group-hover:text-orange-300 transition-colors duration-200" sx={{ fontSize: 24 }} />
              {token && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[3px] bg-orange-500 text-white flex items-center justify-center text-[10px] font-black shadow-lg"
                  style={{ clipPath: 'polygon(4px 0%,100% 0%,100% calc(100% - 4px),calc(100% - 4px) 100%,0% 100%,0% 4px)' }}
                >
                  {wishlistCount}
                </div>
              )}
            </div>
            {/* <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-orange-400/80 transition-colors duration-200">Wishlist</span> */}
          </Link>

          {/* Profile */}
          <div className="group relative flex flex-col items-center gap-[5px]">
            <div
              onClick={(e) => {
                e.stopPropagation();
                const currentToken = token || localStorage.getItem('token');
                if (!currentToken) {
                  navigate("/login");
                  scrollToTop();
                } else {
                  subMenuVisible();
                }
              }}
              className="mobile-profile-icon relative w-11 h-11 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95"
              style={{
                background: token ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                border: token ? '1px solid rgba(251,146,60,0.5)' : '1px solid rgba(148,163,184,0.2)',
                clipPath: 'polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px)',
                boxShadow: token ? '0 0 12px rgba(249,115,22,0.2), 0 2px 10px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              {token ? (
                <div className="w-7 h-7 flex items-center justify-center text-white font-black text-sm uppercase"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251,146,60,0.9), rgba(245,158,11,0.9))',
                    clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)'
                  }}
                >
                  {userNameLetter}
                </div>
              ) : (
                <AccountCircleOutlinedIcon className="text-slate-300 group-hover:text-orange-300 transition-colors duration-200" sx={{ fontSize: 24 }} />
              )}
            </div>
            {/* <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-orange-400/80 transition-colors duration-200">Account</span> */}

            {/* Dropdown */}
            {token && mobMenu === 'visible' && (
              <div className="mobile-profile-dropdown absolute bottom-[calc(100%+12px)] right-0 z-50">
                <div className="relative">
                  {/* Arrow */}
                  <div className="absolute bottom-[-5px] right-5 w-3 h-3 transform rotate-45"
                    style={{ background: '#111214', borderRight: '1px solid rgba(251,146,60,0.3)', borderBottom: '1px solid rgba(251,146,60,0.3)' }}
                  />
                  {/* Container */}
                  <div className="overflow-hidden min-w-[210px] shadow-2xl"
                    style={{
                      background: 'linear-gradient(160deg, #0f1012, #161719)',
                      border: '1px solid rgba(251,146,60,0.3)',
                      clipPath: 'polygon(12px 0%,100% 0%,100% calc(100% - 12px),calc(100% - 12px) 100%,0% 100%,0% 12px)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(251,146,60,0.1)'
                    }}
                  >
                    {/* Orange accent top bar */}
                    <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, rgba(251,146,60,0.9), rgba(245,158,11,0.7), transparent)' }} />
                    {/* Header */}
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(148,163,184,0.12)' }}>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-400">Welcome back</p>
                      <p className="text-sm font-bold text-slate-100 capitalize mt-0.5">{fullUserName}</p>
                    </div>
                    {/* Items */}
                    <div className="py-1.5">
                      <button
                        onClick={() => { navigate("/profile"); setMobMenu("hidden"); scrollToTop(); }}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-150 group/item"
                        style={{ borderLeft: '3px solid transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.borderLeftColor = 'rgba(251,146,60,0.8)'; e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span className="text-[10px] font-black text-orange-500 w-5">01</span>
                        <span className="text-sm font-bold text-slate-300 uppercase tracking-wide">My Profile</span>
                      </button>
                      <button
                        onClick={() => { navigate("/orders"); setMobMenu("hidden"); scrollToTop(); }}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-150"
                        style={{ borderLeft: '3px solid transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.borderLeftColor = 'rgba(251,146,60,0.8)'; e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span className="text-[10px] font-black text-orange-500 w-5">02</span>
                        <span className="text-sm font-bold text-slate-300 uppercase tracking-wide">My Orders</span>
                      </button>
                      <div className="mx-4 my-1" style={{ height: '1px', background: 'rgba(148,163,184,0.12)' }} />
                      <button
                        onClick={() => { logout(); setMobMenu("hidden"); scrollToTop(); }}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-150"
                        style={{ borderLeft: '3px solid transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.borderLeftColor = 'rgba(239,68,68,0.8)'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span className="text-[10px] font-black text-red-500 w-5">—</span>
                        <span className="text-sm font-bold text-red-400 uppercase tracking-wide">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Slide-in side drawer */}
      <div className={`fixed top-0 z-[1105] left-0 bottom-0 overflow-hidden transition-all duration-300 ease-in-out ${visible ? "w-full" : "w-0"}`}>
        <div className="relative flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #0d0d0e 0%, #0f0f11 100%)', borderRight: '2px solid rgba(251,146,60,0.45)' }}>

          {/* Diagonal stripe texture */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 28px)',
              backgroundSize: '40px 40px'
            }}
          />

          {/* Left orange accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(251,146,60,0.95) 0%, rgba(245,158,11,0.6) 50%, rgba(251,146,60,0.2) 100%)' }}
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(251,146,60,0.2)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(251,146,60,0.95), rgba(245,158,11,0.9))',
                  clipPath: 'polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px)',
                  boxShadow: '0 8px 20px rgba(249,115,22,0.4)'
                }}
              >
                <img src={assets.inkdapper_logo} className="w-6 h-6" alt="logo" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Ink Dapper</p>
                <p className="text-base font-black uppercase tracking-[0.12em] text-slate-100 leading-none">Navigation</p>
              </div>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="w-9 h-9 flex items-center justify-center transition-all duration-200 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(251,146,60,0.3)',
                clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)'
              }}
            >
              <ClearOutlinedIcon sx={{ color: '#cbd5e1', fontSize: 20 }} />
            </button>
          </div>

          {/* Section label */}
          <div className="relative z-10 px-6 pt-6 pb-2 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'rgba(148,163,184,0.15)' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Pages</span>
            <div className="h-px flex-1" style={{ background: 'rgba(148,163,184,0.15)' }} />
          </div>

          {/* Navigation Links */}
          <div className="relative z-10 flex-1 px-5 py-2">
            <nav className="space-y-2">
              {[
                { to: '/', label: 'Home', num: '01' },
                { to: '/collection', label: 'Collection', num: '02' },
                { to: '/ai-designer', label: 'AI Design', num: '03' },
                { to: '/about', label: 'About', num: '04' },
                { to: '/contact', label: 'Contact', num: '05' },
              ].map(({ to, label, num }) => (
                <NavLink
                  key={to}
                  onClick={(e) => {
                    e.preventDefault();
                    setVisible(false);
                    scrollToTop();
                    setTimeout(() => window.location.href = to, 100);
                  }}
                  to={to}
                  className={({ isActive }) =>
                    `group flex items-center gap-4 py-4 px-4 transition-all duration-200 active:scale-[0.98] ${isActive ? 'nav-item-active' : ''}`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.025)',
                    borderTop: '1px solid rgba(148,163,184,0.12)',
                    borderRight: '1px solid rgba(148,163,184,0.08)',
                    borderBottom: '1px solid rgba(148,163,184,0.08)',
                    borderLeft: isActive ? '3px solid rgba(251,146,60,0.9)' : '3px solid rgba(148,163,184,0.15)',
                    clipPath: 'polygon(0% 0%,calc(100% - 10px) 0%,100% 10px,100% 100%,0% 100%)',
                  })}
                >
                  <span className="text-[11px] font-black text-orange-500/80 w-6 leading-none tracking-tight">{num}</span>
                  <span className="flex-1 text-sm font-black uppercase tracking-[0.1em] text-slate-900">{label}</span>
                  <span className="w-1.5 h-1.5 bg-orange-500/40 group-hover:bg-orange-400 transition-colors duration-200"
                    style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                  />
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="relative z-10 px-6 py-5" style={{ borderTop: '1px solid rgba(251,146,60,0.2)' }}>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(251,146,60,0.4), transparent)' }} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/60">Premium T-Shirt Brand</span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, rgba(251,146,60,0.4), transparent)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
