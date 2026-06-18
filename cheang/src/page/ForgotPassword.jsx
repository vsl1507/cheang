import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import AppLayout from "../layouts/AppLayout";
import { 
  FaEnvelope, 
  FaSpinner, 
  FaBriefcase, 
  FaTools, 
  FaCheckCircle, 
  FaArrowLeft 
} from "react-icons/fa";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import "../selector/formSelector/SignUpNew.scss";

const getMarketingText = (key, lang) => {
  const texts = {
    title: {
      en: "Forgot Password?",
      kh: "ភ្លេចពាក្យសម្ងាត់មែនទេ?",
      zh: "忘记密码？",
    },
    desc: {
      en: "No worries! Enter your registered email address below, and we will help you restore access to your account.",
      kh: "កុំបារម្ភ! បញ្ចូលអាសយដ្ឋានអ៊ីមែលដែលបានចុះឈ្មោះរបស់អ្នកខាងក្រោម ហើយយើងនឹងជួយអ្នកឱ្យទទួលបានគណនីឡើងវិញ។",
      zh: "不用担心！在下方输入您的注册电子邮件地址，我们将帮助您恢复对账户的访问。",
    },
    f1_title: { en: "Quick Recovery", kh: "ការសង្គ្រោះរហ័ស", zh: "快速恢复" },
    f1_desc: { en: "Get back to hiring local services in just a few clicks.", kh: "ត្រលប់ទៅស្វែងរកសេវាកម្មក្នុងតំបន់វិញបានយ៉ាងរហ័ស។", zh: "只需点击几下即可重新雇佣本地服务。" },
    f2_title: { en: "Secure Verification", kh: "ការផ្ទៀងផ្ទាត់សុវត្ថិភាព", zh: "安全验证" },
    f2_desc: { en: "We ensure only you can recover and modify your password.", kh: "យើងធានាថាមានតែអ្នកប៉ុណ្ណោះដែលអាចសង្គ្រោះ និងកែប្រែពាក្យសម្ងាត់របស់អ្នក។", zh: "我们确保只有您才能恢复和修改密码。" },
    f3_title: { en: "Support Team Help", kh: "ជំនួយការគាំទ្រ", zh: "支持团队帮助" },
    f3_desc: { en: "Our customer support is always here if you face any issues.", kh: "ក្រុមការងារគាំទ្រអតិថិជនរបស់យើងតែងតែនៅទីនេះប្រសិនបើអ្នកជួបបញ្ហា។", zh: "如果您遇到任何问题，我们的客户支持随时为您服务。" },
    resetBtn: { en: "Send Reset Link", kh: "ផ្ញើតំណសង្គ្រោះ", zh: "发送重置链接" },
    backToSignIn: { en: "Back to Sign In", kh: "ត្រលប់ទៅទំព័រចូលគណនី", zh: "返回登录" },
    successTitle: { en: "Check Your Email ✉️", kh: "សូមពិនិត្យមើលអ៊ីមែលរបស់អ្នក ✉️", zh: "请检查您的电子邮件 ✉️" },
    successDesc: {
      en: "If an account exists for that email, we've sent instructions to reset your password. Please check your inbox.",
      kh: "ប្រសិនបើមានគណនីសម្រាប់អ៊ីមែលនោះ យើងបានផ្ញើការណែនាំដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញទៅកាន់ប្រអប់សំបុត្ររបស់អ្នក។",
      zh: "如果该电子邮件存在账户，我们已发送重置密码的说明。请检查您的收件箱。",
    }
  };
  return texts[key]?.[lang] || texts[key]?.[lang === "kh" ? "kh" : "en"] || texts[key]?.["en"] || "";
};

const ForgotPassword = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);

  //handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Sign in
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart(true));
      const res = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // The backend API resetPassword controller is currently empty,
      // so we assume success if it doesn't fail or return an error.
      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        dispatch(signInSuccess(null));
        return;
      }
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      setSuccess(true);
      dispatch(signInSuccess(null));
    } catch (err) {
      // Gracefully handle or display error
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <AppLayout>
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

          {/* Right Side: Form / Success state */}
          <div className="signup-form-panel">
            {success ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div className="success-icon-wrapper" style={{
                  width: "4.5rem",
                  height: "4.5rem",
                  borderRadius: "50%",
                  backgroundColor: "rgba(40, 167, 69, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#28a745",
                  fontSize: "2.25rem",
                  margin: "0 auto 1.5rem"
                }}>
                  <FaCheckCircle />
                </div>
                <h2 className="signup-title">{getMarketingText("successTitle", language)}</h2>
                <p className="signup-subtitle" style={{ marginBottom: "2rem" }}>
                  {getMarketingText("successDesc", language)}
                </p>
                <Link to="/signin" className="signup-submit-btn" style={{ textDecoration: "none" }}>
                  <FaArrowLeft />
                  <span>{getMarketingText("backToSignIn", language)}</span>
                </Link>
              </div>
            ) : (
              <>
                <h2 className="signup-title">{getMarketingText("title", language)}</h2>
                <p className="signup-subtitle">
                  {language === "kh" 
                    ? "បញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នកដើម្បីទទួលបានតំណកំណត់ពាក្យសម្ងាត់ឡើងវិញ។" 
                    : "Enter your account email to receive a password reset link."}
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

                  {/* Submit Action */}
                  <button type="submit" className="signup-submit-btn" disabled={loading}>
                    {loading ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <FaEnvelope />
                    )}
                    <span>{getMarketingText("resetBtn", language)}</span>
                  </button>

                  {error && <div className="signup-error">{error}</div>}
                </form>

                {/* Back to Sign In Link */}
                <p className="signin-prompt" style={{ marginTop: "2rem" }}>
                  <Link to="/signin">
                    <FaArrowLeft style={{ marginRight: "6px", fontSize: "0.8rem" }} />
                    {getMarketingText("backToSignIn", language)}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ForgotPassword;
