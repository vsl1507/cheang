import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import "./LegalPage.scss";

// Localized translations for Privacy Policy
const translations = {
  heroTitle: { en: "Privacy Policy", kh: "គោលការណ៍ឯកជនភាព" },
  heroSubtitle: { 
    en: "Last Updated: June 18, 2026. Learn how Cheang collects, uses, and protects your personal data.", 
    kh: "បច្ចុប្បន្នភាពចុងក្រោយ៖ ១៨ មិថុនា ២០២៦។ ស្វែងយល់ពីរបៀបដែល Cheang ប្រមូល ប្រើប្រាស់ និងការពារទិន្នន័យរបស់អ្នក។" 
  },
  tocTitle: { en: "Sections", kh: "មាតិកា" },
  
  // Section Navigation Links
  s1: { en: "1. Introduction", kh: "១. សេចក្តីផ្តើម" },
  s2: { en: "2. Information We Collect", kh: "២. ព័ត៌មានដែលយើងប្រមូល" },
  s3: { en: "3. How We Use Information", kh: "៣. របៀបដែលយើងប្រើព័ត៌មាន" },
  s4: { en: "4. Sharing Your Data", kh: "៤. ការចែករំលែកទិន្នន័យ" },
  s5: { en: "5. Data Security", kh: "៥. សុវត្ថិភាពទិន្នន័យ" },
  s6: { en: "6. Your Legal Rights", kh: "៦. សិទ្ធិស្របច្បាប់របស់អ្នក" },
  s7: { en: "7. Contact & Support", kh: "៧. ព័ត៌មានទំនាក់ទំនង" },

  // Content Paragraphs
  introTitle: { en: "1. Introduction", kh: "១. សេចក្តីផ្តើម" },
  introDesc: {
    en: "At Cheang, we value your privacy. This Privacy Policy describes how we collect, store, and share your personal information when you use our website, mobile application, and digital marketplace to book local repair specialists or register as a professional service provider in Cambodia.",
    kh: "នៅ Cheang យើងឲ្យតម្លៃលើឯកជនភាពរបស់អ្នក។ គោលការណ៍ឯកជនភាពនេះរៀបរាប់ពីរបៀបដែលយើងប្រមូល រក្សាទុក និងចែករំលែកព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក នៅពេលអ្នកប្រើប្រាស់គេហទំព័រ កម្មវិធីទូរស័ព្ទ និងទីផ្សារឌីជីថលរបស់យើង ដើម្បីកក់ជាងជំនាញជួសជុល ឬចុះឈ្មោះជាអ្នកផ្តល់សេវាកម្មអាជីពនៅក្នុងប្រទេសកម្ពុជា។"
  },
  introCallout: {
    en: "By accessing or using Cheang, you agree to the collection and use of information in accordance with this Privacy Policy.",
    kh: "តាមរយៈការចូលប្រើប្រាស់ ឬប្រើប្រាស់ Cheang អ្នកយល់ព្រមលើការប្រមូល និងការប្រើប្រាស់ព័ត៌មានស្របតាមគោលការណ៍ឯកជនភាពនេះ។"
  },

  collectTitle: { en: "2. Information We Collect", kh: "២. ព័ត៌មានដែលយើងប្រមូល" },
  collectDesc: {
    en: "We collect information to provide and improve our services, facilitate bookings, and guarantee security. This includes:",
    kh: "យើងប្រមូលព័ត៌មានដើម្បីផ្តល់ និងកែលម្អសេវាកម្មរបស់យើង សម្រួលដល់ការកក់ និងធានាសុវត្ថិភាព។ ព័ត៌មានទាំងនោះរួមមាន៖"
  },
  collectBullet1: {
    en: "Personal Identification: Name, phone number, email address, physical location, and profile photo.",
    kh: "ព័ត៌មានផ្ទាល់ខ្លួន៖ ឈ្មោះ លេខទូរស័ព្ទ អាសយដ្ឋានអ៊ីមែល ទីតាំងជាក់ស្តែង និងរូបថតប្រវត្តិរូប។"
  },
  collectBullet2: {
    en: "Account Credentials: Passwords, authentication keys, and service ratings.",
    kh: "ព័ត៌មានគណនី៖ ពាក្យសម្ងាត់ កូនសោផ្ទៀងផ្ទាត់ និងការវាយតម្លៃសេវាកម្ម។"
  },
  collectBullet3: {
    en: "Handyman Pro Details: Business licenses, specialties, location service coverages, and brand descriptions.",
    kh: "ព័ត៌មានលម្អិតជាងជំនាញ៖ អាជ្ញាប័ណ្ណអាជីវកម្ម ជំនាញឯកទេស ទីតាំងគ្របដណ្តប់សេវាកម្ម និងការពិពណ៌នាអំពីម៉ាក។"
  },
  collectBullet4: {
    en: "Usage Data: IP addresses, cookie preferences, browser logs, and transaction details.",
    kh: "ទិន្នន័យប្រើប្រាស់៖ អាសយដ្ឋាន IP ឃុកឃី កំណត់ហេតុកម្មវិធីរុករក និងព័ត៌មានលម្អិតអំពីប្រតិបត្តិការ។"
  },

  usageTitle: { en: "3. How We Use Information", kh: "៣. របៀបដែលយើងប្រើព័ត៌មាន" },
  usageDesc: {
    en: "Your information allows us to customize your booking experience and facilitate secure communications. Specifically, we use data for:",
    kh: "ព័ត៌មានរបស់អ្នកអនុញ្ញាតឱ្យយើងកែលម្អបទពិសោធន៍កក់របស់អ្នក និងសម្របសម្រួលទំនាក់ទំនងប្រកបដោយសុវត្ថិភាព។ ជាពិសេស យើងប្រើទិន្នន័យសម្រាប់៖"
  },
  usageBullet1: {
    en: "Connecting clients with nearby verified handymen based on location searches.",
    kh: "ភ្ជាប់ទំនាក់ទំនងអតិថិជនជាមួយជាងជំនាញដែលបានបញ្ជាក់នៅក្បែរនោះ ផ្អែកលើការស្វែងរកទីតាំង។"
  },
  usageBullet2: {
    en: "Processing registration requests for Professional ('Become Pro') accounts.",
    kh: "ដំណើរការសំណើសុំចុះឈ្មោះគណនីអាជីព ('ក្លាយជាជាងជំនាញ')។"
  },
  usageBullet3: {
    en: "Investigating disputes and reviewing chat history in the event of booking issues.",
    kh: "ស៊ើបអង្កេតវិវាទ និងត្រួតពិនិត្យប្រវត្តិជជែក ក្នុងករណីមានបញ្ហាការកក់ទុក។"
  },
  usageBullet4: {
    en: "Sending account notifications, security alerts, and system updates.",
    kh: "ផ្ញើការជូនដំណឹងគណនី ការដាស់តឿនសុវត្ថិភាព និងការធ្វើបច្ចុប្បន្នភាពប្រព័ន្ធ។"
  },

  sharingTitle: { en: "4. Sharing Your Data", kh: "៤. ការចែករំលែកទិន្នន័យ" },
  sharingDesc1: {
    en: "We do not sell your personal data. To facilitate bookings, we share customer contact information with the chosen handyman, and service provider profiles with users looking for specialists.",
    kh: "យើងមិនលក់ទិន្នន័យផ្ទាល់ខ្លួនរបស់អ្នកទេ។ ដើម្បីសម្រួលដល់ការកក់ យើងចែករំលែកព័ត៌មានទំនាក់ទំនងរបស់អតិថិជនជាមួយជាងជំនាញដែលបានជ្រើសរើស និងចែករំលែកព័ត៌មានរបស់ជាងជំនាញទៅកាន់អតិថិជន។"
  },
  sharingDesc2: {
    en: "We may also disclose information to comply with Cambodian laws, cooperate with authorities, or prevent platform abuse and fraudulent activity.",
    kh: "យើងក៏អាចបង្ហាញព័ត៌មានដើម្បីអនុលោមតាមច្បាប់នៃព្រះរាជាណាចក្រកម្ពុជា សហការជាមួយអាជ្ញាធរ ឬការពារការរំលោភបំពានប្រព័ន្ធ និងសកម្មភាពបោកប្រាស់។"
  },

  securityTitle: { en: "5. Data Security", kh: "៥. សុវត្ថិភាពទិន្នន័យ" },
  securityDesc1: {
    en: "Cheang employs industry-standard encryption protocols (SSL/TLS) to secure all passwords, registration submissions, and messages. However, please remember that no digital storage method is 100% secure.",
    kh: "Cheang ប្រើប្រាស់ពិធីការកូដនីយកម្មតាមស្តង់ដារឧស្សាហកម្ម (SSL/TLS) ដើម្បីការពាររាល់ពាក្យសម្ងាត់ ការចុះឈ្មោះ និងសារ។ ទោះជាយ៉ាងណាក៏ដោយ សូមចងចាំថាគ្មានវិធីសាស្ត្ររក្សាទុកឌីជីថលណាដែលមានសុវត្ថិភាព ១០០% នោះទេ។"
  },
  securityDesc2: {
    en: "We advise you to use a strong, unique password for your account and never share your credentials with third parties.",
    kh: "យើងណែនាំអ្នកឱ្យប្រើពាក្យសម្ងាត់ដែលខ្លាំង និងប្លែកសម្រាប់គណនីរបស់អ្នក ហើយកុំចែករំលែកព័ត៌មានសម្ងាត់ជាមួយភាគីទីបី។"
  },

  rightsTitle: { en: "6. Your Legal Rights", kh: "៦. សិទ្ធិស្របច្បាប់របស់អ្នក" },
  rightsDesc: {
    en: "As a user of our platform, you have the right to control how your personal information is managed:",
    kh: "ក្នុងនាមជាអ្នកប្រើប្រាស់ប្រព័ន្ធរបស់យើង អ្នកមានសិទ្ធិគ្រប់គ្រងរបៀបដែលព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកត្រូវបានចាត់ចែង៖"
  },
  rightsBullet1: {
    en: "Access: Request a copy of the personal information we hold about you.",
    kh: "ការចូលប្រើប្រាស់៖ ស្នើសុំចម្លងព័ត៌មានផ្ទាល់ខ្លួនដែលយើងរក្សាទុកអំពីអ្នក។"
  },
  rightsBullet2: {
    en: "Rectification: Edit your profile name, telephone number, and brand specialties from your settings panel.",
    kh: "ការកែតម្រូវ៖ កែសម្រួលឈ្មោះប្រវត្តិរូប លេខទូរស័ព្ទ និងជំនាញម៉ាករបស់អ្នកពីផ្ទាំងកំណត់គណនី។"
  },
  rightsBullet3: {
    en: "Deletion: Contact support to close your account and delete all associated registration records.",
    kh: "ការលុបចោល៖ ទាក់ទងផ្នែកគាំទ្រដើម្បីបិទគណនីរបស់អ្នក និងលុបរាល់កំណត់ត្រាចុះឈ្មោះពាក់ព័ន្ធទាំងអស់។"
  },

  contactTitleDesc: { en: "7. Contact & Support", kh: "៧. ព័ត៌មានទំនាក់ទំនង" },
  contactDescText: {
    en: "If you have questions about this Privacy Policy, your personal information, or wish to exercise your data rights, please contact our support representatives via email or our hotline.",
    kh: "ប្រសិនបើអ្នកមានសំណួរអំពីគោលការណ៍ឯកជនភាពនេះ ព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក ឬចង់អនុវត្តសិទ្ធិទិន្នន័យរបស់អ្នក សូមទាក់ទងមកតំណាងផ្នែកគាំទ្ររបស់យើងតាមរយៈអ៊ីមែល ឬខ្សែទូរស័ព្ទបន្ទាន់។"
  },
  contactBulletMail: { en: "Email Support: support@cheang.com", kh: "គាំទ្រតាមអ៊ីមែល៖ support@cheang.com" },
  contactBulletPhone: { en: "Support Hotline: +855 12 345 678", kh: "ទូរស័ព្ទគាំទ្រ៖ +855 ១២ ៣៤៥ ៦៧៨" }
};

