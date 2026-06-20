import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import {
  FaComment,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlusCircle,
  FaRegSave,
  FaSave,
  FaSellcast,
  FaThumbsDown,
  FaWrench,
} from "react-icons/fa";
import Tag from "../../components/tag/Tag";
import Label from "../../components/label/Label";
import Profile from "../../components/profile/Profile";
import StarRating from "../../components/starRating/StarRating ";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";
import ShowStar from "../../components/starRating/ShowStar";
import TextBorder from "../../components/textBorder/TextBorder";
import Button from "../../components/button/Button";
import ServiceSelector from "../serviceSelector/ServiceSelector";
import { NavigationLink } from "../../components/navigationLink/NavigationLink";
import AboutUser from "../aboutUser/AboutUser";
import ServiceCreate from "../serviceCreate/ServiceCreate";
import SettingUser from "../settingUser/SettingUser";
import SaveUser from "../saveUser/SaveUser";
import "../profileUser/ProfileUser.scss";
const ProfileUserCurrent = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [normal, setNormal] = useState(currentUser?.userPro ? "service" : "save");
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({});

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
        {normal === "service" ? (
          <button className="disabled" disabled>
            <FaWrench style={{ marginRight: "8px" }} />
            Service
          </button>
        ) : (
          <button onClick={() => setNormal("service")}>
            <FaWrench style={{ marginRight: "8px" }} />
            Service
          </button>
        )}
        {normal === "about" ? (
          <button className="disabled" disabled>
            <FaInfoCircle style={{ marginRight: "8px" }} />
            About
          </button>
        ) : (
          <button onClick={() => setNormal("about")}>
            <FaInfoCircle style={{ marginRight: "8px" }} />
            About
          </button>
        )}
        {normal === "addService" ? (
          <button className="disabled" disabled>
            <FaPlusCircle style={{ marginRight: "8px" }} />
            Add Service
          </button>
        ) : (
          <button onClick={() => setNormal("addService")}>
            <FaPlusCircle style={{ marginRight: "8px" }} />
            Add Service
          </button>
        )}
        {normal === "setting" ? (
          <button className="disabled" disabled>
            <FaSellcast style={{ marginRight: "8px" }} />
            Setting
          </button>
        ) : (
          <button onClick={() => setNormal("setting")}>
            <FaSellcast style={{ marginRight: "8px" }} />
            Setting
          </button>
        )}
        {normal === "save" ? (
          <button className="disabled" disabled>
            <FaSave style={{ marginRight: "8px" }} />
            Saves
          </button>
        ) : (
          <button onClick={() => setNormal("save")}>
            <FaSave style={{ marginRight: "8px" }} />
            Saves
          </button>
        )}
      </div>
    ) : (
      <div className="serviceDetail-container">
        {normal === "save" ? (
          <button className="disabled" disabled>
            <FaSave style={{ marginRight: "8px" }} />
            Saved Handymen
          </button>
        ) : (
          <button onClick={() => setNormal("save")}>
            <FaSave style={{ marginRight: "8px" }} />
            Saved Handymen
          </button>
        )}
        {normal === "about" ? (
          <button className="disabled" disabled>
            <FaInfoCircle style={{ marginRight: "8px" }} />
            About
          </button>
        ) : (
          <button onClick={() => setNormal("about")}>
            <FaInfoCircle style={{ marginRight: "8px" }} />
            About
          </button>
        )}
        {normal === "setting" ? (
          <button className="disabled" disabled>
            <FaSellcast style={{ marginRight: "8px" }} />
            Setting
          </button>
        ) : (
          <button onClick={() => setNormal("setting")}>
            <FaSellcast style={{ marginRight: "8px" }} />
            Setting
          </button>
        )}
      </div>
    );
  };

  const averageRating =
    currentUser && currentUser.ratings && currentUser.ratings.length > 0
      ? currentUser.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
        currentUser.ratings.length
      : 0;

  return (
    <div className={`ProfileContainer ${theme}`}>
      {currentUser && (
        <div className="profile-dashboard-tabs-wrapper">
          {renderTabMenu()}
        </div>
      )}
      <div className="ProfileContainer-container">
        <div className="ProfileContainer-container-left">
          {loading && <p className="loading-text">Loading...</p>}
          {error && <p className="error-text">Something went wrong!</p>}
          {currentUser && !loading && !error && (
            currentUser.userPro ? (
              <div className={`userprofileDetail ${theme} pro-card`}>
                <div className="profile-banner pro-banner"></div>
                <div className="userserviceDetail-container" key={currentUser.id}>
                  <div className="profile-avatar-wrapper">
                    <Profile src={currentUser.avatar} />
                    <span className="account-badge pro-badge">Pro</span>
                  </div>
                  <Label label={currentUser.brandName || "Repair Provider"} />
                  <h3 className="profile-owner-name">Owner: {currentUser.nameuser}</h3>
                  <div className="userserviceDetail-container-tag">
                    {currentUser.mainService && currentUser.mainService !== "None" && currentUser.mainService !== "NONE" && <Tag label={currentUser.mainService} />}
                    {currentUser.subService && currentUser.subService !== "None" && currentUser.subService !== "NONE" && <Tag label={currentUser.subService} />}
                    {(!currentUser.mainService || currentUser.mainService === "None" || currentUser.mainService === "NONE") && <Tag label="Handyman Account" />}
                  </div>
                  <div className="userserviceDetail-container-rate">
                    <ShowStar rating={averageRating.toFixed(2)} />
                    <p>{averageRating.toFixed(2)}</p>
                  </div>
                  <div className="userserviceDetail-container-detail">
                    <div className="TextBorder-container">
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
              </div>
            ) : (
              <div className={`userprofileDetail ${theme} client-card`}>
                <div className="profile-banner client-banner"></div>
                <div className="userserviceDetail-container" key={currentUser.id}>
                  <div className="profile-avatar-wrapper">
                    <Profile src={currentUser.avatar} />
                    <span className="account-badge client-badge">
                      {currentUser.isAdmin ? "Admin" : "Client"}
                    </span>
                  </div>
                  <Label label={currentUser.nameuser} />
                  <div className="userserviceDetail-container-detail">
                    <div className="TextBorder-container">
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
              </div>
            )
          )}
        </div>
        <div className="ProfileContainer-container-right">
          <div className="profileTodo">
            {loading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-text">Something went wrong!</p>}
            {currentUser && !loading && !error && (
              currentUser.userPro ? (
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
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUserCurrent;
