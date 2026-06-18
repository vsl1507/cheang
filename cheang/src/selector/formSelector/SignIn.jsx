import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { 
  FaUserAlt, 
  FaEnvelope, 
  FaLock, 
  FaCheckCircle, 
  FaTools, 
  FaBriefcase, 
  FaSpinner,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../../redux/user/userSlice";
import OAuth from "../../components/oAuth/OAuth";
import "./SignUpNew.scss";

const getMarketingText = (key, lang) => {
  const texts = {
    title: {
      en: "Welcome Back!",
      kh: "ស្វាគមន៍ការត្រឡប់មកវិញ!",
      zh: "欢迎回来！",
    },
    desc: {
      en: "Sign in to access your dashboard, contact handymen, track your requests, and manage your account details.",
      kh: "ចូលគណនីដើម្បីចូលទៅកាន់ផ្ទាំងគ្រប់គ្រង ទាក់ទងជាងជួសជុល តាមដានសំណើ និងគ្រប់គ្រងព័ត៌មានគណនីរបស់អ្នក។",
      zh: "登录以访问您的仪表板，联系勤杂工，跟踪您的请求，并管理您的账户详细信息。",
    },
    f1_title: { en: "Quick Access", kh: "ការចូលប្រើប្រាស់រហ័ស", zh: "快速访问" },
    f1_desc: { en: "Instantly check quotes, reviews, and status of your active home service tasks.", kh: "ពិនិត្យមើលតម្លៃ ការវាយតម្លៃ និងស្ថានភាពនៃកិច្ចការសេវាកម្មគេហដ្ឋានរបស់អ្នកភ្លាមៗ។", zh: "立即检查您的活跃家庭服务任务的报价、评价和状态。" },
    f2_title: { en: "Secure Contact", kh: "ការទំនាក់ទំនងសុវត្ថិភាព", zh: "安全联系" },
    f2_desc: { en: "Continue conversations securely with your chosen handyman or client.", kh: "បន្តការសន្ទនាដោយសុវត្ថិភាពជាមួយជាងជួសជុល ឬអតិថិជនដែលអ្នកបានជ្រើសរើស។", zh: "与您选择 of 勤杂工或客户安全地继续对话。" },
    f3_title: { en: "Protected Privacy", kh: "ការការពារឯកជនភាព", zh: "隐私保护" },
    f3_desc: { en: "Your personal details and password are kept safe with our secure auth systems.", kh: "ព័ត៌មានលម្អិតផ្ទាល់ខ្លួន និងពាក្យសម្ងាត់របស់អ្នកត្រូវបានរក្សាទុកដោយសុវត្ថិភាព។", zh: "您的个人详细信息和密码将通过我们的安全身份验证系统得到安全保管。" },
    signInBtn: { en: "Sign In", kh: "ចូលគណនី", zh: "登录" },
    dontHaveAccount: { en: "Don't have an account?", kh: "មិនទាន់មានគណនីមែនទេ?", zh: "还没有账户？" },
    signUpLink: { en: "Sign Up", kh: "បង្កើតអាខោន", zh: "注册" },
    forgotPassword: { en: "Forgot password?", kh: "ភ្លេចពាក្យសម្ងាត់?", zh: "忘记密码？" },
    orSignInWith: { en: "Or sign in with", kh: "ឬចូលគណនីជាមួយ", zh: "或使用以下方式登录" }
  };
  return texts[key]?.[lang] || texts[key]?.[lang === "kh" ? "kh" : "en"] || texts[key]?.["en"] || "";
};

const SignIn = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  //handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Sign in
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
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
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
          <h2 className="signup-title">{getMarketingText("signInBtn", language)}</h2>
          <p className="signup-subtitle">
            {language === "kh" 
              ? "សូមបំពេញព័ត៌មានគណនីរបស់អ្នកដើម្បីបន្ត។" 
              : "Please enter your account credentials to continue."}
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
                <FaUserAlt />
              )}
              <span>{getMarketingText("signInBtn", language)}</span>
            </button>

            {error && <div className="signup-error">{error}</div>}
          </form>

          {/* Social Divider */}
          <div className="signup-divider">{getMarketingText("orSignInWith", language)}</div>

          {/* Google OAuth Component */}
          <div className="oauth-wrapper">
            <OAuth />
          </div>

          {/* Redirect prompts */}
          <p className="signin-prompt">
            {getMarketingText("dontHaveAccount", language)}
            <Link to="/signup">
              {getMarketingText("signUpLink", language)}
            </Link>
          </p>

          <p className="signin-prompt" style={{ marginTop: "0.5rem" }}>
            <Link to="/forgetpassword" style={{ color: "#888", fontWeight: "normal", fontSize: "0.85rem" }}>
              {getMarketingText("forgotPassword", language)}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
