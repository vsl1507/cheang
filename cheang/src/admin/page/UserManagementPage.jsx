import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminAppLayout from "../layouts/AdminAppLayout";
import Label from "../../components/label/Label";
import { useLanguage } from "../../context/LanguageContext";
import "./UserManagementPage.scss";
import {
  FaSearch,
  FaUserShield,
  FaUsers,
  FaUserCheck,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaEnvelope,
  FaSpinner,
  FaEdit,
  FaKey,
  FaEye,
} from "react-icons/fa";

const translationDictionary = {
  en: {
    title: "User Management",
    searchPlaceholder: "Search users by name or email...",
    filterAll: "All Users",
    filterAdmins: "Admins",
    filterPros: "Handymen (Pros)",
    filterClients: "Clients",
    avatar: "Avatar",
    name: "Name",
    email: "Email",
    role: "Role",
    memberSince: "Member Since",
    actions: "Actions",
    promoteAdmin: "Toggle Admin",
    deleteUser: "Delete User",
    loading: "Loading users list...",
    empty: "No users found matching filters.",
    adminRole: "Administrator",
    proRole: "Handyman Pro",
    clientRole: "Client Customer",
    confirmDeleteTitle: "Confirm Delete User",
    confirmDeleteMsg: "Are you sure you want to permanently delete user {name}? This action cannot be undone.",
    confirmToggleAdminTitle: "Confirm Admin Privilege Change",
    confirmToggleAdminMsg: "Are you sure you want to toggle Admin privileges for {name}?",
    cancel: "Cancel",
    confirm: "Confirm",
    successDelete: "User deleted successfully",
    successToggle: "User permissions updated successfully",
    editUserTitle: "Edit User Details",
    resetPasswordTitle: "Reset Password",
    viewDetailTitle: "User Profile Details",
    btnSave: "Save Changes",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm Password",
    errorPasswordMismatch: "Passwords do not match",
    successEdit: "User updated successfully",
    successReset: "Password reset successfully",
    brandNameLabel: "Brand Name",
    mainServiceLabel: "Main Service",
    subServiceLabel: "Sub-Service",
    phoneLabel: "Phone Number",
    locationLabel: "Location",
    ratingsLabel: "Ratings",
    commentsLabel: "Reviews",
    proLabel: "Handyman Pro Status",
  },
  kh: {
    title: "គ្រប់គ្រងអ្នកប្រើប្រាស់",
    searchPlaceholder: "ស្វែងរកអ្នកប្រើប្រាស់តាមឈ្មោះ ឬអ៊ីមែល...",
    filterAll: "ទាំងអស់",
    filterAdmins: "អភិបាល (Admins)",
    filterPros: "ជាងជំនាញ (Pros)",
    filterClients: "អតិថិជន (Clients)",
    avatar: "រូបថត",
    name: "ឈ្មោះ",
    email: "អ៊ីមែល",
    role: "តួនាទី",
    memberSince: "ថ្ងៃចូលរួម",
    actions: "សកម្មភាព",
    promoteAdmin: "ប្តូរសិទ្ធិ Admin",
    deleteUser: "លុបអ្នកប្រើ",
    loading: "កំពុងទាញយកបញ្ជីអ្នកប្រើប្រាស់...",
    empty: "រកមិនឃើញអ្នកប្រើប្រាស់ដែលត្រូវនឹងតម្រងនោះទេ។",
    adminRole: "អភិបាលប្រព័ន្ធ",
    proRole: "ជាងអាជីព",
    clientRole: "អតិថិជនធម្មតា",
    confirmDeleteTitle: "បញ្ជាក់ការលុបអ្នកប្រើប្រាស់",
    confirmDeleteMsg: "តើអ្នកប្រាកដជាចង់លុបអ្នកប្រើប្រាស់ {name} ជាអចិន្ត្រៃយ៍មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ។",
    confirmToggleAdminTitle: "បញ្ជាក់ការផ្លាស់ប្តូរសិទ្ធិ Admin",
    confirmToggleAdminMsg: "តើអ្នកប្រាកដជាចង់ប្តូរសិទ្ធិ Admin សម្រាប់ {name} មែនទេ?",
    cancel: "បដិសេធ",
    confirm: "យល់ព្រម",
    successDelete: "បានលុបអ្នកប្រើប្រាស់ដោយជោគជ័យ",
    successToggle: "បានធ្វើបច្ចុប្បន្នភាពសិទ្ធិអ្នកប្រើប្រាស់ដោយជោគជ័យ",
    editUserTitle: "កែប្រែព័ត៌មានអ្នកប្រើប្រាស់",
    resetPasswordTitle: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ",
    viewDetailTitle: "ព័ត៌មានលម្អិតគណនី",
    btnSave: "រក្សាទុកការផ្លាស់ប្តូរ",
    newPasswordLabel: "ពាក្យសម្ងាត់ថ្មី",
    confirmPasswordLabel: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
    errorPasswordMismatch: "ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នាឡើយ",
    successEdit: "បានធ្វើបច្ចុប្បន្នភាពគណនីដោយជោគជ័យ",
    successReset: "បានកំណត់ពាក្យសម្ងាត់ឡើងវិញដោយជោគជ័យ",
    brandNameLabel: "ឈ្មោះហាង/ម៉ាក",
    mainServiceLabel: "សេវាកម្មចម្បង",
    subServiceLabel: "សេវាកម្មរង",
    phoneLabel: "លេខទូរស័ព្ទ",
    locationLabel: "ទីតាំង",
    ratingsLabel: "ការវាយតម្លៃ",
    commentsLabel: "មតិយោបល់",
    proLabel: "ស្ថានភាពជាជាងជំនាញ",
  },
  zh: {
    title: "用户管理",
    searchPlaceholder: "按姓名或电子邮件搜索用户...",
    filterAll: "所有用户",
    filterAdmins: "管理员",
    filterPros: "专业工人",
    filterClients: "普通客户",
    avatar: "头像",
    name: "姓名",
    email: "电子邮件",
    role: "角色",
    memberSince: "注册日期",
    actions: "操作",
    promoteAdmin: "切换管理员",
    deleteUser: "删除用户",
    loading: "正在加载用户列表...",
    empty: "没有找到符合条件的用户。",
    adminRole: "管理员",
    proRole: "专业工人",
    clientRole: "普通客户",
    confirmDeleteTitle: "确认删除用户",
    confirmDeleteMsg: "您确定要永久删除用户 {name} 吗？此操作无法撤销。",
    confirmToggleAdminTitle: "确认管理员权限变更",
    confirmToggleAdminMsg: "您确定要切换 {name} 的管理员权限吗？",
    cancel: "取消",
    confirm: "确认",
    successDelete: "用户删除成功",
    successToggle: "用户权限更新成功",
    editUserTitle: "编辑用户信息",
    resetPasswordTitle: "重置密码",
    viewDetailTitle: "用户详细资料",
    btnSave: "保存修改",
    newPasswordLabel: "新密码",
    confirmPasswordLabel: "确认密码",
    errorPasswordMismatch: "密码不匹配",
    successEdit: "用户信息更新成功",
    successReset: "密码重置成功",
    brandNameLabel: "品牌名称",
    mainServiceLabel: "主营服务",
    subServiceLabel: "子服务",
    phoneLabel: "电话号码",
    locationLabel: "位置",
    ratingsLabel: "评分",
    commentsLabel: "用户评论",
    proLabel: "专业工人状态",
  }
};

