import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import "./LegalPage.scss";

// Localized translations for Terms of Service
const translations = {
  heroTitle: { en: "Terms of Service", kh: "លក្ខខណ្ឌសេវាកម្ម" },
  heroSubtitle: { 
    en: "Last Updated: June 18, 2026. Please read these terms carefully before utilizing the Cheang platform.", 
    kh: "បច្ចុប្បន្នភាពចុងក្រោយ៖ ១៨ មិថុនា ២០២៦។ សូមអានលក្ខខណ្ឌទាំងនេះឱ្យបានលម្អិតមុនពេលប្រើប្រាស់ប្រព័ន្ធ Cheang។" 
  },
  tocTitle: { en: "Sections", kh: "មាតិកា" },
  
  // Section Navigation Links
  s1: { en: "1. Agreement to Terms", kh: "១. ការយល់ព្រមលើលក្ខខណ្ឌ" },
  s2: { en: "2. Platform Services", kh: "២. សេវាកម្មនៅលើប្រព័ន្ធ" },
  s3: { en: "3. Service Provider Conduct", kh: "៣. ក្រមសីលធម៌ជាងជំនាញ" },
  s4: { en: "4. Payments & Fees", kh: "៤. ការទូទាត់ និងថ្លៃសេវា" },
  s5: { en: "5. Dispute Resolution", kh: "៥. ការដោះស្រាយវិវាទ" },
  s6: { en: "6. Limitation of Liability", kh: "៦. កម្រិតនៃការទទួលខុសត្រូវ" },
  s7: { en: "7. Termination of Account", kh: "៧. ការបញ្ឈប់គណនី" },

  // Content Paragraphs
  agreeTitle: { en: "1. Agreement to Terms", kh: "១. ការយល់ព្រមលើលក្ខខណ្ឌ" },
  agreeDesc: {
    en: "By creating an account, booking a repair specialist, or registering as a professional handyman on Cheang, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must immediately discontinue using our services.",
    kh: "តាមរយៈការបង្កើតគណនី ការកក់ជាងជួសជុល ឬការចុះឈ្មោះជាជាងជំនាញអាជីពនៅលើ Cheang អ្នកយល់ព្រមអនុលោមតាម និងភ្ជាប់ខ្លួនទៅនឹងលក្ខខណ្ឌសេវាកម្មទាំងនេះ។ ប្រសិនបើអ្នកមិនយល់ព្រមទេ អ្នកត្រូវតែបញ្ឈប់ការប្រើប្រាស់សេវាកម្មរបស់យើងជាបន្ទាន់។"
  },
  agreeCallout: {
    en: "These terms represent a legally binding agreement between you and Cheang regarding your access to and use of our digital platform.",
    kh: "លក្ខខណ្ឌទាំងនេះតំណាងឱ្យកិច្ចព្រមព្រៀងស្របច្បាប់រវាងអ្នក និង Cheang ទាក់ទងនឹងការចូលប្រើប្រាស់ និងការប្រើប្រាស់ប្រព័ន្ធឌីជីថលរបស់យើង។"
  },

  servicesTitle: { en: "2. Platform Services & Bookings", kh: "២. សេវាកម្មនៅលើប្រព័ន្ធ និងការកក់" },
  servicesDesc: {
    en: "Cheang is an online marketplace connecting clients (homeowners/businesses) with local service professionals (handymen, plumbers, electricians, renovators). Please note that:",
    kh: "Cheang គឺជាទីផ្សារអនឡាញដែលភ្ជាប់ទំនាក់ទំនងអតិថិជន (ម្ចាស់ផ្ទះ/អាជីវកម្ម) ជាមួយជាងជំនាញក្នុងស្រុក (ជាងជួសជុល ជាងទឹក ជាងភ្លើង ជាងកែលម្អផ្ទះ)។ សូមចំណាំថា៖"
  },
  servicesBullet1: {
    en: "Bookings: Cheang lists verified professionals, but any booking agreement is a direct contract strictly between the homeowner and the service provider.",
    kh: "ការកក់ទុក៖ Cheang បង្ហាញបញ្ជីឈ្មោះជាងជំនាញដែលបានបញ្ជាក់ ប៉ុន្តែកិច្ចព្រមព្រៀងកក់ទុកណាមួយគឺជាកិច្ចសន្យាផ្ទាល់រវាងម្ចាស់ផ្ទះ និងជាងជំនាញតែប៉ុណ្ណោះ។"
  },
  servicesBullet2: {
    en: "Estimates: Project scopes, materials needed, and completion hours should be discussed and agreed upon via chat or call prior to beginning repairs.",
    kh: "ការប៉ាន់ស្មាន៖ វិសាលភាពការងារ សម្ភារៈដែលត្រូវការ និងម៉ោងបញ្ចប់ការងារគួរតែត្រូវបានពិភាក្សា និងព្រមព្រៀងគ្នាតាមរយៈការជជែក ឬការហៅទូរស័ព្ទមុនពេលចាប់ផ្តើមជួសជុល។"
  },

  conductTitle: { en: "3. Service Provider Conduct", kh: "៣. ក្រមសីលធម៌របស់អ្នកផ្តល់សេវាកម្ម" },
  conductDesc: {
    en: "Professional service providers registered on Cheang ('Become Pro') must maintain high service standards:",
    kh: "អ្នកផ្តល់សេវាកម្មអាជីពដែលបានចុះឈ្មោះនៅលើ Cheang ('ក្លាយជា Pro') ត្រូវតែរក្សាស្តង់ដារសេវាកម្មខ្ពស់៖"
  },
  conductBullet1: {
    en: "Provide honest, accurate descriptions of credentials, business licenses, skills, and province/city service limits.",
    kh: "ផ្តល់ការពិពណ៌នាដោយស្មោះត្រង់ និងត្រឹមត្រូវអំពីលក្ខណៈសម្បត្តិ អាជ្ញាប័ណ្ណអាជីវកម្ម ជំនាញ និងដែនកំណត់សេវាកម្មខេត្ត/ក្រុង។"
  },
  conductBullet2: {
    en: "Be respectful, arrive on time for scheduled bookings, and deliver high-quality craftsmanship.",
    kh: "មានការគោរព មកដល់ទាន់ពេលវេលាសម្រាប់ការកក់ទុក និងផ្តល់នូវសេវាកម្មដែលមានគុណភាពខ្ពស់។"
  },
  conductBullet3: {
    en: "Refrain from seeking off-platform transactions to bypass reviews or platform safety guidelines.",
    kh: "ចៀសវាងការស្វែងរកការទូទាត់ក្រៅប្រព័ន្ធ ដើម្បីគេចវេសពីការវាយតម្លៃ ឬគោលការណ៍ណែនាំសុវត្ថិភាពរបស់ប្រព័ន្ធ។"
  },

  paymentsTitle: { en: "4. Payments & Fees", kh: "៤. ការទូទាត់ និងថ្លៃសេវា" },
  paymentsDesc: {
    en: "Pricing transparency is critical. Currently, the rules are defined as follows:",
    kh: "តម្លាភាពតម្លៃគឺមានសារៈសំខាន់ណាស់។ បច្ចុប្បន្ន ច្បាប់ត្រូវបានកំណត់ដូចខាងក្រោម៖"
  },
  paymentsBullet1: {
    en: "Free to Browse: Homeowners can search and contact handymen completely free of charge.",
    kh: "ស្វែងរកឥតគិតថ្លៃ៖ ម្ចាស់ផ្ទះអាចស្វែងរក និងទាក់ទងជាងជំនាញដោយមិនគិតថ្លៃសេវាឡើយ។"
  },
  paymentsBullet2: {
    en: "Direct Payments: All payments for completed repair services must be paid directly to the handyman as agreed, using cash or ABA Bank transfer.",
    kh: "ការទូទាត់ផ្ទាល់៖ ការទូទាត់ទាំងអស់សម្រាប់សេវាជួសជុលដែលបានបញ្ចប់ ត្រូវតែបង់ផ្ទាល់ទៅជាងជំនាញតាមការព្រមព្រៀង តាមរយៈសាច់ប្រាក់ ឬការផ្ទេរប្រាក់តាមធនាគារ ABA។"
  },
  paymentsBullet3: {
    en: "Pro Commissions: Standard registration for handymen is currently free. Future service fees will be detailed in advance.",
    kh: "កម្រៃជើងសារ Pro៖ ការចុះឈ្មោះស្តង់ដារសម្រាប់ជាងជំនាញបច្ចុប្បន្នគឺឥតគិតថ្លៃ។ ថ្លៃសេវានាពេលអនាគតនឹងត្រូវផ្តល់ជូនព័ត៌មានលម្អិតជាមុន។"
  },

  disputesTitle: { en: "5. Dispute Resolution", kh: "៥. ការដោះស្រាយវិវាទ" },
  disputesDesc1: {
    en: "If a dispute arises between a homeowner and a provider regarding payment or repair quality, both parties are encouraged to attempt resolution through respectful communication.",
    kh: "ប្រសិនបើមានវិវាទកើតឡើងរវាងម្ចាស់ផ្ទះ និងជាងជំនាញទាក់ទងនឹងការទូទាត់ ឬគុណភាពជួសជុល ភាគីទាំងសងខាងត្រូវបានលើកទឹកចិត្តឱ្យព្យាយាមដោះស្រាយតាមរយៈការប្រាស្រ័យទាក់ទងគ្នាប្រកបដោយការគោរព។"
  },
  disputesDesc2: {
    en: "If mediation fails, users can submit details to support@cheang.com. Cheang reserves the right to review chat histories registered on our platform and suspend accounts violating community safety standards.",
    kh: "ប្រសិនបើការសម្របសម្រួលបរាជ័យ អ្នកប្រើប្រាស់អាចផ្ញើព័ត៌មានលម្អិតទៅ support@cheang.com។ Cheang រក្សាសិទ្ធិក្នុងការត្រួតពិនិត្យប្រវត្តិនៃការសន្ទនាដែលបានចុះឈ្មោះនៅលើប្រព័ន្ធ និងផ្អាកគណនីដែលល្មើសនឹងស្តង់ដារសុវត្ថិភាពសហគមន៍។"
  },

  liabilityTitle: { en: "6. Limitation of Liability", kh: "៦. កម្រិតនៃការទទួលខុសត្រូវ" },
  liabilityDesc: {
    en: "Cheang provides the directory and booking facilitation on an 'as is' basis. We are not liable for:",
    kh: "Cheang ផ្តល់ជូននូវបញ្ជីឈ្មោះ និងការសម្របសម្រួលការកក់ដោយផ្អែកលើមូលដ្ឋាន 'តាមការជាក់ស្តែង'។ យើងមិនទទួលខុសត្រូវចំពោះ៖"
  },
  liabilityBullet1: {
    en: "Any damage to property, theft, personal injury, or financial loss resulting from services provided by independent handymen booked through our platform.",
    kh: "រាល់ការខូចខាតទ្រព្យសម្បត្តិ ការលួច របួសផ្ទាល់ខ្លួន ឬការបាត់បង់ហិរញ្ញវត្ថុដែលបណ្តាលមកពីសេវាកម្មដែលផ្តល់ដោយជាងជំនាញឯករាជ្យដែលបានកក់តាមរយៈប្រព័ន្ធរបស់យើង។"
  },
  liabilityBullet2: {
    en: "The accuracy of reviews, provider profile details, or province work licenses.",
    kh: "ភាពត្រឹមត្រូវនៃការវាយតម្លៃ ព័ត៌មានលម្អិតនៃប្រវត្តិរូបជាងជំនាញ ឬអាជ្ញាប័ណ្ណការងារខេត្ត។"
  },

  terminationTitleDesc: { en: "7. Account Suspension & Termination", kh: "៧. ការផ្អាក និងការបញ្ឈប់គណនី" },
  terminationDescText: {
    en: "Cheang reserves the right to suspend or terminate accounts (both client and professional provider profiles) without warning in the event of platform violations, fraud, abusive behavior, repetitive late cancellations, or safety hazards.",
    kh: "Cheang រក្សាសិទ្ធិក្នុងការផ្អាក ឬបញ្ឈប់គណនី (ទាំងគណនីអតិថិជន និងគណនីជាងជំនាញ) ដោយមិនបាច់ជូនដំណឹងជាមុន ក្នុងករណីមានការល្មើសគោលការណ៍ ការបោកប្រាស់ ឥរិយាបថបំពាន ការលុបចោលការកក់យឺតយ៉ាវដដែលៗ ឬបង្កហានិភ័យសុវត្ថិភាព។"
  }
};

