import AppLayout from "../layouts/AppLayout";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { getAboutText } from "../data/wordsLanguage";
import { Link } from "react-router-dom";
import { 
  FaBullseye, 
  FaEye, 
  FaHandshake, 
  FaCheckCircle, 
  FaHeart, 
  FaTools 
} from "react-icons/fa";
import "./AboutPage.scss";

const getAboutTranslations = (key, lang) => {
  const texts = {
    heroTitle: {
      en: "About Cheang",
      kh: "អំពី Cheang",
    },
    heroSubtitle: {
      en: "Connecting Cambodia's finest local handymen and professional service providers with households.",
      kh: "ភ្ជាប់ទំនាក់ទំនងរវាងជាងជំនាញក្នុងស្រុក និងអ្នកផ្តល់សេវាកម្មអាជីពល្អបំផុតនៅក្នុងប្រទេសកម្ពុជាជាមួយគេហដ្ឋានរបស់អ្នក។",
    },
    storyTitle: {
      en: "Our Story",
      kh: "រឿងរ៉ាវរបស់យើង",
    },
    missionTitle: {
      en: "Our Mission",
      kh: "បេសកកម្មរបស់យើង",
    },
    missionDesc: {
      en: "To provide home and office maintenance services in Cambodia that are accessible, transparent, and built on trust.",
      kh: "ដើម្បីផ្តល់សេវាកម្មថែទាំគេហដ្ឋាន និងការិយាល័យនៅក្នុងប្រទេសកម្ពុជា ដែលអាចចូលប្រើប្រាស់បាន ឆ្លុះបញ្ចាំងពីតម្លាភាព និងបង្កើតឡើងនៅលើទំនុកចិត្ត។",
    },
    visionTitle: {
      en: "Our Vision",
      kh: "ចក្ខុវិស័យរបស់យើង",
    },
    visionDesc: {
      en: "To become the leading platform for professional handymen in Southeast Asia, creating economic opportunities for local workers.",
      kh: "ដើម្បីក្លាយជាវេទិកានាំមុខគេសម្រាប់ជាងអាជីពនៅអាស៊ីអាគ្នេយ៍ ដោយបង្កើតឱកាសសេដ្ឋកិច្ចសម្រាប់កម្មករក្នុងស្រុក។",
    },
    valuesTitle: {
      en: "Our Core Values",
      kh: "គុណតម្លៃស្នូលរបស់យើង",
    },
    val1Title: { en: "Integrity", kh: "ភាពស្មោះត្រង់" },
    val1Desc: { en: "We foster honest, open, and transparent connections between handymen and clients.", kh: "យើងជំរុញការតភ្ជាប់ប្រកបដោយភាពស្មោះត្រង់ បើកចំហ និងតម្លាភាពរវាងជាង និងអតិថិជន។" },
    val2Title: { en: "Quality Service", kh: "សេវាកម្មមានគុណភាព" },
    val2Desc: { en: "We promote standard, high-quality work from verified local repair professionals.", kh: "យើងលើកកម្ពស់ការងារស្តង់ដារ និងគុណភាពខ្ពស់ពីអ្នកជំនាញជួសជុលក្នុងស្រុកដែលបានផ្ទៀងផ្ទាត់។" },
    val3Title: { en: "Community Empowerment", kh: "ការផ្តល់អំណាចដល់សហគមន៍" },
    val3Desc: { en: "We empower local workers to digitalize their services and scale their earning capacity.", kh: "យើងផ្តល់អំណាចដល់ជាងក្នុងស្រុកក្នុងការធ្វើឌីជីថលនីយកម្មសេវាកម្មរបស់ពួកគេ និងពង្រីកសមត្ថភាពរកចំណូល។" },
    ctaTitle: { en: "Ready to Get Started?", kh: "ត្រៀមខ្លួនចាប់ផ្តើមហើយឬនៅ?" },
    ctaDesc: { en: "Explore standard local repair services, or join Cheang as a professional provider to grow your business.", kh: "ស្វែងរកសេវាកម្មជួសជុលក្នុងស្រុក ឬចូលរួមជាមួយ Cheang ជាអ្នកផ្តល់សេវាកម្មអាជីពដើម្បីពង្រីកអាជីវកម្មរបស់អ្នក។" },
    ctaBtnPrimary: { en: "Find Services", kh: "ស្វែងរកសេវាកម្ម" },
    ctaBtnSecondary: { en: "Become a Pro", kh: "ក្លាយជាអ្នកផ្តល់សេវា" },
  };
  return texts[key]?.[lang] || texts[key]?.[lang === "kh" ? "kh" : "en"] || texts[key]?.["en"] || "";
};

const AboutPage = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <AppLayout page="about">
      <div className={`about-page-container ${theme} ${language}`}>
        {/* Hero Banner Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1>
              <span>{getAboutTranslations("heroTitle", language)}</span>
            </h1>
            <p>{getAboutTranslations("heroSubtitle", language)}</p>
          </div>
        </section>

        {/* Content Wrapper */}
        <div className="about-content-wrapper">
          {/* Main Brand Description Story */}
          <section className="about-story-section">
            <h2>{getAboutTranslations("storyTitle", language)}</h2>
            <p>{getAboutText(language)}</p>
          </section>

          {/* Grid: Mission & Vision */}
          <section className="about-grid-two">
            <div className="info-card">
              <div className="card-icon-wrapper">
                <FaBullseye />
              </div>
              <h2>{getAboutTranslations("missionTitle", language)}</h2>
              <p>{getAboutTranslations("missionDesc", language)}</p>
            </div>

            <div className="info-card">
              <div className="card-icon-wrapper">
                <FaEye />
              </div>
              <h2>{getAboutTranslations("visionTitle", language)}</h2>
              <p>{getAboutTranslations("visionDesc", language)}</p>
            </div>
          </section>

          {/* Grid: Core Values */}
          <section className="about-values-section">
            <h2 className="section-title">{getAboutTranslations("valuesTitle", language)}</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <FaHandshake />
                </div>
                <h3>{getAboutTranslations("val1Title", language)}</h3>
                <p>{getAboutTranslations("val1Desc", language)}</p>
              </div>

              <div className="value-card">
                <div className="value-icon-wrapper">
                  <FaCheckCircle />
                </div>
                <h3>{getAboutTranslations("val2Title", language)}</h3>
                <p>{getAboutTranslations("val2Desc", language)}</p>
              </div>

              <div className="value-card">
                <div className="value-icon-wrapper">
                  <FaHeart />
                </div>
                <h3>{getAboutTranslations("val3Title", language)}</h3>
                <p>{getAboutTranslations("val3Desc", language)}</p>
              </div>
            </div>
          </section>

          {/* Call to Action banner card */}
          <section className="about-cta">
            <div className="cta-content">
              <h2>{getAboutTranslations("ctaTitle", language)}</h2>
              <p>{getAboutTranslations("ctaDesc", language)}</p>
              <div className="cta-buttons">
                <Link to="/" className="btn-primary">
                  {getAboutTranslations("ctaBtnPrimary", language)}
                </Link>
                <Link to="/signup-pro" className="btn-secondary">
                  <FaTools style={{ marginRight: "8px", fontSize: "0.9rem" }} />
                  {getAboutTranslations("ctaBtnSecondary", language)}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default AboutPage;
