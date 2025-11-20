import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import OptimizedImage from './OptimizedImage'

// Enhanced responsive navbar with mobile-first design - Updated for deployment
// Cache bust: v2.1.0 - Mobile responsive enhancement - ${new Date().toISOString()}
const Navbar = () => {
  const navigate = useNavigate()
  const { token, setToken, userData } = React.useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const profileDropdownRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/')
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowMenu(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('nav')) {
        setShowMenu(false)
      }
      if (showProfileDropdown && !profileDropdownRef.current?.contains(event.target)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu, showProfileDropdown])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showMenu])

  return (
    <>
      {/* Mobile Navbar Update Indicator - Remove after confirmation */}
      <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-1 text-xs z-50">
        ✅ Enhanced Mobile Navbar v2.1.0 Deployed Successfully
      </div>
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            {/* Logo */}
            <OptimizedImage
              onClick={() => navigate('/')}
              className="w-24 sm:w-28 md:w-36 lg:w-40 cursor-pointer hover:scale-105 transition-transform duration-200"
              src={assets.logo}
              alt="Logo"
            />

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-6 lg:gap-8 font-semibold text-gray-700">
              {['/', '/doctors', '/about', '/contact'].map((path, i) => {
                const names = ['HOME', 'ALL DOCTORS', 'ABOUT', 'CONTACT'];
                return (
                  <NavLink
                    key={i}
                    to={path}
                    className={({ isActive }) =>
                      `relative px-2 py-1 hover:text-primary transition-colors duration-200
                      ${isActive ? 'text-primary after:absolute after:content-[""] after:h-[2px] after:bg-primary after:w-full after:bottom-0 after:left-0' : ''}`
                    }
                  >
                    {names[i]}
                  </NavLink>
                );
              })}
            </ul>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-4">
              {token ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                      <OptimizedImage
                        src={userData?.image || assets.profile_pic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {userData?.name || 'User'}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        showProfileDropdown ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{userData?.email || 'user@example.com'}</p>
                      </div>
                      
                      <NavLink
                        to="/my-profile"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </NavLink>
                      
                      <NavLink
                        to="/my-appointments"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Appointmentss
                      </NavLink>
                      
                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
                >
                  Login
                </NavLink>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden relative p-2 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 border border-primary/20"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute inset-0 transform transition-all duration-300 ${showMenu ? 'rotate-45 translate-y-0' : '-translate-y-1'}`}>
                  <OptimizedImage
                    className="w-full h-full"
                    src={showMenu ? assets.cross_icon : assets.menu_icon}
                    alt={showMenu ? "Close menu" : "Open menu"}
                  />
                </span>
              </div>
            </button>
          </div>

          {/* Enhanced Mobile Menu */}
          <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            showMenu ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-6 px-4 rounded-b-2xl shadow-2xl">
              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                {['/', '/doctors', '/about', '/contact'].map((path, i) => {
                  const names = ['HOME', 'ALL DOCTORS', 'ABOUT', 'CONTACT'];
                  const icons = [
                    <svg key="home" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>,
                    <svg key="doctors" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>,
                    <svg key="about" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>,
                    <svg key="contact" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ];
                  
                  return (
                    <NavLink
                      key={i}
                      to={path}
                      onClick={() => setShowMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg' 
                          : 'bg-white/80 hover:bg-white text-gray-700 hover:text-primary border border-gray-100 hover:border-primary/30'
                        }`
                      }
                    >
                      <div className={`p-2 rounded-lg ${({ isActive }) => isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                        {icons[i]}
                      </div>
                      <span className="font-semibold text-sm">{names[i]}</span>
                    </NavLink>
                  );
                })}
              </div>
              
              {/* User Section */}
              <div className="border-t border-gray-200 pt-6">
                {token ? (
                  <div className="space-y-4">
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl p-4 border border-primary/10">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-primary/20 shadow-lg">
                            <OptimizedImage
                              src={userData?.image || assets.profile_pic}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{userData?.name || 'User'}</p>
                          <p className="text-xs text-gray-500">{userData?.email || 'user@example.com'}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* User Actions */}
                    <div className="space-y-2">
                      <NavLink
                        to="/my-profile"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-4 px-4 py-3 bg-white/80 hover:bg-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-100 hover:border-primary/30"
                      >
                        <div className="p-2 rounded-lg bg-blue-100">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-sm text-gray-700">My Profile</span>
                      </NavLink>
                      
                      <NavLink
                        to="/my-appointments"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-4 px-4 py-3 bg-white/80 hover:bg-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-100 hover:border-primary/30"
                      >
                        <div className="p-2 rounded-lg bg-green-100">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-sm text-gray-700">My Appointments</span>
                      </NavLink>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-4 px-4 py-3 bg-white/80 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-100 hover:border-red-300 w-full text-left"
                      >
                        <div className="p-2 rounded-lg bg-red-100">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span className="font-semibold text-sm text-red-600">Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600 mb-4">Welcome! Please login to access your account</p>
                      <NavLink
                        to="/login"
                        onClick={() => setShowMenu(false)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-primary transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login to Your Account
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Enhanced Mobile Menu Overlay */}
      {showMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setShowMenu(false)} />
      )}
    </>
  );
};

export default Navbar;
