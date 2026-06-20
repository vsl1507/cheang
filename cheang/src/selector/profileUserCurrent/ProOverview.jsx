import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import {
  FaWrench,
  FaPlusCircle,
  FaCog,
  FaEye,
  FaHeart,
  FaChevronRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import FormatDate from "../../utils/FormatDate";
import "./ProOverview.scss";

const ProOverview = ({ setActiveTab }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const [servicesCount, setServicesCount] = useState(0);
  const [recentServices, setRecentServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`/api/user/services/${currentUser._id}`);
        const data = await res.json();
        if (data && data.success !== false) {
          const list = data.data || data;
          setServicesCount(list.length);
          setRecentServices(list.slice(0, 3)); // show top 3
        }
      } catch (err) {
        console.error("Error fetching services for overview: ", err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?._id) {
      fetchServices();
    }
  }, [currentUser]);

  const t = {
    welcome: { en: "Welcome back", kh: "ស្វាគមន៍ការត្រឡប់មកវិញ", zh: "欢迎回来" },
    overview: { en: "Dashboard Overview", kh: "ទិដ្ឋភាពទូទៅផ្ទាំងគ្រប់គ្រង", zh: "控制台概览" },
    subtitle: {
      en: "Manage your services, track profile activity, and customize your settings.",
      kh: "គ្រប់គ្រងសេវាកម្មរបស់អ្នក តាមដានសកម្មភាពប្រវត្តិរូប និងកំណត់គណនីរបស់អ្នក។",
      zh: "在此管理您的服务、跟踪个人资料活动并自定义您的设置。",
    },
    totalServices: { en: "Total Services", kh: "សេវាកម្មសរុប", zh: "服务总数" },
    savedItems: { en: "Saved Items", kh: "របស់រក្សាទុក", zh: "已保存项目" },
    profileStatus: { en: "Profile Status", kh: "ស្ថានភាពគណនី", zh: "资料状态" },
    active: { en: "Active", kh: "សកម្ម", zh: "活跃" },
    quickActions: { en: "Quick Actions", kh: "សកម្មភាពរហ័ស", zh: "快速操作" },
    addNewService: { en: "Add New Service", kh: "បន្ថែមសេវាកម្មថ្មី", zh: "添加新服务" },
    editSettings: { en: "Account Settings", kh: "ការកំណត់គណនី", zh: "账户设置" },
    viewPublic: { en: "Public Profile", kh: "ប្រវត្តិរូបជាសាធារណៈ", zh: "公开主页" },
    recentServices: { en: "Recent Services", kh: "សេវាកម្មថ្មីៗ", zh: "近期服务" },
    noServices: { en: "No services added yet.", kh: "មិនទាន់មានសេវាកម្មនៅឡើយទេ។", zh: "暂无服务。" },
    price: { en: "Price", kh: "តម្លៃ", zh: "价格" },
    specialty: { en: "Specialty", kh: "ជំនាញ", zh: "专业" },
    location: { en: "Location", kh: "ទីតាំង", zh: "位置" },
  };

  const getLabel = (key) => t[key]?.[language] || t[key]?.["en"];

  const getSpecialtyDisplay = () => {
    if (!currentUser) return "";
    return currentUser.mainService || currentUser.subService
      ? `${currentUser.mainService || ""} ${currentUser.subService ? `- ${currentUser.subService}` : ""}`
      : "Repair Specialist";
  };

  const getLocationDisplay = () => {
    if (!currentUser) return "";
    return currentUser.city || currentUser.province
      ? `${currentUser.city || ""} ${currentUser.city && currentUser.province ? ", " : ""} ${currentUser.province || ""}`
      : "Location not specified";
  };

  if (!currentUser) return null;

  return (
    <div className={`pro-overview-container ${theme}`}>
      {/* Welcome Banner */}
      <header className="overview-welcome-banner">
        <div className="banner-text">
          <span className="banner-greeting">{getLabel("welcome")},</span>
          <h1 className="banner-title">{currentUser.brandName || currentUser.nameuser}</h1>
          <p className="banner-subtitle">{getLabel("subtitle")}</p>
          <div className="banner-metadata">
            <span className="meta-item">
              <FaWrench /> <strong>{getLabel("specialty")}:</strong> {getSpecialtyDisplay()}
            </span>
            <span className="meta-item">
              <FaMapMarkerAlt /> <strong>{getLabel("location")}:</strong> {getLocationDisplay()}
            </span>
          </div>
        </div>
        <div className="banner-illustration">
          <FaWrench className="wrench-icon-floating" />
        </div>
      </header>

      {/* Metrics Cards */}
      <section className="overview-metrics-grid">
        <div className="metric-card services">
          <div className="metric-icon-box">
            <FaWrench />
          </div>
          <div className="metric-info">
            <span className="metric-label">{getLabel("totalServices")}</span>
            <h3 className="metric-value">{loading ? "..." : servicesCount}</h3>
          </div>
        </div>

        <div className="metric-card saves">
          <div className="metric-icon-box">
            <FaHeart />
          </div>
          <div className="metric-info">
            <span className="metric-label">{getLabel("savedItems")}</span>
            <h3 className="metric-value">{currentUser.saves?.length || 0}</h3>
          </div>
        </div>

        <div className="metric-card status">
          <div className="metric-icon-box">
            <FaEye />
          </div>
          <div className="metric-info">
            <span className="metric-label">{getLabel("profileStatus")}</span>
            <div className="status-badge">
              <span className="status-dot"></span>
              <span className="status-text">{getLabel("active")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="overview-content-layout">
        {/* Quick Actions */}
        <section className="overview-section quick-actions-wrapper">
          <h2 className="section-title">{getLabel("quickActions")}</h2>
          <div className="quick-actions-grid">
            <button
              onClick={() => setActiveTab("addService")}
              className="quick-action-card accent"
            >
              <div className="action-icon"><FaPlusCircle /></div>
              <div className="action-details">
                <h4>{getLabel("addNewService")}</h4>
                <FaChevronRight className="action-arrow" />
              </div>
            </button>

            <button
              onClick={() => setActiveTab("setting")}
              className="quick-action-card"
            >
              <div className="action-icon"><FaCog /></div>
              <div className="action-details">
                <h4>{getLabel("editSettings")}</h4>
                <FaChevronRight className="action-arrow" />
              </div>
            </button>

            <Link
              to={`/profile/${currentUser._id}`}
              className="quick-action-card link-card"
            >
              <div className="action-icon"><FaEye /></div>
              <div className="action-details">
                <h4>{getLabel("viewPublic")}</h4>
                <FaChevronRight className="action-arrow" />
              </div>
            </Link>
          </div>
        </section>

        {/* Recent Service list */}
        <section className="overview-section recent-services-wrapper">
          <h2 className="section-title">{getLabel("recentServices")}</h2>
          <div className="recent-services-list">
            {loading ? (
              <p className="loading-placeholder">Loading services...</p>
            ) : recentServices.length === 0 ? (
              <div className="empty-placeholder">
                <p>{getLabel("noServices")}</p>
                <button
                  onClick={() => setActiveTab("addService")}
                  className="add-service-inline-btn"
                >
                  {getLabel("addNewService")}
                </button>
              </div>
            ) : (
              recentServices.map((service) => (
                <div key={service._id} className="mini-service-card">
                  <div className="service-img-wrapper">
                    <img
                      src={service.image}
                      alt={service.name}
                      onError={(e) => {
                        e.target.src =
                          "https://static-00.iconduck.com/assets.00/wrench-icon-2047x2048-jyerjpd9.png";
                      }}
                    />
                  </div>
                  <div className="service-info">
                    <h4>{service.name}</h4>
                    <p className="service-desc">{service.description}</p>
                  </div>
                  <div className="service-price-tag">
                    <span className="price-label">{getLabel("price")}</span>
                    <span className="price-val">${service.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProOverview;
