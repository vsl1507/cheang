import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import {
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlusCircle,
  FaBookmark,
  FaCog,
  FaWrench,
  FaSpinner,
} from "react-icons/fa";
import Tag from "../../components/tag/Tag";
import Label from "../../components/label/Label";
import Profile from "../../components/profile/Profile";
import ShowStar from "../../components/starRating/ShowStar";
import TextBorder from "../../components/textBorder/TextBorder";
import ServiceSelector from "../serviceSelector/ServiceSelector";
import AboutUser from "../aboutUser/AboutUser";
import ServiceCreate from "../serviceCreate/ServiceCreate";
import SettingUser from "../settingUser/SettingUser";
import SaveUser from "../saveUser/SaveUser";
import "../profileUser/ProfileUser.scss";

const ProfileUserCurrent = () => {
  const { theme } = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const [normal, setNormal] = useState(currentUser?.userPro ? "service" : "save");
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      setNormal(currentUser.userPro ? "service" : "save");
    }
  }, [currentUser]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setNormal(location.state.activeTab);
    }
  }, [location]);

  const renderTabMenu = () => {
    if (!currentUser) return null;
    return currentUser.userPro ? (
      <div className="serviceDetail-container">
        <button 
          type="button"
          className={normal === "service" ? "disabled" : ""} 
          disabled={normal === "service"}
          onClick={() => setNormal("service")}
        >
          <FaWrench />
          <span>Service</span>
        </button>
        
        <button 
          type="button"
          className={normal === "about" ? "disabled" : ""} 
          disabled={normal === "about"}
          onClick={() => setNormal("about")}
        >
          <FaInfoCircle />
          <span>About</span>
        </button>
        
        <button 
          type="button"
          className={normal === "addService" ? "disabled" : ""} 
          disabled={normal === "addService"}
          onClick={() => setNormal("addService")}
        >
          <FaPlusCircle />
          <span>Add Service</span>
        </button>
        
        <button 
          type="button"
          className={normal === "setting" ? "disabled" : ""} 
          disabled={normal === "setting"}
          onClick={() => setNormal("setting")}
        >
          <FaCog />
          <span>Settings</span>
        </button>
        
        <button 
          type="button"
          className={normal === "save" ? "disabled" : ""} 
          disabled={normal === "save"}
          onClick={() => setNormal("save")}
        >
          <FaBookmark />
          <span>Saves</span>
        </button>
      </div>
    ) : (
      <div className="serviceDetail-container">
        <button 
          type="button"
          className={normal === "save" ? "disabled" : ""} 
          disabled={normal === "save"}
          onClick={() => setNormal("save")}
        >
          <FaBookmark />
          <span>Saved Handymen</span>
        </button>
        
        <button 
          type="button"
          className={normal === "about" ? "disabled" : ""} 
          disabled={normal === "about"}
          onClick={() => setNormal("about")}
        >
          <FaInfoCircle />
          <span>About</span>
        </button>
        
        <button 
          type="button"
          className={normal === "setting" ? "disabled" : ""} 
          disabled={normal === "setting"}
          onClick={() => setNormal("setting")}
        >
          <FaCog />
          <span>Settings</span>
        </button>
      </div>
    );
  };

  const averageRating =
    currentUser && currentUser.ratings && currentUser.ratings.length > 0
      ? currentUser.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
        currentUser.ratings.length
      : 0;

  if (!currentUser) return null;

  return (
    <div className={`ProfileContainer ${theme}`}>
      {/* 1. Full-bleed Hero Cover Banner */}
      <div className={`profile-hero-banner ${currentUser.userPro ? "pro-banner" : "client-banner"}`}></div>

      {/* 2. Overlapping Profile Header Block */}
      <div className="profile-hero-header-wrapper">
        <div className="profile-hero-header">
          <div className="profile-hero-left">
            <div className="profile-avatar-wrapper">
              <Profile src={currentUser.avatar} />
              <span className={`account-badge ${currentUser.userPro ? "pro-badge" : "client-badge"}`}>
                {currentUser.userPro ? "Pro" : currentUser.isAdmin ? "Admin" : "Client"}
              </span>
            </div>
            
            <div className="profile-hero-details">
              <h1 className="profile-brand-title">
                {currentUser.userPro ? (currentUser.brandName || "Repair Provider") : currentUser.nameuser}
              </h1>
              {currentUser.userPro && <p className="profile-owner-name">Owner: {currentUser.nameuser}</p>}
              
              <div className="profile-hero-tags">
                {currentUser.userPro ? (
                  <>
                    {currentUser.mainService && currentUser.mainService !== "None" && currentUser.mainService !== "NONE" && <Tag label={currentUser.mainService} />}
                    {currentUser.subService && currentUser.subService !== "None" && currentUser.subService !== "NONE" && <Tag label={currentUser.subService} />}
                    {(!currentUser.mainService || currentUser.mainService === "None" || currentUser.mainService === "NONE") && <Tag label="Handyman Account" />}
                  </>
                ) : (
                  <Tag label={currentUser.isAdmin ? "Admin Portal" : "Client Account"} />
                )}
              </div>
            </div>
          </div>

          <div className="profile-hero-right">
            {currentUser.userPro && (
              <div className="profile-hero-rating-summary">
                <div className="hero-rating-row">
                  <ShowStar rating={averageRating.toFixed(2)} />
                  <span className="rating-num">{averageRating.toFixed(2)}</span>
                </div>
                <span className="rating-count">({currentUser.ratings?.length || 0} reviews)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Dashboard Horizontal Navigation Bar */}
      <div className="profile-dashboard-tabs-wrapper">
        {renderTabMenu()}
      </div>

      {/* 4. Centered Content Grid */}
      <div className="ProfileContainer-container">
        {/* Left Column Card: Contact & Location details */}
        <div className="ProfileContainer-container-left">
          <div className="profile-details-sidebar-card">
            <h3 className="sidebar-card-title">Contact & Location</h3>
            <div className="sidebar-details-list">
              <TextBorder
                label={<FaMapMarkerAlt />}
                text={
                  (currentUser.city && currentUser.city !== "None" && currentUser.city !== "NONE") || 
                  (currentUser.province && currentUser.province !== "None" && currentUser.province !== "NONE") ?
                  (currentUser.city + " , " + currentUser.province) :
                  "Location not set"
                }
              />
              <TextBorder
                label={<FaPhoneAlt />}
                text={currentUser.phone && currentUser.phone !== "None" && currentUser.phone !== "NONE" ? currentUser.phone : "No phone added"}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Workspaces */}
        <div className="ProfileContainer-container-right">
          <div className="profileTodo">
            {currentUser.userPro ? (
              <>
                {normal === "service" && <ServiceSelector />}
                {normal === "about" && <AboutUser />}
                {normal === "addService" && <ServiceCreate />}
                {normal === "setting" && <SettingUser />}
                {normal === "save" && <SaveUser />}
              </>
            ) : (
              <>
                {normal === "save" && <SaveUser />}
                {normal === "about" && <AboutUser />}
                {normal === "setting" && <SettingUser />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUserCurrent;
