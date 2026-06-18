import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import "./LegalPage.scss";

// Localized translations for Cancellation Policy
const translations = {
  heroTitle: { en: "Cancellation Policy", kh: "គោលការណ៍លុបចោល" },
  heroSubtitle: { 
    en: "Last Updated: June 18, 2026. Understand rules regarding booking cancellations, rescheduling, and associated penalties on Cheang.", 
    kh: "បច្ចុប្បន្នភាពចុងក្រោយ៖ ១៨ មិថុនា ២០២៦។ ស្វែងយល់ពីច្បាប់ទាក់ទងនឹងការលុបចោលការកក់ ការផ្លាស់ប្តូរពេលវេលា និងពិន័យពាក់ព័ន្ធនៅលើ Cheang។" 
  },
  tocTitle: { en: "Sections", kh: "មាតិកា" },
  
  // Section Navigation Links
  s1: { en: "1. Policy Overview", kh: "១. ទិដ្ឋភាពទូទៅនៃគោលការណ៍" },
  s2: { en: "2. Client Cancellation Rules", kh: "២. ច្បាប់លុបចោលសម្រាប់អតិថិជន" },
  s3: { en: "3. Provider Cancellation Rules", kh: "៣. ច្បាប់លុបចោលសម្រាប់ជាងជំនាញ" },
  s4: { en: "4. Disputes & Mediations", kh: "៤. វិវាទ និងការសម្របសម្រួល" },
  s5: { en: "5. Abuse Penalties", kh: "៥. ពិន័យការរំលោភបំពាន" },
  s6: { en: "6. Get Support", kh: "៦. ជំនួយការគាំទ្រ" },

  // Content Paragraphs
  overviewTitle: { en: "1. Policy Overview", kh: "១. ទិដ្ឋភាពទូទៅនៃគោលការណ៍" },
  overviewDesc: {
    en: "To maintain a reliable and secure environment for both homeowners (clients) and local specialists (providers) in Cambodia, Cheang establishes this Cancellation Policy. We encourage active, transparent communication to resolve scheduling conflicts.",
    kh: "ដើម្បីរក្សាបរិយាកាសដែលអាចទុកចិត្តបាន និងមានសុវត្ថិភាពសម្រាប់ទាំងម្ចាស់ផ្ទះ (អតិថិជន) និងជាងជំនាញជួសជុលក្នុងស្រុកនៅក្នុងប្រទេសកម្ពុជា Cheang បង្កើតគោលការណ៍លុបចោលនេះ។ យើងលើកទឹកចិត្តឱ្យមានទំនាក់ទំនងសកម្ម និងច្បាស់លាស់ដើម្បីដោះស្រាយទំនាស់កាលវិភាគ។"
  },
  overviewCallout: {
    en: "Cancellations impact the schedule and income of local workers. Please only cancel bookings when absolutely necessary, and provide as much notice as possible.",
    kh: "ការលុបចោលប៉ះពាល់ដល់កាលវិភាគ និងប្រាក់ចំណូលរបស់ជាងជំនាញក្នុងស្រុក។ សូមលុបចោលការកក់ទុកនៅពេលចាំបាច់បំផុតប៉ុណ្ណោះ ហើយផ្តល់ដំណឹងឱ្យបានឆាប់តាមដែលអាចធ្វើទៅបាន។"
  },

  clientTitle: { en: "2. Client (Homeowner) Cancellation Rules", kh: "២. ច្បាប់លុបចោលសម្រាប់អតិថិជន (ម្ចាស់ផ្ទះ)" },
  clientDesc: {
    en: "If you need to cancel or reschedule a confirmed booking, please follow these guidelines:",
    kh: "ប្រសិនបើអ្នកត្រូវការលុបចោល ឬផ្លាស់ប្តូរពេលវេលាកក់ដែលបានបញ្ជាក់ សូមអនុវត្តតាមគោលការណ៍ណែនាំខាងក្រោម៖"
  },
  clientBullet1: {
    en: "Notice Window: Cancel or request a reschedule at least 12 hours prior to the scheduled booking window.",
    kh: "រយៈពេលជូនដំណឹង៖ លុបចោល ឬស្នើសុំប្តូរពេលវេលាយ៉ាងហោចណាស់ ១២ ម៉ោង មុនម៉ោងកក់ដែលបានកំណត់។"
  },
  clientBullet2: {
    en: "Late Cancellation: Cancellations made less than 3 hours before the scheduled arrival may result in a negative rating review from the provider.",
    kh: "ការលុបចោលយឺតយ៉ាវ៖ ការលុបចោលដែលធ្វើឡើងតិចជាង ៣ ម៉ោង មុនពេលជាងមកដល់ អាចបណ្តាលឱ្យទទួលបានការវាយតម្លៃអវិជ្ជមានពីជាងជំនាញ។"
  },
  clientBullet3: {
    en: "Communication: Always message the handyman directly via our platform chat system or telephone to explain the reason for the cancellation.",
    kh: "ការប្រាស្រ័យទាក់ទង៖ ត្រូវផ្ញើសារទៅជាងជំនាញដោយផ្ទាល់ជានិច្ចតាមរយៈប្រព័ន្ធជជែកកំសាន្ត ឬទូរស័ព្ទ ដើម្បីពន្យល់ពីមូលហេតុនៃការលុបចោល។"
  },

  providerTitle: { en: "3. Professional Provider (Handyman) Cancellation Rules", kh: "៣. ច្បាប់លុបចោលសម្រាប់អ្នកផ្តល់សេវាកម្មអាជីព (ជាងជំនាញ)" },
  providerDesc: {
    en: "Service providers must respect confirmed service appointments. Cancellations damage client trust and the platform's reliability:",
    kh: "អ្នកផ្តល់សេវាកម្មត្រូវតែគោរពការណាត់ជួបសេវាកម្មដែលបានបញ្ជាក់។ ការលុបចោលធ្វើឱ្យខូចទំនុកចិត្តអតិថិជន និងភាពជឿជាក់របស់ប្រព័ន្ធ៖"
  },
  providerBullet1: {
    en: "Handymen should cancel bookings only under emergency conditions, providing at least 12 hours of advanced notice.",
    kh: "ជាងជំនាញគួរតែលុបចោលការកក់ទុកតែក្នុងករណីអាសន្នប៉ុណ្ណោះ ដោយផ្តល់ដំណឹងជាមុនយ៉ាងតិច ១២ ម៉ោង។"
  },
  providerBullet2: {
    en: "Cancellations made less than 12 hours in advance must be followed by a message or call to the client explaining the situation.",
    kh: "ការលុបចោលដែលធ្វើឡើងតិចជាង ១២ ម៉ោងជាមុន ត្រូវតែផ្ញើសារ ឬទូរស័ព្ទទៅអតិថិជនដើម្បីពន្យល់ពីស្ថានភាពជាក់ស្តែង។"
  },

  disputeTitle: { en: "4. Disputes & Rescheduling Mediations", kh: "៤. វិវាទ និងការសម្របសម្រួលប្តូរពេលវេលា" },
  disputeDesc1: {
    en: "Cheang does not collect booking deposit fees on behalf of standard users. Any deposit agreements made directly between a homeowner and a handyman are subject to their personal agreements.",
    kh: "Cheang មិនប្រមូលប្រាក់កក់សម្រាប់ការកក់ជំនួសអ្នកប្រើប្រាស់ឡើយ។ រាល់កិច្ចព្រមព្រៀងប្រាក់កក់ដែលធ្វើឡើងដោយផ្ទាល់រវាងម្ចាស់ផ្ទះ និងជាងជំនាញ គឺស្ថិតក្រោមកិច្ចព្រមព្រៀងផ្ទាល់ខ្លួនរបស់ពួកគេ។"
  },
  disputeDesc2: {
    en: "If a dispute arises (e.g. deposit refunds after cancellation), users can email support@cheang.com with chat records. We will review details to assist in mediation.",
    kh: "ប្រសិនបើមានវិវាទកើតឡើង (ឧទាហរណ៍ ការបង្វិលប្រាក់កក់វិញបន្ទាប់ពីការលុបចោល) អ្នកប្រើប្រាស់អាចផ្ញើអ៊ីមែលមក support@cheang.com រួមជាមួយកំណត់ត្រាសន្ទនា។ យើងនឹងពិនិត្យព័ត៌មានលម្អិតដើម្បីជួយសម្របសម្រួល។"
  },

  abuseTitle: { en: "5. Abuse and Penalties", kh: "៥. ការរំលោភបំពាន និងការផាកពិន័យ" },
  abuseDesc: {
    en: "To protect community integrity, Cheang tracks repetitive cancellation actions. The following penalties apply:",
    kh: "ដើម្បីការពារសុចរិតភាពសហគមន៍ Cheang តាមដានសកម្មភាពលុបចោលដែលកើតឡើងដដែលៗ។ ការផាកពិន័យខាងក្រោមនឹងត្រូវអនុវត្ត៖"
  },
  abuseBullet1: {
    en: "Handymen who cancel confirmed bookings more than 3 times a month without valid explanations will have their 'Pro status' suspended for 30 days.",
    kh: "ជាងជំនាញដែលលុបចោលការកក់ដែលបានបញ្ជាក់ច្រើនជាង ៣ ដងក្នុងមួយខែ ដោយគ្មានការពន្យល់សមស្រប នឹងត្រូវព្យួរ 'ស្ថានភាព Pro' រយៈពេល ៣០ ថ្ងៃ។"
  },
  abuseBullet2: {
    en: "Clients with continuous late-cancellation activities will face temporary booking limitations or account blocks.",
    kh: "អតិថិជនដែលមានសកម្មភាពលុបចោលការកក់យឺតយ៉ាវជាបន្តបន្ទាប់ នឹងប្រឈមមុខនឹងការកម្រិតការកក់ជាបណ្តោះអាសន្ន ឬការបិទគណនី។"
  },

  supportTitleDesc: { en: "6. Contact Customer Support", kh: "៦. ទាក់ទងផ្នែកគាំទ្រអតិថិជន" },
  supportDescText: {
    en: "If you have experienced an issue with a handyman canceling last minute, or if you need assistance rescheduling a booking due to emergency conditions, feel free to contact our support desk.",
    kh: "ប្រសិនបើអ្នកជួបបញ្ហាទាក់ទងនឹងជាងជំនាញលុបចោលការកក់នៅនាទីចុងក្រោយ ឬត្រូវការជំនួយក្នុងការផ្លាស់ប្តូរពេលវេលាកក់ដោយសារស្ថានភាពអាសន្ន សូមទាក់ទងមកផ្នែកគាំទ្ររបស់យើង។"
  },
  supportBulletMail: { en: "Support Email: support@cheang.com", kh: "អ៊ីមែលគាំទ្រ៖ support@cheang.com" },
  supportBulletPhone: { en: "Direct Support Hotline: +855 12 345 678", kh: "ទូរស័ព្ទគាំទ្រផ្ទាល់៖ +855 ១២ ៣៤៥ ៦៧៨" }
};

