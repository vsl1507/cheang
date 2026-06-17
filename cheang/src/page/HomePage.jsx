import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import AppLayout from "../layouts/AppLayout";
import AdsModal from "../components/adsModal/AdsModal";
import Card from "../components/card/Card";
import { getServicesAndSubServices } from "../data/Service";
import { getProvincesAndCities } from "../data/Location";
import { getSeeMore } from "../data/wordsLanguage";
import "./HomePage.scss";

// Icons
import {
  FaTools,
  FaHome,
  FaBolt,
  FaTint,
  FaHammer,
  FaTv,
  FaLeaf,
  FaUserCog,
  FaSearch,
  FaBriefcase,
  FaSlidersH,
  FaMapMarkerAlt,
  FaCity,
} from "react-icons/fa";

// Category Icons Mapping Helper
const getCategoryIcon = (serviceName) => {
  switch (serviceName) {
    case "General Repairs Service":
      return <FaTools />;
    case "Home Renovations Service":
      return <FaHome />;
    case "Electrical Services":
      return <FaBolt />;
    case "Plumbing Solutions Service":
      return <FaTint />;
    case "Carpentry and Woodworking Services":
      return <FaHammer />;
    case "Appliance Installation and Repair Services":
      return <FaTv />;
    case "Outdoor Maintenance Services":
      return <FaLeaf />;
    case "Handyman Assistance Services":
      return <FaUserCog />;
    default:
      return <FaTools />;
  }
};

