import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Label from "../../components/label/Label";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserAlt,
  FaWrench,
  FaBriefcase,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import "./AboutUser.scss";
import FormatDate from "../../utils/FormatDate";

const AboutUser = () => {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const params = useParams();

  useEffect(() => {
    if (!params.userId) {
      setUser(null);
      return;
    }
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getUser/${params.userId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setUser(data.data || data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchService();
  }, [params.userId]);

  const displayUser = user || currentUser;
  if (!displayUser) return null;

  const isPro = displayUser.userPro;
  const joinDate = displayUser.createdAt ? new Date(displayUser.createdAt) : null;

  return (
    <div className={`service-about ${theme}`}>
      {loading && <p className="loading-text">Loading details...</p>}
      {!loading && (
        <>
          <Label label={isPro ? "About the Provider" : "About Me"} />
          <div className="service-about-grid">
            {isPro && (
              <div className="about-card">
                <div className="about-icon"><FaBriefcase /></div>
                <div className="about-info">
                  <span className="about-label">Brand Name</span>
                  <span className="about-value">{displayUser.brandName || "Not specified"}</span>
                </div>
              </div>
            )}

            <div className="about-card">
              <div className="about-icon"><FaUserAlt /></div>
              <div className="about-info">
                <span className="about-label">{isPro ? "Owner / Manager" : "Full Name"}</span>
                <span className="about-value">{displayUser.nameuser}</span>
              </div>
            </div>

            <div className="about-card">
              <div className="about-icon"><FaEnvelope /></div>
              <div className="about-info">
                <span className="about-label">Email Address</span>
                <span className="about-value">{displayUser.email || "Not public"}</span>
              </div>
            </div>

            <div className="about-card">
              <div className="about-icon"><FaMapMarkerAlt /></div>
              <div className="about-info">
                <span className="about-label">Location</span>
                <span className="about-value">
                  {displayUser.city || displayUser.province
                    ? `${displayUser.city || ""}${displayUser.city && displayUser.province ? ", " : ""}${displayUser.province || ""}`
                    : "Location not set"}
                </span>
              </div>
            </div>

            {isPro && (
              <div className="about-card">
                <div className="about-icon"><FaWrench /></div>
                <div className="about-info">
                  <span className="about-label">Specialties</span>
                  <span className="about-value">
                    {displayUser.mainService || displayUser.subService
                      ? `${displayUser.mainService || ""}${displayUser.mainService && displayUser.subService ? " - " : ""}${displayUser.subService || ""}`
                      : "Handyman services"}
                  </span>
                </div>
              </div>
            )}

            <div className="about-card">
              <div className="about-icon"><FaPhoneAlt /></div>
              <div className="about-info">
                <span className="about-label">Phone Number</span>
                <span className="about-value">{displayUser.phone || "No phone added"}</span>
              </div>
            </div>

            <div className="about-card">
              <div className="about-icon"><FaCalendarAlt /></div>
              <div className="about-info">
                <span className="about-label">Member Since</span>
                <span className="about-value">{joinDate ? FormatDate(joinDate) : "Recently"}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AboutUser;
