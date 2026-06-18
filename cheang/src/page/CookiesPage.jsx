import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import "./LegalPage.scss";

// Localized translations for Cookie Policy
const translations = {
  heroTitle: { en: "Cookie Policy", kh: "គោលការណ៍ឃុកឃី" },
  heroSubtitle: { 
    en: "Last Updated: June 18, 2026. Discover how and why Cheang uses cookies to optimize your marketplace experience.", 
    kh: "បច្ចុប្បន្នភាពចុងក្រោយ៖ ១៨ មិថុនា ២០២៦។ ស្វែងយល់ពីរបៀប និងហេតុផលដែល Cheang ប្រើប្រាស់ឃុកឃី ដើម្បីកែលម្អបទពិសោធន៍របស់អ្នក។" 
  },
  tocTitle: { en: "Sections", kh: "មាតិកា" },
  
  // Section Navigation Links
  s1: { en: "1. What Are Cookies?", kh: "១. តើឃុកឃីជាអ្វី?" },
  s2: { en: "2. How We Use Cookies", kh: "២. របៀបដែលយើងប្រើឃុកឃី" },
  s3: { en: "3. Essential Cookies", kh: "៣. ឃុកឃីចាំបាច់" },
  s4: { en: "4. Performance & Analytics", kh: "៤. ការអនុវត្ត និងការវិភាគ" },
  s5: { en: "5. Managing Cookie Choices", kh: "៥. ការគ្រប់គ្រងជម្រើសឃុកឃី" },
  s6: { en: "6. Updates to Policy", kh: "៦. បច្ចុប្បន្នភាពគោលការណ៍" },

  // Content Paragraphs
  whatTitle: { en: "1. What Are Cookies?", kh: "១. តើឃុកឃីជាអ្វី?" },
  whatDesc: {
    en: "Cookies are small text files stored on your computer, tablet, or mobile phone when you visit digital websites. They help the platform recognize your browser, save your interface configurations, and authenticate logins.",
    kh: "ឃុកឃី (Cookies) គឺជាឯកសារអត្ថបទតូចៗដែលរក្សាទុកនៅលើកុំព្យូទ័រ ថេប្លេត ឬទូរស័ព្ទដៃរបស់អ្នក នៅពេលអ្នកចូលទៅកាន់គេហទំព័រ។ ពួកវាជួយប្រព័ន្ធឱ្យសម្គាល់កម្មវិធីរុករករបស់អ្នក រក្សាទុកការកំណត់ផ្ទៃកម្មវិធី និងផ្ទៀងផ្ទាត់ការចូលគណនីរបស់អ្នក។"
  },
  whatCallout: {
    en: "Cookies can be 'persistent' (remaining on your device until they expire or are cleared) or 'session' cookies (which delete immediately once you close your browser).",
    kh: "ឃុកឃីអាចជា 'ឃុកឃីជាប់រហូត' (រក្សាទុកនៅលើឧបករណ៍របស់អ្នករហូតដល់វាហួសកំណត់ ឬត្រូវបានលុបចោល) ឬ 'ឃុកឃីតាមវគ្គ' (ដែលលុបភ្លាមៗនៅពេលអ្នកបិទកម្មវិធីរុករករបស់អ្នក)។"
  },

  howTitle: { en: "2. How We Use Cookies", kh: "២. របៀបដែលយើងប្រើឃុកឃី" },
  howDesc: {
    en: "We use cookies to secure the login state, remember your active language preferences (English vs. Khmer), customize dark/light themes, and track usage trends to improve marketplace performance in Cambodia.",
    kh: "យើងប្រើឃុកឃីដើម្បីរក្សាស្ថានភាពចូលគណនីប្រកបដោយសុវត្ថិភាព ចងចាំភាសាដែលអ្នកជ្រើសរើស (អង់គ្លេស ឬខ្មែរ) កែសម្រួលស្បែកងងឹត/ភ្លឺ និងតាមដាននិន្នាការប្រើប្រាស់ដើម្បីកែលម្អការអនុវត្តទីផ្សាររបស់យើងនៅក្នុងប្រទេសកម្ពុជា។"
  },

  essentialTitle: { en: "3. Essential Cookies", kh: "៣. ឃុកឃីចាំបាច់" },
  essentialDesc: {
    en: "These cookies are strictly required to navigate the platform, load custom pages, and secure user states. Without these cookies, basic platform operations like signing in or submitting upgrade requests ('Become Pro') would fail.",
    kh: "ឃុកឃីទាំងនេះគឺចាំបាច់បំផុតដើម្បីរុករកប្រព័ន្ធ ទាញយកទំព័រផ្សេងៗ និងធានាសុវត្ថិភាពគណនី។ បើគ្មានឃុកឃីទាំងនេះទេ ប្រតិបត្តិការមូលដ្ឋានរបស់ប្រព័ន្ធ ដូចជាការចូលគណនី ឬការផ្ញើសំណើដំឡើងគណនី ('ក្លាយជា Pro') នឹងមិនអាចដំណើរការបានទេ។"
  },

  analyticsTitle: { en: "4. Performance & Analytics Cookies", kh: "៤. ឃុកឃីសម្រាប់ដំណើរការ និងការវិភាគ" },
  analyticsDesc: {
    en: "These tracking items allow us to understand how users interact with Cheang. We log metrics like page traffic, search words, duration of stay, and errors to optimize interface layouts and responsiveness.",
    kh: "ឃុកឃីទាំងនេះអនុញ្ញាតឱ្យយើងស្វែងយល់ពីរបៀបដែលអ្នកប្រើប្រាស់ធ្វើអន្តរកម្មជាមួយ Cheang។ យើងកត់ត្រារង្វាស់នានា ដូចជាចរាចរណ៍ទំព័រ ពាក្យស្វែងរក រយៈពេលចូលមើល និងកំហុសនានា ដើម្បីបង្កើនល្បឿន និងភាពឆ្លើយតបនៃផ្ទៃកម្មវិធី។"
  },

  managingTitle: { en: "5. Managing Cookie Choices", kh: "៥. ការគ្រប់គ្រងជម្រើសឃុកឃី" },
  managingDesc: {
    en: "Most browsers automatically accept cookies by default. You can adjust your browser settings to warn you before accepting cookies, block third-party cookies, or clear existing cookies. Please note that disabling essential cookies may impact platform features.",
    kh: "កម្មវិធីរុករកភាគច្រើនទទួលយកឃុកឃីដោយស្វ័យប្រវត្តិតាមលំនាំដើម។ អ្នកអាចកែតម្រូវការកំណត់កម្មវិធីរុករករបស់អ្នកដើម្បីដាស់តឿនអ្នកមុនពេលទទួលយកឃុកឃី រារាំងឃុកឃីភាគីទីបី ឬលុបឃុកឃីដែលមានស្រាប់។ សូមចំណាំថាការបិទឃុកឃីចាំបាច់អាចប៉ះពាល់ដល់មុខងាររបស់ប្រព័ន្ធ។"
  },
  managingCallout: {
    en: "To modify your choices, look under the 'Privacy and Security' menu in your Chrome, Safari, Firefox, or Edge browser settings.",
    kh: "ដើម្បីកែប្រែជម្រើសរបស់អ្នក សូមចូលទៅកាន់ម៉ឺនុយ 'ឯកជនភាព និងសុវត្ថិភាព' (Privacy and Security) នៅក្នុងការកំណត់កម្មវិធីរុករករបស់អ្នក។"
  },

  updatesTitleDesc: { en: "6. Updates to this Policy", kh: "៦. ការធ្វើបច្ចុប្បន្នភាពគោលការណ៍" },
  updatesDescText: {
    en: "We may update this Cookie Policy from time to time to match system changes or compliance standards. Any updates will be marked by an updated date at the top of the page.",
    kh: "យើងអាចធ្វើបច្ចុប្បន្នភាពគោលការណ៍ឃុកឃីនេះពីពេលមួយទៅពេលមួយ ដើម្បីឱ្យស្របទៅនឹងការផ្លាស់ប្តូរប្រព័ន្ធ ឬស្តង់ដារអនុលោមភាព។ រាល់បច្ចុប្បន្នភាពនឹងត្រូវបានបង្ហាញដោយកាលបរិច្ឆេទធ្វើបច្ចុប្បន្នភាពនៅផ្នែកខាងលើនៃទំព័រ។"
  }
};

