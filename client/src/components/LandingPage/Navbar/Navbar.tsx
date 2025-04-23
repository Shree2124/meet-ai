import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUser } from "@/redux/slices/authSlice";
import axiosInstance from "@/utils/axios";
import { Avatar } from "@mui/material";
import { navigation } from "@/constants/navigationItems";
import MeetAILogoContainer from "@/constants/Logo";

// SVG Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch user on mount
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (openNavigation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [openNavigation]);

  const toggleNavigation = () => {
    setOpenNavigation(prev => !prev);
  };

  const handleDropdownToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDropdownOpen(prev => !prev);
  };

  const handleOptionClick = (url: string) => {
    if (url.startsWith('#')) {
      const sectionId = url.replace("#", "");
      try {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } catch (error) {
        console.error("Error scrolling to section:", error);
      }
    } else {
      router.push(url);
    }

    setOpenNavigation(false);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.get(`/user/logout`);
      router.replace("/");
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout failure
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 shadow-lg backdrop-blur-md py-2' : 'bg-black/80 backdrop-blur-sm py-4'
        } border-b border-gray-800`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Text Logo */}

          <MeetAILogoContainer />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navigation
              .filter(item => !item.onlyMobile)
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => handleOptionClick(item.url)}
                  className="group relative px-3 lg:px-4 py-2 font-medium text-gray-200 hover:text-white text-sm lg:text-base"
                >
                  {item.title}
                  <span className="bottom-0 left-1/2 absolute bg-gradient-to-r from-blue-400 to-purple-600 w-0 group-hover:w-4/5 h-0.5 transition-all -translate-x-1/2 duration-300 transform"></span>
                </button>
              ))}
          </nav>

          {/* Authentication & User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  ref={menuButtonRef}
                  onClick={handleDropdownToggle}
                  className="flex items-center space-x-2 hover:bg-gray-800/50 px-3 py-2 rounded-md transition-colors"
                >
                  <Avatar
                    src={user.avatar || "https://www.w3schools.com/howto/img_avatar.png"}
                    alt={user?.userName || "User"}
                    sx={{ width: 32, height: 32 }}
                  />
                  <span className="font-medium text-gray-200 text-sm">
                    {user?.userName || "User"}
                  </span>
                  <span className="transition-transform duration-300">
                    {isDropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </span>
                </button>

                <div
                  className={`absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700 transition-all duration-300 transform origin-top-right ${isDropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                    }`}
                >
                  <Link
                    href="/profile"
                    className="block hover:bg-gray-700 px-4 py-2 text-gray-200 hover:text-white text-sm transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/user/dashboard"
                    className="block hover:bg-gray-700 px-4 py-2 text-gray-200 hover:text-white text-sm transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="block hover:bg-gray-700 px-4 py-2 w-full text-gray-200 hover:text-white text-sm text-left transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="group relative hover:bg-purple-500/20 px-4 py-2 border border-purple-500 rounded-md overflow-hidden font-medium text-white text-sm transition-all duration-300"
                >
                  <span className="z-10 relative">Sign up</span>
                  <span className="bottom-0 left-0 absolute bg-purple-500/10 w-0 group-hover:w-full h-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/auth/login"
                  className="group relative bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700 px-5 py-2 rounded-md overflow-hidden font-medium text-white text-sm transition-all duration-300"
                >
                  <span className="z-10 relative flex items-center">
                    Sign in
                    <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1 duration-300 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  <span className="top-0 left-0 absolute bg-white/10 opacity-0 group-hover:opacity-100 w-full h-full transition-opacity duration-300"></span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden bg-gray-800/50 p-2 rounded-md text-gray-400 hover:text-white transition-colors"
            onClick={toggleNavigation}
            aria-expanded={openNavigation}
          >
            <span className="sr-only">
              {openNavigation ? 'Close menu' : 'Open menu'}
            </span>
            <span className="transition-opacity duration-300">
              {openNavigation ? <CloseIcon /> : <MenuIcon />}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${openNavigation ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="space-y-1 bg-gray-900/95 backdrop-blur-sm px-2 pt-2 pb-3">
          {navigation
            .filter(item => !item.onlyMobile)
            .map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleOptionClick(item.url)}
                className="block hover:bg-gray-700 px-3 py-2 rounded-md w-full font-medium text-gray-300 hover:text-white text-base text-left transition-all duration-300 transform"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.title}
              </button>
            ))}

          {user ? (
            <>
              <div className="pt-4 pb-3 border-gray-700 border-t">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <Avatar
                      src={user.avatar || "https://www.w3schools.com/howto/img_avatar.png"}
                      alt={user?.userName || "User"}
                      sx={{ width: 40, height: 40 }}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-white text-base">{user?.userName || "User"}</div>
                  </div>
                </div>
                <div className="space-y-1 mt-3 px-2">
                  <Link
                    href="/profile"
                    className="block hover:bg-gray-700 px-3 py-2 rounded-md font-medium text-gray-300 hover:text-white text-base transition-colors"
                    onClick={() => setOpenNavigation(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/user/dashboard"
                    className="block hover:bg-gray-700 px-3 py-2 rounded-md font-medium text-gray-300 hover:text-white text-base transition-colors"
                    onClick={() => setOpenNavigation(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="block hover:bg-gray-700 px-3 py-2 rounded-md w-full font-medium text-gray-300 hover:text-white text-base text-left transition-colors"
                    onClick={() => {
                      handleLogout();
                      setOpenNavigation(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="pt-4 pb-3 border-gray-700 border-t">
              <div className="flex flex-col space-y-3 px-2">
                <Link
                  href="/auth/register"
                  className="block hover:bg-purple-500/20 px-4 py-2 border border-purple-500 rounded-md font-medium text-white text-base text-center transition-colors"
                  onClick={() => setOpenNavigation(false)}
                >
                  Sign up
                </Link>
                <Link
                  href="/auth/login"
                  className="block bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700 px-4 py-2 rounded-md font-medium text-white text-base text-center transition-colors"
                  onClick={() => setOpenNavigation(false)}
                >
                  <span className="flex justify-center items-center">
                    Sign in
                    <svg className="ml-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;