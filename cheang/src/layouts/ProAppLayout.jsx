import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import LanguageSelector from "../components/languageSelector/LanguageSelector";
import ThemeSelector from "../components/themeSelector/ThemeSelector";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../assets/logo.png";
import {
  FaWrench,
  FaPlusCircle,
  FaInfoCircle,
  FaSave,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaUser,
  FaChartLine,
} from "react-icons/fa";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import Profile from "../components/profile/Profile.jsx";
import "./ProAppLayout.scss";

const ProAppLayout = ({ children, activeTab, setActiveTab }) => {
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
      navigate("/");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: { en: "Overview", kh: "ទិដ្ឋភាពទូទៅ", zh: "概览" },
      icon: <FaChartLine />,
    },
    {
      id: "service",
      label: { en: "My Services", kh: "សេវាកម្មរបស់ខ្ញុំ", zh: "我的服务" },
      icon: <FaWrench />,
    },
    {
      id: "addService",
      label: { en: "Add Service", kh: "បន្ថែមសេវាកម្ម", zh: "添加服务" },
      icon: <FaPlusCircle />,
    },
    {
      id: "about",
      label: { en: "Business Profile", kh: "ប្រវត្តិរូបអាជីវកម្ម", zh: "业务资料" },
      icon: <FaInfoCircle />,
    },
    {
      id: "save",
      label: { en: "Saved Items", kh: "របស់រក្សាទុក", zh: "已保存" },
      icon: <FaSave />,
    },
    {
      id: "setting",
      label: { en: "Account Settings", kh: "ការកំណត់គណនី", zh: "账户设置" },
      icon: <FaCog />,
    },
  ];

  const getSystemLabel = (key) => {
    const labels = {
      overview: { en: "Provider Panel", kh: "ផ្ទាំងគ្រប់គ្រងជាង", zh: "服务商控制台" },
      signOut: { en: "Sign Out", kh: "ចាកចេញ", zh: "退出登录" },
      viewSite: { en: "View Marketplace", kh: "មើលគេហទំព័រផ្សារ", zh: "浏览市场" },
      viewProfile: { en: "Public Profile", kh: "ប្រវត្តិរូបជាសាធារណៈ", zh: "公开主页" }
    };
    return labels[key]?.[language] || labels[key]?.["en"];
  };

  const getActiveTabLabel = () => {
    const item = menuItems.find((m) => m.id === activeTab);
    return item ? (item.label[language] || item.label["en"]) : "Dashboard";
  };

  return (
    <div className={`pro-layout-wrapper ${theme} ${language}`}>
      {/* Sidebar Overlay */}
      {showSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar */}
      <aside className={`pro-sidebar ${showSidebar ? "show" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <img src={Logo} alt="Cheang Logo" className="brand-logo" />
          <div className="brand-info">
            <span className="brand-name">Cheang</span>
            <span className="brand-badge">PRO</span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setShowSidebar(false)}>
            <FaTimes />
          </button>
        </div>

        {/* Sidebar Nav */}
        <div className="sidebar-nav">
          <span className="nav-section-title">{getSystemLabel("overview")}</span>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowSidebar(false);
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label[language] || item.label["en"]}</span>
                </button>
              </li>
            ))}
          </ul>

          <span className="nav-section-title" style={{ marginTop: "2rem" }}>Navigation</span>
          <ul className="nav-list">
            <li className="nav-item">
              {currentUser && (
                <Link
                  to={`/profile/${currentUser._id}`}
                  className="nav-link view-profile-link"
                >
                  <span className="nav-icon"><FaUser /></span>
                  <span className="nav-label">{getSystemLabel("viewProfile")}</span>
                </Link>
              )}
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link view-site-link">
                <span className="nav-icon"><FaHome /></span>
                <span className="nav-label">{getSystemLabel("viewSite")}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="sidebar-user-card">
            <div className="user-avatar-wrapper">
              <Profile src={currentUser.avatar} />
            </div>
            <div className="user-details">
              <h4 className="user-name">{currentUser.brandName || currentUser.nameuser}</h4>
              <p className="user-role">{currentUser.mainService || "Repairer Pro"}</p>
            </div>
            <button className="signout-button" onClick={handleSignOut} title={getSystemLabel("signOut")}>
              <FaSignOutAlt />
            </button>
          </div>
        )}
      </aside>

      {/* Main Panel */}
      <div className="pro-main-panel">
        {/* Top Navbar */}
        <header className="pro-top-navbar">
          <div className="navbar-left">
            <button className="sidebar-toggle-btn" onClick={() => setShowSidebar(!showSidebar)}>
              <FaBars />
            </button>
            <div className="navbar-breadcrumbs">
              <FaHome className="breadcrumb-home-icon" />
              <span className="breadcrumb-parent">Pro Dashboard</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">{getActiveTabLabel()}</span>
            </div>
          </div>

          <div className="navbar-right">
            <ThemeSelector />
            <div className="lang-selector-group">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
            </div>

            {/* Profile Dropdown */}
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
                  <span className="profile-role">Pro Account</span>
                </div>
                
                <div className={`profile-dropdown-menu ${showProfileDropdown ? "show" : ""}`}>
                  <div className="dropdown-header">
                    <span className="dropdown-user-name">{currentUser.nameuser}</span>
                    <span className="dropdown-user-email">{currentUser.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/" className="dropdown-item">
                    <FaHome /> <span>Marketplace</span>
                  </Link>
                  <button className="dropdown-item signout-btn" onClick={handleSignOut}>
                    <FaSignOutAlt /> <span>{getSystemLabel("signOut")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Workspace */}
        <main className="pro-content-workspace">
          {children}
        </main>

        {/* Footer */}
        <footer className="pro-footer">
          <p>&copy; 2026 Cheang. All rights reserved. Powered by Visal Electrical Services Ltd</p>
        </footer>
      </div>
    </div>
  );
};

export default ProAppLayout;
