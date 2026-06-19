import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminAppLayout from "../layouts/AdminAppLayout";
import Label from "../../components/label/Label";
import { useLanguage } from "../../context/LanguageContext";
import "./BookingLogsPage.scss";
import {
  FaSearch,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaUser,
  FaWrench,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const translationDictionary = {
  en: {
    title: "Service Booking Logs",
    searchPlaceholder: "Search bookings by handyman, client, or service...",
    filterAll: "All Bookings",
    filterPending: "Pending",
    filterAccepted: "Accepted",
    filterCompleted: "Completed",
    filterCancelled: "Cancelled",
    client: "Client",
    handyman: "Handyman Pro",
    service: "Service Offered",
    price: "Price Rate",
    status: "Status",
    date: "Booking Date",
    actions: "Details",
    loading: "Loading booking transactions...",
    empty: "No booking records found.",
    address: "Service Address",
    bookingId: "Booking ID",
    createdAt: "Logged Date",
    seeMore: "View Details",
    seeLess: "Hide Details",
  },
  kh: {
    title: "កំណត់ត្រាកក់សេវាកម្ម",
    searchPlaceholder: "ស្វែងរកការកក់តាមជាង អតិថិជន ឬសេវាកម្ម...",
    filterAll: "ការកក់ទាំងអស់",
    filterPending: "រង់ចាំការយល់ព្រម",
    filterAccepted: "បានទទួលយក",
    filterCompleted: "បានបញ្ចប់",
    filterCancelled: "បានបដិសេធ",
    client: "អតិថិជន",
    handyman: "ជាងជំនាញ",
    service: "សេវាកម្ម",
    price: "តម្លៃសេវា",
    status: "ស្ថានភាព",
    date: "ថ្ងៃកក់សេវាកម្ម",
    actions: "លម្អិត",
    loading: "កំពុងទាញយកទិន្នន័យការកក់...",
    empty: "រកមិនឃើញប្រវត្តិកក់សេវាកម្មឡើយ។",
    address: "អាសយដ្ឋានសេវាកម្ម",
    bookingId: "លេខកូដកក់",
    createdAt: "ថ្ងៃកត់ត្រា",
    seeMore: "បង្ហាញលម្អិត",
    seeLess: "លាក់លម្អិត",
  },
  zh: {
    title: "预约服务记录",
    searchPlaceholder: "按工人、客户或服务搜索预约...",
    filterAll: "所有预约",
    filterPending: "等待中",
    filterAccepted: "已接受",
    filterCompleted: "已完成",
    filterCancelled: "已取消",
    client: "客户",
    handyman: "专业工人",
    service: "服务项目",
    price: "服务价格",
    status: "状态",
    date: "预约日期",
    actions: "详情",
    loading: "正在加载预约交易...",
    empty: "未找到预约记录。",
    address: "服务地址",
    bookingId: "预约编号",
    createdAt: "记录日期",
    seeMore: "查看详情",
    seeLess: "收起详情",
  }
};

const SkeletonLoader = () => (
  <div className="skeleton-booking-container">
    {[1, 2, 3].map((n) => (
      <div className="skeleton-card skeleton-shimmer" key={n}>
        <div className="skeleton-row header"></div>
        <div className="skeleton-row body"></div>
        <div className="skeleton-row footer"></div>
      </div>
    ))}
  </div>
);

const BookingLogsPage = () => {
  const { language } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search & Filter Status state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, Pending, Accepted, Completed, Cancelled
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  const getTranslation = (key) => {
    return translationDictionary[language]?.[key] || translationDictionary["en"][key];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "kh" ? "km-KH" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShow = (bookingId) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/admin/bookings");
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setBookings(data);
        }
      } catch (err) {
        setError("Failed to fetch booking history.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  // Filter & Search Logic
  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase();
    
    // Safety check for null populate refs
    const clientName = b.client?.nameuser?.toLowerCase() || "";
    const handymanName = b.handyman?.nameuser?.toLowerCase() || "";
    const handymanBrand = b.handyman?.brandName?.toLowerCase() || "";
    const serviceName = b.serviceName?.toLowerCase() || "";

    const matchesSearch =
      clientName.includes(query) ||
      handymanName.includes(query) ||
      handymanBrand.includes(query) ||
      serviceName.includes(query);

    const matchesFilter = activeFilter === "all" || b.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <AdminAppLayout>
      <div className="booking-logs-contain">
        <Label label={getTranslation("title")} />

        {error && <div className="error-state">{error}</div>}

        {/* Filters and Search Bar */}
        <div className="logs-toolbar">
          <div className="search-bar-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={getTranslation("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            <button
              className={activeFilter === "all" ? "tab active" : "tab"}
              onClick={() => setActiveFilter("all")}
            >
              {getTranslation("filterAll")}
            </button>
            <button
              className={activeFilter === "Pending" ? "tab active" : "tab"}
              onClick={() => setActiveFilter("Pending")}
            >
              {getTranslation("filterPending")}
            </button>
            <button
              className={activeFilter === "Accepted" ? "tab active" : "tab"}
              onClick={() => setActiveFilter("Accepted")}
            >
              {getTranslation("filterAccepted")}
            </button>
            <button
              className={activeFilter === "Completed" ? "tab active" : "tab"}
              onClick={() => setActiveFilter("Completed")}
            >
              {getTranslation("filterCompleted")}
            </button>
            <button
              className={activeFilter === "Cancelled" ? "tab active" : "tab"}
              onClick={() => setActiveFilter("Cancelled")}
            >
              {getTranslation("filterCancelled")}
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bookings-list-container">
          {loading ? (
            <SkeletonLoader />
          ) : filteredBookings.length === 0 ? (
            <div className="empty-results-card">
              <p>{getTranslation("empty")}</p>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div className="booking-card" key={b._id}>
                {/* Header row */}
                <div className="booking-card-header">
                  <div className="header-left">
                    <span className="booking-number">
                      {getTranslation("bookingId")}: <strong>#{b._id.slice(-6).toUpperCase()}</strong>
                    </span>
                  </div>
                  <div className="header-right">
                    <span className={`status-badge ${b.status.toLowerCase()}`}>
                      {b.status === "Pending" && <FaClock />}
                      {b.status === "Accepted" && <FaCheckCircle />}
                      {b.status === "Completed" && <FaCheckCircle />}
                      {b.status === "Cancelled" && <FaTimesCircle />}
                      {b.status === "Pending" && getTranslation("filterPending")}
                      {b.status === "Accepted" && getTranslation("filterAccepted")}
                      {b.status === "Completed" && getTranslation("filterCompleted")}
                      {b.status === "Cancelled" && getTranslation("filterCancelled")}
                    </span>
                  </div>
                </div>

                {/* Primary Card Content */}
                <div className="booking-card-body">
                  <div className="involved-parties">
                    {/* Client details */}
                    <div className="party-block">
                      <div className="avatar-wrapper">
                        <img src={b.client?.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="Client Avatar" />
                      </div>
                      <div className="party-details">
                        <span className="party-label">{getTranslation("client")}</span>
                        <strong className="party-name">{b.client?.nameuser || "Deleted Client"}</strong>
                      </div>
                    </div>

                    <div className="parties-connector">⇄</div>

                    {/* Handyman details */}
                    <div className="party-block">
                      <div className="avatar-wrapper">
                        <img src={b.handyman?.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="Handyman Avatar" />
                      </div>
                      <div className="party-details">
                        <span className="party-label">{getTranslation("handyman")}</span>
                        <strong className="party-name">{b.handyman?.brandName || b.handyman?.nameuser || "Deleted Handyman"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="service-pricing">
                    <div className="info-item">
                      <span className="info-label">{getTranslation("service")}</span>
                      <span className="info-val">
                        <FaWrench className="icon-orange" /> {b.serviceName}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">{getTranslation("price")}</span>
                      <span className="info-val price">
                        <FaFileInvoiceDollar className="icon-orange" /> ${b.price}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">{getTranslation("date")}</span>
                      <span className="info-val">
                        <FaCalendarAlt className="icon-orange" /> {formatDate(b.bookingDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expandable details drawer */}
                <div className={`booking-drawer ${expandedBookingId === b._id ? "open" : ""}`}>
                  <div className="drawer-inner-content">
                    <div className="drawer-detail-grid">
                      <div className="grid-card address-card">
                        <h4 className="detail-header-title">{getTranslation("address")}</h4>
                        <p>
                          <FaMapMarkerAlt className="icon-orange" /> {b.address}
                        </p>
                      </div>

                      <div className="grid-card system-card">
                        <h4 className="detail-header-title">System Metadata</h4>
                        <div className="meta-list">
                          <div className="meta-row">
                            <span>Transaction ID:</span>
                            <strong>{b._id}</strong>
                          </div>
                          <div className="meta-row">
                            <span>Logged at:</span>
                            <strong>{formatDate(b.createdAt)}</strong>
                          </div>
                          <div className="meta-row">
                            <span>Last Updated:</span>
                            <strong>{formatDate(b.updatedAt)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toggle Footer */}
                <div className="card-toggle-footer">
                  <button className="toggle-btn" onClick={() => handleShow(b._id)}>
                    {expandedBookingId === b._id ? (
                      <>
                        {getTranslation("seeLess")} <FaChevronUp />
                      </>
                    ) : (
                      <>
                        {getTranslation("seeMore")} <FaChevronDown />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminAppLayout>
  );
};

export default BookingLogsPage;
