import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { FaChevronDown, FaQuestionCircle, FaArrowLeft, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./FAQPage.scss";

const faqTranslations = {
  heroTitle: { en: "Frequently Asked Questions", kh: "សំណួរដែលសួរញឹកញាប់" },
  heroSubtitle: { en: "Find answers to common questions about booking, becoming a provider, and using Cheang.", kh: "ស្វែងរកចម្លើយចំពោះសំណួរទូទៅអំពីការកក់ទុក ការក្លាយជាអ្នកផ្តល់សេវា និងការប្រើប្រាស់ Cheang។" },
  all: { en: "All Questions", kh: "សំណួរទាំងអស់" },
  general: { en: "General Info", kh: "ព័ត៌មានទូទៅ" },
  clients: { en: "For Clients", kh: "សម្រាប់អតិថិជន" },
  providers: { en: "For Providers", kh: "សម្រាប់ជាងជំនាញ" },
  supportTitle: { en: "Still Have Questions?", kh: "នៅតែមានសំណួរមែនទេ?" },
  supportDesc: { en: "If you cannot find the answer to your questions, feel free to contact our customer support.", kh: "ប្រសិនបើអ្នកមិនអាចស្វែងរកចម្លើយចំពោះសំណួររបស់អ្នកបានទេ សូមទាក់ទងមកផ្នែកគាំទ្រអតិថិជនរបស់យើង។" },
  contactBtn: { en: "Contact Us", kh: "ទាក់ទងមកយើង" },
  homeBtn: { en: "Back to Home", kh: "ត្រលប់ទៅទំព័រដើម" }
};

const getTranslations = (key, lang) => {
  return faqTranslations[key]?.[lang] || faqTranslations[key]?.[lang === "kh" ? "kh" : "en"] || faqTranslations[key]?.["en"] || "";
};

const faqList = [
  {
    id: 1,
    category: "general",
    question: {
      en: "What is Cheang?",
      kh: "តើ Cheang ជាអ្វី?",
    },
    answer: {
      en: "Cheang is a digital marketplace that connects homeowners and businesses directly with verified local service professionals like handymen, plumbers, electricians, and renovators in Cambodia.",
      kh: "Cheang គឺជាទីផ្សារឌីជីថលដែលភ្ជាប់ទំនាក់ទំនងម្ចាស់ផ្ទះ និងអាជីវកម្មដោយផ្ទាល់ជាមួយជាងជំនាញក្នុងស្រុកដែលបានបញ្ជាក់ ដូចជាជាងជួសជុល ជាងទឹក ជាងភ្លើង និងអ្នកកែលម្អផ្ទះនៅក្នុងប្រទេសកម្ពុជា។",
    }
  },
  {
    id: 2,
    category: "clients",
    question: {
      en: "Is it free to use Cheang for booking?",
      kh: "តើវាឥតគិតថ្លៃក្នុងការប្រើប្រាស់ Cheang សម្រាប់ការកក់ដែរឬទេ?",
    },
    answer: {
      en: "Yes! It is completely free for homeowners to search, compare reviews, and contact handymen. You only pay the handyman directly for the actual service completed based on your agreed budget.",
      kh: "បាទ/ចាស! វាឥតគិតថ្លៃទាំងស្រុងសម្រាប់ម្ចាស់ផ្ទះក្នុងការស្វែងរក ប្រៀបធៀបការវាយតម្លៃ និងទាក់ទងជាង។ អ្នកគ្រាន់តែទូទាត់ប្រាក់ទៅជាងដោយផ្ទាល់សម្រាប់សេវាកម្មជាក់ស្តែងដែលបានបញ្ចប់ផ្អែកលើកិច្ចព្រមព្រៀងរបស់អ្នក។",
    }
  },
  {
    id: 3,
    category: "providers",
    question: {
      en: "How do I sign up as a professional service provider?",
      kh: "តើខ្ញុំចុះឈ្មោះជាអ្នកផ្តល់សេវាកម្មអាជីពដោយរបៀបណា?",
    },
    answer: {
      en: "First, sign up for a standard account on our Sign Up page. Once logged in, go to 'Become Pro' from the main navigation menu, fill out your brand details, choose your locations and services, and submit the request. Our admin team will review and approve your request.",
      kh: "ដំបូង ចុះឈ្មោះគណនីធម្មតានៅលើទំព័រចុះឈ្មោះរបស់យើង។ នៅពេលចូលគណនីរួច សូមចូលទៅកាន់ 'ក្លាយជាអ្នកផ្តល់សេវា' ពីម៉ឺនុយរុករកចម្បង បំពេញព័ត៌មានលម្អិតអំពីម៉ាករបស់អ្នក ជ្រើសរើសទីតាំង និងសេវាកម្ម រួចផ្ញើការស្នើសុំ។ ក្រុមការងារនឹងពិនិត្យ និងអនុម័តសំណើរបស់អ្នក។",
    }
  },
  {
    id: 4,
    category: "clients",
    question: {
      en: "How are the handymen verified?",
      kh: "តើជាងជួសជុលត្រូវបានផ្ទៀងផ្ទាត់ដោយរបៀបណា?",
    },
    answer: {
      en: "We verify contact details, phone numbers, and cross-reference background details. Additionally, we use verified client ratings and reviews from completed tasks on the platform to maintain high service standards.",
      kh: "យើងផ្ទៀងផ្ទាត់ព័ត៌មានទំនាក់ទំនង លេខទូរស័ព្ទ និងពិនិត្យមើលព័ត៌មានប្រវត្តិរូប។ លើសពីនេះ យើងប្រើការវាយតម្លៃ និងមតិកែលម្អរបស់អតិថិជនពិតប្រាកដពីការងារដែលបានបញ្ចប់នៅលើប្រព័ន្ធ ដើម្បីរក្សាស្តង់ដារសេវាកម្មខ្ពស់។",
    }
  },
  {
    id: 5,
    category: "general",
    question: {
      en: "What should I do if I face issues with a booking?",
      kh: "តើខ្ញុំគួរធ្វើដូចម្តេចប្រសិនបើខ្ញុំជួបបញ្ហាជាមួយការកក់សេវាកម្ម?",
    },
    answer: {
      en: "If you encounter any issues or misunderstandings with a service provider, you can contact our support team at support@cheang.com or call our hotline. We will review the chat logs registered on the platform to help mediate and resolve the dispute.",
      kh: "ប្រសិនបើអ្នកជួបប្រទះបញ្ហា ឬការយល់ច្រឡំណាមួយជាមួយអ្នកផ្តល់សេវា អ្នកអាចទាក់ទងក្រុមការងារគាំទ្ររបស់យើងតាមរយៈ support@cheang.com ឬទូរស័ព្ទទៅកាន់ខ្សែទូរស័ព្ទបន្ទាន់របស់យើង។ យើងនឹងពិនិត្យមើលប្រវត្តិនៃការជជែកនៅលើប្រព័ន្ធដើម្បីជួយសម្របសម្រួល និងដោះស្រាយវិវាទ។",
    }
  },
  {
    id: 6,
    category: "providers",
    question: {
      en: "Are there membership fees for professionals?",
      kh: "តើមានថ្លៃសមាជិកភាពសម្រាប់អ្នកផ្តល់សេវាកម្មអាជីពដែរឬទេ?",
    },
    answer: {
      en: "Currently, registering and getting requests as a professional on Cheang is completely free. We want to support local Cambodian handymen to digitize and grow their businesses.",
      kh: "បច្ចុប្បន្ន ការចុះឈ្មោះ និងការទទួលបានសំណើជាអ្នកជំនាញនៅលើ Cheang គឺឥតគិតថ្លៃទាំងស្រុង។ យើងចង់គាំទ្រជាងជំនាញក្នុងស្រុករបស់កម្ពុជាដើម្បីធ្វើឌីជីថលនីយកម្ម និងពង្រីកអាជីវកម្មរបស់ពួកគេ។",
    }
  }
];

const FAQPage = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (id) => {
    if (activeFaq === id) {
      setActiveFaq(null);
    } else {
      setActiveFaq(id);
    }
  };

  const filteredFaqs = faqList.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  return (
    <AppLayout page="faq">
      <div className={`faq-page-container ${theme} ${language}`}>
        {/* Hero Banner Section */}
        <section className="faq-hero">
          <div className="hero-content">
            <h1>
              <span>{getTranslations("heroTitle", language)}</span>
            </h1>
            <p>{getTranslations("heroSubtitle", language)}</p>
          </div>
        </section>

        {/* Content Wrapper */}
        <div className="faq-content-wrapper">
          {/* Category Selector Tabs */}
          <div className="faq-categories-tabs">
            <button
              className={`category-tab-btn ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => {
                setActiveCategory("all");
                setActiveFaq(null);
              }}
            >
              {getTranslations("all", language)}
            </button>
            <button
              className={`category-tab-btn ${activeCategory === "general" ? "active" : ""}`}
              onClick={() => {
                setActiveCategory("general");
                setActiveFaq(null);
              }}
            >
              {getTranslations("general", language)}
            </button>
            <button
              className={`category-tab-btn ${activeCategory === "clients" ? "active" : ""}`}
              onClick={() => {
                setActiveCategory("clients");
                setActiveFaq(null);
              }}
            >
              {getTranslations("clients", language)}
            </button>
            <button
              className={`category-tab-btn ${activeCategory === "providers" ? "active" : ""}`}
              onClick={() => {
                setActiveCategory("providers");
                setActiveFaq(null);
              }}
            >
              {getTranslations("providers", language)}
            </button>
          </div>

          {/* Accordion Group */}
          <div className="faq-accordion-group">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className={`faq-item ${activeFaq === faq.id ? "active" : ""}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <h3>{faq.question[language] || faq.question.en}</h3>
                  <FaChevronDown className="chevron-icon" />
                </button>
                <div className="faq-answer-panel">
                  <p>{faq.answer[language] || faq.answer.en}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Support Call-to-Action Banner */}
          <section className="faq-support-cta">
            <div className="cta-content">
              <h2>{getTranslations("supportTitle", language)}</h2>
              <p>{getTranslations("supportDesc", language)}</p>
              <div className="cta-buttons">
                <Link to="/" className="btn-primary">
                  <FaArrowLeft style={{ marginRight: "8px", fontSize: "0.85rem" }} />
                  {getTranslations("homeBtn", language)}
                </Link>
                <a href="mailto:support@cheang.com" className="btn-secondary">
                  <FaEnvelope style={{ marginRight: "8px", fontSize: "0.85rem" }} />
                  {getTranslations("contactBtn", language)}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default FAQPage;
