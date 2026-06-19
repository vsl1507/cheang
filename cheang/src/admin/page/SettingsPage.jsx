import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminAppLayout from "../layouts/AdminAppLayout";
import Label from "../../components/label/Label";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import "./SettingsPage.scss";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaImage,
  FaCog,
  FaCheck,
  FaGlobe,
  FaSpinner,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

const translationDictionary = {
  en: {
    title: "System Settings",
    profileTitle: "Admin Profile Settings",
    systemTitle: "Platform Configurations",
    preferenceTitle: "Preferences",
    nameLabel: "Administrator Name",
    emailLabel: "Administrative Email",
    passwordLabel: "New Password (Optional)",
    avatarLabel: "Avatar Image URL",
    saveProfileBtn: "Update Profile Details",
    maintenanceLabel: "Maintenance Mode",
    maintenanceDesc: "Lock public access to the client portal and show a maintenance page.",
    autoVerifyLabel: "Auto-Approve Pros",
    autoVerifyDesc: "Automatically approve new handyman requests without review.",
    supportEmailLabel: "Support Routing Email",
    saveSystemBtn: "Save Configurations",
    themeLabel: "Active UI Theme",
    langLabel: "Active Language",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    successSave: "Settings updated successfully!",
    errorSave: "Failed to update profile settings.",
    loading: "Updating account...",
  },
  kh: {
    title: "ការកំណត់ប្រព័ន្ធ",
    profileTitle: "ការកំណត់ប្រវត្តិរូប Admin",
    systemTitle: "ការកំណត់រចនាសម្ព័ន្ធប្រព័ន្ធ",
    preferenceTitle: "ចំណង់ចំណូលចិត្ត",
    nameLabel: "ឈ្មោះអ្នកគ្រប់គ្រង",
    emailLabel: "អ៊ីមែលអ្នកគ្រប់គ្រង",
    passwordLabel: "ពាក្យសម្ងាត់ថ្មី (ជម្រើស)",
    avatarLabel: "តំណភ្ជាប់រូបភាពអាវ៉ាតា",
    saveProfileBtn: "ធ្វើបច្ចុប្បន្នភាពព័ត៌មានប្រវត្តិរូប",
    maintenanceLabel: "របៀបថែទាំប្រព័ន្ធ (Maintenance Mode)",
    maintenanceDesc: "បិទការចូលប្រើប្រាស់ជាសាធារណៈ និងបង្ហាញទំព័រថែទាំប្រព័ន្ធជាបណ្តោះអាសន្ន។",
    autoVerifyLabel: "យល់ព្រមគណនីជាងស្វ័យប្រវត្ត",
    autoVerifyDesc: "យល់ព្រមលើរាល់សំណើគណនីជាងថ្មីៗដោយស្វ័យប្រវត្តដោយមិនបាច់ពិនិត្យ។",
    supportEmailLabel: "អ៊ីមែលគាំទ្រប្រព័ន្ធ",
    saveSystemBtn: "រក្សាទុកការកំណត់ប្រព័ន្ធ",
    themeLabel: "ស្បែកប្រព័ន្ធសកម្ម",
    langLabel: "ភាសាសកម្ម",
    themeLight: "ពន្លឺ",
    themeDark: "ងងឹត",
    successSave: "បានធ្វើបច្ចុប្បន្នភាពការកំណត់ដោយជោគជ័យ!",
    errorSave: "ការធ្វើបច្ចុប្បន្នភាពគណនីបានបរាជ័យ។",
    loading: "កំពុងរក្សាទុក...",
  },
  zh: {
    title: "系统设置",
    profileTitle: "管理员个人资料设置",
    systemTitle: "平台配置控制",
    preferenceTitle: "显示偏好",
    nameLabel: "管理员姓名",
    emailLabel: "管理员邮箱",
    passwordLabel: "新密码（可选）",
    avatarLabel: "头像链接 URL",
    saveProfileBtn: "更新个人资料",
    maintenanceLabel: "维护模式",
    maintenanceDesc: "锁定对公共平台的访问，并显示维护页面。",
    autoVerifyLabel: "自动批准工人",
    autoVerifyDesc: "自动批准新的勤杂工申请，无需人工审核。",
    supportEmailLabel: "客服分流邮箱",
    saveSystemBtn: "保存系统配置",
    themeLabel: "主题偏好",
    langLabel: "系统语言",
    themeLight: "浅色模式",
    themeDark: "深色模式",
    successSave: "系统设置更新成功！",
    errorSave: "更新个人资料失败。",
    loading: "正在保存...",
  }
};

