import { useState } from "react";
import { 
  FaUserPlus, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCheckCircle, 
  FaTools, 
  FaBriefcase, 
  FaSpinner,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import OAuth from "../../components/oAuth/OAuth";
import "./SignUpNew.scss";

const getMarketingText = (key, lang) => {
  const texts = {
    title: {
      en: "Join Cheang Today",
      kh: "ចូលរួមជាមួយ Cheang ថ្ងៃនេះ",
      zh: "今天加入 Cheang",
    },
    desc: {
      en: "Create an account to browse professional handymen, check reviews, and get your home tasks done efficiently.",
      kh: "បង្កើតគណនីដើម្បីស្វែងរកជាងជំនាញ មើលការវាយតម្លៃ និងសម្រេចការងារគេហដ្ឋានរបស់អ្នកប្រកបដោយប្រសិទ្ធភាព។",
      zh: "创建账户以浏览专业的勤杂工，查看评价并高效完成您的家庭任务。",
    },
    f1_title: { en: "Verified Professionals", kh: "អ្នកជំនាញដែលបានផ្ទៀងផ្ទាត់", zh: "经过验证的专业人士" },
    f1_desc: { en: "Browse rated and reviewed experts for any home repair or service.", kh: "ស្វែងរកអ្នកជំនាញដែលបានត្រួតពិនិត្យប្រវត្តិ និងវាយតម្លៃសម្រាប់សេវាកម្មគេហដ្ឋានណាមួយ។", zh: "浏览经过背景调查和评级的任何家庭服务专家。" },
    f2_title: { en: "Secure Booking", kh: "ការកក់ទុកប្រកបដោយសុវត្ថិភាព", zh: "安全预订" },
    f2_desc: { en: "Connect directly with local handymen and track request status.", kh: "ភ្ជាប់ទំនាក់ទំនងដោយផ្ទាល់ជាមួយជាងក្នុងតំបន់ និងតាមដានស្ថានភាពសំណើ។", zh: "直接与当地勤杂工联系并跟踪请求状态。" },
    f3_title: { en: "Completely Free", kh: "ឥតគិតថ្លៃទាំងស្រុង", zh: "完全免费" },
    f3_desc: { en: "Register your client account for free. Pay only for the actual service.", kh: "ចុះឈ្មោះគណនីរបស់អ្នកដោយឥតគិតថ្លៃ។ ទូទាត់តែថ្លៃការងារជាក់ស្តែងប៉ុណ្ណោះ។", zh: "免费注册您的客户账户。仅为实际服务付费。" },
    createAccount: { en: "Create Account", kh: "បង្កើតគណនី", zh: "创建账户" },
    alreadyHaveAccount: { en: "Already have an account?", kh: "មានគណនីរួចហើយមែនទេ?", zh: "已经有账户了？" },
    signInLink: { en: "Sign In", kh: "ចូលគណនី", zh: "登录" },
    orSignUpWith: { en: "Or sign up with", kh: "ឬបង្កើតគណនីជាមួយ", zh: "或使用以下方式注册" }
  };
  return texts[key]?.[lang] || texts[key]?.[lang === "kh" ? "kh" : "en"] || texts[key]?.["en"] || "";
};

const SignUp = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/signin");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className={`signup-page-wrapper ${theme} ${language}`}>
      <div className="signup-card-container">
        {/* Left Side: Marketing Info */}
        <div className="signup-marketing-panel">
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

        {/* Right Side: Form */}
        <div className="signup-form-panel">
          <h2 className="signup-title">{getMarketingText("createAccount", language)}</h2>
          <p className="signup-subtitle">
            {language === "kh" 
              ? "បំពេញព័ត៌មានខាងក្រោមដើម្បីចាប់ផ្តើមប្រើប្រាស់ Cheang។" 
              : "Fill out the information below to get started on Cheang."}
          </p>

          <form className="signup-form" onSubmit={handleSubmit}>
            {/* User Name field */}
            <div className="input-field-group">
              <input
                type="text"
                name="nameuser"
                id="nameuser"
                value={formData.nameuser || ""}
                onChange={handleChange}
                placeholder={language === "kh" ? "ឈ្មោះអ្នកប្រើប្រាស់" : "User Name"}
                required
              />
              <FaUser className="input-field-icon" />
            </div>

            {/* Email field */}
            <div className="input-field-group">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Email"
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
                <FaUserPlus />
              )}
              <span>{getMarketingText("createAccount", language)}</span>
            </button>

            {error && <div className="signup-error">{error}</div>}
          </form>

          {/* Social Sign Up Divider */}
          <div className="signup-divider">{getMarketingText("orSignUpWith", language)}</div>

          {/* Google OAuth Component wrapper */}
          <div className="oauth-wrapper">
            <OAuth />
          </div>

          {/* Switch to Sign In */}
          <p className="signin-prompt">
            {getMarketingText("alreadyHaveAccount", language)}
            <Link to="/signin">
              {getMarketingText("signInLink", language)}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
