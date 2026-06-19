import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import {
  FaUser,
  FaEnvelope,
  FaTag,
  FaComment,
  FaPaperPlane,
  FaSpinner,
  FaPhoneAlt,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";
import CustomSelect from "../components/customSelect/CustomSelect";
import "./ContactPage.scss";

// Localized translations for the Contact Us Page
const contactTranslations = {
  heroTitle: {
    en: "Get in Touch",
    kh: "ទាក់ទងមកយើង"
  },
  heroSubtitle: {
    en: "Have questions, feedback, or need support? Send us a message and we'll reply shortly.",
    kh: "មានសំណួរ មតិយោបល់ ឬត្រូវការជំនួយមែនទេ? ផ្ញើសារមកកាន់យើង ហើយយើងនឹងឆ្លើយតបទៅវិញឆាប់ៗ។"
  },
  formTitle: {
    en: "Send us a Message",
    kh: "ផ្ញើសារមកកាន់យើង"
  },
  formSubtitle: {
    en: "Have a specific problem or inquiry? Contact support directly.",
    kh: "មានបញ្ហា ឬសំណួរជាក់លាក់មែនទេ? ទាក់ទងផ្នែកគាំទ្រដោយផ្ទាល់។"
  },
  fieldName: {
    en: "Full Name",
    kh: "ឈ្មោះពេញ"
  },
  fieldEmail: {
    en: "Email Address",
    kh: "អាសយដ្ឋានអ៊ីមែល"
  },
  fieldTopic: {
    en: "Select Topic",
    kh: "ជ្រើសរើសប្រធានបទ"
  },
  fieldMessage: {
    en: "Your Message",
    kh: "សាររបស់អ្នក"
  },
  placeholderName: {
    en: "Enter your full name",
    kh: "បញ្ចូលឈ្មោះពេញរបស់អ្នក"
  },
  placeholderEmail: {
    en: "Enter your email address",
    kh: "បញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក"
  },
  placeholderMessage: {
    en: "Describe your issue or question in detail...",
    kh: "រៀបរាប់ពីបញ្ហា ឬសំណួររបស់អ្នកឱ្យបានលម្អិត..."
  },
  btnSubmit: {
    en: "Send Message",
    kh: "ផ្ញើសារ"
  },
  btnSending: {
    en: "Sending...",
    kh: "កំពុងផ្ញើ..."
  },
  successTitle: {
    en: "Message Sent Successfully!",
    kh: "សារត្រូវបានផ្ញើដោយជោគជ័យ!"
  },
  successDesc: {
    en: "Thank you for contacting us. Our support team will review your message and reply back within 24 hours.",
    kh: "សូមអរគុណសម្រាប់ការទាក់ទងមកយើងខ្ញុំ។ ក្រុមការងារគាំទ្ររបស់យើងនឹងពិនិត្យមើលសាររបស់អ្នក និងឆ្លើយតបមកវិញក្នុងរយៈពេល ២៤ ម៉ោង។"
  },
  topicPlaceholder: {
    en: "Choose a topic...",
    kh: "ជ្រើសរើសប្រធានបទ..."
  },
  topicGeneral: {
    en: "General Inquiry",
    kh: "ការសាកសួរទូទៅ"
  },
  topicAccount: {
    en: "Account & Login Issues",
    kh: "បញ្ហាគណនី និងការចូលប្រើប្រាស់"
  },
  topicPayment: {
    en: "Payments & Invoicing",
    kh: "ការទូទាត់ និងវិក្កយបត្រ"
  },
  topicProvider: {
    en: "Service Provider Support",
    kh: "ការគាំទ្រសម្រាប់អ្នកផ្តល់សេវាកម្ម"
  },
  topicBug: {
    en: "Report Technical Bug",
    kh: "រាយការណ៍អំពីកំហុសបច្ចេកទេស"
  },
  infoTitle: {
    en: "Support Information",
    kh: "ព័ត៌មានជំនួយ"
  },
  infoHoursTitle: {
    en: "Working Hours",
    kh: "ម៉ោងធ្វើការ"
  },
  infoHoursDesc: {
    en: "Monday - Sunday: 8:00 AM - 8:00 PM (ICT)",
    kh: "ច័ន្ទ - អាទិត្យ: ៨:០០ ព្រឹក - ៨:០០ យប់ (ម៉ោងនៅកម្ពុជា)"
  },
  infoPhoneTitle: {
    en: "Hotline Support",
    kh: "ខ្សែទូរស័ព្ទគាំទ្របន្ទាន់"
  },
  infoPhoneDesc: {
    en: "+855 12 345 678\n+855 98 765 432",
    kh: "+855 ១២ ៣៤៥ ៦៧៨\n+855 ៩៨ ៧៦៥ ៤៣២"
  },
  infoEmailTitle: {
    en: "Email Support",
    kh: "គាំទ្រតាមអ៊ីមែល"
  },
  infoEmailDesc: {
    en: "support@cheang.com\ninfo@cheang.com",
    kh: "support@cheang.com\ninfo@cheang.com"
  },
  errorName: {
    en: "Name is required",
    kh: "សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក"
  },
  errorEmail: {
    en: "Valid email is required",
    kh: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលឱ្យបានត្រឹមត្រូវ"
  },
  errorTopic: {
    en: "Please select a topic",
    kh: "សូមជ្រើសរើសប្រធានបទមួយ"
  },
  errorMessage: {
    en: "Message must be at least 10 characters",
    kh: "សារត្រូវមានយ៉ាងហោចណាស់ ១០ តួអក្សរ"
  }
};

const ContactPage = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const topicOptions = [
    { value: "general", label: contactTranslations.topicGeneral[language] || contactTranslations.topicGeneral.en },
    { value: "account", label: contactTranslations.topicAccount[language] || contactTranslations.topicAccount.en },
    { value: "payment", label: contactTranslations.topicPayment[language] || contactTranslations.topicPayment.en },
    { value: "provider", label: contactTranslations.topicProvider[language] || contactTranslations.topicProvider.en },
    { value: "bug", label: contactTranslations.topicBug[language] || contactTranslations.topicBug.en }
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const getTranslation = (key) => {
    return contactTranslations[key]?.[language] || contactTranslations[key]?.en || "";
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = getTranslation("errorName");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = getTranslation("errorEmail");
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = getTranslation("errorEmail");
    }

    if (!formData.topic) {
      tempErrors.topic = getTranslation("errorTopic");
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      tempErrors.message = getTranslation("errorMessage");
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError("");
    try {
      const topicLabels = {
        general: "General Inquiry",
        account: "Account & Login Issues",
        payment: "Payments & Invoicing",
        provider: "Service Provider Support",
        bug: "Report Technical Bug"
      };
      const topicToSend = topicLabels[formData.topic] || formData.topic;

      const response = await fetch("/api/user/support-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          topic: topicToSend,
          message: formData.message
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit message.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        topic: "",
        message: ""
      });
    } catch (err) {
      console.error("Support submission error:", err);
      setApiError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout page="contact">
      <div className={`contact-page-container ${theme} ${language}`}>
        {/* Hero Banner Section */}
        <section className="contact-hero">
          <div className="hero-content">
            <h1>
              <span>{getTranslation("heroTitle")}</span>
            </h1>
            <p>{getTranslation("heroSubtitle")}</p>
          </div>
        </section>

        {/* Content Wrapper */}
        <div className="contact-content-wrapper">
          {/* Split Section Layout (Form vs Contact Info) */}
          <section className="contact-split-section">
            {/* Left Panel: Contact Form Card */}
            <div className="contact-form-card">
              <h2>{getTranslation("formTitle")}</h2>
              <p className="form-subtitle">{getTranslation("formSubtitle")}</p>

              <form className="contact-form" onSubmit={handleSubmit}>
                {success ? (
                  <div className="form-success-card">
                    <FaCheckCircle className="success-icon" />
                    <h3>{getTranslation("successTitle")}</h3>
                    <p>{getTranslation("successDesc")}</p>
                  </div>
                ) : (
                  <>
                    {apiError && (
                      <div className="api-error-alert" style={{
                        color: "#ef4444",
                        background: "rgba(239, 68, 68, 0.1)",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontSize: "14px",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span>{apiError}</span>
                      </div>
                    )}
                    <div className="input-group">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder={getTranslation("placeholderName")}
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <FaUser className="input-icon" />
                      {errors.name && <span className="field-error-text">{errors.name}</span>}
                    </div>

                    <div className="input-group">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={getTranslation("placeholderEmail")}
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <FaEnvelope className="input-icon" />
                      {errors.email && <span className="field-error-text">{errors.email}</span>}
                    </div>

                    <div className="input-group">
                      <CustomSelect
                        value={formData.topic}
                        onChange={handleChange}
                        options={topicOptions}
                        placeholder={getTranslation("topicPlaceholder")}
                        icon={<FaTag />}
                        disabled={loading}
                      />
                      {errors.topic && <span className="field-error-text" style={{ display: "block" }}>{errors.topic}</span>}
                    </div>

                    <div className="input-group">
                      <textarea
                        name="message"
                        id="message"
                        placeholder={getTranslation("placeholderMessage")}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <FaComment className="input-icon" />
                      {errors.message && <span className="field-error-text">{errors.message}</span>}
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                      {loading ? (
                        <>
                          <FaSpinner className="spinner" />
                          <span>{getTranslation("btnSending")}</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          <span>{getTranslation("btnSubmit")}</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </form>
            </div>

            {/* Right Panel: Contact Info Card */}
            <div className="contact-info-card">
              <h2>{getTranslation("infoTitle")}</h2>
              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <FaClock />
                  </div>
                  <div className="info-details">
                    <h4>{getTranslation("infoHoursTitle")}</h4>
                    <p>{getTranslation("infoHoursDesc")}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <FaPhoneAlt />
                  </div>
                  <div className="info-details">
                    <h4>{getTranslation("infoPhoneTitle")}</h4>
                    <p style={{ whiteSpace: "pre-line" }}>{getTranslation("infoPhoneDesc")}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <FaEnvelope />
                  </div>
                  <div className="info-details">
                    <h4>{getTranslation("infoEmailTitle")}</h4>
                    <p style={{ whiteSpace: "pre-line" }}>{getTranslation("infoEmailDesc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContactPage;