const TermsPage = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("s1");

  const getTranslation = (key) => {
    return translations[key]?.[language] || translations[key]?.en || "";
  };

  const sections = ["s1", "s2", "s3", "s4", "s5", "s6", "s7"];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AppLayout page="terms">
      <div className={`legal-page-container ${theme} ${language}`}>
        {/* Hero Banner Section */}
        <section className="legal-hero">
          <div className="hero-content">
            <h1>
              <span>{getTranslation("heroTitle")}</span>
            </h1>
            <p>{getTranslation("heroSubtitle")}</p>
          </div>
        </section>

        {/* Content Wrapper */}
        <div className="legal-content-wrapper">
          <div className="legal-split-section">
            {/* Left Sidebar Table of Contents */}
            <aside className="legal-sidebar">
              <h3 className="toc-title">{getTranslation("tocTitle")}</h3>
              <ul className="toc-list">
                {sections.map((sec) => (
                  <li key={sec}>
                    <button
                      onClick={() => scrollToSection(sec)}
                      className={`toc-link ${activeSection === sec ? "active" : ""}`}
                    >
                      {getTranslation(sec)}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Right Side Text Content Body */}
            <main className="legal-body">
              {/* 1. Agreement to Terms */}
              <section id="s1" className="legal-section">
                <h2>{getTranslation("agreeTitle")}</h2>
                <p>{getTranslation("agreeDesc")}</p>
                <div className="callout-box">
                  <p>{getTranslation("agreeCallout")}</p>
                </div>
              </section>

              {/* 2. Platform Services & Bookings */}
              <section id="s2" className="legal-section">
                <h2>{getTranslation("servicesTitle")}</h2>
                <p>{getTranslation("servicesDesc")}</p>
                <ul>
                  <li>{getTranslation("servicesBullet1")}</li>
                  <li>{getTranslation("servicesBullet2")}</li>
                </ul>
              </section>

              {/* 3. Service Provider Conduct */}
              <section id="s3" className="legal-section">
                <h2>{getTranslation("conductTitle")}</h2>
                <p>{getTranslation("conductDesc")}</p>
                <ul>
                  <li><strong>{language === "kh" ? "ព័ត៌មានត្រឹមត្រូវ៖ " : "Accuracy: "}</strong>{getTranslation("conductBullet1")}</li>
                  <li><strong>{language === "kh" ? "វិជ្ជាជីវៈ៖ " : "Professionalism: "}</strong>{getTranslation("conductBullet2")}</li>
                  <li><strong>{language === "kh" ? "ក្រៅប្រព័ន្ធ៖ " : "Off-platform: "}</strong>{getTranslation("conductBullet3")}</li>
                </ul>
              </section>

              {/* 4. Payments & Fees */}
              <section id="s4" className="legal-section">
                <h2>{getTranslation("paymentsTitle")}</h2>
                <p>{getTranslation("paymentsDesc")}</p>
                <ul>
                  <li>{getTranslation("paymentsBullet1")}</li>
                  <li>{getTranslation("paymentsBullet2")}</li>
                  <li>{getTranslation("paymentsBullet3")}</li>
                </ul>
              </section>

              {/* 5. Dispute Resolution */}
              <section id="s5" className="legal-section">
                <h2>{getTranslation("disputesTitle")}</h2>
                <p>{getTranslation("disputesDesc1")}</p>
                <div className="callout-box">
                  <p>{getTranslation("disputesDesc2")}</p>
                </div>
              </section>

              {/* 6. Limitation of Liability */}
              <section id="s6" className="legal-section">
                <h2>{getTranslation("liabilityTitle")}</h2>
                <p>{getTranslation("liabilityDesc")}</p>
                <ul>
                  <li>{getTranslation("liabilityBullet1")}</li>
                  <li>{getTranslation("liabilityBullet2")}</li>
                </ul>
              </section>

              {/* 7. Termination of Account */}
              <section id="s7" className="legal-section">
                <h2>{getTranslation("terminationTitleDesc")}</h2>
                <p>{getTranslation("terminationDescText")}</p>
              </section>
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TermsPage;
