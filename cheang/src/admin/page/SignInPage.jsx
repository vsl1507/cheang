import React, { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { 
  FaUserShield, 
  FaEnvelope, 
  FaLock, 
  FaBriefcase, 
  FaTools, 
  FaCheckCircle, 
  FaEye, 
  FaEyeSlash, 
  FaSpinner 
} from "react-icons/fa";
import "../../selector/formSelector/SignUpNew.scss";
import "./SignInPage.scss";

const getMarketingText = (key, lang) => {
  const texts = {
    title: {
      en: "Cheang Admin Portal",
      kh: "ផ្ទាំងគ្រប់គ្រង Cheang",
      zh: "Cheang 管理员门户",
    },
    desc: {
      en: "Manage system configurations, approve services, review platform users, and track system audits securely.",
      kh: "គ្រប់គ្រងការកំណត់ប្រព័ន្ធ អនុម័តសេវាកម្ម ពិនិត្យមើលអ្នកប្រើប្រាស់ និងតាមដានរបាយការណ៍សវនកម្មដោយសុវត្ថិភាព។",
      zh: "管理系统配置，批准服务，审查平台用户，并安全地跟踪系统审核。",
    },
    f1_title: { en: "User Confirmations", kh: "ការអនុម័តអ្នកប្រើប្រាស់", zh: "用户确认" },
    f1_desc: { en: "Review and approve handyman credentials, certifications, and service eligibility.", kh: "ពិនិត្យមើល និងអនុម័តលើអត្តសញ្ញាណប័ណ្ណ វិញ្ញាបនបត្រ និងលក្ខខណ្ឌសេវាកម្មរបស់ជាង។", zh: "审查并批准勤杂工的凭证、认证和业务资格。" },
    f2_title: { en: "Audit Tracking", kh: "ការតាមដានសវនកម្ម", zh: "审计跟踪" },
    f2_desc: { en: "Access granular activity logs and real-time alerts to maintain platform integrity.", kh: "មើលកំណត់ត្រាសកម្មភាពលម្អិត និងការជូនដំណឹងភ្លាមៗដើម្បីរក្សាភាពត្រឹមត្រូវនៃប្រព័ន្ធ។", zh: "访问详细的活动日志和实时警报，以维护平台完整性。" },
    f3_title: { en: "Secure Operations", kh: "ប្រតិបត្តិការមានសុវត្ថិភាព", zh: "安全操作" },
    f3_desc: { en: "Ensure maximum standard controls over permissions, categories, and statistics dashboard.", kh: "ធានាបាននូវការត្រួតពិនិត្យស្តង់ដារអតិបរមាលើសិទ្ធិ ប្រភេទសេវាកម្ម និងផ្ទាំងស្ថិតិ។", zh: "确保对权限、服务类别和统计仪表板实施最高标准的控制。" },
    signInBtn: { en: "Sign In Admin", kh: "ចូលគណនី Admin", zh: "管理员登录" },
  };
  return texts[key]?.[lang] || texts[key]?.[lang === "kh" ? "kh" : "en"] || texts[key]?.["en"] || "";
};

const AdminSignInPage = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart(true));
      const res = await fetch("/api/auth/signin", {
         method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      const user = data.data?.user;
      if (!user || (!user.admin && user.role?.name !== "Admin")) {
        dispatch(signInFailure(language === "kh" ? "ការចូលប្រើត្រូវបានបដិសេធ។ ត្រូវការសិទ្ធិជាអ្នកគ្រប់គ្រង។" : "Access denied. Administrative privileges required."));
        return;
      }
      dispatch(signInSuccess(user));
      navigate("/admin/dashboard");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <AppLayout>
      <div className={`signup-page-wrapper ${theme} ${language}`}>
        <div className="signup-card-container">
          {/* Left Side: Admin Marketing Panel */}
          <div className="signup-marketing-panel admin-theme">
            <h1 className="marketing-title">{getMarketingText("title", language)}</h1>
            <p className="marketing-description">{getMarketingText("desc", language)}</p>

            <div className="features-list">
              <div className="feature-item">
                <FaBriefcase className="feature-icon" />
                <div className="feature-details">
                  <h3>{getMarketingText("f1_title", language)}</h3>
                  <p>{getMarketingText("f1_desc", language)}</p>
                </div>
              </div>

              <div className="feature-item">
                <FaTools className="feature-icon" />
                <div className="feature-details">
                  <h3>{getMarketingText("f2_title", language)}</h3>
                  <p>{getMarketingText("f2_desc", language)}</p>
                </div>
              </div>

              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <div className="feature-details">
                  <h3>{getMarketingText("f3_title", language)}</h3>
                  <p>{getMarketingText("f3_desc", language)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Admin Form Panel */}
          <div className="signup-form-panel">
            <h2 className="signup-title">{getMarketingText("signInBtn", language)}</h2>
            <p className="signup-subtitle">
              {language === "kh" 
                ? "សូមបំពេញព័ត៌មានអត្តសញ្ញាណប័ណ្ណដើម្បីចូលផ្ទាំងគ្រប់គ្រង។" 
                : "Please enter your administrative credentials to continue."}
            </p>

            <form className="signup-form" onSubmit={handleSubmit}>
              {/* Email field */}
              <div className="input-field-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="Admin Email"
                  required
                />
                <FaEnvelope className="input-field-icon" />
              </div>

              {/* Password field */}
              <div className="input-field-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  placeholder={language === "kh" ? "ពាក្យសម្ងាត់" : "Password"}
                  required
                  style={{ paddingRight: "3rem" }}
                />
                <FaLock className="input-field-icon" />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "1.1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "#888",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>

              {/* Submit Action */}
              <button type="submit" className="signup-submit-btn" disabled={loading}>
                {loading ? (
                  <FaSpinner className="spinner" />
                ) : (
                  <FaUserShield />
                )}
                <span>{getMarketingText("signInBtn", language)}</span>
              </button>

              {error && <div className="signup-error">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminSignInPage;
