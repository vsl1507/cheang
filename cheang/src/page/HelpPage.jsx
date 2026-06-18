import AppLayout from "../layouts/AppLayout";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import {
  FaQuestionCircle,
  FaBookOpen,
  FaInfoCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaArrowRight
} from "react-icons/fa";
import "./HelpPage.scss";

// Localized translations for the Help Center Page
const helpTranslations = {
  heroTitle: {
    en: "How can we help you?",
    kh: "តើយើងអាចជួយអ្នកដោយរបៀបណា?"
  },
  heroSubtitle: {
    en: "Find resources, read our guidelines, or get in touch with our team directly.",
    kh: "ស្វែងរកធនធាន អានគោលការណ៍ណែនាំរបស់យើង ឬទាក់ទងមកក្រុមការងាររបស់យើងដោយផ្ទាល់។"
  },
  faqTitle: {
    en: "Frequently Asked Questions",
    kh: "សំណួរដែលសួរញឹកញាប់"
  },
  faqDesc: {
    en: "Find quick answers to common questions about services and payments.",
    kh: "ស្វែងរកចម្លើយរហ័សចំពោះសំណួរទូទៅអំពីសេវាកម្ម និងការទូទាត់។"
  },
  guidelinesTitle: {
    en: "Community Guidelines",
    kh: "គោលការណ៍ណែនាំសហគមន៍"
  },
  guidelinesDesc: {
    en: "Read our rules to maintain a safe and professional environment.",
    kh: "អានច្បាប់របស់យើងដើម្បីរក្សាបរិយាកាសសុវត្ថិភាព និងវិជ្ជាជីវៈ។"
  },
  aboutTitle: {
    en: "About Cheang",
    kh: "អំពី Cheang"
  },
  aboutDesc: {
    en: "Learn more about our mission, vision, and core team values.",
    kh: "ស្វែងយល់បន្ថែមអំពីបេសកកម្ម ចក្ខុវិស័យ និងតម្លៃស្នូលរបស់ក្រុមការងារយើង។"
  },
  contactTitle: {
    en: "Contact Us",
    kh: "ទាក់ទងមកយើង"
  },
  contactDesc: {
    en: "Send a message directly to our dedicated support representatives.",
    kh: "ផ្ញើសារផ្ទាល់ទៅកាន់តំណាងគាំទ្រអតិថិជនរបស់យើង។"
  },
  supportTitle: {
    en: "Still Need Help?",
    kh: "នៅតែមានចម្ងល់មែនទេ?"
  },
  supportDesc: {
    en: "If you cannot find the answer to your questions in our documentation, send us a direct message.",
    kh: "ប្រសិនបើអ្នកមិនអាចស្វែងរកចម្លើយចំពោះសំណួររបស់អ្នកក្នុងឯកសារនេះទេ សូមផ្ញើសារមកកាន់យើងដោយផ្ទាល់។"
  },
  contactBtn: {
    en: "Send Message",
    kh: "ផ្ញើសារមកយើង"
  },
  hotlineBtn: {
    en: "Call Hotline",
    kh: "ទូរស័ព្ទទៅផ្នែកគាំទ្រ"
  }
};

const HelpPage = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const getTranslation = (key) => {
    return helpTranslations[key]?.[language] || helpTranslations[key]?.en || "";
  };

  return (
    <AppLayout page="help">
      <div className={`help-page-container ${theme} ${language}`}>
        {/* Hero Banner Section */}
        <section className="help-hero">
          <div className="hero-content">
            <h1>
              <span>{getTranslation("heroTitle")}</span>
            </h1>
            <p>{getTranslation("heroSubtitle")}</p>
          </div>
        </section>

        {/* Content Wrapper */}
        <div className="help-content-wrapper">
          {/* Quick Resources Grid (4 Columns) */}
          <section className="help-resources-section">
            <div className="resources-grid">
              <Link to="/faq" className="resource-card">
                <div className="resource-icon-wrapper">
                  <FaQuestionCircle />
                </div>
                <h3>{getTranslation("faqTitle")}</h3>
                <p>{getTranslation("faqDesc")}</p>
              </Link>

              <Link to="/guidelines" className="resource-card">
                <div className="resource-icon-wrapper">
                  <FaBookOpen />
                </div>
                <h3>{getTranslation("guidelinesTitle")}</h3>
                <p>{getTranslation("guidelinesDesc")}</p>
              </Link>

              <Link to="/about" className="resource-card">
                <div className="resource-icon-wrapper">
                  <FaInfoCircle />
                </div>
                <h3>{getTranslation("aboutTitle")}</h3>
                <p>{getTranslation("aboutDesc")}</p>
              </Link>

              <Link to="/contact" className="resource-card">
                <div className="resource-icon-wrapper">
                  <FaEnvelope />
                </div>
                <h3>{getTranslation("contactTitle")}</h3>
                <p>{getTranslation("contactDesc")}</p>
              </Link>
            </div>
          </section>

          {/* Support Call-to-Action Banner */}
          <section className="help-support-cta">
            <div className="cta-content">
              <h2>{getTranslation("supportTitle")}</h2>
              <p>{getTranslation("supportDesc")}</p>
              <div className="cta-buttons">
                <Link to="/contact" className="btn-primary">
                  <FaEnvelope style={{ marginRight: "8px", fontSize: "0.85rem" }} />
                  {getTranslation("contactBtn")}
                </Link>
                <a href="tel:+85512345678" className="btn-secondary">
                  <FaPhoneAlt style={{ marginRight: "8px", fontSize: "0.85rem" }} />
                  {getTranslation("hotlineBtn")}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default HelpPage;
