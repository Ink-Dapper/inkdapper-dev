import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    getWishlistCount,
    setWishlist,
    usersDetails,
  } = useContext(ShopContext);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [value, setValue] = useState("recent");
  const [mobMenu, setMobMenu] = useState("hidden");
  const [userNameLetter, setUserNameLetter] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      const wishlistCount = await getWishlistCount();
      setWishlistCount(wishlistCount);
    };
    fetchCounts();
  }, [getWishlistCount]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const subMenuVisible = () => {
    if (!token) {
      navigate("/login");
    }

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
    setCartItems({});
    setWishlist({});
  };

  // Smoothly scroll window to the top
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const userName = () => {
    usersDetails.map((user) => {
      setUserNameLetter(user.users.name[0]);
    });
  };

  useEffect(() => {
    userName();
  }, [usersDetails]);

  return (
    <div className="">
      <div className="flex items-center md:flex-row justify-between flex-row-reverse py-3 md:py-5 font-medium">
        <Link to="/">
          <div className="flex items-end gap-2">
            <img src={assets.inkdapper_logo} className="md:w-12 w-10" alt="logo" />
            {/* <p className='md:text-2xl text-xl font-medium'>Ink Dapper</p> */}
          </div>
        </Link>

        <ul className="hidden md:flex gap-5 text-sm text-slate-800 font-semibold">
          <NavLink to="/" className="flex flex-col items-center gap-1 hover:text-orange-600 transition-colors duration-300">
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-orange-600 hidden" />
          </NavLink>
          <NavLink to="/collection" className="flex flex-col items-center gap-1 hover:text-orange-600 transition-colors duration-300">
            <p>COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-orange-600 hidden" />
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1 hover:text-orange-600 transition-colors duration-300">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-orange-600 hidden" />
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1 hover:text-orange-600 transition-colors duration-300">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-orange-600 hidden" />
          </NavLink>
        </ul>

        <div className="hidden md:block">
          <div className="flex items-center gap-6">
            <SearchIcon onClick={() => setShowSearch(true)} className="cursor-pointer text-slate-700 hover:text-orange-600 transition-colors duration-300" sx={{ fontSize: 30 }} alt="search-icon" />
            <Link to="/cart" className="relative">
              <LocalMallOutlinedIcon alt="cart icon" className="cursor-pointer text-slate-700 hover:text-orange-600 transition-colors duration-300" sx={{ fontSize: 25 }} />
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-orange-600 text-white aspect-square rounded-full text-[8px] font-semibold">
                {getCartCount()}
              </p>
            </Link>
            <Link to="/wishlist" className="relative">
              <span>
                <FavoriteBorderOutlinedIcon alt="cart icon" className="cursor-pointer text-slate-700 hover:text-orange-600 transition-colors duration-300" sx={{ fontSize: 25 }} />
                <p className="absolute right-[-3px] bottom-[-5px] w-4 text-center leading-4 bg-orange-600 text-white aspect-square rounded-full text-[8px] font-semibold">
                  {wishlistCount}
                </p>
              </span>
            </Link>

            <div className="group relative">
              <AccountCircleOutlinedIcon onClick={() => (token ? null : navigate("/login"))} alt="profile icon" className="cursor-pointer text-slate-700 hover:text-orange-600 transition-colors duration-300"
                sx={{ fontSize: 28 }} />
              {token && (
                <span className="absolute right-0 top-[1px] w-7 h-7 z-10 rounded-full bg-orange-600 text-white flex justify-center items-center cursor-pointer uppercase font-semibold">
                  {userNameLetter}
                </span>
              )}
              {/* Dropdown Menu*/}
              {token && (
                <div className="group-hover:block hidden absolute dropdown-menu right-[-24px] pt-4 z-10">
                  <div className="flex flex-col gap-2 w-36 py-3 px-3 bg-white/95 backdrop-blur-sm text-slate-700 rounded text-right pr-5 shadow-lg border border-white/20">
                    <p onClick={() => navigate("/profile")} className="cursor-pointer hover:text-orange-600 transition-colors duration-300">
                      My Profile
                    </p>
                    <p onClick={() => navigate("/orders")} className="cursor-pointer hover:text-orange-600 transition-colors duration-300">
                      Orders
                    </p>
                    <p onClick={logout} className="cursor-pointer hover:text-orange-600 transition-colors duration-300">
                      Logout
                    </p>
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
      <div className="fixed bottom-0 -left-0 w-[100%] z-30  md:hidden">
        <div className="flex grid-cols-4 justify-around p-3 bg-gray-950 rounded-t-md">
          <p>
            <Link to="/" onClick={scrollToTop}>
              <img src={assets.logo_white_only} className="w-7" alt="logo" />
            </Link>
          </p>
          <p className="relative">
            <Link to="/cart" onClick={scrollToTop}>
              <LocalMallOutlinedIcon sx={{ color: "white" }} />
              <span className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-gray-50 text-black aspect-square rounded-full text-[8px]">
                {getCartCount()}
              </span>
            </Link>
          </p>
          <p className="relative">
            <Link to="/wishlist" onClick={scrollToTop}>
              <FavoriteBorderOutlinedIcon sx={{ color: "white" }} />
              <span className="absolute right-[-3px] bottom-[-5px] w-4 text-center leading-4 bg-gray-50 text-black aspect-square rounded-full text-[8px]">
                {wishlistCount}
              </span>
            </Link>
          </p>
          <div className="relative">
            <p onClick={() => subMenuVisible()} className="relative">
              <AccountCircleOutlinedIcon sx={{ color: "white" }} />
            </p>
            {token && (
              <span onClick={() => subMenuVisible()} className="absolute right-0 top-0 w-7 h-7 z-10 rounded-full bg-orange-600 text-white flex justify-center uppercase shadow-md items-center cursor-pointer">
                {userNameLetter}
              </span>
            )}
            {/* Dropdown Menu */}
            {token && (
              <div className={`absolute ${mobMenu} bottom-full mb-2 right-0 z-20 transition-all duration-300 ease-in-out`}>
                <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[140px]">
                  <div className="py-2">
                    <button
                      onClick={() => { navigate("/profile"); setMobMenu("hidden"); scrollToTop() }}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-orange-600 rounded-full"></span>
                      My Profile
                    </button>
                    <button
                      onClick={() => { navigate("/orders"); setMobMenu("hidden"); scrollToTop() }}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-orange-600 rounded-full"></span>
                      Orders
                    </button>
                    <hr className="border-gray-100 my-1" />
                    <button
                      onClick={() => { logout(); setMobMenu("hidden"); scrollToTop() }}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                onClick={() => setVisible(false)}
                className="flex items-center gap-4 py-4 px-4 rounded-xl text-gray-700 hover:bg-orange-600 hover:text-orange-600 transition-all duration-200 group"
                to="/"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                  <span className="menu-span text-gray-700 font-semibold text-sm">H</span>
                </div>
                <span className="font-medium">HOME</span>
              </NavLink>

              <NavLink
                onClick={() => setVisible(false)}
                className="flex items-center gap-4 py-4 px-4 rounded-xl text-gray-700 hover:bg-orange-600 hover:text-orange-600 transition-all duration-200 group"
                to="/collection"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                  <span className="menu-span text-gray-700 font-semibold text-sm">C</span>
                </div>
                <span className="font-medium">COLLECTION</span>
              </NavLink>

              <NavLink
                onClick={() => setVisible(false)}
                className="flex items-center gap-4 py-4 px-4 rounded-xl text-gray-700 hover:bg-orange-600 hover:text-orange-600 transition-all duration-200 group"
                to="/about"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                  <span className="menu-span text-gray-700 font-semibold text-sm">A</span>
                </div>
                <span className="font-medium">ABOUT</span>
              </NavLink>

              <NavLink
                onClick={() => setVisible(false)}
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
