import AppLayout from "../layouts/AppLayout";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { 
  FaUser, 
  FaTools, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaStar, 
  FaComments,
  FaArrowLeft,
  FaBookOpen
} from "react-icons/fa";
import "./GuidelinesPage.scss";

const getTranslations = (key, lang) => {
  const texts = {
    heroTitle: {
      en: "Community Guidelines",
      kh: "គោលការណ៍ណែនាំសហគមន៍",
    },
    heroSubtitle: {
      en: "Rules, recommendations, and best practices to ensure a professional and safe marketplace for everyone.",
      kh: "ច្បាប់ ការណែនាំ និងការអនុវត្តល្អៗដើម្បីធានាបាននូវទីផ្សារការងារដែលប្រកបដោយវិជ្ជាជីវៈ និងសុវត្ថិភាពសម្រាប់មនុស្សគ្រប់គ្នា។",
    },
    clientHeader: {
      en: "For Homeowners & Clients",
      kh: "សម្រាប់ម្ចាស់ផ្ទះ និងអតិថិជន",
    },
    providerHeader: {
      en: "For Service Providers",
      kh: "សម្រាប់អ្នកផ្តល់សេវាកម្ម",
    },
    generalRules: {
      en: "General Platform Rules",
      kh: "ច្បាប់ទូទៅនៃប្រព័ន្ធ",
    },
    c1_title: { en: "Choose Verified Handymen", kh: "ជ្រើសរើសជាងដែលបានផ្ទៀងផ្ទាត់" },
    c1_desc: { en: "Always review profile badges, historical job ratings, and verified client feedback before hiring.", kh: "តែងតែពិនិត្យមើលផ្លាកសញ្ញាប្រវត្តិរូប ការវាយតម្លៃការងារ និងមតិកែលម្អរបស់អតិថិជនមុនពេលជួល។" },
    c2_title: { en: "Define Scope & Budget First", kh: "កំណត់ទំហំការងារ និងថវិកាជាមុន" },
    c2_desc: { en: "Discuss and write down specific requirements and pricing terms on the chat before the provider starts work.", kh: "ពិភាក្សា និងកត់ត្រាតម្រូវការជាក់លាក់ និងលក្ខខណ្ឌតម្លៃនៅលើការជជែក មុនពេលអ្នកផ្តល់សេវាចាប់ផ្តើមការងារ។" },
    c3_title: { en: "Secure Handover & Payments", kh: "ការប្រគល់ការងារ និងការទូទាត់ប្រាក់" },
    c3_desc: { en: "Inspect the finished job to ensure it matches your requirements before sending the final payment.", kh: "ត្រួតពិនិត្យការងារដែលបានបញ្ចប់ ដើម្បីធានាថាវាស្របតាមតម្រូវការរបស់អ្នក មុនពេលផ្ញើការទូទាត់ចុងក្រោយ។" },
    p1_title: { en: "Accurate Profile Data", kh: "ព័ត៌មានប្រវត្តិរូបត្រឹមត្រូវ" },
    p1_desc: { en: "Keep your brand names, main skills, locations, and phone numbers genuine to gain client confidence.", kh: "រក្សាឈ្មោះម៉ាក ជំនាញចម្បង ទីតាំង និងលេខទូរស័ព្ទឱ្យពិតប្រាកដ ដើម្បីទទួលបានទំនុកចិត្តពីអតិថិជន។" },
    p2_title: { en: "Fair Estimate Quotes", kh: "ការប៉ាន់ប្រមាណតម្លៃសមរម្យ" },
    p2_desc: { en: "Provide honest, competitive, and clear service estimates with no hidden or unexpected costs.", kh: "ផ្តល់នូវការប៉ាន់ស្មានសេវាកម្មប្រកបដោយភាពស្មោះត្រង់ ការប្រកួតប្រជែង និងច្បាស់លាស់ ដោយគ្មានការលាក់បាំង ឬការចំណាយដែលមិនរំពឹងទុក។" },
    p3_title: { en: "Professional Standards", kh: "ស្តង់ដារវិជ្ជាជីវៈ" },
    p3_desc: { en: "Be punctual, deliver high-quality craftsmanship, and behave respectfully inside customer households.", kh: "គោរពពេលវេលា ផ្តល់នូវស្នាដៃដែលមានគុណភាពខ្ពស់ និងប្រព្រឹត្តដោយការគោរពនៅក្នុងគេហដ្ឋានរបស់អតិតិជន។" },
    r1_title: { en: "Mutual Respect", kh: "ការគោរពគ្នាទៅវិញទៅមក" },
    r1_desc: { en: "Harassment, abuse, or discriminatory language is strictly forbidden and leads to account suspension.", kh: "ការបៀតបៀន ការរំលោភបំពាន ឬភាសារើសអើង ត្រូវបានហាមឃាត់យ៉ាងតឹងរ៉ឹង និងនាំឱ្យមានការផ្អាកគណនី។" },
    r2_title: { en: "Secure Communication", kh: "ការទំនាក់ទំនងប្រកបដោយសុវត្ថិភាព" },
    r2_desc: { en: "Communicate on the platform to maintain transaction history, details, and support resolution options.", kh: "ប្រាស្រ័យទាក់ទងគ្នានៅលើប្រព័ន្ធ ដើម្បីរក្សាប្រវត្តិប្រតិបត្តិការ ព័ត៌មានលម្អិត និងជម្រើសដោះស្រាយវិវាទ។" },
    r3_title: { en: "Honest Feedback", kh: "មតិកែលម្អប្រកបដោយភាពស្មោះត្រង់" },
    r3_desc: { en: "Reviews must reflect genuine job experiences. Manipulated, paid, or false ratings are prohibited.", kh: "ការវាយតម្លៃត្រូវតែឆ្លុះបញ្ចាំងពីបទពិសោធន៍ការងារពិតប្រាកដ។ ការរៀបចំទុកជាមុន ឬការវាយតម្លៃមិនពិត ត្រូវបានហាមឃាត់។" },
    ctaTitle: { en: "Help Us Maintain a Safe Platform", kh: "ជួយយើងរក្សាប្រព័ន្ធប្រកបដោយសុវត្ថិភាព" },
    ctaDesc: { en: "If you notice suspicious user behavior, policy violations, or face issues, reach out to our team.", kh: "ប្រសិនបើអ្នកកត់សម្គាល់ឃើញអាកប្បក្បិយាគួរឱ្យសង្ស័យ ការបំពានគោលការណ៍ ឬជួបប្រទះបញ្ហា សូមទាក់ទងមកក្រុមការងាររបស់យើង។" },
    ctaBtnPrimary: { en: "Back to Home", kh: "ត្រលប់ទៅទំព័រដើម" },
    ctaBtnSecondary: { en: "Become a Pro", kh: "ក្លាយជាអ្នកផ្តល់សេវា" },
  };
  return texts[key]?.[lang] || texts[key]?.[lang === "kh" ? "kh" : "en"] || texts[key]?.["en"] || "";
};