const CancellationPage = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("s1");

  const getTranslation = (key) => {
    return translations[key]?.[language] || translations[key]?.en || "";
  };

  const sections = ["s1", "s2", "s3", "s4", "s5", "s6"];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AppLayout page="cancellation">
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
              {/* 1. Policy Overview */}
              <section id="s1" className="legal-section">
                <h2>{getTranslation("overviewTitle")}</h2>
                <p>{getTranslation("overviewDesc")}</p>
                <div className="callout-box">
                  <p>{getTranslation("overviewCallout")}</p>
                </div>
              </section>

              {/* 2. Client Cancellation Rules */}
              <section id="s2" className="legal-section">
                <h2>{getTranslation("clientTitle")}</h2>
                <p>{getTranslation("clientDesc")}</p>
                <ul>
                  <li><strong>{language === "kh" ? "រយៈពេលជូនដំណឹង៖ " : "Notice window: "}</strong>{getTranslation("clientBullet1")}</li>
                  <li><strong>{language === "kh" ? "ការលុបចោលយឺតយ៉ាវ៖ " : "Late notice: "}</strong>{getTranslation("clientBullet2")}</li>
                  <li><strong>{language === "kh" ? "ការប្រាស្រ័យទាក់ទង៖ " : "Communication: "}</strong>{getTranslation("clientBullet3")}</li>
                </ul>
              </section>

              {/* 3. Provider Cancellation Rules */}
              <section id="s3" className="legal-section">
                <h2>{getTranslation("providerTitle")}</h2>
                <p>{getTranslation("providerDesc")}</p>
                <ul>
                  <li><strong>{language === "kh" ? "លក្ខខណ្ឌអាសន្ន៖ " : "Emergencies: "}</strong>{getTranslation("providerBullet1")}</li>
                  <li><strong>{language === "kh" ? "ការជូនដំណឹង៖ " : "Late notification: "}</strong>{getTranslation("providerBullet2")}</li>
                </ul>
              </section>

              {/* 4. Disputes & Rescheduling */}
              <section id="s4" className="legal-section">
                <h2>{getTranslation("disputeTitle")}</h2>
                <p>{getTranslation("disputeDesc1")}</p>
                <div className="callout-box">
                  <p>{getTranslation("disputeDesc2")}</p>
                </div>
              </section>

              {/* 5. Abuse Penalties */}
              <section id="s5" className="legal-section">
                <h2>{getTranslation("abuseTitle")}</h2>
                <p>{getTranslation("abuseDesc")}</p>
                <ul>
                  <li><strong>{language === "kh" ? "ការផាកពិន័យជាងជំនាញ៖ " : "Handyman penalty: "}</strong>{getTranslation("abuseBullet1")}</li>
                  <li><strong>{language === "kh" ? "ការផាកពិន័យអតិថិជន៖ " : "Client penalty: "}</strong>{getTranslation("abuseBullet2")}</li>
                </ul>
              </section>

              {/* 6. Get Support */}
              <section id="s6" className="legal-section">
                <h2>{getTranslation("supportTitleDesc")}</h2>
                <p>{getTranslation("supportDescText")}</p>
                <ul>
                  <li>{getTranslation("supportBulletMail")}</li>
                  <li>{getTranslation("supportBulletPhone")}</li>
                </ul>
              </section>
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CancellationPage;