// Localized Page Content Translations
const homeTranslations = {
  en: {
    heroTitle: "Find & Book Expert Local <span>Repair Pros</span>",
    heroSubtitle: "Book verified plumbers, electricians, carpenters, and appliance experts near you.",
    labelMainService: "Main Service",
    labelSubService: "Sub Service",
    labelProvince: "Province",
    labelCity: "City",
    allServices: "Select Main Service",
    allSubServices: "Select Sub Service",
    allProvinces: "Select Province",
    allCities: "Select City",
    searchBtn: "Search Repairers",
    categoriesTitle: "Popular Categories",
    categoriesSubtitle: "Explore professional repair services by industry specialty",
    howTitle: "How It Works",
    howSubtitle: "Three simple steps to get your home repairs resolved",
    step1Title: "1. Select a Service",
    step1Desc: "Choose from our wide range of professional repair categories and filter by sub-service.",
    step2Title: "2. Choose Your Pro",
    step2Desc: "Compare verified provider profiles, check ratings, customer reviews, and location.",
    step3Title: "3. Get It Fixed",
    step3Desc: "Contact your chosen repair professional directly and schedule your repair with ease.",
    featuredTitle: "Featured Repair Specialists",
    searchResultsTitle: "Search Results",
    noResults: "No repair specialists found matching your search. Try resetting filters or choosing another area.",
    allProLink: "View All Services",
    ctaTitle: "Grow Your Repair Business",
    ctaDesc: "Are you a professional repairer or technician? Join Cheang today to connect with local clients and expand your reach.",
    ctaBtn: "Register as a Pro",
  },
  kh: {
    heroTitle: "ស្វែងរក និងកក់ <span>ជាងជំនាញជួសជុល</span> ក្នុងតំបន់",
    heroSubtitle: "កក់សេវាជាងទឹក ជាងភ្លើង ជាងឈើ និងអ្នកជំនាញឧបករណ៍ប្រើប្រាស់ក្នុងផ្ទះដែលមានការបញ្ជាក់នៅជិតអ្នក។",
    labelMainService: "សេវាកម្មចម្បង",
    labelSubService: "សេវាកម្មជំនាញ",
    labelProvince: "ខេត្ត/រាជធានី",
    labelCity: "ក្រុង/ស្រុក/ខណ្ឌ",
    allServices: "ជ្រើសរើសសេវាកម្មចម្បង",
    allSubServices: "ជ្រើសរើសសេវាកម្មជំនាញ",
    allProvinces: "ជ្រើសរើសខេត្ត/រាជធានី",
    allCities: "ជ្រើសរើសស្រុក/ខណ្ឌ",
    searchBtn: "ស្វែងរកជាងជំនាញ",
    categoriesTitle: "ប្រភេទសេវាកម្មពេញនិយម",
    categoriesSubtitle: "រុករកសេវាកម្មជួសជុលដែលមានវិជ្ជាជីវៈតាមជំនាញនីមួយៗ",
    howTitle: "តើវាដំណើរការដូចម្តេច?",
    howSubtitle: "ជំហានងាយៗចំនួន ៣ ដើម្បីដោះស្រាយការជួសជុលគេហដ្ឋានរបស់អ្នក",
    step1Title: "១. ជ្រើសរើសសេវាកម្ម",
    step1Desc: "ជ្រើសរើសពីប្រភេទសេវាកម្មជួសជុលដ៏សម្បូរបែប និងកំណត់ជំនាញជាក់លាក់។",
    step2Title: "២. ជ្រើសរើសជាងរបស់អ្នក",
    step2Desc: "ប្រៀបធៀបប្រវត្តិរូបជាង ពិនិត្យមើលការវាយតម្លៃ ផ្កាយ និងទីតាំងរបស់ពួកគេ។",
    step3Title: "៣. ទទួលបានការជួសជុល",
    step3Desc: "ទាក់ទងជាងជំនាញដែលអ្នកបានជ្រើសរើសដោយផ្ទាល់ និងកំណត់ពេលជួសជុលដោយងាយស្រួល។",
    featuredTitle: "ជាងជំនាញឆ្នើមដែលត្រូវបានណែនាំ",
    searchResultsTitle: "លទ្ធផលស្វែងរក",
    noResults: "រកមិនឃើញជាងជំនាញដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។ សូមសាកល្បងផ្លាស់ប្តូរតម្រងម្តងទៀត។",
    allProLink: "មើលសេវាកម្មទាំងអស់",
    ctaTitle: "ពង្រីកអាជីវកម្មជួសជុលរបស់អ្នក",
    ctaDesc: "តើអ្នកជាជាងជំនាញ ឬអ្នកបច្ចេកទេសអាជីពមែនទេ? ចូលរួមជាមួយ Cheang ថ្ងៃនេះដើម្បីភ្ជាប់ទំនាក់ទំនងជាមួយអតិថិជន។",
    ctaBtn: "ចុះឈ្មោះជាជាងជំនាញ",
  },
  zh: {
    heroTitle: "查找并预订本地 <span>专业维修人员</span>",
    heroSubtitle: "预订您附近经过验证的管道工、电工、木工和家电专家。",
    labelMainService: "主要服务",
    labelSubService: "子服务",
    labelProvince: "省份/直辖市",
    labelCity: "城市/区县",
    allServices: "选择主要服务",
    allSubServices: "选择子服务",
    allProvinces: "选择省份/直辖市",
    allCities: "选择城市/区县",
    searchBtn: "搜索维修工",
    categoriesTitle: "热门服务类别",
    categoriesSubtitle: "按行业专业探索专业的维修服务",
    howTitle: "工作原理",
    howSubtitle: "只需三个简单步骤，即可解决您的家庭维修问题",
    step1Title: "1. 选择服务",
    step1Desc: "从我们广泛的专业维修类别中进行选择，并按子服务进行筛选。",
    step2Title: "2. 选择您的专家",
    step2Desc: "比较经过验证的提供商个人资料，查看评级、客户评论 and 位置。",
    step3Title: "3. 解决问题",
    step3Desc: "直接与您选择的维修专业人员联系，轻松安排您的维修服务。",
    featuredTitle: "推荐的维修专家",
    searchResultsTitle: "搜索结果",
    noResults: "未找到符合您搜索条件的维修专家。请尝试重置筛选条件或选择其他区域。",
    allProLink: "查看所有服务",
    ctaTitle: "拓展您的维修业务",
    ctaDesc: "您是专业维修工或技术人员吗？立即加入 Cheang，与本地客户建立联系并扩大您的服务范围。",
    ctaBtn: "注册为专业版",
  },
};

