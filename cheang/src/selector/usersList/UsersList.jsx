import React, { useEffect, useState } from "react";
import Card from "../../components/card/Card";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { getServicesAndSubServices } from "../../data/Service";
import { getProvincesAndCities } from "../../data/Location";
import {
  FaFilter,
  FaMapMarkerAlt,
  FaBriefcase,
  FaSlidersH,
  FaCity,
  FaTimes,
} from "react-icons/fa";
import "./UsersList.scss";
import CustomSelect from "../../components/customSelect/CustomSelect";

// Localized Directory Page Content
const listTranslations = {
  en: {
    pageTitleAll: "Find Top-Rated Repair Pros",
    pageSubtitleAll: "Browse and hire verified plumbers, electricians, carpenters, and appliance experts near you.",
    pageTitleService: "Specialists in {service}",
    pageSubtitleService: "Verified professionals offering {service} in your area.",
    filterTitle: "Filter Directory",
    labelMainService: "Main Service",
    labelSubService: "Sub Service",
    labelProvince: "Province",
    labelCity: "City",
    all: "All",
    clearFilters: "Clear Filters",
    noResults: "No repair specialists found matching your search. Try adjusting the filters.",
  },
  kh: {
    pageTitleAll: "ស្វែងរកជាងជំនាញជួសជុលឆ្នើម",
    pageSubtitleAll: "ស្វែងរក និងជួលជាងទឹក ជាងភ្លើង ជាងឈើ និងអ្នកជំនាញឧបករណ៍ប្រើប្រាស់ក្នុងផ្ទះដែលមានការបញ្ជាក់នៅជិតអ្នក។",
    pageTitleService: "អ្នកជំនាញផ្នែក {service}",
    pageSubtitleService: "ជាងជំនាញដែលមានការបញ្ជាក់ផ្ដល់ជូនសេវាកម្ម {service} ក្នុងតំបន់របស់អ្នក។",
    filterTitle: "តម្រងស្វែងរក",
    labelMainService: "សេវាកម្មចម្បង",
    labelSubService: "សេវាកម្មជំនាញ",
    labelProvince: "ខេត្ត/រាជធានី",
    labelCity: "ក្រុង/ស្រុក/ខណ្ឌ",
    all: "ទាំងអស់",
    clearFilters: "សម្អាតតម្រង",
    noResults: "រកមិនឃើញជាងជំនាញដែលត្រូវនឹងតម្រូវការរបស់អ្នកទេ។ សូមសាកល្បងកែសម្រួលតម្រងស្វែងរក។",
  },
  zh: {
    pageTitleAll: "查找高分维修专家",
    pageSubtitleAll: "浏览并雇用您附近经过验证的管道工、电工、木工和家电专家。",
    pageTitleService: "{service} 专家",
    pageSubtitleService: "在您当地提供 {service} 的经过验证的专业人员。",
    filterTitle: "筛选目录",
    labelMainService: "主要服务",
    labelSubService: "子服务",
    labelProvince: "省份/直辖市",
    labelCity: "城市/区县",
    all: "全部",
    clearFilters: "清除筛选器",
    noResults: "未找到符合您搜索条件的维修专家。请尝试调整筛选条件。",
  },
};