const GuidelinesPage = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <AppLayout page="guidelines">
      <div className={`guidelines-page-container ${theme} ${language}`}>
        {/* Hero Banner Section */}
        <section className="guidelines-hero">
          <div className="hero-content">
            <h1>
              <span>{getTranslations("heroTitle", language)}</span>
            </h1>
            <p>{getTranslations("heroSubtitle", language)}</p>
          </div>
        </section>

        {/* Content wrapper */}
        <div className="guidelines-content-wrapper">
          {/* Split Column Grid: Clients vs Providers */}
          <section className="guidelines-split-grid">
            {/* Homeowners / Clients */}
            <div className="guideline-card">
              <div className="card-header-group">
                <FaUser className="header-icon" />
                <h2>{getTranslations("clientHeader", language)}</h2>
              </div>
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-body">
                    <h3>{getTranslations("c1_title", language)}</h3>
                    <p>{getTranslations("c1_desc", language)}</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-body">
                    <h3>{getTranslations("c2_title", language)}</h3>
                    <p>{getTranslations("c2_desc", language)}</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-body">
                    <h3>{getTranslations("c3_title", language)}</h3>
                    <p>{getTranslations("c3_desc", language)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Providers / Handymen */}
            <div className="guideline-card">
              <div className="card-header-group">
                <FaTools className="header-icon" />
                <h2>{getTranslations("providerHeader", language)}</h2>
              </div>
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-body">
                    <h3>{getTranslations("p1_title", language)}</h3>
                    <p>{getTranslations("p1_desc", language)}</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-body">
                    <h3>{getTranslations("p2_title", language)}</h3>
                    <p>{getTranslations("p2_desc", language)}</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-body">
                    <h3>{getTranslations("p3_title", language)}</h3>
                    <p>{getTranslations("p3_desc", language)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* General Platform Rules Cards Grid */}
          <section className="guidelines-general-section">
            <h2 className="section-title">{getTranslations("generalRules", language)}</h2>
            <div className="rules-grid">
              <div className="rule-card">
                <div className="rule-icon-wrapper">
                  <FaShieldAlt />
                </div>
                <h3>{getTranslations("r1_title", language)}</h3>
                <p>{getTranslations("r1_desc", language)}</p>
              </div>

              <div className="rule-card">
                <div className="rule-icon-wrapper">
                  <FaComments />
                </div>
                <h3>{getTranslations("r2_title", language)}</h3>
                <p>{getTranslations("r2_desc", language)}</p>
              </div>

              <div className="rule-card">
                <div className="rule-icon-wrapper">
                  <FaStar />
                </div>
                <h3>{getTranslations("r3_title", language)}</h3>
                <p>{getTranslations("r3_desc", language)}</p>
              </div>
            </div>
          </section>

          {/* Call to Action Banner Section */}
          <section className="guidelines-cta">
            <div className="cta-content">
              <h2>{getTranslations("ctaTitle", language)}</h2>
              <p>{getTranslations("ctaDesc", language)}</p>
              <div className="cta-buttons">
                <Link to="/" className="btn-primary">
                  <FaArrowLeft style={{ marginRight: "8px", fontSize: "0.85rem" }} />
                  {getTranslations("ctaBtnPrimary", language)}
                </Link>
                <Link to="/signup-pro" className="btn-secondary">
                  <FaBookOpen style={{ marginRight: "8px", fontSize: "0.85rem" }} />
                  {getTranslations("ctaBtnSecondary", language)}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default GuidelinesPage;
