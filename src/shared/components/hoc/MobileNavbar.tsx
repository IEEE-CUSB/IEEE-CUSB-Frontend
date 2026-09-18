import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaCalendarAlt,
  FaFlask,
  FaUserCircle,
  FaInfo,
  FaUsers,
} from 'react-icons/fa';
import { FiSettings, FiLogOut, FiUser } from 'react-icons/fi'; // Additional icons
import { MdAdminPanelSettings } from 'react-icons/md';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAppSelector } from '@/shared/store/hooks';
import { useLogout } from '@/shared/queries/auth';
import { RoleName } from '@/shared/types/auth.types';
import logo from '@/assets/logo.png';

export const MobileNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin =
    user?.role?.name === RoleName.ADMIN ||
    user?.role?.name === RoleName.SUPER_ADMIN;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Common NavLink style generator
  const getNavLinkClass = (isActive: boolean) =>
    `flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
      isActive
        ? 'text-primary'
        : isDark
          ? 'text-gray-400 hover:text-white'
          : 'text-gray-500 hover:text-primary'
    }`;

  return (
    <div className="block md:hidden">
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div
            className={`relative w-full rounded-t-3xl p-6 transition-transform duration-300 transform translate-y-0 ${
              isDark
                ? 'bg-gray-900 border-t border-gray-800 text-white'
                : 'bg-white border-t border-gray-100 text-gray-900'
            }`}
          >
            {/* Close Handle / Indicator */}
            <div className="flex justify-center mb-4">
              <div
                className={`w-12 h-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
              />
            </div>

            {/* Menu Header (User Info or Welcome) */}
            <div className="mb-6 text-center">
              {isAuthenticated && user ? (
                <div className="flex flex-col items-center">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-primary/20 mb-3"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <FaUserCircle className="w-10 h-10 text-primary" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{user.name}</h3>
                  <p
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {user.email}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                      isDark
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {user?.role?.name}
                  </span>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    Welcome to IEEE CUSB
                  </h3>
                  <p
                    className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Join our community to access exclusive features.
                  </p>
                  <Link
                    to="/join"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block px-6 py-2 rounded-full font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    Join Us
                  </Link>
                </div>
              )}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <FiUser className="w-6 h-6 mb-2 text-primary" />
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>
                  <Link
                    to="/join"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <FaUsers className="w-6 h-6 mb-2 text-primary" />
                    <span className="text-sm font-medium">Join Us</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${
                        isDark
                          ? 'bg-gray-800 hover:bg-gray-700'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <MdAdminPanelSettings className="w-6 h-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">Admin Panel</span>
                    </Link>
                  )}
                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <FiSettings className="w-6 h-6 mb-2 text-primary" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                  <div
                    onClick={handleLogout}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-red-900/10 hover:bg-red-900/20'
                        : 'bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <FiLogOut className="w-6 h-6 mb-2 text-red-500" />
                    <span className="text-sm font-medium text-red-500">
                      Logout
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* Additional Items for Guests if needed */}
                  <div
                    onClick={toggleTheme}
                    className={`col-span-2 flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isDark ? (
                        <HiSun className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <HiMoon className="w-5 h-5 text-blue-600" />
                      )}
                      <span className="font-medium">Theme</span>
                    </div>
                    <span
                      className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      {isDark ? 'Switch to Light' : 'Switch to Dark'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                isDark
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 w-full grid grid-cols-7 items-center h-16 border-t rounded-t-3xl shadow-lg transition-all duration-300 ${
          isDark
            ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800 shadow-blue-900/10'
            : 'bg-white/95 backdrop-blur-xl border-gray-100 shadow-gray-200/50'
        }`}
      >
        {/* 1. Home */}
        <div className="col-start-1 flex justify-center">
          <NavLink
            className={({ isActive }) => getNavLinkClass(isActive)}
            to="/"
          >
            <FaHome size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </NavLink>
        </div>

        {/* 2. Committees */}
        <div className="col-start-2 flex justify-center">
          <NavLink
            className={({ isActive }) => getNavLinkClass(isActive)}
            to="/committees"
          >
            <FaUsers size={20} />
            <span className="text-[10px] font-medium">Committees</span>
          </NavLink>
        </div>

        {/* 3. Events */}
        <div className="col-start-3 flex justify-center">
          <NavLink
            className={({ isActive }) => getNavLinkClass(isActive)}
            to="/events"
          >
            <FaCalendarAlt size={20} />
            <span className="text-[10px] font-medium">Events</span>
          </NavLink>
        </div>

        {/* 4. CENTER - Reserved Space */}
        <div className="col-start-4 w-full h-full pointer-events-none" />

        {/* 5. Workshops */}
        <div className="col-start-5 flex justify-center">
          <NavLink
            className={({ isActive }) => getNavLinkClass(isActive)}
            to="/workshops"
          >
            <FaFlask size={20} />
            <span className="text-[10px] font-medium">Workshops</span>
          </NavLink>
        </div>

        {/* 6. About Us */}
        <div className="col-start-6 flex justify-center">
          <NavLink
            className={({ isActive }) => getNavLinkClass(isActive)}
            to="/about"
          >
            <FaInfo size={20} />
            <span className="text-[10px] font-medium">About</span>
          </NavLink>
        </div>

        {/* 7. Action Button (Theme or Login) */}
        <div className="col-start-7 flex justify-center">
          {isAuthenticated ? (
            <button
              onClick={toggleTheme}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                isDark
                  ? 'text-gray-400 hover:text-yellow-400'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              {isDark ? <HiSun size={20} /> : <HiMoon size={20} />}
              <span className="text-[10px] font-medium">Theme</span>
            </button>
          ) : (
            <NavLink
              className={({ isActive }) => getNavLinkClass(isActive)}
              to="/login"
            >
              <div className="relative">
                <FaUserCircle size={20} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
              </div>
              <span className="text-[10px] font-medium">Sign In</span>
            </NavLink>
          )}
        </div>

        {/* Centered Logo Button (Absolute Overlay) */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="absolute left-1/2 -translate-x-1/2 -top-7 z-50 group"
          aria-label="Open Menu"
        >
          {/* Pedestal Shadow */}
          <div
            aria-hidden
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-14 rounded-full bg-black/10 blur-md"
          />
          {/* Badge/Button */}
          <div
            className={`rounded-full p-0.5 border shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 group-active:scale-95 ${
              isDark
                ? 'bg-gray-900 border-gray-800'
                : 'bg-white border-gray-200'
            }`}
          >
            <div
              className={`rounded-full p-0.5 bg-gradient-to-b transition-all duration-300 ${
                isDark
                  ? 'from-gray-800 to-blue-950/30'
                  : 'from-white to-blue-50'
              }`}
            >
              <img
                src={logo}
                alt="Menu"
                className="block h-12 w-12 object-contain"
              />
            </div>
          </div>
        </button>
      </nav>
    </div>
  );
};
