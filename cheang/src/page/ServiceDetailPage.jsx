import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import AppLayout from "../layouts/AppLayout";
import { FaUserCircle, FaMapMarkerAlt, FaStar, FaChevronLeft } from "react-icons/fa";
import "./ServiceDetailPage.scss";

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const t = {
    backBtn: { en: "Back to Home", kh: "ត្រឡប់ទៅទំព័រដើម", zh: "回到首页" },
    bookNow: { en: "Book Now", kh: "កក់ឥឡូវនេះ", zh: "立即预订" },
    price: { en: "Price", kh: "តម្លៃ", zh: "价格" },
    aboutService: { en: "About this Service", kh: "អំពីសេវាកម្មនេះ", zh: "关于此服务" },
    aboutProvider: { en: "About the Provider", kh: "អំពីអ្នកផ្តល់សេវា", zh: "关于提供商" },
    viewProfile: { en: "View Full Profile", kh: "មើលប្រវត្តិរូបពេញលេញ", zh: "查看完整资料" },
  };

  const getLabel = (key) => t[key]?.[language] || t[key]?.["en"];

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/services/get/${serviceId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setService(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [serviceId]);

  if (loading) {
    return (
      <AppLayout>
        <div className={`service-detail-loading ${theme}`}>
          <div className="spinner"></div>
          <p>Loading service details...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !service) {
    return (
      <AppLayout>
        <div className={`service-detail-error ${theme}`}>
          <h2>Service Not Found</h2>
          <p>{error || "The service you are looking for does not exist."}</p>
          <button onClick={() => navigate("/")} className="btn-back">
            {getLabel("backBtn")}
          </button>
        </div>
      </AppLayout>
    );
  }

  const provider = service.userRef || {};
  const providerName = provider.brandName || provider.nameuser || "Unknown Provider";
  const providerAvatar = provider.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return (
    <AppLayout>
      <div className={`service-detail-page ${theme}`}>
        <div className="container">
          <button className="back-link" onClick={() => navigate(-1)}>
            <FaChevronLeft /> {getLabel("backBtn")}
          </button>

          <div className="service-content-wrapper">
            {/* Left Column: Service Info */}
            <div className="service-main-info">
              <div className="service-hero-image">
                <img src={service.image} alt={service.name} 
                  onError={(e) => { e.target.src = "https://static-00.iconduck.com/assets.00/wrench-icon-2047x2048-jyerjpd9.png"; }}
                />
              </div>
              
              <div className="service-text-content">
                <h1 className="service-title">{service.name}</h1>
                <div className="service-price-badge">
                  <span className="price-label">{getLabel("price")}</span>
                  <span className="price-value">${service.price}</span>
                </div>

                <div className="section-divider"></div>
                
                <h2 className="section-heading">{getLabel("aboutService")}</h2>
                <p className="service-description">{service.description}</p>
              </div>
            </div>

            {/* Right Column: Provider Info & Booking */}
            <div className="service-sidebar">
              <div className="booking-card">
                <h3 className="booking-price">${service.price}</h3>
                <Link to={`/profile/${provider._id || provider.id}`} className="btn-book-now">
                  {getLabel("bookNow")}
                </Link>
                <p className="booking-hint">You will be redirected to the provider's profile to schedule your appointment securely.</p>
              </div>

              <div className="provider-card">
                <h2 className="section-heading">{getLabel("aboutProvider")}</h2>
                <div className="provider-profile-summary">
                  <img src={providerAvatar} alt={providerName} className="provider-avatar" />
                  <div className="provider-info">
                    <h3 className="provider-name">{providerName}</h3>
                    {provider.province && (
                      <span className="provider-location">
                        <FaMapMarkerAlt /> {provider.province} {provider.city && `, ${provider.city}`}
                      </span>
                    )}
                    <div className="provider-rating">
                      <FaStar className="star-icon" />
                      <span>{provider.ratings || "0.0"}</span>
                      <span className="review-count">({provider.reviews?.length || 0} reviews)</span>
                    </div>
                  </div>
                </div>
                <Link to={`/profile/${provider._id || provider.id}`} className="btn-view-profile">
                  {getLabel("viewProfile")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ServiceDetailPage;
