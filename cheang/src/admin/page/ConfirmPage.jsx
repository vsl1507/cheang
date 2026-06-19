import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import AdminAppLayout from "../layouts/AdminAppLayout";
import Label from "../../components/label/Label";
import { useLanguage } from "../../context/LanguageContext";
import "./ConfirmPage.scss";
import {
  FaLocationArrow,
  FaUser,
  FaWrench,
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
} from "react-icons/fa";

const translationDictionary = {
  en: {
    title: "Confirm Professional Accounts",
    pendingRequests: "Pending Request",
    noRequests: "No handyman requests pending confirmation.",
    owner: "Owner",
    brandName: "Brand Name",
    location: "Location",
    mainService: "Main Service",
    subService: "Sub Service",
    phone: "Phone",
    email: "Email",
    description: "Description",
    confirm: "Approve Request",
    reject: "Reject Request",
    seeMore: "Show Details",
    seeLess: "Hide Details",
    requestedOn: "Requested on",
    details: "Verification Details",
  },
  kh: {
    title: "អនុម័តគណនីជាង",
    pendingRequests: "សំណើកំពុងរង់ចាំ",
    noRequests: "មិនមានសំណើរបស់ជាងកំពុងរង់ចាំការអនុម័តទេ។",
    owner: "ម្ចាស់គណនី",
    brandName: "ឈ្មោះយីហោ/ហាង",
    location: "ទីតាំង",
    mainService: "សេវាកម្មចម្បង",
    subService: "សេវាកម្មរង",
    phone: "លេខទូរស័ព្ទ",
    email: "អ៊ីមែល",
    description: "ការពិពណ៌នា",
    confirm: "អនុម័តសំណើ",
    reject: "បដិសេធសំណើ",
    seeMore: "បង្ហាញព័ត៌មានលម្អិត",
    seeLess: "លាក់ព័ត៌មានលម្អិត",
    requestedOn: "បានស្នើសុំនៅ",
    details: "ព័ត៌មានផ្ទៀងផ្ទាត់គណនី",
  },
  zh: {
    title: "确认专业账户",
    pendingRequests: "待处理申请",
    noRequests: "没有等待确认的专业账户申请。",
    owner: "所有者",
    brandName: "品牌名称",
    location: "位置",
    mainService: "主营服务",
    subService: "子服务",
    phone: "电话",
    email: "电子邮件",
    description: "描述",
    confirm: "批准申请",
    reject: "拒绝申请",
    seeMore: "显示详情",
    seeLess: "隐藏详情",
    requestedOn: "申请时间",
    details: "认证详情",
  }
};

const RequestSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-shimmer skeleton-badge"></div>
      <div className="skeleton-shimmer skeleton-date"></div>
    </div>
    <div className="skeleton-body">
      <div className="skeleton-profile">
        <div className="skeleton-shimmer skeleton-avatar"></div>
        <div className="skeleton-info">
          <div className="skeleton-shimmer skeleton-title"></div>
          <div className="skeleton-shimmer skeleton-subtitle"></div>
        </div>
      </div>
      <div className="skeleton-badges">
        <div className="skeleton-shimmer skeleton-pill"></div>
        <div className="skeleton-shimmer skeleton-pill"></div>
      </div>
      <div className="skeleton-grid">
        <div className="skeleton-shimmer skeleton-grid-item"></div>
        <div className="skeleton-shimmer skeleton-grid-item"></div>
        <div className="skeleton-shimmer skeleton-grid-item"></div>
      </div>
      <div className="skeleton-actions">
        <div className="skeleton-shimmer skeleton-button"></div>
        <div className="skeleton-shimmer skeleton-button"></div>
      </div>
    </div>
  </div>
);