const HomePage = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);
  
  // Modals
  const [showAdModal, setShowAdModal] = useState(() => {
    const lastShownDate = localStorage.getItem("adModalLastShown");
    const shownDuringSession = sessionStorage.getItem("adModalShownDuringSession");
    return !lastShownDate || new Date(lastShownDate).getDate() !== new Date().getDate() || !shownDuringSession;
  });

  // Search Results Ref for smooth scroll
  const resultsRef = useRef(null);

  // States
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);

  // Form Fields
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedMainService, setSelectedMainService] = useState("");
  const [selectedSubService, setSelectedSubService] = useState("");

  const [formData, setFormData] = useState({
    province: "",
    city: "",
    mainService: "",
    subService: "",
  });

  // Services Data
  const servicesLanguage = getServicesAndSubServices(language);
  const servicesEnglish = getServicesAndSubServices("en");

  // Locations Data
  const locationLanguage = getProvincesAndCities(language);
  const locationEnglish = getProvincesAndCities("en");

  // Load Initial Featured Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        let res;
        if (!currentUser) {
          res = await fetch("/api/user/getalluser");
        } else {
          const currentUserSearchQuery = currentUser._id
            ? `&excludeUserId=${currentUser._id}`
            : "";
          res = await fetch(`/api/user/getalluserac?${currentUserSearchQuery}`);
        }
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setUsers(data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  // Handle Close Ad Modal
  useEffect(() => {
    if (showAdModal) {
      localStorage.setItem("adModalLastShown", new Date().toISOString());
      sessionStorage.setItem("adModalShownDuringSession", "true");
    }
  }, [showAdModal]);

  const handleCloseAdModal = () => {
    setShowAdModal(false);
  };

  // Form Actions
  const handleProvinceChange = (e) => {
    const provinceVal = e.target.value;
    setSelectedProvince(provinceVal);
    setSelectedCity(""); // Reset city

    const index = locationLanguage.Provinces.indexOf(provinceVal);
    const engProvince = index !== -1 ? locationEnglish.Provinces[index] : "";

    setFormData((prev) => ({
      ...prev,
      province: engProvince,
      city: "",
    }));
  };

  const handleCityChange = (e) => {
    const cityVal = e.target.value;
    setSelectedCity(cityVal);

    let engCity = "";
    if (selectedProvince) {
      const subCityArray = locationLanguage.Cities[selectedProvince] || [];
      const indexCity = subCityArray.indexOf(cityVal);
      const provIndex = locationLanguage.Provinces.indexOf(selectedProvince);
      if (provIndex !== -1 && indexCity !== -1) {
        const engProvKey = locationEnglish.Provinces[provIndex];
        const engCities = locationEnglish.Cities[engProvKey] || [];
        engCity = engCities[indexCity] || "";
      }
    }

    setFormData((prev) => ({
      ...prev,
      city: engCity,
    }));
  };

  const handleMainServiceChange = (e) => {
    const serviceVal = e.target.value;
    setSelectedMainService(serviceVal);
    setSelectedSubService(""); // Reset sub service

    const index = servicesLanguage.MainService.indexOf(serviceVal);
    const engService = index !== -1 ? servicesEnglish.MainService[index] : "";

    setFormData((prev) => ({
      ...prev,
      mainService: engService,
      subService: "",
    }));
  };

  const handleSubServiceChange = (e) => {
    const subVal = e.target.value;
    setSelectedSubService(subVal);

    let engSubService = "";
    if (selectedMainService) {
      const subServiceArray = servicesLanguage.SubService[selectedMainService] || [];
      const indexSub = subServiceArray.indexOf(subVal);
      const serviceIndex = servicesLanguage.MainService.indexOf(selectedMainService);
      if (serviceIndex !== -1 && indexSub !== -1) {
        const engServiceKey = servicesEnglish.MainService[serviceIndex];
        const engSubServices = servicesEnglish.SubService[engServiceKey] || [];
        engSubService = engSubServices[indexSub] || "";
      }
    }

    setFormData((prev) => ({
      ...prev,
      subService: engSubService,
    }));
  };

  // Submit Search Query
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { mainService, subService, province, city } = formData;

      const apiUrl = `/api/user/live-search?mainService=${mainService || ""}&subService=${subService || ""}&province=${province || ""}&city=${city || ""}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      
      setSearchResults(data);
      setLoading(false);

      // Smooth scroll down to results section
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Reset Search Filter
  const handleResetSearch = () => {
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedMainService("");
    setSelectedSubService("");
    setFormData({
      province: "",
      city: "",
      mainService: "",
      subService: "",
    });
    setSearchResults(null);
  };

  // Localized texts helper
  const t = homeTranslations[language] || homeTranslations.en;

  return (
    <AppLayout page="home">
      <div className={`home-page-container ${theme}`}>
        {/* 1. Hero Search Section */}
        <section className="home-hero">
          <div className="hero-content">
            <h1 dangerouslySetInnerHTML={{ __html: t.heroTitle }} />
            <p>{t.heroSubtitle}</p>

            {/* Search Dropdowns Card */}
            <div className="search-card-container">
              <form className="search-form-grid" onSubmit={handleSearchSubmit}>
                {/* Main Service */}
                <div className="form-group">
                  <label>{t.labelMainService}</label>
                  <div className="select-wrapper">
                    <FaBriefcase className="select-icon" />
                    <select
                      value={selectedMainService}
                      onChange={handleMainServiceChange}
                    >
                      <option value="">{t.allServices}</option>
                      {servicesLanguage.MainService.map((main) => (
                        <option key={main} value={main}>
                          {main}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sub Service */}
                <div className="form-group">
                  <label>{t.labelSubService}</label>
                  <div className="select-wrapper">
                    <FaSlidersH className="select-icon" />
                    <select
                      value={selectedSubService}
                      onChange={handleSubServiceChange}
                      disabled={!selectedMainService}
                    >
                      <option value="">{t.allSubServices}</option>
                      {servicesLanguage.SubService[selectedMainService]?.map(
                        (sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Province */}
                <div className="form-group">
                  <label>{t.labelProvince}</label>
                  <div className="select-wrapper">
                    <FaMapMarkerAlt className="select-icon" />
                    <select
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                    >
                      <option value="">{t.allProvinces}</option>
                      {locationLanguage.Provinces.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City */}
                <div className="form-group">
                  <label>{t.labelCity}</label>
                  <div className="select-wrapper">
                    <FaCity className="select-icon" />
                    <select
                      value={selectedCity}
                      onChange={handleCityChange}
                      disabled={!selectedProvince}
                    >
                      <option value="">{t.allCities}</option>
                      {locationLanguage.Cities[selectedProvince]?.map((ct) => (
                        <option key={ct} value={ct}>
                          {ct}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button type="submit" className="search-submit-btn">
                  <FaSearch />
                  {t.searchBtn}
                </button>
              </form>
              
              {searchResults !== null && (
                <div style={{ marginTop: "1rem", textAlign: "right" }}>
                  <button
                    onClick={handleResetSearch}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff7f00",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Clear Search Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. Popular Categories Grid Section */}
        <section className="home-categories">
          <div className="section-title-container">
            <h2 className="section-title">{t.categoriesTitle}</h2>
            <p className="section-subtitle">{t.categoriesSubtitle}</p>
          </div>

          <div className="categories-grid">
            {servicesLanguage.MainService.map((service, index) => {
              const englishService = servicesEnglish.MainService[index];
              return (
                <Link
                  key={index}
                  to={`/userlist/${englishService}`}
                  className="category-card"
                >
                  <div className="category-icon-wrapper">
                    {getCategoryIcon(englishService)}
                  </div>
                  <h3>{service}</h3>
                  <span>{getSeeMore(language)} →</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. How It Works Section */}
        <section className="home-how-it-works">
          <div className="section-title-container">
            <h2 className="section-title">{t.howTitle}</h2>
            <p className="section-subtitle">{t.howSubtitle}</p>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>{t.step1Title}</h3>
              <p>{t.step1Desc}</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>{t.step2Title}</h3>
              <p>{t.step2Desc}</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>{t.step3Title}</h3>
              <p>{t.step3Desc}</p>
            </div>
          </div>
        </section>

        {/* 4. Featured Repairers / Search Results Section */}
        <section className="home-featured-repairers" ref={resultsRef}>
          <div className="section-title-container">
            <h2 className="section-title">
              {searchResults !== null ? t.searchResultsTitle : t.featuredTitle}
            </h2>
            <p className="section-subtitle">
              {searchResults !== null
                ? `Found ${searchResults.length} professional repairers in your area`
                : "Connect with verified local repair technicians today"}
            </p>
          </div>

          {error && (
            <div style={{ color: "#dc3545", textAlign: "center", marginBottom: "1.5rem", fontWeight: "bold" }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", width: "100%" }}>
              <h3>Loading specialists...</h3>
            </div>
          ) : (
            <div className="featured-grid">
              {searchResults !== null ? (
                searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <Card {...user} key={user._id} ID={user._id} />
                  ))
                ) : (
                  <div className="no-results">
                    <h3>No specialists found</h3>
                    <p>{t.noResults}</p>
                  </div>
                )
              ) : (
                users.map((user) => (
                  <Card {...user} key={user._id} ID={user._id} />
                ))
              )}
            </div>
          )}
        </section>

        {/* 5. Become a Pro CTA Section */}
        <section className="home-cta-banner">
          <div className="cta-card">
            <div className="cta-info">
              <h2>{t.ctaTitle}</h2>
              <p>{t.ctaDesc}</p>
            </div>
            <Link to="/signup-pro" className="cta-button">
              {t.ctaBtn}
            </Link>
          </div>
        </section>

        {/* 6. Ads Modal overlay */}
        {showAdModal && <AdsModal onClose={handleCloseAdModal} />}
      </div>
    </AppLayout>
  );
};

export default HomePage;
