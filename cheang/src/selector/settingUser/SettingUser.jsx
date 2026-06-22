import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";
import Label from "../../components/label/Label";
import {
  FaSave,
  FaSignOutAlt,
  FaTrash,
  FaBriefcase,
  FaTools,
  FaMapMarkerAlt,
  FaCity,
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaCamera,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaUserCog,
  FaShieldAlt,
} from "react-icons/fa";
import Profile from "../../components/profile/Profile";
import "./SettingUser.scss";
import { getProvincesAndCities } from "../../data/Location";
import { getServicesAndSubServices } from "../../data/Service";
import { useLanguage } from "../../context/LanguageContext";
import CustomSelect from "../../components/customSelect/CustomSelect";
import {
  getCity,
  getMainService,
  getProvince,
  getSelect,
  getSubService,
} from "../../data/wordsLanguage";
import { app } from "../../firebase";

const SettingUser = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { showToast } = useToast();

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Custom interactive states
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Location mapping
  const locationLanguage = getProvincesAndCities(language);
  const locationEnglsih = getProvincesAndCities("en");

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
    const index = locationLanguage.Provinces.indexOf(event.target.value);
    setSelectedCity("");
    setFormData({
      ...formData,
      province: locationEnglsih.Provinces[index],
      city: "",
    });
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    const index = locationLanguage.Provinces.indexOf(selectedProvince);
    const subCityArray = locationLanguage.Cities[selectedProvince];
    const indexCity = subCityArray.indexOf(event.target.value);
    const value = locationEnglsih.Cities[locationEnglsih.Provinces[index]][indexCity];
    setFormData({
      ...formData,
      city: value,
    });
  };

  // Service mapping
  const servicesLanguage = getServicesAndSubServices(language);
  const servicesEnglsih = getServicesAndSubServices("en");

  const [selectedMainService, setSelectedMainService] = useState("");
  const [selectedSubService, setSelectedSubService] = useState("");

  const handleMainServiceChange = (event) => {
    setSelectedMainService(event.target.value);
    const index = servicesLanguage.MainService.indexOf(event.target.value);
    setSelectedSubService("");
    setFormData({
      ...formData,
      mainService: servicesEnglsih.MainService[index],
      subService: "",
    });
  };

  const handleSubServiceChange = (event) => {
    setSelectedSubService(event.target.value);
    const index = servicesLanguage.MainService.indexOf(selectedMainService);
    const subServiceArray = servicesLanguage.SubService[selectedMainService];
    const indexSub = subServiceArray.indexOf(event.target.value);
    const value = servicesEnglsih.SubService[servicesEnglsih.MainService[index]][indexSub];
    setFormData({
      ...formData,
      subService: value,
    });
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Prepopulate selections
  useEffect(() => {
    if (currentUser) {
      if (currentUser.province) {
        const index = locationEnglsih.Provinces.indexOf(currentUser.province);
        if (index !== -1) {
          const provLang = locationLanguage.Provinces[index];
          setSelectedProvince(provLang);
          if (currentUser.city) {
            const citiesEng = locationEnglsih.Cities[currentUser.province] || [];
            const cityIndex = citiesEng.indexOf(currentUser.city);
            if (cityIndex !== -1) {
              const citiesLang = locationLanguage.Cities[provLang] || [];
              setSelectedCity(citiesLang[cityIndex] || "");
            }
          }
        }
      }
      if (currentUser.mainService) {
        const index = servicesEnglsih.MainService.indexOf(currentUser.mainService);
        if (index !== -1) {
          const mainLang = servicesLanguage.MainService[index];
          setSelectedMainService(mainLang);
          if (currentUser.subService) {
            const subsEng = servicesEnglsih.SubService[currentUser.mainService] || [];
            const subIndex = subsEng.indexOf(currentUser.subService);
            if (subIndex !== -1) {
              const subsLang = servicesLanguage.SubService[mainLang] || [];
              setSelectedSubService(subsLang[subIndex] || "");
            }
          }
        }
      }
    }
  }, [currentUser, language]);

  const handleFileUpload = (file) => {
    setFileUploadError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prev) => ({ ...prev, avatar: downloadURL }))
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        showToast(data.message, "error");
        return;
      }
      dispatch(updateUserSuccess(data.data || data));
      showToast(getLabel("updateSuccessText"), "success");
      setUpdateSuccess(true);
      // If password was updated, clear it from formData
      if (formData.password) {
        setFormData((prev) => {
          const updated = { ...prev };
          delete updated.password;
          return updated;
        });
      }
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
      showToast(err.message, "error");
      setUpdateSuccess(false);
    }
  };

  const handleDeleteUser = async () => {
    if (
      deleteConfirmationInput.trim() !== "DELETE" &&
      deleteConfirmationInput.trim() !== currentUser.nameuser.trim()
    ) {
      return;
    }
    handleCloseDeleteModal();
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleShowDeleteModal = () => {
    setDeleteConfirmationInput("");
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      localStorage.removeItem("authToken");
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  // Translations
  const t = {
    title: { en: "Account Settings", kh: "ការកំណត់គណនី", zh: "账户设置" },
    subtitle: { 
      en: "Update your profile details, change security credentials, or manage your account status.", 
      kh: "ធ្វើបច្ចុប្បន្នភាពព័ត៌មានប្រវត្តិរូប ប្តូរលេខសម្ងាត់ ឬគ្រប់គ្រងគណនីរបស់អ្នក។", 
      zh: "更新您的个人资料详细信息、更改安全凭证或管理您的账户状态。" 
    },
    profileSection: { en: "Profile Details", kh: "ប្រវត្តិរូបអាជីវកម្ម", zh: "个人资料设置" },
    credentialsSection: { en: "Security Credentials", kh: "គណនីសុវត្ថិភាព", zh: "安全凭证设置" },
    dangerSection: { en: "Danger Zone", kh: "តំបន់គ្រោះថ្នាក់", zh: "危险区域" },
    emailLabel: { en: "Email Address", kh: "អាសយដ្ឋានអ៊ីមែល", zh: "电子邮箱" },
    passwordLabel: { en: "New Password (Optional)", kh: "លេខសម្ងាត់ថ្មី (ជម្រើស)", zh: "新密码（可选）" },
    nameLabel: { en: "Full Name", kh: "ឈ្មោះពេញ", zh: "姓名" },
    brandLabel: { en: "Brand / Business Name", kh: "ឈ្មោះអាជីវកម្ម", zh: "品牌 / 业务名称" },
    phoneLabel: { en: "Phone Number", kh: "លេខទូរស័ព្ទ", zh: "电话号码" },
    saveBtn: { en: "Save Settings", kh: "រក្សាទុកការផ្លាស់ប្តូរ", zh: "保存修改" },
    savingBtn: { en: "Saving...", kh: "កំពុងរក្សាទុក...", zh: "保存中..." },
    signOutBtn: { en: "Sign Out", kh: "ចាកចេញ", zh: "退出登录" },
    deleteBtn: { en: "Delete Account", kh: "លុបគណនី", zh: "删除账户" },
    confirmDeleteTitle: { en: "Delete Account Permanently?", kh: "តើអ្នកចង់លុបគណនីជារៀងរហូតមែនទេ?", zh: "永久删除账户？" },
    confirmDeleteText: {
      en: "Are you sure you want to delete your account? This action is permanent and cannot be undone.",
      kh: "តើអ្នកប្រាកដជាចង់លុបគណនីរបស់អ្នកមែនទេ? សកម្មភាពនេះនឹងលុបជារៀងរហូត ហើយមិនអាចត្រឡប់ក្រោយបានឡើយ។",
      zh: "您确定要删除您的账户吗？此操作永久生效且无法撤销。",
    },
    cancel: { en: "Cancel", kh: "បោះបង់", zh: "取消" },
    delete: { en: "Delete Account", kh: "លុបគណនី", zh: "删除账户" },
    uploading: { en: "Uploading image...", kh: "កំពុងបញ្ចូលរូបភាព...", zh: "正在上传..." },
    uploadSuccess: { en: "Avatar updated!", kh: "រូបភាពគណនីបានផ្លាស់ប្តូរ!", zh: "头像更新成功！" },
    uploadError: { en: "Upload failed (Max 2MB)", kh: "ការបញ្ចូលរូបភាពបរាជ័យ (ទំហំធំបំផុត 2MB)", zh: "上传失败（最大 2MB）" },
    updateSuccessText: { en: "Settings updated successfully!", kh: "ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ!", zh: "设置更新成功！" },
    
    // Tab Translations
    tabProfile: { en: "Edit Profile", kh: "កែសម្រួលប្រវត្តិរូប", zh: "编辑资料" },
    tabSecurity: { en: "Login & Security", kh: "សុវត្ថិភាពគណនី", zh: "登录与安全" },
    tabDanger: { en: "Danger Zone", kh: "តំបន់គ្រោះថ្នាក់", zh: "危险区域" },
    
    // Verification Translations
    deleteVerificationInstruction: {
      en: "Please type your name or DELETE to confirm:",
      kh: "សូមវាយឈ្មោះរបស់អ្នក ឬពាក្យ DELETE ដើម្បីបញ្ជាក់៖",
      zh: "请输入您的姓名或 DELETE 以确认："
    },
    confirmDeletePlaceholder: { 
      en: "Type verification name...", 
      kh: "វាយបញ្ចូលឈ្មោះបញ្ជាក់...", 
      zh: "输入确认字符..." 
    },
    avatarUploadInstructions: {
      en: "Click avatar to upload new image. JPG or PNG under 2MB.",
      kh: "ចុចលើរូបភាពដើម្បីបញ្ចូលរូបភាពថ្មី។ JPG ឬ PNG ក្រោម 2MB។",
      zh: "点击头像以更改图片。限 JPG 或 PNG 格式且小于 2MB。"
    }
  };

  const getLabel = (key) => t[key]?.[language] || t[key]?.["en"];

  if (!currentUser) return null;

  // Check if delete input is verified
  const isDeleteVerified =
    deleteConfirmationInput.trim() === "DELETE" ||
    deleteConfirmationInput.trim() === currentUser.nameuser.trim();

  return (
    <div className={`settings-page-container ${theme}`}>
      {/* Header */}
      <header className="settings-page-header">
        <div className="header-title-row">
          <FaUserCog className="settings-header-icon" />
          <h1 className="header-title">{getLabel("title")}</h1>
        </div>
        <p className="header-subtitle">{getLabel("subtitle")}</p>
      </header>

      {/* Main Settings Panel */}
      <div className="settings-content-layout">
        
        {/* Left Sub-navigation Sidebar */}
        <aside className="settings-sidebar-tabs">
          <button 
            type="button"
            className={`settings-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser className="tab-icon" />
            <span>{getLabel("tabProfile")}</span>
          </button>
          
          <button 
            type="button"
            className={`settings-tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <FaShieldAlt className="tab-icon" />
            <span>{getLabel("tabSecurity")}</span>
          </button>
          
          <button 
            type="button"
            className={`settings-tab-btn danger-tab-btn ${activeTab === "danger" ? "active" : ""}`}
            onClick={() => setActiveTab("danger")}
          >
            <FaExclamationTriangle className="tab-icon" />
            <span>{getLabel("tabDanger")}</span>
          </button>
        </aside>

        {/* Right Settings Workspace */}
        <main className="settings-workspace">
          
          {/* PROFILE SETTINGS CARD */}
          {activeTab === "profile" && (
            <section className="settings-section-card fade-in">
              <div className="section-header">
                <Label label={getLabel("profileSection")} />
              </div>
              
              <form className="settings-form" onSubmit={handleSubmit}>
                {/* Avatar Row */}
                <div className="avatar-settings-row">
                  <div className="avatar-preview-box" onClick={() => fileRef.current.click()}>
                    <Profile src={formData?.avatar || currentUser.avatar} />
                    <div className="avatar-camera-overlay">
                      <FaCamera />
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      ref={fileRef}
                      hidden
                      accept="image/*"
                    />
                  </div>
                  
                  <div className="avatar-status-info">
                    <p className="avatar-help-text">{getLabel("avatarUploadInstructions")}</p>
                    <div className="avatar-progress-container">
                      {filePerc > 0 && filePerc < 100 && (
                        <div className="upload-progress-wrapper">
                          <div className="progress-bar-outer">
                            <div className="progress-bar-inner" style={{ width: `${filePerc}%` }}></div>
                          </div>
                          <span className="upload-status info">{getLabel("uploading")} {filePerc}%</span>
                        </div>
                      )}
                      {filePerc === 100 && !fileUploadError && (
                        <span className="upload-status success">{getLabel("uploadSuccess")}</span>
                      )}
                      {fileUploadError && (
                        <span className="upload-status error">{getLabel("uploadError")}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inputs Grid */}
                <div className="settings-inputs-grid">
                  <div className="input-group">
                    <span className="input-icon"><FaUser /></span>
                    <input
                      type="text"
                      name="nameuser"
                      value={formData.nameuser !== undefined ? formData.nameuser : currentUser.nameuser}
                      onChange={handleChange}
                      placeholder={getLabel("nameLabel")}
                      required
                    />
                  </div>

                  {currentUser.userPro && (
                    <div className="input-group">
                      <span className="input-icon"><FaBriefcase /></span>
                      <input
                        type="text"
                        name="brandName"
                        value={formData.brandName !== undefined ? formData.brandName : currentUser.brandName || ""}
                        onChange={handleChange}
                        placeholder={getLabel("brandLabel")}
                      />
                    </div>
                  )}

                  {currentUser.userPro && (
                    <div className="select-row-group">
                      <div className="custom-select-wrapper">
                        <CustomSelect
                          value={selectedMainService}
                          onChange={handleMainServiceChange}
                          options={servicesLanguage.MainService}
                          placeholder={getSelect(language) + " " + getMainService(language)}
                          icon={<FaBriefcase />}
                        />
                      </div>

                      <div className="custom-select-wrapper">
                        <CustomSelect
                          value={selectedSubService}
                          onChange={handleSubServiceChange}
                          options={servicesLanguage.SubService[selectedMainService] || []}
                          placeholder={getSelect(language) + " " + getSubService(language)}
                          icon={<FaTools />}
                          disabled={!selectedMainService}
                        />
                      </div>
                    </div>
                  )}

                  <div className="select-row-group">
                    <div className="custom-select-wrapper">
                      <CustomSelect
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        options={locationLanguage.Provinces}
                        placeholder={getSelect(language) + " " + getProvince(language)}
                        icon={<FaMapMarkerAlt />}
                      />
                    </div>

                    <div className="custom-select-wrapper">
                      <CustomSelect
                        value={selectedCity}
                        onChange={handleCityChange}
                        options={locationLanguage.Cities[selectedProvince] || []}
                        placeholder={getSelect(language) + " " + getCity(language)}
                        icon={<FaCity />}
                        disabled={!selectedProvince}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <span className="input-icon"><FaPhone /></span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone !== undefined ? formData.phone : currentUser.phone || ""}
                      onChange={handleChange}
                      placeholder={getLabel("phoneLabel")}
                    />
                  </div>
                </div>

                {error && <div className="error-message-box">{error}</div>}
                {updateSuccess && <div className="success-message-box">{getLabel("updateSuccessText")}</div>}

                <div className="form-submit-row">
                  <button type="submit" className="save-settings-btn" disabled={loading}>
                    {loading ? <FaSpinner className="spin" /> : <FaSave />}
                    <span>{loading ? getLabel("savingBtn") : getLabel("saveBtn")}</span>
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* SECURITY CREDENTIALS CARD */}
          {activeTab === "security" && (
            <section className="settings-section-card fade-in">
              <div className="section-header">
                <Label label={getLabel("credentialsSection")} />
              </div>

              <form className="settings-form" onSubmit={handleSubmit}>
                <div className="settings-inputs-grid">
                  <div className="input-group">
                    <span className="input-icon"><FaEnvelope /></span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email !== undefined ? formData.email : currentUser.email}
                      onChange={handleChange}
                      placeholder={getLabel("emailLabel")}
                      required
                    />
                  </div>

                  <div className="input-group password-group">
                    <span className="input-icon"><FaLock /></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password || ""}
                      onChange={handleChange}
                      placeholder={getLabel("passwordLabel")}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {error && <div className="error-message-box">{error}</div>}
                {updateSuccess && <div className="success-message-box">{getLabel("updateSuccessText")}</div>}

                <div className="form-submit-row">
                  <button type="submit" className="save-settings-btn" disabled={loading}>
                    {loading ? <FaSpinner className="spin" /> : <FaSave />}
                    <span>{loading ? getLabel("savingBtn") : getLabel("saveBtn")}</span>
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* DANGER ZONE CARD */}
          {activeTab === "danger" && (
            <section className="settings-section-card danger-zone-card fade-in">
              <div className="section-header">
                <Label label={getLabel("dangerSection")} />
              </div>
              
              <div className="danger-zone-details">
                <div className="danger-alert-box">
                  <FaExclamationTriangle className="alert-icon" />
                  <p>{getLabel("confirmDeleteText")}</p>
                </div>
                
                <div className="danger-buttons-row">
                  <button type="button" className="btn-signout" onClick={handleSignOut}>
                    <FaSignOutAlt />
                    <span>{getLabel("signOutBtn")}</span>
                  </button>
                  <button type="button" className="btn-delete-account" onClick={handleShowDeleteModal}>
                    <FaTrash />
                    <span>{getLabel("deleteBtn")}</span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="pro-modal-overlay">
          <div className="pro-modal-wrapper confirmation-modal fade-in">
            <div className="modal-icon warning">
              <FaExclamationTriangle />
            </div>
            <h3>{getLabel("confirmDeleteTitle")}</h3>
            <p>{getLabel("confirmDeleteText")}</p>
            
            {/* Verification confirmation input */}
            <div className="modal-verification-box">
              <label htmlFor="delete-verification-input" className="verification-label">
                {getLabel("deleteVerificationInstruction")}
              </label>
              <div className="verification-reference-name">
                {currentUser.nameuser}
              </div>
              <input
                id="delete-verification-input"
                type="text"
                className="verification-input"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                placeholder={getLabel("confirmDeletePlaceholder")}
                autoFocus
              />
            </div>

            <div className="modal-buttons">
              <button type="button" className="btn-modal-cancel" onClick={handleCloseDeleteModal}>
                {getLabel("cancel")}
              </button>
              <button 
                type="button" 
                className="btn-modal-delete" 
                onClick={handleDeleteUser}
                disabled={!isDeleteVerified}
              >
                <FaTrash style={{ marginRight: "6px" }} />
                {getLabel("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingUser;