const CookiesPage = () => {
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
    <AppLayout page="cookies">
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
              {/* 1. What Are Cookies? */}
              <section id="s1" className="legal-section">
                <h2>{getTranslation("whatTitle")}</h2>
                <p>{getTranslation("whatDesc")}</p>
                <div className="callout-box">
                  <p>{getTranslation("whatCallout")}</p>
                </div>
              </section>

              {/* 2. How We Use Cookies */}
              <section id="s2" className="legal-section">
                <h2>{getTranslation("howTitle")}</h2>
                <p>{getTranslation("howDesc")}</p>
              </section>

              {/* 3. Essential Cookies */}
              <section id="s3" className="legal-section">
                <h2>{getTranslation("essentialTitle")}</h2>
                <p>{getTranslation("essentialDesc")}</p>
              </section>

              {/* 4. Performance & Analytics */}
              <section id="s4" className="legal-section">
                <h2>{getTranslation("analyticsTitle")}</h2>
                <p>{getTranslation("analyticsDesc")}</p>
              </section>

              {/* 5. Managing Cookie Choices */}
              <section id="s5" className="legal-section">
                <h2>{getTranslation("managingTitle")}</h2>
                <p>{getTranslation("managingDesc")}</p>
                <div className="callout-box">
                  <p>{getTranslation("managingCallout")}</p>
                </div>
              </section>

              {/* 6. Updates to Policy */}
              <section id="s6" className="legal-section">
                <h2>{getTranslation("updatesTitleDesc")}</h2>
                <p>{getTranslation("updatesDescText")}</p>
              </section>
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CookiesPage;
