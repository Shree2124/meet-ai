// @ts-ignore

import React, { useEffect, useState } from "react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/constants/navigationItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faCaretDown,
  faCaretUp,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUser } from "@/redux/slices/authSlice";
import axios from "axios";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

function Navbar() {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch user information on component mount
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // console.log("Avatar: ", user.avatar);
  

  const [openNavigation, setOpenNavigation] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter()
  const toggleNavigation = () => {
    setOpenNavigation((prev) => !prev);
    if (!openNavigation) {
      disablePageScroll();
    } else {
      enablePageScroll();
    }
  };

  const handleDropdownToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

const handleOptionClick=(url:string)=>{
  const sectionId=url.replace("#","")
  const section=document.getElementById(sectionId);
  if(section){
    section.scrollIntoView({behavior:"smooth"})
  }
  setOpenNavigation(false);

}

const handleLogout = async() => {
  const response = await axiosInstance.get(
    `/user/logout`
  );
  console.log("Response: ", response.data);
  router.replace("/")
}
  return (
    <div className="relative">
      <div
        className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 transition-all duration-300 ${
          openNavigation ? "bg-black/50" : "bg-black/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center px-4 lg:px-3 xl:px-6">
          <Link href="#hero" className="block xl:mr-8 w-[12rem]">
            <Logo width={"4rem"}/>
          </Link>

          {/* Navigation for Larger Devices */}
          <div className="hidden lg:flex flex-grow justify-center space-x-8">
            {navigation.map(
              (item) =>
                !item.onlyMobile && (
                  <button
                   key={item.id}
                   onClick={()=>handleOptionClick(item.url)}
                   className="block px-6 py-6 md:py-8 font-roboto font-normal text-[16px] text-n-1 hover:text-color-1 uppercase transition-colors"
                  >
                        {item.title}
                  </button>
                )
            )}
          </div>

          {/* Buttons for Larger Devices */}
          <div className="hidden relative lg:flex items-center space-x-4 ml-auto">
            {user ? (
              <Box position="relative">
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={
                      user.avatar ||
                      "https://www.w3schools.com/howto/img_avatar.png"
                    }
                  />
                  <Typography sx={{ ml: 1 }}>
                    {user?.userName || "User"}
                  </Typography>
                  <IconButton onClick={handleDropdownToggle}>
                  <FontAwesomeIcon
                    color="white"
                    icon={isDropdownOpen ? { prefix: 'fas', iconName: 'caret-up' } : { prefix: 'fas', iconName: 'caret-down' }}
                  />
                  </IconButton>
                </Box>

                {isDropdownOpen && (
                  <Box
                    sx={{
                      marginTop: "0.5rem",
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      bgcolor: "#313131",
                      boxShadow: 1,
                      borderRadius: 1,
                      zIndex: 999,
                      padding: "0.5rem"
                    }}
                  >
                    <Link
                      href="profile"
                      className="block hover:bg-[#434244] px-4 py-2 rounded-md"
                      onClick={() => {
                        setDropdownOpen(false);
                        toggleNavigation();
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      className="block hover:bg-[#434244] px-4 py-2 rounded-md"
                      onClick={() => {
                        handleLogout()
                        setDropdownOpen(false);
                  
                      }}
                    >
                      Logout
                    </button>
                    <Link
                      href="/user/dashboard"
                      className="block hover:bg-[#434244] px-4 py-2 rounded-md"
                      onClick={() => {
                        setDropdownOpen(false);
                      }}
                    >
                      Dashboard
                    </Link>
                  </Box>
                )}
              </Box>
            ) : (
              <>
                <Link
                  href="auth/register"
                  className="text-n-1/50 hover:text-n-1 transition-colors button"
                >
                  Sign up
                </Link>
                <Link
                  href="auth/login"
                  className="flex items-center space-x-2 bg-primary-gradient hover:shadow-brand-purple-500/80 hover:shadow-md px-6 py-3 rounded-lg font-semibold text-white hover:text-white/80 text-sm leading-none whitespace-nowrap transition duration-300 ease-in-out"
                >
                  <span>Sign in</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.366 17.648a1.2 1.2 0 0 1 0-1.696L12.318 12 8.366 8.048a1.2 1.2 0 1 1 1.697-1.696l4.8 4.8a1.2 1.2 0 0 1 0 1.696l-4.8 4.8a1.2 1.2 0 0 1-1.697 0Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </Link>
              </>
            )}
          </div>

          <button
            aria-label="Toggle Navigation"
            className="lg:hidden z-10 relative ml-auto px-3"
            onClick={toggleNavigation}
          >
            <FontAwesomeIcon
              icon={{ iconName: openNavigation ? 'times' : 'bars', prefix: 'fas' }}
              className="text-gray-600 transition-transform duration-300"
            />
          </button>
        </div>
      </div>

      {/* Overlay and Menu */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          openNavigation
            ? "opacity-100 lg:opacity-0 md:visible"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {openNavigation && (
          <div
            className="absolute inset-0 bg-black/80"
            onClick={toggleNavigation}
          ></div>
        )}
        <nav
          className={`fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${
            openNavigation ? "translate-x-0" : "translate-x-full"
          } z-50 md:flex lg:hidden`}
        >
          <div className="flex flex-col items-center mt-4">
            {navigation.map(
              (item) =>
                !item.onlyMobile && (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={toggleNavigation}
                    className={`block text-[16px] uppercase text-n-1 transition-colors hover:text-color-1 ${
                      item.onlyMobile ? "lg:hidden" : ""
                    } px-6 py-6 md:py-8 font-roboto font-normal`}
                  >
                    {item.title}
                  </Link>
                )
            )}

            {user ? (
              <>
                <Link
                  href="user/dashboard"
                  onClick={toggleNavigation}
                  className="flex justify-between items-center px-6 py-6 md:py-8 font-roboto font-normal text-[16px] text-n-1 hover:text-color-1 uppercase transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    // Add your logout functionality here
                    handleLogout()
                  }}
                  className="flex justify-between items-center px-6 py-6 md:py-8 font-roboto font-normal text-[16px] text-n-1 hover:text-color-1 uppercase transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="auth/register"
                  className="py-6 text-n-1 hover:text-color-1 text-xl uppercase transition-colors"
                >
                  Sign up
                </Link>
                <Link
                  href="auth/login"
                  className="bg-primary-gradient px-6 py-3 rounded-lg text-white hover:text-white/80 text-xl uppercase"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
