import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import LanguageSelector from "../../components/languageSelector/LanguageSelector";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/logo.png";
import { 
  FaThLarge, 
  FaClipboardCheck, 
  FaHome, 
  FaSignOutAlt, 
  FaUserShield, 
  FaBars, 
  FaTimes, 
  FaGlobe,
  FaBell,
  FaCog,
  FaSearch,
  FaChevronDown
} from "react-icons/fa";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice";
import Profile from "../../components/profile/Profile.jsx";
import "./AdminAppLayout.scss";

const AdminAppLayout = ({ children }) => {
  const { language, changeLanguage } = useLanguage();
  const { theme } = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
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
      navigate("/admin/signin");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const menuItems = [
    {
      href: "/admin/dashboard",
      label: { en: "Dashboard", kh: "ផ្ទាំងគ្រប់គ្រង", zh: "仪表板" },
      icon: <FaThLarge />,
    },
    {
      href: "/admin/dashboard/confirm",
      label: { en: "Confirm Requests", kh: "អនុម័តគណនីជាង", zh: "确认申请" },
      icon: <FaClipboardCheck />,
    },
  ];

  const getSystemLabel = (key) => {
    const labels = {
      overview: { en: "System Control", kh: "ការគ្រប់គ្រងប្រព័ន្ធ", zh: "系统控制" },
      portal: { en: "Admin Portal", kh: "ផ្ទាំងគ្រប់គ្រង Admin", zh: "管理员门户" },
      signOut: { en: "Sign Out", kh: "ចាកចេញ", zh: "退出登录" },
      viewSite: { en: "View Website", kh: "មើលគេហទំព័រ", zh: "访问网站" },
      languageLabel: { en: "Language", kh: "ភាសា", zh: "语言" }
    };
    return labels[key]?.[language] || labels[key]?.["en"];
  };

  const getBreadcrumbs = () => {
    const path = window.location.pathname;
    const isConfirm = path.includes("/confirm");
    return (
      <div className="navbar-breadcrumbs">
        <FaHome className="breadcrumb-home-icon" />
        <span className="breadcrumb-parent">Admin</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-active">
          {isConfirm 
            ? (language === "kh" ? "អនុម័តគណនីជាង" : "Confirm Requests")
            : (language === "kh" ? "ផ្ទាំងគ្រប់គ្រង" : "Dashboard")}
        </span>
      </div>
    );
  };


  return (
    <div className={`admin-layout-wrapper ${theme} ${language}`}>
      {/* Sidebar Overlay for Mobile */}
      {showSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${showSidebar ? "show" : ""}`}>
        {/* Sidebar Logo */}
        <div className="sidebar-brand">
          <img src={Logo} alt="Cheang Logo" className="brand-logo" />
          <div className="brand-info">
            <span className="brand-name">Cheang</span>
            <span className="brand-badge">ADMIN</span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setShowSidebar(false)}>
            <FaTimes />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="sidebar-nav">
          <span className="nav-section-title">{getSystemLabel("overview")}</span>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.href} className="nav-item">
                <NavLink
                  to={item.href}
                  end
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setShowSidebar(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label[language] || item.label["en"]}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <span className="nav-section-title" style={{ marginTop: "2rem" }}>Actions</span>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className="nav-link view-site-link"
                onClick={() => setShowSidebar(false)}
              >
                <span className="nav-icon"><FaHome /></span>
                <span className="nav-label">{getSystemLabel("viewSite")}</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Sidebar Profile Card */}
        {currentUser && (
          <div className="sidebar-user-card">
            <div className="user-avatar-wrapper">
              <Profile src={currentUser.avatar} />
            </div>
            <div className="user-details">
              <h4 className="user-name">{currentUser.nameuser}</h4>
              <p className="user-role">Super Admin</p>
            </div>
            <button className="signout-button" onClick={handleSignOut} title={getSystemLabel("signOut")}>
              <FaSignOutAlt />
            </button>
          </div>
        )}
      </aside>

      {/* Main Panel */}
      <div className="admin-main-panel">
        {/* Floating Navbar */}
        <header className="admin-top-navbar">
          <div className="navbar-left">
            <button className="sidebar-toggle-btn" onClick={() => setShowSidebar(!showSidebar)}>
              <FaBars />
            </button>
            {getBreadcrumbs()}
          </div>

          {/* Search bar inside header */}
          <div className="navbar-search-wrapper">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={language === "kh" ? "ស្វែងរកប្រព័ន្ធ..." : "Search system dashboard..."} 
              className="navbar-search-input" 
            />
            <span className="search-shortcut">⌘K</span>
          </div>

          <div className="navbar-right">
            {/* Notifications and Settings shortcuts */}
            <div className="navbar-action-btn notification-trigger">
              <FaBell />
              <span className="notification-badge">3</span>
            </div>

            <div className="navbar-action-btn">
              <FaCog />
            </div>

            <div className="lang-selector-group">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
            </div>

            {/* Profile Pill Trigger */}
            {currentUser && (
              <div 
                className="nav-profile-pill" 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="nav-avatar-display">
                  <Profile src={currentUser.avatar} />
                </div>
                <div className="nav-profile-details">
                  <span className="profile-name">{currentUser.nameuser}</span>
                  <span className="profile-role">Super Admin</span>
                </div>
                <FaChevronDown className={`profile-dropdown-arrow ${showProfileDropdown ? "rotate" : ""}`} />
                
                {/* Profile Dropdown List */}
                <div className={`profile-dropdown-menu ${showProfileDropdown ? "show" : ""}`}>
                  <div className="dropdown-header">
                    <span className="dropdown-user-name">{currentUser.nameuser}</span>
                    <span className="dropdown-user-email">{currentUser.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/" className="dropdown-item">
                    <FaHome /> <span>{getSystemLabel("viewSite")}</span>
                  </Link>
                  <button className="dropdown-item signout-btn" onClick={handleSignOut}>
                    <FaSignOutAlt /> <span>{getSystemLabel("signOut")}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="admin-content-workspace">
          {children}
        </main>

        {/* Footer */}
        <footer className="admin-footer">
          <p>&copy; 2026 Handy. All rights reserved. Powered by Visal, Brathna, Sophana</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminAppLayout;
