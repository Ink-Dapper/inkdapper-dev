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

        <ul className="hidden md:flex gap-5 text-sm text-gray-700">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/collection" className="flex flex-col items-center gap-1">
            <p>COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>

        <div className="hidden md:block">
          <div className="flex items-center gap-6">
            <SearchIcon onClick={() => setShowSearch(true)} className="cursor-pointer" sx={{ fontSize: 30, color: "#605e5e" }} alt="search-icon" />
            <Link to="/cart" className="relative">
              <LocalMallOutlinedIcon alt="cart icon" className="cursor-pointer" sx={{ fontSize: 25, color: "#605e5e" }} />
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                {getCartCount()}
              </p>
            </Link>
            <Link to="/wishlist" className="relative">
              <span>
                <FavoriteBorderOutlinedIcon alt="cart icon" className="cursor-pointer" sx={{ fontSize: 25, color: "#605e5e" }} />
                <p className="absolute right-[-3px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                  {wishlistCount}
                </p>
              </span>
            </Link>

            <div className="group relative">
              <AccountCircleOutlinedIcon onClick={() => (token ? null : navigate("/login"))} alt="profile icon" className="cursor-pointer"
                sx={{ fontSize: 28, color: "#605e5e" }} />
              {token && (
                <span className="absolute right-0 top-[1px] w-7 h-7 z-10 rounded-full bg-gray-600 text-white flex justify-center items-center cursor-pointer uppercase">
                  {userNameLetter}
                </span>
              )}
              {/* Dropdown Menu*/}
              {token && (
                <div className="group-hover:block hidden absolute dropdown-menu right-[-24px] pt-4 z-10">
                  <div className="flex flex-col gap-2 w-36 py-3 px-3 bg-slate-100 text-gray-500 rounded text-right pr-5 shadow-lg">
                    <p onClick={() => navigate("/profile")} className="cursor-pointer hover:text-black">
                      My Profile
                    </p>
                    <p onClick={() => navigate("/orders")} className="cursor-pointer hover:text-black">
                      Orders
                    </p>
                    <p onClick={logout} className="cursor-pointer hover:text-black">
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
            <Link to="/">
              <img src={assets.logo_white_only} className="w-7" alt="logo"/>
            </Link>
          </p>
          <p className="relative">
            <Link to="/cart">
              <LocalMallOutlinedIcon sx={{ color: "white" }} />
              <span className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-gray-50 text-black aspect-square rounded-full text-[8px]">
                {getCartCount()}
              </span>
            </Link>
          </p>
          <p className="relative">
            <Link to="/wishlist">
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
              <div className={`group-hover:block absolute ${mobMenu} dropdown-menu -top-36 -right-2 pt-4 z-20`}>
                <div className="flex flex-col gap-2 w-32 py-3 px-3 bg-black text-white rounded text-right">
                  <p onClick={() => { navigate("/profile"); setMobMenu("hidden"); }} className="cursor-pointer hover:text-gray-300">
                    My Profile
                  </p>
                  <p onClick={() => {navigate("/orders"); setMobMenu("hidden"); }} className="cursor-pointer hover:text-gray-300">
                    Orders
                  </p>
                  <p onClick={() => {logout(); setMobMenu("hidden"); }} className="cursor-pointer hover:text-gray-300">
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* {sliderBar menu for mobile} */}
      <div className={`fixed top-0 z-30 left-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? "w-full" : "w-0"}`}>
        <div className="flex flex-col text-gray-50">
          <div className="flex items-center justify-end gap-4 p-4 cursor-pointer" onClick={() => setVisible(false)}>
            <ClearOutlinedIcon alt="dropdown_icon" className="h-4 rotate-180" sx={{ color: "black", fontSize: 30 }} />
          </div>
          <div className="flex flex-col text-gray-50 text-left">
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border text-black" to="/">
              HOME
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border text-black" to="/collection">
              COLLECTION
            </NavLink>
            {/* <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border text-black' to='/custom'>CUSTOM</NavLink> */}
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border text-black" to="/about">
              ABOUT
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border text-black" to="/contact">
              CONTACT
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
