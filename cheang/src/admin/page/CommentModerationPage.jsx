import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminAppLayout from "../layouts/AdminAppLayout";
import Label from "../../components/label/Label";
import { useLanguage } from "../../context/LanguageContext";
import "./CommentModerationPage.scss";
import {
  FaSearch,
  FaTrashAlt,
  FaStar,
  FaUser,
  FaWrench,
  FaCalendarAlt,
  FaCommentAlt,
  FaCheck,
  FaTimes,
  FaStarHalfAlt,
} from "react-icons/fa";

const translationDictionary = {
  en: {
    title: "Review & Comment Moderation",
    searchPlaceholder: "Search reviews by author, comment text, or handyman...",
    filterAll: "All Reviews",
    filterBad: "Bad Reviews (1-3★)",
    filterGood: "Good Reviews (4-5★)",
    author: "Written By",
    handyman: "Handyman Pro Profile",
    comment: "Comment Review",
    rating: "Rating Score",
    date: "Posted Date",
    actions: "Actions",
    loading: "Loading platform reviews...",
    empty: "No review records found.",
    confirmTitle: "Confirm Delete Review",
    confirmMsg: "Are you sure you want to permanently delete this review left by {author}? This action cannot be undone.",
    cancel: "Cancel",
    confirm: "Delete Review",
    successDelete: "Review comment deleted successfully",
  },
  kh: {
    title: "គ្រប់គ្រងការមតិយោបល់",
    searchPlaceholder: "ស្វែងរកការវាយតម្លៃតាមអ្នកសរសេរ មតិ ឬឈ្មោះជាង...",
    filterAll: "ការវាយតម្លៃទាំងអស់",
    filterBad: "ការវាយតម្លៃមិនល្អ (១-៣★)",
    filterGood: "ការវាយតម្លៃល្អ (៤-៥★)",
    author: "សរសេរដោយ",
    handyman: "ប្រវត្តិរូបជាងជំនាញ",
    comment: "មតិយោបល់",
    rating: "កម្រិតផ្កាយ",
    date: "ថ្ងៃបង្ហោះ",
    actions: "សកម្មភាព",
    loading: "កំពុងទាញយកមតិយោបល់...",
    empty: "រកមិនឃើញប្រវត្តិនៃការមតិយោបល់ឡើយ។",
    confirmTitle: "បញ្ជាក់ការលុបមតិយោបល់",
    confirmMsg: "តើអ្នកប្រាកដជាចង់លុបមតិយោបល់ដែលសរសេរដោយ {author} មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ។",
    cancel: "បដិសេធ",
    confirm: "លុបមតិយោបល់",
    successDelete: "បានលុបមតិយោបល់ដោយជោគជ័យ",
  },
  zh: {
    title: "评论与评分审核",
    searchPlaceholder: "按作者、评论内容或工人搜索评论...",
    filterAll: "所有评价",
    filterBad: "差评 (1-3★)",
    filterGood: "好评 (4-5★)",
    author: "评价人",
    handyman: "专业工人主页",
    comment: "评价内容",
    rating: "星级评分",
    date: "发布时间",
    actions: "操作",
    loading: "正在加载平台评价...",
    empty: "未找到任何评价记录。",
    confirmTitle: "确认删除评价",
    confirmMsg: "您确定要永久删除由 {author} 发布的评价吗？此操作无法撤销。",
    cancel: "取消",
    confirm: "确认删除",
    successDelete: "评价删除成功",
  }
};

const TableSkeleton = () => (
  <div className="skeleton-table">
    {[1, 2, 3, 4].map((n) => (
      <div className="skeleton-row" key={n}>
        <div className="skeleton-col author-col skeleton-shimmer"></div>
        <div className="skeleton-col target-col skeleton-shimmer"></div>
        <div className="skeleton-col comment-col skeleton-shimmer"></div>
        <div className="skeleton-col star-col skeleton-shimmer"></div>
        <div className="skeleton-col date-col skeleton-shimmer"></div>
        <div className="skeleton-col action-col skeleton-shimmer"></div>
      </div>
    ))}
  </div>
);

