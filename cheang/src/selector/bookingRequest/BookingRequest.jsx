import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { FaCalendarAlt, FaCheck, FaTimes, FaMapMarkerAlt, FaUser, FaDollarSign, FaSpinner } from "react-icons/fa";
import FormatDate from "../../utils/FormatDate";
import "./BookingRequest.scss";

const BookingRequest = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const t = {
    title: { en: "Booking Requests", kh: "ការកក់សេវាកម្ម", zh: "预约请求" },
    subtitle: { 
      en: "Accept, cancel, and manage client booking requests for your services.", 
      kh: "យល់ព្រម បោះបង់ និងគ្រប់គ្រងសំណើកក់សេវាកម្មរបស់អតិថិជន។", 
      zh: "接受、取消和管理客户对您服务的预约请求。" 
    },
    client: { en: "Client", kh: "អតិថិជន", zh: "客户" },
    service: { en: "Service", kh: "សេវាកម្ម", zh: "服务" },
    price: { en: "Price", kh: "តម្លៃ", zh: "价格" },
    date: { en: "Booking Date", kh: "ថ្ងៃកក់សេវាកម្ម", zh: "预约日期" },
    address: { en: "Location", kh: "ទីតាំង", zh: "服务地址" },
    status: { en: "Status", kh: "ស្ថានភាព", zh: "状态" },
    accept: { en: "Accept", kh: "យល់ព្រម", zh: "接受" },
    decline: { en: "Decline", kh: "បដិសេធ", zh: "拒绝" },
    noBookings: { en: "No booking requests received yet.", kh: "មិនទាន់មានការកក់សេវាកម្មនៅឡើយទេ។", zh: "暂无预约请求。" },
    loadingText: { en: "Loading bookings...", kh: "កំពុងផ្ទុកការកក់...", zh: "正在加载预约..." },
    statusPending: { en: "Pending", kh: "កំពុងរង់ចាំ", zh: "等待中" },
    statusAccepted: { en: "Accepted", kh: "បានយល់ព្រម", zh: "已接受" },
    statusCompleted: { en: "Completed", kh: "បានបញ្ចប់", zh: "已完成" },
    statusCancelled: { en: "Cancelled", kh: "បានបោះបង់", zh: "已取消" }
  };

  const getLabel = (key) => t[key]?.[language] || t[key]?.["en"];

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/v1/bookings");
      const responseData = await res.json();
      
      if (responseData.success === false) {
        setError(responseData.message);
        return;
      }
      
      const allBookings = responseData.data || responseData;
      // Filter bookings where handyman is the current user
      const filtered = allBookings.filter(
        (b) => b.handyman && (b.handyman._id === currentUser._id || b.handyman.id === currentUser._id)
      );
      setBookings(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      fetchBookings();
    }
  }, [currentUser]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setActionLoadingId(bookingId);
      const res = await fetch(`/api/v1/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success === false) {
        console.error(data.message);
        return;
      }
      
      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId || b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Accepted": return "status-accepted";
      case "Completed": return "status-completed";
      case "Cancelled": return "status-cancelled";
      default: return "status-pending";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Accepted": return getLabel("statusAccepted");
      case "Completed": return getLabel("statusCompleted");
      case "Cancelled": return getLabel("statusCancelled");
      default: return getLabel("statusPending");
    }
  };

  return (
    <div className={`booking-requests-container ${theme}`}>
      {/* Header */}
      <header className="bookings-page-header">
        <div className="header-info">
          <h1 className="header-title">{getLabel("title")}</h1>
          <p className="header-subtitle">{getLabel("subtitle")}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="bookings-content-main">
        {loading ? (
          <div className="loading-placeholder">
            <FaSpinner className="spin loading-icon" />
            <span>{getLabel("loadingText")}</span>
          </div>
        ) : error ? (
          <div className="error-placeholder">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="empty-placeholder">
            <FaCalendarAlt className="empty-icon" />
            <p>{getLabel("noBookings")}</p>
          </div>
        ) : (
          <div className="bookings-list-grid">
            {bookings.map((booking, index) => (
              <article className="booking-card-item" key={booking.id || booking._id || index}>
                <div className="booking-card-header">
                  <div className="client-profile-group">
                    <img 
                      src={booking.client?.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} 
                      alt={booking.client?.nameuser || "Client"}
                      className="client-avatar"
                      onError={(e) => {
                        e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                      }}
                    />
                    <div className="client-text-info">
                      <span className="client-label">{getLabel("client")}</span>
                      <h4 className="client-name">{booking.client?.nameuser || "User"}</h4>
                      <span className="client-email">{booking.client?.email}</span>
                    </div>
                  </div>
                  <div className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                    <span className="status-dot"></span>
                    <span className="status-text">{getStatusLabel(booking.status)}</span>
                  </div>
                </div>

                <div className="booking-card-body">
                  <div className="info-row">
                    <span className="info-icon"><FaCalendarAlt /></span>
                    <div className="info-details">
                      <span className="info-label">{getLabel("date")}</span>
                      <span className="info-value">{FormatDate(booking.bookingDate)}</span>
                    </div>
                  </div>

                  <div className="info-row">
                    <span className="info-icon"><FaMapMarkerAlt /></span>
                    <div className="info-details">
                      <span className="info-label">{getLabel("address")}</span>
                      <span className="info-value">{booking.address || "Phnom Penh, Cambodia"}</span>
                    </div>
                  </div>

                  <div className="service-details-row">
                    <div className="details-block">
                      <span className="block-label">{getLabel("service")}</span>
                      <span className="block-value">{booking.serviceName}</span>
                    </div>
                    <div className="details-block price-block">
                      <span className="block-label">{getLabel("price")}</span>
                      <span className="block-value">${booking.price}</span>
                    </div>
                  </div>
                </div>

                {booking.status === "Pending" && (
                  <div className="booking-card-actions">
                    <button 
                      className="btn-decline" 
                      onClick={() => handleUpdateStatus(booking.id || booking._id, "Cancelled")}
                      disabled={actionLoadingId === (booking.id || booking._id)}
                    >
                      {actionLoadingId === (booking.id || booking._id) ? <FaSpinner className="spin" /> : <FaTimes />}
                      <span>{getLabel("decline")}</span>
                    </button>
                    <button 
                      className="btn-accept" 
                      onClick={() => handleUpdateStatus(booking.id || booking._id, "Accepted")}
                      disabled={actionLoadingId === (booking.id || booking._id)}
                    >
                      {actionLoadingId === (booking.id || booking._id) ? <FaSpinner className="spin" /> : <FaCheck />}
                      <span>{getLabel("accept")}</span>
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingRequest;