const PrivacyPage = () => {
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
    <AppLayout page="privacy">
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
              {/* 1. Introduction */}
              <section id="s1" className="legal-section">
                <h2>{getTranslation("introTitle")}</h2>
                <p>{getTranslation("introDesc")}</p>
                <div className="callout-box">
                  <p>{getTranslation("introCallout")}</p>
                </div>
              </section>

              {/* 2. Information We Collect */}
              <section id="s2" className="legal-section">
                <h2>{getTranslation("collectTitle")}</h2>
                <p>{getTranslation("collectDesc")}</p>
                <ul>
                  <li><strong>{language === "kh" ? "ការកំណត់អត្តសញ្ញាណ៖ " : "Identification: "}</strong>{getTranslation("collectBullet1")}</li>
                  <li><strong>{language === "kh" ? "ព័ត៌មានគណនី៖ " : "Credentials: "}</strong>{getTranslation("collectBullet2")}</li>
                  <li><strong>{language === "kh" ? "សេវាកម្ម Pro៖ " : "Pro details: "}</strong>{getTranslation("collectBullet3")}</li>
                  <li><strong>{language === "kh" ? "ទិន្នន័យប្រព័ន្ធ៖ " : "System metrics: "}</strong>{getTranslation("collectBullet4")}</li>
                </ul>
              </section>

              {/* 3. How We Use Information */}
              <section id="s3" className="legal-section">
                <h2>{getTranslation("usageTitle")}</h2>
                <p>{getTranslation("usageDesc")}</p>
                <ul>
                  <li>{getTranslation("usageBullet1")}</li>
                  <li>{getTranslation("usageBullet2")}</li>
                  <li>{getTranslation("usageBullet3")}</li>
                  <li>{getTranslation("usageBullet4")}</li>
                </ul>
              </section>

              {/* 4. Sharing Your Data */}
              <section id="s4" className="legal-section">
                <h2>{getTranslation("sharingTitle")}</h2>
                <p>{getTranslation("sharingDesc1")}</p>
                <p>{getTranslation("sharingDesc2")}</p>
              </section>

              {/* 5. Data Security */}
              <section id="s5" className="legal-section">
                <h2>{getTranslation("securityTitle")}</h2>
                <p>{getTranslation("securityDesc1")}</p>
                <div className="callout-box">
                  <p>{getTranslation("securityDesc2")}</p>
                </div>
              </section>

              {/* 6. Your Legal Rights */}
              <section id="s6" className="legal-section">
                <h2>{getTranslation("rightsTitle")}</h2>
                <p>{getTranslation("rightsDesc")}</p>
                <ul>
                  <li><strong>{language === "kh" ? "សិទ្ធិចូលមើល៖ " : "Access: "}</strong>{getTranslation("rightsBullet1")}</li>
                  <li><strong>{language === "kh" ? "សិទ្ធិកែតម្រូវ៖ " : "Rectification: "}</strong>{getTranslation("rightsBullet2")}</li>
                  <li><strong>{language === "kh" ? "សិទ្ធិលុបចោល៖ " : "Erasure: "}</strong>{getTranslation("rightsBullet3")}</li>
                </ul>
              </section>

              {/* 7. Contact & Support */}
              <section id="s7" className="legal-section">
                <h2>{getTranslation("contactTitleDesc")}</h2>
                <p>{getTranslation("contactDescText")}</p>
                <ul>
                  <li>{getTranslation("contactBulletMail")}</li>
                  <li>{getTranslation("contactBulletPhone")}</li>
                </ul>
              </section>
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PrivacyPage;
