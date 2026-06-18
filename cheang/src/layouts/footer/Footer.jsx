import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import "./Footer.scss";

// Localized Footer Translations
const footerTranslations = {
  en: {
    brandDesc: "Your trusted local marketplace for booking verified repair specialists, plumbers, electricians, and handymen.",
    services: "Specialties",
    quickLinks: "Quick Links",
    contactSupport: "Contact & Support",
    about: "About Us",
    servicesLink: "Our Services",
    guidelines: "Guidelines",
    faq: "FAQs",
    help: "Help Center",
    contact: "Contact Us",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookie Policy",
    cancellation: "Cancellation Policy",
    generalRepairs: "General Repairs",
    electrical: "Electrical Services",
    plumbing: "Plumbing Solutions",
    renovations: "Home Renovations",
    copyright: "All rights reserved. Powered by Visal Brathna Sophana",
  },
  kh: {
    brandDesc: "ជាទីផ្សារក្នុងស្រុកដែលគួរឱ្យទុកចិត្តរបស់អ្នកសម្រាប់ការស្វែងរកជាងជំនាញជួសជុល ជាងទឹក ជាងភ្លើង និងជំនួយការជាងដែលបានបញ្ជាក់។",
    services: "ជំនាញជួសជុល",
    quickLinks: "តំណភ្ជាប់រហ័ស",
    contactSupport: "ទំនាក់ទំនង និងជំនួយ",
    about: "អំពីយើង",
    servicesLink: "សេវាកម្មរបស់យើង",
    guidelines: "គោលការណ៍ណែនាំ",
    faq: "សំណួរដែលសួរញឹកញាប់",
    help: "មជ្ឈមណ្ឌលជំនួយ",
    contact: "ទាក់ទងមកយើង",
    privacy: "គោលការណ៍ឯកជនភាព",
    terms: "លក្ខខណ្ឌសេវាកម្ម",
    cookies: "គោលការណ៍ឃុកឃី",
    cancellation: "គោលការណ៍លុបចោល",
    generalRepairs: "សេវាកម្មជួសជុលទូទៅ",
    electrical: "សេវាកម្មអគ្គិសនី",
    plumbing: "សេវាកម្មប្រព័ន្ធទឹក",
    renovations: "កែលម្អគេហដ្ឋាន",
    copyright: "រក្សាសិទ្ធិគ្រប់យ៉ាង។ សម្របសម្រួលដោយ វីសាល ប្រាថ្នា សុភ័ណ្ឌ",
  },
  zh: {
    brandDesc: "您值得信赖的本地维修服务市场，可预订经过验证的维修专家、管道工、电工和勤杂工。",
    services: "服务项目",
    quickLinks: "快速链接",
    contactSupport: "联系与支持",
    about: "关于我们",
    servicesLink: "我们的服务",
    guidelines: "使用指南",
    faq: "常见问题",
    help: "帮助中心",
    contact: "联系我们",
    privacy: "隐私政策",
    terms: "服务条款",
    cookies: "Cookie 政策",
    cancellation: "取消政策",
    generalRepairs: "一般维修",
    electrical: "电力服务",
    plumbing: "管道解决方案",
    renovations: "家居装修",
    copyright: "保留所有权利。由 Visal Brathna Sophana 提供支持",
  }
};

const Footer = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = footerTranslations[language] || footerTranslations.en;
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer-wrapper ${theme}`}>
      <div className="footer-main-content">
        {/* Column 1: Brand Info & Socials */}
        <div className="footer-column brand-col">
          <h2 className="brand-logo-text">Cheang</h2>
          <p className="brand-description">{t.brandDesc}</p>
          <div className="social-icons-group">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaTiktok />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaLinkedinIn />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-circle">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Column 2: Specialties */}
        <div className="footer-column">
          <h3>{t.services}</h3>
          <ul className="footer-links-list">
            <li>
              <Link to="/userlist/General Repairs Service">{t.generalRepairs}</Link>
            </li>
            <li>
              <Link to="/userlist/Electrical Services">{t.electrical}</Link>
            </li>
            <li>
              <Link to="/userlist/Plumbing Solutions Service">{t.plumbing}</Link>
            </li>
            <li>
              <Link to="/userlist/Home Renovations Service">{t.renovations}</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div className="footer-column">
          <h3>{t.quickLinks}</h3>
          <ul className="footer-links-list">
            <li>
              <Link to="/about">{t.about}</Link>
            </li>
            <li>
              <Link to="/service">{t.servicesLink}</Link>
            </li>
            <li>
              <Link to="/guidelines">{t.guidelines}</Link>
            </li>
            <li>
              <Link to="/faq">{t.faq}</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Help */}
        <div className="footer-column">
          <h3>{t.contactSupport}</h3>
          <ul className="footer-links-list">
            <li>
              <Link to="/help">{t.help}</Link>
            </li>
            <li>
              <Link to="/contact">{t.contact}</Link>
            </li>
            <li className="contact-info-item">
              <span className="contact-label">Email:</span> support@cheang.com
            </li>
            <li className="contact-info-item">
              <span className="contact-label">Phone:</span> +855 12 345 678
            </li>
          </ul>
        </div>
      </div>

      {/* Sub-Footer: Copyright and Legal */}
      <div className="footer-bottom-section">
        <div className="footer-bottom-container">
          <div className="copyright-text">
            <p>&copy; {currentYear} Cheang. {t.copyright}</p>
          </div>
          <div className="legal-links-list">
            <Link to="/privacy">{t.privacy}</Link>
            <Link to="/terms">{t.terms}</Link>
            <Link to="/cookies">{t.cookies}</Link>
            <Link to="/cancellation-policy">{t.cancellation}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