const SettingsPage = () => {
  const { language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    nameuser: currentUser?.nameuser || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
    password: "",
  });

  // Mock System Settings state (persisted in localStorage)
  const [systemData, setSystemData] = useState(() => {
    const saved = localStorage.getItem("cheang_admin_settings");
    return saved ? JSON.parse(saved) : {
      maintenanceMode: false,
      autoApprove: false,
      supportEmail: "support@cheang.com",
    };
  });

  const [toastMsg, setToastMsg] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const getTranslation = (key) => {
    return translationDictionary[language]?.[key] || translationDictionary["en"][key];
  };

  // Sync profile values if currentUser updates
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        nameuser: currentUser.nameuser || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || "",
        password: "",
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemData({
      ...systemData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit profile edits to the backend User Router
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const body = { ...profileData };
      if (!body.password) {
        delete body.password; // Do not send empty password field
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        showToast(getTranslation("errorSave"), "error");
      } else {
        dispatch(updateUserSuccess(data));
        showToast(getTranslation("successSave"), "success");
      }
    } catch (err) {
      dispatch(updateUserFailure(err.message));
      showToast(getTranslation("errorSave"), "error");
    }
  };

  // Save system toggles to localStorage
  const handleSystemSubmit = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setTimeout(() => {
      localStorage.setItem("cheang_admin_settings", JSON.stringify(systemData));
      setSaveLoading(false);
      showToast(getTranslation("successSave"), "success");
    }, 800);
  };

  const showToast = (msg, type = "success") => {
    setToastMsg({ text: msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <AdminAppLayout>
      <div className="settings-page-contain">
        <Label label={getTranslation("title")} />

        {toastMsg && (
          <div className={`toast-notification ${toastMsg.type}`}>
            {toastMsg.type === "success" ? <FaCheckCircle className="icon" /> : <FaTimes className="icon" />}
            <span>{toastMsg.text}</span>
          </div>
        )}

        <div className="settings-grid">
          {/* Left Column: Admin Profile Card */}
          <div className="settings-card profile-card">
            <h3 className="card-title">
              <FaUser /> {getTranslation("profileTitle")}
            </h3>
            <form onSubmit={handleProfileSubmit} className="settings-form">
              <div className="profile-preview">
                <img src={profileData.avatar || currentUser?.avatar} alt="Admin Avatar" className="preview-avatar" />
              </div>

              <div className="form-group">
                <label htmlFor="nameuser">{getTranslation("nameLabel")}</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="nameuser"
                    name="nameuser"
                    value={profileData.nameuser}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">{getTranslation("emailLabel")}</label>
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">{getTranslation("passwordLabel")}</label>
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={profileData.password}
                    onChange={handleProfileChange}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="avatar">{getTranslation("avatarLabel")}</label>
                <div className="input-wrapper">
                  <FaImage className="input-icon" />
                  <input
                    type="text"
                    id="avatar"
                    name="avatar"
                    value={profileData.avatar}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <button type="submit" className="submit-settings-btn" disabled={loading}>
                {loading ? <FaSpinner className="spinner" /> : <FaCheck />}
                <span>{getTranslation("saveProfileBtn")}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Platform Configuration & Preferences */}
          <div className="settings-right-col">
            {/* System config */}
            <div className="settings-card">
              <h3 className="card-title">
                <FaCog /> {getTranslation("systemTitle")}
              </h3>
              <form onSubmit={handleSystemSubmit} className="settings-form">
                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">{getTranslation("maintenanceLabel")}</span>
                    <span className="toggle-desc">{getTranslation("maintenanceDesc")}</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={systemData.maintenanceMode}
                      onChange={handleSystemChange}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">{getTranslation("autoVerifyLabel")}</span>
                    <span className="toggle-desc">{getTranslation("autoVerifyDesc")}</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="autoApprove"
                      checked={systemData.autoApprove}
                      onChange={handleSystemChange}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="supportEmail">{getTranslation("supportEmailLabel")}</label>
                  <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      id="supportEmail"
                      name="supportEmail"
                      value={systemData.supportEmail}
                      onChange={handleSystemChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="submit-settings-btn" disabled={saveLoading}>
                  {saveLoading ? <FaSpinner className="spinner" /> : <FaCheck />}
                  <span>{getTranslation("saveSystemBtn")}</span>
                </button>
              </form>
            </div>

            {/* Display preferences */}
            <div className="settings-card preference-card">
              <h3 className="card-title">
                <FaGlobe /> {getTranslation("preferenceTitle")}
              </h3>
              <div className="preference-section">
                {/* Language Switch */}
                <div className="pref-row">
                  <span className="pref-label">{getTranslation("langLabel")}</span>
                  <div className="language-options">
                    <button
                      className={language === "en" ? "lang-btn active" : "lang-btn"}
                      onClick={() => changeLanguage("en")}
                    >
                      English
                    </button>
                    <button
                      className={language === "kh" ? "lang-btn active" : "lang-btn"}
                      onClick={() => changeLanguage("kh")}
                    >
                      ភាសាខ្មែរ
                    </button>
                    <button
                      className={language === "zh" ? "lang-btn active" : "lang-btn"}
                      onClick={() => changeLanguage("zh")}
                    >
                      中文
                    </button>
                  </div>
                </div>

                {/* Theme Switch */}
                <div className="pref-row">
                  <span className="pref-label">{getTranslation("themeLabel")}</span>
                  <div className="theme-toggle-wrapper">
                    <button
                      className={theme === "light" ? "theme-btn active" : "theme-btn"}
                      onClick={() => { if (theme !== "light") toggleTheme(); }}
                    >
                      {getTranslation("themeLight")}
                    </button>
                    <button
                      className={theme === "dark" ? "theme-btn active" : "theme-btn"}
                      onClick={() => { if (theme !== "dark") toggleTheme(); }}
                    >
                      {getTranslation("themeDark")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
};

export default SettingsPage;