const CommentModerationPage = () => {
  const { language } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, bad (1-3), good (4-5)

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    targetComment: null,
  });

  const getTranslation = (key) => {
    return translationDictionary[language]?.[key] || translationDictionary["en"][key];
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/comments");
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      } else {
        setComments(data);
      }
    } catch (err) {
      setError("Failed to fetch comment logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [currentUser]);

  // Handle Comment Deletion
  const handleDeleteComment = async () => {
    const { targetComment } = confirmModal;
    if (!targetComment) return;
    try {
      const { handymanId, commentId } = targetComment;
      const res = await fetch(`/api/admin/comments/${handymanId}/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message || "Failed to delete comment.");
      } else {
        setComments((prevComments) =>
          prevComments.filter((c) => c.commentId !== commentId)
        );
      }
    } catch (err) {
      setError("Network error deleting comment.");
    } finally {
      closeModal();
    }
  };

  const openModal = (comment) => {
    setConfirmModal({
      isOpen: true,
      targetComment: comment,
    });
  };

  const closeModal = () => {
    setConfirmModal({
      isOpen: false,
      targetComment: null,
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar className="star full" key={i} />);
      } else {
        stars.push(<FaStar className="star empty" key={i} />);
      }
    }
    return stars;
  };

  // Filter & Search Logic
  const filteredComments = comments.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      c.userName.toLowerCase().includes(query) ||
      c.commentText.toLowerCase().includes(query) ||
      c.handymanName.toLowerCase().includes(query) ||
      (c.handymanBrand && c.handymanBrand.toLowerCase().includes(query));

    let matchesFilter = true;
    if (activeFilter === "bad") {
      matchesFilter = c.rating <= 3;
    } else if (activeFilter === "good") {
      matchesFilter = c.rating >= 4;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <AdminAppLayout>
      <div className="comment-moderation-contain">
        <Label label={getTranslation("title")} />

        {error && <div className="error-toast">{error}</div>}

        {/* Search & Filter Toolbar */}
        <div className="moderation-toolbar">
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
              className={activeFilter === "good" ? "tab active" : "tab"}
              onClick={() => setActiveFilter("good")}
            >
              {getTranslation("filterGood")}
            </button>
            <button
              className={activeFilter === "bad" ? "tab active" : "tab"}
              onClick={() => setActiveFilter("bad")}
            >
              {getTranslation("filterBad")}
            </button>
          </div>
        </div>

        {/* Comments Listing Grid/Table */}
        <div className="comments-card-container">
          {loading ? (
            <TableSkeleton />
          ) : filteredComments.length === 0 ? (
            <div className="empty-results">
              <p>{getTranslation("empty")}</p>
            </div>
          ) : (
            <div className="responsive-table-wrapper">
              <table className="comments-table">
                <thead>
                  <tr>
                    <th>{getTranslation("author")}</th>
                    <th>{getTranslation("handyman")}</th>
                    <th>{getTranslation("comment")}</th>
                    <th>{getTranslation("rating")}</th>
                    <th>{getTranslation("date")}</th>
                    <th>{getTranslation("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComments.map((c) => (
                    <tr key={c.commentId}>
                      {/* Author */}
                      <td>
                        <div className="author-cell">
                          <img
                            src={c.userAvatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                            alt={c.userName}
                            className="author-avatar"
                          />
                          <strong className="author-name">{c.userName}</strong>
                        </div>
                      </td>

                      {/* Handyman */}
                      <td>
                        <div className="handyman-cell">
                          <span className="brand-name">
                            <FaWrench className="icon-orange" /> {c.handymanBrand || c.handymanName}
                          </span>
                          <span className="owner-sub">Owner: {c.handymanName}</span>
                        </div>
                      </td>

                      {/* Comment */}
                      <td>
                        <div className="comment-cell">
                          <FaCommentAlt className="quote-icon" />
                          <p className="comment-text">{c.commentText}</p>
                        </div>
                      </td>

                      {/* Rating */}
                      <td>
                        <div className="rating-stars-cell">
                          <div className="stars-wrapper">{renderStars(c.rating)}</div>
                          <span className="rating-num">({c.rating}★)</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td>
                        <span className="post-date">
                          <FaCalendarAlt className="icon" />{" "}
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <button
                          className="btn-delete"
                          title={getTranslation("confirm")}
                          onClick={() => openModal(c)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {confirmModal.isOpen && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal-card">
              <h3 className="modal-title">{getTranslation("confirmTitle")}</h3>
              <p className="modal-message">
                {getTranslation("confirmMsg").replace(
                  "{author}",
                  confirmModal.targetComment?.userName
                )}
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeModal}>
                  <FaTimes /> {getTranslation("cancel")}
                </button>
                <button className="btn-confirm-delete" onClick={handleDeleteComment}>
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

export default CommentModerationPage;