const ConfirmPage = () => {
  const { language } = useLanguage();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [copiedText, setCopiedText] = useState(null);

  const confirmData = {
    userPro: true,
    Confirm: true,
    Request: false,
  };

  const rejectData = {
    Request: false,
    userPro: false,
    Confirm: false,
  };

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
    });
  };

  const handleShow = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(`${type} copied to clipboard!`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleConfirm = async (userId) => {
    try {
      setActionLoadingId(userId);
      const res = await fetch(`/api/user/updateconfirm/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message || "Failed to confirm user.");
        setActionLoadingId(null);
        return;
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setActionLoadingId(null);
    } catch (err) {
      setError("An error occurred while confirming request.");
      setActionLoadingId(null);
    }
  };

  const handleReject = async (userId) => {
    try {
      setActionLoadingId(userId);
      const res = await fetch(`/api/user/updateconfirm/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rejectData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message || "Failed to reject user.");
        setActionLoadingId(null);
        return;
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setActionLoadingId(null);
    } catch (err) {
      setError("An error occurred while rejecting request.");
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/admin/usersreq");
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setUsers(data);
        }
      } catch (err) {
        setError("Failed to load request list.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUser]);

  return (
    <AdminAppLayout>
      <div className="confirm-contain">
        <Label label={getTranslation("title")} />
        
        {copiedText && (
          <div className="copy-toast-notification">
            <FaCheck style={{ marginRight: "8px" }} /> {copiedText}
          </div>
        )}

        <div className="confirm-container">
          {error && <div className="error-state">{error}</div>}

          {loading ? (
            <div className="skeleton-container">
              <RequestSkeleton />
              <RequestSkeleton />
              <RequestSkeleton />
            </div>
          ) : (
            <>
              {users.length === 0 ? (
                <div className="empty-state-card">
                  <p>{getTranslation("noRequests")}</p>
                </div>
              ) : (
                users.map((user) => (
                  <div className="list-user" key={user._id}>
                    <div className="card-header">
                      <span className="badge-pending">
                        <FaInfoCircle className="icon" /> {getTranslation("pendingRequests")}
                      </span>
                      <span className="request-date">
                        <FaCalendarAlt className="icon" /> {getTranslation("requestedOn")}: {formatDate(user.createdAt)}
                      </span>
                    </div>

                    <div className="user-confirm">
                      <div className="avatar-section">
                        <img src={user.avatar} alt={user.nameuser} className="user-avatar" />
                        <span className="avatar-pulse"></span>
                      </div>

                      <div className="user-confirm-name">
                        <h3 className="brand-title">{user.brandName || "No Brand Name"}</h3>
                        <p className="owner-name">
                          <FaUser className="icon-orange" />
                          {getTranslation("owner")}: <strong>{user.nameuser}</strong>
                        </p>
                      </div>

                      {/* Main and Sub Service Badges */}
                      <div className="services-showcase">
                        {user.mainService && (
                          <span className="service-pill primary">
                            <FaWrench className="icon" /> {user.mainService}
                          </span>
                        )}
                        {user.subService && (
                          <span className="service-pill secondary">
                            {user.subService}
                          </span>
                        )}
                      </div>

                      {/* Contact and Location details */}
                      <div className="quick-details-grid">
                        <div className="detail-pill">
                          <span className="detail-label">{getTranslation("location")}</span>
                          <span className="detail-val">
                            <FaLocationArrow className="icon-orange" /> {user.city || "N/A"}, {user.province || "N/A"}
                          </span>
                        </div>

                        <div className="detail-pill clickable">
                          <span className="detail-label">{getTranslation("phone")}</span>
                          <div className="detail-val-copy">
                            <a href={`tel:${user.phone}`} className="phone-link">
                              <FaPhoneAlt className="icon-orange" /> {user.phone || "N/A"}
                            </a>
                            {user.phone && (
                              <button className="copy-action-btn" onClick={() => handleCopy(user.phone, "Phone")}>
                                <FaCopy />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="detail-pill clickable">
                          <span className="detail-label">{getTranslation("email")}</span>
                          <div className="detail-val-copy">
                            <a href={`mailto:${user.email}`} className="email-link">
                              <FaEnvelope className="icon-orange" /> {user.email || "N/A"}
                            </a>
                            {user.email && (
                              <button className="copy-action-btn" onClick={() => handleCopy(user.email, "Email")}>
                                <FaCopy />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="user-button">
                        <button
                          className="confirm-btn"
                          onClick={() => handleConfirm(user._id)}
                          disabled={actionLoadingId !== null}
                        >
                          {actionLoadingId === user._id ? (
                            <span className="button-spinner"></span>
                          ) : (
                            <>
                              <FaCheck className="btn-icon" /> {getTranslation("confirm")}
                            </>
                          )}
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleReject(user._id)}
                          disabled={actionLoadingId !== null}
                        >
                          {actionLoadingId === user._id ? (
                            <span className="button-spinner"></span>
                          ) : (
                            <>
                              <FaTimes className="btn-icon" /> {getTranslation("reject")}
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable details section */}
                    <div className={`details-drawer ${expandedUserId === user._id ? "open" : ""}`}>
                      <div className="drawer-inner">
                        <h4 className="drawer-header-title">{getTranslation("details")}</h4>
                        <div className="drawer-info-grid">
                          <div className="info-block bio">
                            <h5>{getTranslation("description")}</h5>
                            <p>
                              {user.brandName 
                                ? `${user.brandName} is requesting a professional handyman account to offer services under the category of ${user.mainService || 'handyman services'}.`
                                : "No brand description provided by user."
                              }
                            </p>
                          </div>
                          <div className="info-block meta">
                            <div className="meta-row">
                              <span>System User ID:</span>
                              <strong>{user._id}</strong>
                            </div>
                            <div className="meta-row">
                              <span>Registered Name:</span>
                              <strong>{user.nameuser}</strong>
                            </div>
                            <div className="meta-row">
                              <span>Location Area:</span>
                              <strong>{user.city || "N/A"} ({user.province || "N/A"})</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* See more toggle drawer */}
                    <div className="see-more-btn-container">
                      <button className="see-more-toggle" onClick={() => handleShow(user._id)}>
                        {expandedUserId === user._id ? (
                          <>
                            {getTranslation("seeLess")} <FaChevronUp style={{ fontSize: "12px" }} />
                          </>
                        ) : (
                          <>
                            {getTranslation("seeMore")} <FaChevronDown style={{ fontSize: "12px" }} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </AdminAppLayout>
  );
};

export default ConfirmPage;

