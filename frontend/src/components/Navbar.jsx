import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "../utils/axios";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
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
      className={`relative group transition-all duration-500 ease-out ${isActive
        ? 'text-orange-600'
        : 'text-slate-600 hover:text-orange-600'
        }`}
    >
      <span className="relative z-10 font-medium tracking-wide">{children}</span>
      <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out ${isActive ? 'w-full' : 'group-hover:w-full w-0'
        }`}></div>
      <div className={`absolute -bottom-1 left-0 w-full h-0.5 bg-orange-200 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}></div>
    </Link>
  );
};

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const context = useContext(ShopContext);

  // Safety check to prevent destructuring undefined context
  if (!context) {
    return <div>Loading...</div>
  }

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    getWishlistCount,
    setWishlist,
    wishlist,
    usersDetails,
    clearCart,
    scrollToTop,
  } = context;
  const [wishlistCount, setWishlistCount] = useState(0);
  const [value, setValue] = useState("recent");
  const [mobMenu, setMobMenu] = useState("hidden");
  const [userNameLetter, setUserNameLetter] = useState("");
  const [fullUserName, setFullUserName] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      const wishlistCount = await getWishlistCount();
      setWishlistCount(wishlistCount);
    };
    fetchCounts();
  }, [getWishlistCount, wishlist]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const subMenuVisible = () => {
    if (mobMenu === "hidden") {
      setMobMenu("visible");
    } else {
      setMobMenu("hidden");
    }
  };

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    // Don't clear cart or wishlist on logout - keep them for when user logs back in
    // clearCart(); // Removed to preserve cart across sessions
    // setWishlist({}); // Removed to preserve wishlist across sessions
  };


  const userName = () => {
    usersDetails.map((user) => {
      setUserNameLetter(user.users.name[0]);
      setFullUserName(user.users.name);
    });
  };

  useEffect(() => {
    userName();
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
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobMenu]);

  // Close mobile menu on route change
  const location = useLocation();
  useEffect(() => {
    setMobMenu("hidden");
  }, [location.pathname]);

  return (
    <div className="">
      <div className="flex items-center md:flex-row justify-between flex-row-reverse py-3 md:py-5 font-medium">
        <Link to="/">
          <div className="relative flex items-center justify-center px-4 py-3 group overflow-hidden">
            {/* Main Blob Background - Compact Shape */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-orange-500 to-orange-700 rounded-[30px_15px_40px_20px] shadow-lg transition-all duration-700"></div>

            {/* Floating Blob Elements - Compact */}
            <div className="absolute inset-0 rounded-[30px_15px_40px_20px] overflow-hidden">
              {/* Top Left Blob */}
              <div className="absolute -top-2 -left-2 w-10 h-10 bg-gradient-to-br from-orange-200 to-orange-400 rounded-full blur-lg opacity-80 transition-all duration-1000"></div>

              {/* Bottom Right Blob */}
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-300 rounded-full blur-lg opacity-70 transition-all duration-1000" style={{ animationDelay: '0.4s' }}></div>

              {/* Center Right Blob */}
              <div className="absolute top-1/2 -right-1 w-8 h-8 bg-gradient-to-br from-orange-50 to-orange-200 rounded-full blur-md opacity-60 transition-all duration-1000" style={{ animationDelay: '0.8s' }}></div>

              {/* Top Center Blob */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-300 rounded-full blur-sm opacity-50 transition-all duration-800"></div>

              {/* Bottom Left Blob */}
              <div className="absolute bottom-0 left-1/4 w-3 h-3 bg-orange-200 rounded-full blur-sm opacity-40 transition-all duration-800"></div>

              {/* Middle Left Blob */}
              <div className="absolute top-1/3 -left-1 w-2 h-2 bg-orange-100 rounded-full blur-sm opacity-30 transition-all duration-600"></div>
            </div>

            {/* Enhanced Shimmer Effect */}
            <div className="absolute inset-0 rounded-[30px_15px_40px_20px] bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-15 -translate-x-full transition-transform duration-1200"></div>

            {/* Glowing Border Effect */}
            <div className="absolute inset-0 rounded-[30px_15px_40px_20px] bg-gradient-to-r from-orange-300/20 via-transparent to-orange-300/20 opacity-0 transition-opacity duration-500"></div>

            {/* Logo */}
            <img src={assets.inkdapper_logo} className="md:w-10 w-8 relative z-10 drop-shadow-lg" alt="logo" />
            {/* <p className='md:text-2xl text-xl font-medium'>Ink Dapper</p> */}
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-10 text-sm">
          <CustomNavLink to="/" scrollToTop={scrollToTop}>Home</CustomNavLink>

          <CustomNavLink to="/collection" scrollToTop={scrollToTop}>Collection</CustomNavLink>

          <CustomNavLink to="/about" scrollToTop={scrollToTop}>About</CustomNavLink>

          <CustomNavLink to="/contact" scrollToTop={scrollToTop}>Contact</CustomNavLink>
        </ul>

        <div className="hidden md:block">
          <div className="flex items-center gap-8">
            {/* Search Icon */}
            <div className="relative group">
              <div className="p-2 rounded-full bg-gray-50 hover:bg-orange-50 transition-all duration-300 cursor-pointer group-hover:scale-110">
                <SearchIcon
                  onClick={() => setShowSearch(true)}
                  className="text-slate-600 group-hover:text-orange-600 transition-all duration-300"
                  sx={{ fontSize: 24 }}
                  alt="search-icon"
                />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-8"></div>
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative group">
              <div className="p-2 rounded-full bg-gray-50 hover:bg-orange-50 transition-all duration-300 group-hover:scale-110">
                <LocalMallOutlinedIcon
                  alt="cart icon"
                  className="text-slate-600 group-hover:text-orange-600 transition-all duration-300"
                  sx={{ fontSize: 24 }}
                />
                {token && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    {getCartCount()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-8"></div>
            </Link>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative group">
              <div className="p-2 rounded-full bg-gray-50 hover:bg-orange-50 transition-all duration-300 group-hover:scale-110">
                <FavoriteBorderOutlinedIcon
                  alt="wishlist icon"
                  className="text-slate-600 group-hover:text-orange-600 transition-all duration-300"
                  sx={{ fontSize: 24 }}
                />
                {token && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    {wishlistCount}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-8"></div>
            </Link>

            {/* Profile Section */}
            <div className="group relative">
              <div
                className="p-2 rounded-full bg-gray-50 hover:bg-orange-50 transition-all duration-300 cursor-pointer group-hover:scale-110"
                onClick={() => {
                  const currentToken = token || localStorage.getItem('token');
                  if (!currentToken) {
                    // Navigate to login immediately
                    navigate("/login");
                  }
                }}
              >
                {token ? (
                  <div className="relative w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex justify-center items-center uppercase font-bold text-sm shadow-lg border-2 border-white">
                    {userNameLetter}
                  </div>
                ) : (
                  <AccountCircleOutlinedIcon
                    alt="profile icon"
                    className="text-slate-600 group-hover:text-orange-600 transition-all duration-300"
                    sx={{ fontSize: 24 }}
                  />
                )}
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-8"></div>

              {/* Enhanced Dropdown Menu */}
              {token && (
                <div className="desktop-profile-dropdown group-hover:block hidden absolute dropdown-menu right-0 pt-6 z-20">
                  <div className="relative">
                    <div className="absolute top-0 right-4 w-3 h-3 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[180px] py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">Welcome back!</p>
                        <p className="text-xs text-gray-500 capitalize">{fullUserName}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => navigate("/profile")}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 flex items-center gap-3"
                        >
                          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                          My Profile
                        </button>
                        <button
                          onClick={() => navigate("/orders")}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 flex items-center gap-3"
                        >
                          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                          My Orders
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={logout}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" md:hidden">
          <MenuOpenIcon onClick={() => setVisible(true)} alt="menu-icon" className="w-5 cursor-pointer" sx={{ fontSize: 30 }} />
        </div>
      </div>
      <div className="fixed bottom-[-2px] left-0 w-full z-30 md:hidden">
        {/* Dark Glassmorphism Background with Blur */}
        <div className="relative">
          {/* Backdrop Blur Background */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl border-t border-gray-800/50 rounded-t-xl"></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/70 rounded-t-xl"></div>

          {/* Navigation Container */}
          <div className="relative flex items-center justify-around px-4 py-2 rounded-t-xl">
            {/* Home/Logo */}
            <Link to="/" onClick={(e) => { e.preventDefault(); scrollToTop(); setTimeout(() => window.location.href = '/', 100); }} className="group relative">
              <div className="flex flex-col items-center">
                <div className="relative p-1.5">
                  <img src={assets.logo_white_only} className="w-7 h-7 filter brightness-100 group-hover:brightness-110 transition-all duration-300" alt="logo" />
                </div>
              </div>
            </Link>

            {/* Cart */}
            <Link to="/cart" onClick={(e) => { e.preventDefault(); scrollToTop(); setTimeout(() => window.location.href = '/cart', 100); }} className="group relative">
              <div className="flex flex-col items-center">
                <div className="relative p-1.5">
                  <LocalMallOutlinedIcon className="text-white group-hover:text-gray-200 transition-colors duration-300" sx={{ fontSize: 28 }} />

                  {/* Cart Badge */}
                  {token && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-gray-900 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      {getCartCount()}
                    </div>
                  )}
                </div>
              </div>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" onClick={(e) => { e.preventDefault(); scrollToTop(); setTimeout(() => window.location.href = '/wishlist', 100); }} className="group relative">
              <div className="flex flex-col items-center">
                <div className="relative p-1.5">
                  <FavoriteBorderOutlinedIcon className="text-white group-hover:text-gray-200 transition-colors duration-300" sx={{ fontSize: 28 }} />

                  {/* Wishlist Badge */}
                  {token && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-gray-900 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      {wishlistCount}
                    </div>
                  )}
                </div>
              </div>
            </Link>

            {/* Profile */}
            <div className="group relative">
              <div className="flex flex-col items-center">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentToken = token || localStorage.getItem('token');
                    if (!currentToken) {
                      // Navigate to login immediately
                      navigate("/login");
                      scrollToTop();
                    } else {
                      subMenuVisible();
                    }
                  }}
                  className="mobile-profile-icon relative p-1.5 cursor-pointer"
                >
                  {token ? (
                    <div className="relative w-8 h-8 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full flex justify-center items-center text-xs font-bold shadow-lg border-2 border-gray-900">
                      {userNameLetter}
                    </div>
                  ) : (
                    <AccountCircleOutlinedIcon
                      className="text-white group-hover:text-gray-200 transition-colors duration-300"
                      sx={{ fontSize: 28 }}
                    />
                  )}
                </div>
              </div>

              {/* Enhanced Dropdown Menu */}
              {token && mobMenu === 'visible' && (
                <div className="mobile-profile-dropdown absolute bottom-full mb-3 right-0 z-50 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100 scale-100">
                  <div className="relative">
                    {/* Arrow */}
                    <div className="absolute bottom-[-5px] right-4 w-3 h-3 bg-gray-900 transform rotate-45 border-r border-b border-gray-700 shadow-lg"></div>

                    {/* Menu Container */}
                    <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden min-w-[200px]">
                      {/* Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-orange-900/30 to-orange-800/20 border-b border-gray-700/50">
                        <p className="text-sm font-semibold text-gray-100">Welcome back!</p>
                        <p className="text-xs text-gray-400 capitalize">{fullUserName}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => { navigate("/profile"); setMobMenu("hidden"); scrollToTop() }}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-300 hover:bg-orange-900/30 hover:text-orange-300 transition-all duration-200 flex items-center gap-3 group"
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                          My Profile
                        </button>
                        <button
                          onClick={() => { navigate("/orders"); setMobMenu("hidden"); scrollToTop() }}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-300 hover:bg-orange-900/30 hover:text-orange-300 transition-all duration-200 flex items-center gap-3 group"
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                          My Orders
                        </button>
                        <div className="border-t border-gray-700/50 my-1"></div>
                        <button
                          onClick={() => { logout(); setMobMenu("hidden"); scrollToTop() }}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200 flex items-center gap-3 group"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* {sliderBar menu for mobile} */}
      <div className={`fixed top-0 z-[1000] left-0 bottom-0 overflow-hidden bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out ${visible ? "w-full" : "w-0"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img src={assets.inkdapper_logo} className="w-9 h-8" alt="logo" />
              <span className="text-lg font-semibold text-gray-800">Menu</span>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <ClearOutlinedIcon sx={{ color: "#6b7280", fontSize: 24 }} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-6 py-8">
            <nav className="space-y-2">
              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                  setVisible(false);
                  scrollToTop();
                  setTimeout(() => window.location.href = '/', 100);
                }}
                className="flex items-center gap-4 py-4 px-4 rounded-xl text-gray-700 hover:bg-orange-600 hover:text-orange-600 transition-all duration-200 group"
                to="/"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                  <span className="menu-span text-gray-700 font-semibold text-sm">H</span>
                </div>
                <span className="font-medium">HOME</span>
              </NavLink>

              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                  setVisible(false);
                  scrollToTop();
                  setTimeout(() => window.location.href = '/collection', 100);
                }}
                className="flex items-center gap-4 py-4 px-4 rounded-xl text-gray-700 hover:bg-orange-600 hover:text-orange-600 transition-all duration-200 group"
                to="/collection"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                  <span className="menu-span text-gray-700 font-semibold text-sm">C</span>
                </div>
                <span className="font-medium">COLLECTION</span>
              </NavLink>

              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                  setVisible(false);
                  scrollToTop();
                  setTimeout(() => window.location.href = '/about', 100);
                }}
                className="flex items-center gap-4 py-4 px-4 rounded-xl text-gray-700 hover:bg-orange-600 hover:text-orange-600 transition-all duration-200 group"
                to="/about"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                  <span className="menu-span text-gray-700 font-semibold text-sm">A</span>
                </div>
                <span className="font-medium">ABOUT</span>
              </NavLink>

              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                  setVisible(false);
                  scrollToTop();
                  setTimeout(() => window.location.href = '/contact', 100);
                }}
                className="flex items-center gap-4 py-4 px-4 rounded-xl text-gray-700 hover:bg-orange-600 hover:text-orange-600 transition-all duration-200 group"
                to="/contact"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                  <span className="menu-span text-gray-700 font-semibold text-sm">C</span>
                </div>
                <span className="font-medium">CONTACT</span>
              </NavLink>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100">
            <div className="text-center text-sm text-gray-500">
              <p>© 2024 Ink Dapper</p>
              <p className="mt-1">Premium T-Shirt Branding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