const TableSkeleton = () => (
  <div className="skeleton-table">
    {[1, 2, 3, 4, 5].map((n) => (
      <div className="skeleton-row" key={n}>
        <div className="skeleton-col avatar-col skeleton-shimmer"></div>
        <div className="skeleton-col text-col skeleton-shimmer"></div>
        <div className="skeleton-col text-col skeleton-shimmer"></div>
        <div className="skeleton-col badge-col skeleton-shimmer"></div>
        <div className="skeleton-col date-col skeleton-shimmer"></div>
        <div className="skeleton-col actions-col skeleton-shimmer"></div>
      </div>
    ))}
  </div>
);

const UserManagementPage = () => {
  const { language } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtering and Searching states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, admin, pro, client

  // Modals state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "", // delete, toggleAdmin
    targetUser: null,
  });

  // Additional admin tool states
  const [viewUser, setViewUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [resetPwdUser, setResetPwdUser] = useState(null);

  const [editFormData, setEditFormData] = useState({
    nameuser: "",
    email: "",
    brandName: "",
    phone: "",
    province: "",
    city: "",
    mainService: "",
    subService: "",
    userPro: false
  });

  const [resetPwdFormData, setResetPwdFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      nameuser: user.nameuser || "",
      email: user.email || "",
      brandName: user.brandName || "",
      phone: user.phone || "",
      province: user.province || "",
      city: user.city || "",
      mainService: user.mainService || "",
      subService: user.subService || "",
      userPro: user.userPro || false
    });
    setFormErrors({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.nameuser.trim()) {
      setFormErrors({ nameuser: "Name is required" });
      return;
    }
    if (!editFormData.email.trim()) {
      setFormErrors({ email: "Email is required" });
      return;
    }

    try {
      setFormLoading(true);
      setFormErrors({});
      const res = await fetch(`/api/admin/edit-user/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (data.success === false) {
        setFormErrors({ apiError: data.message });
      } else {
        setUsers((prev) =>
          prev.map((u) => (u._id === editingUser._id ? data.user : u))
        );
        setEditingUser(null);
      }
    } catch (err) {
      setFormErrors({ apiError: "Network error updating user." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleResetPwdSubmit = async (e) => {
    e.preventDefault();
    if (resetPwdFormData.newPassword.length < 6) {
      setFormErrors({ newPassword: "Password must be at least 6 characters" });
      return;
    }
    if (resetPwdFormData.newPassword !== resetPwdFormData.confirmPassword) {
      setFormErrors({ confirmPassword: getTranslation("errorPasswordMismatch") });
      return;
    }

    try {
      setFormLoading(true);
      setFormErrors({});
      const res = await fetch(`/api/admin/reset-password/${resetPwdUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: resetPwdFormData.newPassword }),
      });
      const data = await res.json();
      if (data.success === false) {
        setFormErrors({ apiError: data.message });
      } else {
        setResetPwdUser(null);
        setResetPwdFormData({ newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setFormErrors({ apiError: "Network error resetting password." });
    } finally {
      setFormLoading(false);
    }
  };

  const getTranslation = (key) => {
    return translationDictionary[language]?.[key] || translationDictionary["en"][key];
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/user/countusers");
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      } else {
        setUsers(data.data || data);
      }
    } catch (err) {
      setError("Failed to fetch user list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  // Handle Role Toggling
  const handleToggleAdmin = async (userId) => {
    try {
      const res = await fetch(`/api/admin/toggle-admin/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message || "Failed to update permissions.");
      } else {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === userId ? { ...u, admin: !u.admin } : u))
        );
      }
    } catch (err) {
      setError("Network error updating role.");
    } finally {
      closeModal();
    }
  };

  // Handle Deleting User
  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/delete-user/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message || "Failed to delete user.");
      } else {
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
      }
    } catch (err) {
      setError("Network error deleting user.");
    } finally {
      closeModal();
    }
  };

  const openModal = (type, user) => {
    setConfirmModal({
      isOpen: true,
      type,
      targetUser: user,
    });
  };

  const closeModal = () => {
    setConfirmModal({
      isOpen: false,
      type: "",
      targetUser: null,
    });
  };

  const handleConfirmAction = () => {
    const { type, targetUser } = confirmModal;
    if (!targetUser) return;
    if (type === "delete") {
      handleDeleteUser(targetUser._id);
    } else if (type === "toggleAdmin") {
      handleToggleAdmin(targetUser._id);
    }
  };

  // Filter & Search computation
  const filteredUsers = users.filter((u) => {
    // Search query match
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      u.nameuser.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query);

    // Tab filter match
    let matchesTab = true;
    if (activeTab === "admin") {
      matchesTab = u.admin === true;
    } else if (activeTab === "pro") {
      matchesTab = u.userPro === true && !u.admin;
    } else if (activeTab === "client") {
      matchesTab = !u.userPro && !u.admin;
    }

    return matchesSearch && matchesTab;
  });

  return (
    <AdminAppLayout>
      <div className="user-management-contain">
        <Label label={getTranslation("title")} />

        {error && <div className="error-toast">{error}</div>}

        {/* Toolbar: Search & Filter Tabs */}
        <div className="management-toolbar">
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
              <FaUsers /> {getTranslation("filterAll")}
            </button>
            <button
              className={activeTab === "admin" ? "tab active" : "tab"}
              onClick={() => setActiveTab("admin")}
            >
              <FaUserShield /> {getTranslation("filterAdmins")}
            </button>
            <button
              className={activeTab === "pro" ? "tab active" : "tab"}
              onClick={() => setActiveTab("pro")}
            >
              <FaUserCheck /> {getTranslation("filterPros")}
            </button>
            <button
              className={activeTab === "client" ? "tab active" : "tab"}
              onClick={() => setActiveTab("client")}
            >
              <FaUsers /> {getTranslation("filterClients")}
            </button>
          </div>
        </div>

        {/* Users Table / Grid */}
        <div className="users-table-card">
          {loading ? (
            <TableSkeleton />
          ) : filteredUsers.length === 0 ? (
            <div className="empty-results">
              <p>{getTranslation("empty")}</p>
            </div>
          ) : (
            <div className="responsive-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>{getTranslation("avatar")}</th>
                    <th>{getTranslation("name")}</th>
                    <th>{getTranslation("email")}</th>
                    <th>{getTranslation("role")}</th>
                    <th>{getTranslation("memberSince")}</th>
                    <th>{getTranslation("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <img src={user.avatar} alt={user.nameuser} className="user-avatar" />
                      </td>
                      <td>
                        <strong className="user-name">{user.nameuser}</strong>
                      </td>
                      <td>
                        <span className="user-email-text">
                          <FaEnvelope className="icon" /> {user.email}
                        </span>
                      </td>
                      <td>
                        {user.admin ? (
                          <span className="role-badge admin">
                            <FaUserShield /> {getTranslation("adminRole")}
                          </span>
                        ) : user.userPro ? (
                          <span className="role-badge pro">
                            <FaUserCheck /> {getTranslation("proRole")}
                          </span>
                        ) : (
                          <span className="role-badge client">
                            <FaUsers /> {getTranslation("clientRole")}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="reg-date">
                          <FaCalendarAlt className="icon" />{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-view"
                            title={getTranslation("viewDetailTitle")}
                            onClick={() => setViewUser(user)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn-edit"
                            title={getTranslation("editUserTitle")}
                            onClick={() => handleOpenEdit(user)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-reset"
                            title={getTranslation("resetPasswordTitle")}
                            onClick={() => {
                              setResetPwdUser(user);
                              setResetPwdFormData({ newPassword: "", confirmPassword: "" });
                              setFormErrors({});
                            }}
                          >
                            <FaKey />
                          </button>
                          <button
                            className="btn-toggle-admin"
                            title={getTranslation("promoteAdmin")}
                            onClick={() => openModal("toggleAdmin", user)}
                            disabled={currentUser._id === user._id}
                          >
                            <FaUserShield />
                          </button>
                          <button
                            className="btn-delete"
                            title={getTranslation("deleteUser")}
                            onClick={() => openModal("delete", user)}
                            disabled={currentUser._id === user._id}
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

        {/* Confirmation Modal */}
        {confirmModal.isOpen && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal-card">
              <h3 className="modal-title">
                {confirmModal.type === "delete"
                  ? getTranslation("confirmDeleteTitle")
                  : getTranslation("confirmToggleAdminTitle")}
              </h3>
              <p className="modal-message">
                {confirmModal.type === "delete"
                  ? getTranslation("confirmDeleteMsg").replace(
                      "{name}",
                      confirmModal.targetUser?.nameuser
                    )
                  : getTranslation("confirmToggleAdminMsg").replace(
                      "{name}",
                      confirmModal.targetUser?.nameuser
                    )}
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeModal}>
                  <FaTimes /> {getTranslation("cancel")}
                </button>
                <button className="btn-confirm" onClick={handleConfirmAction}>
                  <FaCheck /> {getTranslation("confirm")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Drawer/Overlay Modal */}
        {viewUser && (
          <div className="detail-modal-overlay" onClick={() => setViewUser(null)}>
            <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{getTranslation("viewDetailTitle")}</h3>
                <button className="btn-close-modal" onClick={() => setViewUser(null)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body user-details-body">
                <div className="user-profile-summary">
                  <img src={viewUser.avatar} alt={viewUser.nameuser} className="detail-avatar" />
                  <div className="profile-text">
                    <h4>{viewUser.nameuser}</h4>
                    <span className="profile-role-badge">
                      {viewUser.admin ? getTranslation("adminRole") : viewUser.userPro ? getTranslation("proRole") : getTranslation("clientRole")}
                    </span>
                  </div>
                </div>

                <div className="details-grid">
                  <div className="detail-field">
                    <span className="field-label">{getTranslation("email")}</span>
                    <span className="field-value">{viewUser.email}</span>
                  </div>

                  <div className="detail-field">
                    <span className="field-label">{getTranslation("phoneLabel")}</span>
                    <span className="field-value">{viewUser.phone || "N/A"}</span>
                  </div>

                  <div className="detail-field">
                    <span className="field-label">{getTranslation("locationLabel")}</span>
                    <span className="field-value">
                      {viewUser.province || viewUser.city ? `${viewUser.province || ""}, ${viewUser.city || ""}` : "N/A"}
                    </span>
                  </div>

                  {viewUser.userPro && (
                    <>
                      <div className="detail-field">
                        <span className="field-label">{getTranslation("brandNameLabel")}</span>
                        <span className="field-value">{viewUser.brandName || "N/A"}</span>
                      </div>

                      <div className="detail-field">
                        <span className="field-label">{getTranslation("mainServiceLabel")}</span>
                        <span className="field-value">{viewUser.mainService || "N/A"}</span>
                      </div>

                      <div className="detail-field">
                        <span className="field-label">{getTranslation("subServiceLabel")}</span>
                        <span className="field-value">{viewUser.subService || "N/A"}</span>
                      </div>
                    </>
                  )}

                  <div className="detail-field">
                    <span className="field-label">{getTranslation("memberSince")}</span>
                    <span className="field-value">{new Date(viewUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {viewUser.userPro && viewUser.ratings && viewUser.ratings.length > 0 && (
                  <div className="ratings-section">
                    <h4>{getTranslation("ratingsLabel")} ({viewUser.ratings.length})</h4>
                    <div className="ratings-summary">
                      <span className="rating-avg">
                        ★ {(viewUser.ratings.reduce((sum, r) => sum + r.rating, 0) / viewUser.ratings.length).toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}

                {viewUser.userPro && viewUser.comments && viewUser.comments.length > 0 && (
                  <div className="comments-section">
                    <h4>{getTranslation("commentsLabel")} ({viewUser.comments.length})</h4>
                    <div className="comments-list">
                      {viewUser.comments.map((c, i) => (
                        <div className="comment-item" key={c._id || i}>
                          <div className="comment-author">
                            <img src={c.userAvatar} alt={c.userName} className="comment-avatar" />
                            <span className="comment-name">{c.userName}</span>
                          </div>
                          <p className="comment-text">{c.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit User Form Modal */}
        {editingUser && (
          <div className="form-modal-overlay" onClick={() => setEditingUser(null)}>
            <div className="form-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{getTranslation("editUserTitle")}</h3>
                <button className="btn-close-modal" onClick={() => setEditingUser(null)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="modal-form">
                {formErrors.apiError && <div className="form-error-banner">{formErrors.apiError}</div>}

                <div className="form-group">
                  <label>{getTranslation("name")}</label>
                  <input
                    type="text"
                    value={editFormData.nameuser}
                    onChange={(e) => setEditFormData({ ...editFormData, nameuser: e.target.value })}
                  />
                  {formErrors.nameuser && <span className="field-error">{formErrors.nameuser}</span>}
                </div>

                <div className="form-group">
                  <label>{getTranslation("email")}</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label>{getTranslation("phoneLabel")}</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group-checkbox">
                  <input
                    type="checkbox"
                    id="userPro"
                    checked={editFormData.userPro}
                    onChange={(e) => setEditFormData({ ...editFormData, userPro: e.target.checked })}
                  />
                  <label htmlFor="userPro">{getTranslation("proLabel")}</label>
                </div>

                {editFormData.userPro && (
                  <>
                    <div className="form-group">
                      <label>{getTranslation("brandNameLabel")}</label>
                      <input
                        type="text"
                        value={editFormData.brandName}
                        onChange={(e) => setEditFormData({ ...editFormData, brandName: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>{getTranslation("mainServiceLabel")}</label>
                      <input
                        type="text"
                        value={editFormData.mainService}
                        onChange={(e) => setEditFormData({ ...editFormData, mainService: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>{getTranslation("subServiceLabel")}</label>
                      <input
                        type="text"
                        value={editFormData.subService}
                        onChange={(e) => setEditFormData({ ...editFormData, subService: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setEditingUser(null)}>
                    <FaTimes /> {getTranslation("cancel")}
                  </button>
                  <button type="submit" className="btn-confirm" disabled={formLoading}>
                    {formLoading ? <FaSpinner className="spinner" /> : <FaCheck />} {getTranslation("btnSave")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {resetPwdUser && (
          <div className="form-modal-overlay" onClick={() => setResetPwdUser(null)}>
            <div className="form-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{getTranslation("resetPasswordTitle")} ({resetPwdUser.nameuser})</h3>
                <button className="btn-close-modal" onClick={() => setResetPwdUser(null)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleResetPwdSubmit} className="modal-form">
                {formErrors.apiError && <div className="form-error-banner">{formErrors.apiError}</div>}

                <div className="form-group">
                  <label>{getTranslation("newPasswordLabel")}</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={resetPwdFormData.newPassword}
                    onChange={(e) => setFormErrors({}) || setResetPwdFormData({ ...resetPwdFormData, newPassword: e.target.value })}
                  />
                  {formErrors.newPassword && <span className="field-error">{formErrors.newPassword}</span>}
                </div>

                <div className="form-group">
                  <label>{getTranslation("confirmPasswordLabel")}</label>
                  <input
                    type="password"
                    value={resetPwdFormData.confirmPassword}
                    onChange={(e) => setFormErrors({}) || setResetPwdFormData({ ...resetPwdFormData, confirmPassword: e.target.value })}
                  />
                  {formErrors.confirmPassword && <span className="field-error">{formErrors.confirmPassword}</span>}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setResetPwdUser(null)}>
                    <FaTimes /> {getTranslation("cancel")}
                  </button>
                  <button type="submit" className="btn-confirm" disabled={formLoading}>
                    {formLoading ? <FaSpinner className="spinner" /> : <FaCheck />} {getTranslation("confirm")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminAppLayout>
  );
};

export default UserManagementPage;