const UsersList = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Localized texts helper
  const t = listTranslations[language] || listTranslations.en;
  const params = useParams();

  // Filter States
  const [filterProvince, setFilterProvince] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterMainService, setFilterMainService] = useState("");
  const [filterSubService, setFilterSubService] = useState("");

  // Sync params.typeservice to filter state when URL changes
  useEffect(() => {
    if (params.typeservice) {
      setFilterMainService(params.typeservice);
    } else {
      setFilterMainService("");
    }
    setFilterSubService(""); // Clear sub-service on category change
  }, [params.typeservice]);

  // Load active specialists
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        let res;
        if (currentUser) {
          const currentUserSearchQuery = currentUser._id
            ? `&excludeUserId=${currentUser._id}`
            : "";
          res = await fetch(`/api/user/getalluserac?${currentUserSearchQuery}`);
        } else {
          res = await fetch("/api/user/getalluser");
        }
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setUsers(data.data || data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  // Dropdown Options helpers
  const locationLanguage = getProvincesAndCities(language);
  const servicesLanguage = getServicesAndSubServices(language);

  // Handle select actions
  const handleMainServiceChange = (e) => {
    setFilterMainService(e.target.value);
    setFilterSubService("");
  };

  const handleProvinceChange = (e) => {
    setFilterProvince(e.target.value);
    setFilterCity("");
  };

  const handleClearFilters = () => {
    setFilterProvince("");
    setFilterCity("");
    setFilterSubService("");
    if (!params.typeservice) {
      setFilterMainService("");
    }
  };

  // Dynamic Filtering Logic
  const filteredUsers = users.filter((user) => {
    if (filterMainService && user.mainService !== filterMainService) return false;
    if (filterSubService && user.subService !== filterSubService) return false;
    if (filterProvince && user.province !== filterProvince) return false;
    if (filterCity && user.city !== filterCity) return false;
    return true;
  });

  const hasActiveFilters =
    filterProvince ||
    filterCity ||
    filterSubService ||
    (!params.typeservice && filterMainService);

  const getPageTitle = () => {
    if (params.typeservice) {
      return t.pageTitleService.replace("{service}", params.typeservice);
    }
    return t.pageTitleAll;
  };

  const getPageSubtitle = () => {
    if (params.typeservice) {
      return t.pageSubtitleService.replace("{service}", params.typeservice);
    }
    return t.pageSubtitleAll;
  };

  return (
    <div className={`userslist ${theme}`}>
      {/* 1. Directory Header Section */}
      <header className="directory-header">
        <div className="header-content">
          <h1>{getPageTitle()}</h1>
          <p>{getPageSubtitle()}</p>
        </div>
      </header>

      <div className="userslist-container">
        {/* 2. Directory Filters Panel */}
        <section className="directory-filters-container">
          <div className="filters-card">
            <div className="filters-header">
              <h3>
                <FaFilter className="filter-title-icon" />
                {t.filterTitle}
              </h3>
              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={handleClearFilters}>
                  <FaTimes />
                  {t.clearFilters}
                </button>
              )}
            </div>

            <div className="filters-grid">
              {/* Main Service Select */}
              {!params.typeservice && (
                <div className="filter-group">
                  <label>{t.labelMainService}</label>
                  <CustomSelect
                    value={filterMainService}
                    onChange={handleMainServiceChange}
                    options={servicesLanguage.MainService}
                    placeholder={t.all}
                    icon={<FaBriefcase />}
                  />
                </div>
              )}

              {/* Sub Service Select */}
              <div className="filter-group">
                <label>{t.labelSubService}</label>
                <CustomSelect
                  value={filterSubService}
                  onChange={(e) => setFilterSubService(e.target.value)}
                  options={servicesLanguage.SubService[filterMainService] || []}
                  placeholder={t.all}
                  icon={<FaSlidersH />}
                  disabled={!filterMainService}
                />
              </div>

              {/* Province Select */}
              <div className="filter-group">
                <label>{t.labelProvince}</label>
                <CustomSelect
                  value={filterProvince}
                  onChange={handleProvinceChange}
                  options={locationLanguage.Provinces}
                  placeholder={t.all}
                  icon={<FaMapMarkerAlt />}
                />
              </div>

              {/* City Select */}
              <div className="filter-group">
                <label>{t.labelCity}</label>
                <CustomSelect
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  options={locationLanguage.Cities[filterProvince] || []}
                  placeholder={t.all}
                  icon={<FaCity />}
                  disabled={!filterProvince}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Specialists Grid Results */}
        {loading ? (
          <div className="directory-loading">
            <div className="spinner"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="service-card">
            {filteredUsers.map((user) => (
              <Card {...user} key={user._id} ID={user._id} />
            ))}
          </div>
        ) : (
          <div className="no-results-container">
            <h3>{t.noResults}</h3>
            {hasActiveFilters && (
              <button
                className="clear-filters-btn-large"
                onClick={handleClearFilters}
              >
                {t.clearFilters}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
