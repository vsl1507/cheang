/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../../assets/logo.png";
import {
  NavigationLink,
  NavigationLinkDisabled,
} from "../../components/navigationLink/NavigationLink";
import {
  getAbout,
  getBecomePro,
  getHome,
  getService,
  getSignup,
} from "../../data/wordsLanguage";
import ServiceList from "../../data/ServiceList";
import LanguageSelector from "../../components/languageSelector/LanguageSelector";
import ThemeSelector from "../../components/themeSelector/ThemeSelector";
import Profile from "../../components/profile/Profile";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice";
import "./MainNavbar.scss";

const MainNavbar = ({ page }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      localStorage.removeItem("authToken");
      dispatch(signOutUserSuccess());
      setShowDropdown(false);
      navigate("/");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setShowMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageLink = page;

  return (
    <nav className={`navbar-wrapper ${theme}`}>
      <div className="navbar-container">
        {/* Hamburger Menu Toggle (Mobile) */}
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          {showMenu ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logo and Brand */}
        <div className="navbar-logo-section">
          <NavLink to="/" className="logo-link">
            <img src={Logo} alt="Cheang Logo" className="logo-img" />
            <span className="brand-name">Cheang</span>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className={`navbar-links-section ${showMenu ? "active" : ""}`}>
          <div className="nav-item">
            {pageLink === "home" ? (
              <NavigationLinkDisabled value={getHome(language)} />
            ) : (
              <NavigationLink href="/" value={getHome(language)} />
            )}
          </div>

          <div className="nav-item dropdown">
            {pageLink === "service" ? (
              <NavigationLinkDisabled value={getService(language)} />
            ) : (
              <NavigationLink href="/service" value={getService(language)} />
            )}
            
            <div className="dropdown-menu-list">
              {ServiceList.map((service) => (
                <NavLink
                  to={`/userlist/${service.value}`}
                  className="dropdown-item-link"
                  key={service.id}
                  onClick={() => setShowMenu(false)}
                >
                  {service.value}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="nav-item">
            {pageLink === "about" ? (
              <NavigationLinkDisabled value={getAbout(language)} />
            ) : (
              <NavigationLink value={getAbout(language)} href="/about" />
            )}
          </div>
        </div>

        {/* Controls and Account Panel */}
        <div className="navbar-actions-section">
          {/* Controls */}
          <div className="actions-controls">
            <ThemeSelector />
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          {/* Account Details */}
          <div className="actions-account">
            {currentUser ? (
              <div className="user-profile-group">
                {!currentUser.userPro && (
                  <NavLink to="/signup-pro" className="become-pro-pill" onClick={() => setShowMenu(false)}>
                    {getBecomePro(language)}
                  </NavLink>
                )}
                
                {/* Circular Profile Avatar with Dropdown */}
                <div className="profile-dropdown-wrapper">
                  <div className="avatar-trigger" onClick={toggleDropdown}>
                    <Profile src={currentUser.avatar} />
                  </div>
                  {showDropdown && (
                    <div className={`profile-dropdown-menu ${theme}`}>
                      <div className="dropdown-user-info">
                        <span className="dropdown-username">{currentUser.nameuser}</span>
                        <span className="dropdown-email">{currentUser.email}</span>
                      </div>
                      <div className="dropdown-divider"></div>
                      <NavLink 
                        to="/profile" 
                        state={{ activeTab: "about" }} 
                        className="dropdown-menu-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile Info
                      </NavLink>
                      <NavLink 
                        to="/profile" 
                        state={{ activeTab: "setting" }} 
                        className="dropdown-menu-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        Settings
                      </NavLink>
                      {(currentUser.admin || currentUser.isAdmin) && (
                        <NavLink 
                          to="/admin/dashboard" 
                          className="dropdown-menu-item"
                          onClick={() => setShowDropdown(false)}
                        >
                          Admin Dashboard
                        </NavLink>
                      )}
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-menu-item logout-btn" onClick={handleSignOut}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <NavLink to="/signup" className="signup-outline-btn" onClick={() => setShowMenu(false)}>
                {getSignup(language)}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
