import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminAppLayout from "../layouts/AdminAppLayout";
import Label from "../../components/label/Label";
import { useLanguage } from "../../context/LanguageContext";
import "./SupportInboxPage.scss";
import {
  FaSearch,
  FaHeadset,
  FaTrashAlt,
  FaCheck,
  FaClock,
  FaEnvelope,
  FaUser,
  FaTag,
  FaComments,
  FaTimes,
  FaEye,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

const translationDictionary = {
  en: {
    title: "Support Desk",
    searchPlaceholder: "Search tickets by sender name, email, topic, or message...",
    filterAll: "All Tickets",
    filterNew: "New",
    filterPending: "Pending",
    filterResolved: "Resolved",
    sender: "Sender",
    topic: "Topic",
    message: "Message",
    status: "Status",
    date: "Received Date",
    actions: "Actions",
    viewDetails: "View Details",
    markPending: "Mark Pending",
    resolveTicket: "Resolve Ticket",
    deleteTicket: "Delete Ticket",
    loading: "Loading support tickets...",
    empty: "No support tickets found.",
    ticketDetails: "Ticket Details",
    close: "Close",
    confirmDeleteTitle: "Confirm Delete Ticket",
    confirmDeleteMsg: "Are you sure you want to permanently delete this support ticket from {name}? This action cannot be undone.",
    cancel: "Cancel",
    confirm: "Confirm",
    successDelete: "Ticket deleted successfully",
    successUpdate: "Ticket status updated successfully",
  },
  kh: {
    title: "ប្រអប់សំបុត្រជំនួយ",
    searchPlaceholder: "ស្វែងរកតាមឈ្មោះ អ៊ីមែល ប្រធានបទ ឬសារ...",
    filterAll: "សំបុត្រទាំងអស់",
    filterNew: "ថ្មី",
    filterPending: "កំពុងដោះស្រាយ",
    filterResolved: "ដោះស្រាយរួច",
    sender: "អ្នកផ្ញើ",
    topic: "ប្រធានបទ",
    message: "សារ",
    status: "ស្ថានភាព",
    date: "កាលបរិច្ឆេទទទួលបាន",
    actions: "សកម្មភាព",
    viewDetails: "មើលលម្អិត",
    markPending: "កំណត់កំពុងដោះស្រាយ",
    resolveTicket: "ដោះស្រាយសំបុត្រ",
    deleteTicket: "លុបសំបុត្រ",
    loading: "កំពុងទាញយកសំបុត្រគាំទ្រ...",
    empty: "រកមិនឃើញសំបុត្រគាំទ្រឡើយ។",
    ticketDetails: "ព័ត៌មានលម្អិតសំបុត្រ",
    close: "បិទ",
    confirmDeleteTitle: "បញ្ជាក់ការលុបសំបុត្រ",
    confirmDeleteMsg: "តើអ្នកប្រាកដជាចង់លុបសំបុត្រគាំទ្រពី {name} ជាអចិន្ត្រៃយ៍មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ។",
    cancel: "បោះបង់",
    confirm: "យល់ព្រម",
    successDelete: "បានលុបសំបុត្រដោយជោគជ័យ",
    successUpdate: "បានកែប្រែស្ថានភាពសំបុត្រដោយជោគជ័យ",
  },
  zh: {
    title: "客服工单",
    searchPlaceholder: "按发件人姓名、邮箱、主题或内容搜索...",
    filterAll: "所有工单",
    filterNew: "新建",
    filterPending: "处理中",
    filterResolved: "已解决",
    sender: "发件人",
    topic: "主题",
    message: "内容",
    status: "状态",
    date: "接收日期",
    actions: "操作",
    viewDetails: "查看详情",
    markPending: "设为处理中",
    resolveTicket: "解决工单",
    deleteTicket: "删除工单",
    loading: "正在加载客服工单...",
    empty: "未找到任何客服工单。",
    ticketDetails: "工单详情",
    close: "关闭",
    confirmDeleteTitle: "确认删除工单",
    confirmDeleteMsg: "您确定要永久删除来自 {name} 的客服工单吗？此操作无法撤销。",
    cancel: "取消",
    confirm: "确认",
    successDelete: "工单删除成功",
    successUpdate: "工单状态更新成功",
  }
};

const TableSkeleton = () => (
  <div className="skeleton-table">
    {[1, 2, 3, 4].map((n) => (
      <div className="skeleton-row" key={n}>
        <div className="skeleton-col status-col skeleton-shimmer"></div>
        <div className="skeleton-col text-col skeleton-shimmer"></div>
        <div className="skeleton-col text-col skeleton-shimmer"></div>
        <div className="skeleton-col message-col skeleton-shimmer"></div>
        <div className="skeleton-col date-col skeleton-shimmer"></div>
        <div className="skeleton-col actions-col skeleton-shimmer"></div>
      </div>
    ))}
  </div>
);

const SupportInboxPage = () => {
  const { language } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, New, Pending, Resolved

  // Selected Ticket for Drawer
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Delete Modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    ticket: null,
  });

  const getTranslation = (key) => {
    return translationDictionary[language]?.[key] || translationDictionary["en"][key];
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/support-messages");
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      } else {
        setMessages(data);
      }
    } catch (err) {
      setError("Failed to fetch support messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentUser]);

  // Handle status update
  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/support-messages/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message || "Failed to update ticket status.");
      } else {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === ticketId ? { ...msg, status: newStatus } : msg))
        );
        // Update selected ticket state if drawer is open
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      setError("Network error updating status.");
    }
  };

  // Handle deletion
  const handleDeleteTicket = async (ticketId) => {
    try {
      const res = await fetch(`/api/admin/support-messages/${ticketId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message || "Failed to delete ticket.");
      } else {
        setMessages((prev) => prev.filter((msg) => msg._id !== ticketId));
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(null);
        }
      }
    } catch (err) {
      setError("Network error deleting ticket.");
    } finally {
      closeDeleteModal();
    }
  };

  const openDeleteModal = (ticket, e) => {
    if (e) e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      ticket,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      ticket: null,
    });
  };

  // Format Received Date
  const formatDateTime = (dateString) => {
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

  // Filter & Search Logic
  const filteredTickets = messages.filter((ticket) => {
    const query = searchQuery.toLowerCase();
    const name = ticket.name?.toLowerCase() || "";
    const email = ticket.email?.toLowerCase() || "";
    const topic = ticket.topic?.toLowerCase() || "";
    const message = ticket.message?.toLowerCase() || "";

    const matchesSearch =
      name.includes(query) ||
      email.includes(query) ||
      topic.includes(query) ||
      message.includes(query);

    let matchesTab = true;
    if (activeTab !== "all") {
      matchesTab = ticket.status === activeTab;
    }

    return matchesSearch && matchesTab;
  });

  return (
    <AdminAppLayout>
      <div className="support-inbox-page-contain">
        <Label label={getTranslation("title")} />

        {error && <div className="error-toast">{error}</div>}

        {/* Toolbar Section */}
        <div className="support-toolbar">
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
              className={activeTab === "all" ? "tab active" : "tab"}
              onClick={() => setActiveTab("all")}
            >
              <FaHeadset /> {getTranslation("filterAll")}
            </button>
            <button
              className={activeTab === "New" ? "tab active" : "tab"}
              onClick={() => setActiveTab("New")}
            >
              <FaExclamationCircle className="status-new-icon" /> {getTranslation("filterNew")}
            </button>
            <button
              className={activeTab === "Pending" ? "tab active" : "tab"}
              onClick={() => setActiveTab("Pending")}
            >
              <FaClock className="status-pending-icon" /> {getTranslation("filterPending")}
            </button>
            <button
              className={activeTab === "Resolved" ? "tab active" : "tab"}
              onClick={() => setActiveTab("Resolved")}
            >
              <FaCheckCircle className="status-resolved-icon" /> {getTranslation("filterResolved")}
            </button>
          </div>
        </div>

        {/* Support Grid / Table Card */}
        <div className="support-table-card">
          {loading ? (
            <TableSkeleton />
          ) : filteredTickets.length === 0 ? (
            <div className="empty-results-card">
              <FaEnvelope className="empty-icon" />
              <p>{getTranslation("empty")}</p>
            </div>
          ) : (
            <div className="responsive-table-wrapper">
              <table className="support-table">
                <thead>
                  <tr>
                    <th>{getTranslation("status")}</th>
                    <th>{getTranslation("sender")}</th>
                    <th>{getTranslation("topic")}</th>
                    <th>{getTranslation("message")}</th>
                    <th>{getTranslation("date")}</th>
                    <th>{getTranslation("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="ticket-row"
                    >
                      <td>
                        <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                          {ticket.status === "New" && <FaExclamationCircle />}
                          {ticket.status === "Pending" && <FaClock />}
                          {ticket.status === "Resolved" && <FaCheckCircle />}
                          {getTranslation(`filter${ticket.status}`)}
                        </span>
                      </td>
                      <td>
                        <div className="sender-cell">
                          <strong className="sender-name">{ticket.name}</strong>
                          <span className="sender-email">{ticket.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="topic-text">
                          <FaTag className="icon" /> {ticket.topic}
                        </span>
                      </td>
                      <td>
                        <p className="message-preview-text">
                          {ticket.message.length > 60
                            ? `${ticket.message.substring(0, 60)}...`
                            : ticket.message}
                        </p>
                      </td>
                      <td>
                        <span className="received-date">
                          <FaClock className="icon" /> {formatDateTime(ticket.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="btn-view"
                            title={getTranslation("viewDetails")}
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn-delete"
                            title={getTranslation("deleteTicket")}
                            onClick={(e) => openDeleteModal(ticket, e)}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Ticket Detail Drawer Sidepanel / Modal Overlay */}
        {selectedTicket && (
          <div className="drawer-overlay" onClick={() => setSelectedTicket(null)}>
            <div className="drawer-card" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <h3>{getTranslation("ticketDetails")}</h3>
                <button className="close-drawer-btn" onClick={() => setSelectedTicket(null)}>
                  <FaTimes />
                </button>
              </div>

              <div className="drawer-body">
                <div className="drawer-info-group">
                  <div className="info-item">
                    <span className="label-title">{getTranslation("status")}</span>
                    <span className={`status-badge ${selectedTicket.status.toLowerCase()}`}>
                      {selectedTicket.status === "New" && <FaExclamationCircle />}
                      {selectedTicket.status === "Pending" && <FaClock />}
                      {selectedTicket.status === "Resolved" && <FaCheckCircle />}
                      {getTranslation(`filter${selectedTicket.status}`)}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="label-title">{getTranslation("date")}</span>
                    <span className="value-content">
                      <FaClock /> {formatDateTime(selectedTicket.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="drawer-divider"></div>

                <div className="drawer-section">
                  <h4>{getTranslation("sender")}</h4>
                  <div className="sender-profile">
                    <div className="sender-avatar">
                      <FaUser />
                    </div>
                    <div className="sender-details">
                      <strong className="name-val">{selectedTicket.name}</strong>
                      <span className="email-val">
                        <FaEnvelope /> {selectedTicket.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="drawer-section">
                  <h4>{getTranslation("topic")}</h4>
                  <p className="topic-val">
                    <FaTag /> {selectedTicket.topic}
                  </p>
                </div>

                <div className="drawer-section message-section">
                  <h4>{getTranslation("message")}</h4>
                  <div className="message-bubble">
                    <FaComments className="quote-icon" />
                    <p className="message-content-text">{selectedTicket.message}</p>
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <div className="update-actions">
                  {selectedTicket.status !== "Pending" && (
                    <button
                      className="btn-pending-action"
                      onClick={() => handleUpdateStatus(selectedTicket._id, "Pending")}
                    >
                      <FaClock /> {getTranslation("markPending")}
                    </button>
                  )}
                  {selectedTicket.status !== "Resolved" && (
                    <button
                      className="btn-resolve-action"
                      onClick={() => handleUpdateStatus(selectedTicket._id, "Resolved")}
                    >
                      <FaCheck /> {getTranslation("resolveTicket")}
                    </button>
                  )}
                </div>
                <button
                  className="btn-delete-action"
                  onClick={(e) => openDeleteModal(selectedTicket, e)}
                >
                  <FaTrashAlt /> {getTranslation("deleteTicket")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal-card">
              <h3 className="modal-title">{getTranslation("confirmDeleteTitle")}</h3>
              <p className="modal-message">
                {getTranslation("confirmDeleteMsg").replace(
                  "{name}",
                  deleteModal.ticket?.name
                )}
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeDeleteModal}>
                  <FaTimes /> {getTranslation("cancel")}
                </button>
                <button
                  className="btn-confirm"
                  onClick={() => handleDeleteTicket(deleteModal.ticket?._id)}
                >
                  <FaTrashAlt /> {getTranslation("confirm")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAppLayout>
  );
};

export default SupportInboxPage;
