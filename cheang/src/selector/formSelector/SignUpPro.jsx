import { useState } from "react";
import { 
  FaUserPlus, 
  FaStore, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaTools, 
  FaBriefcase, 
  FaCheckCircle, 
  FaHome, 
  FaUser, 
  FaSpinner 
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";
import FormLayout from "../../layouts/FormLayout";
import { getServicesAndSubServices } from "../../data/Service";
import { useLanguage } from "../../context/LanguageContext";
import { getProvincesAndCities } from "../../data/Location";
import "./SignUpPro.scss";
import {
  getBecomePro,
  getBrandName,
  getCity,
  getMainService,
  getPhone,
  getProvince,
  getRequest,
  getSelect,
  getSubService,
} from "../../data/wordsLanguage";

const getMarketingText = (key, lang) => {
  const texts = {
    title: {
      en: "Grow Your Business with Cheang",
      kh: "ពង្រីកអាជីវកម្មរបស់អ្នកជាមួយ Cheang",
      zh: "与 Cheang 一起发展您的业务",
    },
    desc: {
      en: "Join our professional network and gain access to thousands of clients looking for skilled services in your area.",
      kh: "ចូលរួមបណ្តាញសមាជិកអាជីពរបស់យើង ដើម្បីទទួលបានអតិថិជនរាប់ពាន់នាក់ដែលកំពុងស្វែងរកសេវាកម្មជំនាញក្នុងតំបន់របស់អ្នក។",
      zh: "加入我们的专业网络，接触您所在地区数千名寻找技术服务的客户。",
    },
    b1_title: { en: "Expand Your Reach", kh: "ពង្រីកវិសាលភាពរបស់អ្នក", zh: "扩大您的影响力" },
    b1_desc: { en: "Connect with thousands of local clients looking for your specific expertise.", kh: "ភ្ជាប់ទំនាក់ទំនងជាមួយអតិថិជនក្នុងតំបន់រាប់ពាន់នាក់ដែលកំពុងស្វែងរកជំនាញជាក់លាក់របស់អ្នក។", zh: "与寻找您特定专业知识的数千名本地客户建立联系。" },
    b2_title: { en: "Flexible Control", kh: "ការគ្រប់គ្រងដែលអាចបត់បែនបាន", zh: "灵活控制" },
    b2_desc: { en: "Choose your own working hours, set your service areas, and manage your rates.", kh: "ជ្រើសរើសម៉ោងធ្វើការផ្ទាល់ខ្លួន កំណត់ទីតាំងសេវាកម្ម និងគ្រប់គ្រងតម្លៃរបស់អ្នក។", zh: "选择您自己的工作时间，设置您的服务区域，并管理您的费率。" },
    b3_title: { en: "Build Reputation", kh: "កសាងកេរ្តិ៍ឈ្មោះ", zh: "建立声誉" },
    b3_desc: { en: "Earn badges, receive verified reviews from clients, and grow your portfolio.", kh: "ទទួលបានផ្លាកសញ្ញា ទទួលការវាយតម្លៃដែលបានផ្ទៀងផ្ទាត់ពីអតិថិជន និងបង្កើតផលប័ត្រអាជីព។", zh: "赚取徽章，接收客户的验证评价，并增加您的作品集。" },
    alreadyTitle: { en: "You're all set! 🌟", kh: "អ្នកបានរៀបចំរួចរាល់ហើយ! 🌟", zh: "您已准备就绪！🌟" },
    alreadyDesc: { en: "You are already registered as a Professional. Access your profile or dashboard to manage your services.", kh: "អ្នកបានចុះឈ្មោះជាអ្នកផ្តល់សេវាកម្មរួចហើយ។ ចូលទៅកាន់ប្រវត្តិរូប ឬផ្ទាំងគ្រប់គ្រងរបស់អ្នកដើម្បីគ្រប់គ្រងសេវាកម្ម។", zh: "您已经注册为专业人士。访问您的个人资料或仪表板来管理您的服务。" },
    goHome: { en: "Go to Home", kh: "ទៅកាន់ទំព័រដើម", zh: "回到主页" },
    goProfile: { en: "Go to Profile", kh: "ទៅកាន់ប្រវត្តិរូប", zh: "转到个人资料" },
    formTitle: { en: "Become a Professional", kh: "ក្លាយជាអ្នកផ្តល់សេវាកម្ម", zh: "成为专业人士" },
    formSubtitle: { en: "Fill out the information below to register as a provider on Cheang.", kh: "បំពេញព័ត៌មានខាងក្រោមដើម្បីចុះឈ្មោះជាអ្នកផ្តល់សេវាកម្មនៅលើ Cheang។", zh: "填写以下信息在 Cheang 上注册为服务提供商。" },
  };
  return texts[key]?.[lang] || texts[key]?.[lang === "kh" ? "kh" : "en"] || texts[key]?.["en"] || "";
};

const SignUpPro = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});

  //Handle change data
  const handleChange = (e) => {
    if (e.target.type === "text" || e.target.type === "tel") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
        Request: true,
      });
    }
  };

  //Location
  const locationLanguage = getProvincesAndCities(language);
  const locationEnglsih = getProvincesAndCities("en");

  //Variable location
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  //Handle change for province
  const handleProvinceChange = (event) => {
    const val = event.target.value;
    setSelectedProvince(val);
    setSelectedCity("");
    if (!val) {
      setFormData({
        ...formData,
        province: "",
        city: "",
      });
      return;
    }
    const index = locationLanguage.Provinces.indexOf(val);
    setFormData({
      ...formData,
      province: locationEnglsih.Provinces[index] || "",
      city: "",
    });
  };

  //Handle change for city
  const handleCityChange = (event) => {
    const val = event.target.value;
    setSelectedCity(val);
    if (!val) {
      setFormData({
        ...formData,
        city: "",
      });
      return;
    }
    const index = locationLanguage.Provinces.indexOf(selectedProvince);
    const subCityArray = locationLanguage.Cities[selectedProvince];
    const indexCity = subCityArray.indexOf(val);
    const value =
      locationEnglsih.Cities[locationEnglsih.Provinces[index]][indexCity];
    setFormData({
      ...formData,
      city: value || "",
    });
  };

  //Service
  const servicesLanguage = getServicesAndSubServices(language);
  const servicesEnglsih = getServicesAndSubServices("en");

  //Variable for main & sub service
  const [selectedMainService, setSelectedMainService] = useState("");
  const [selectedSubService, setSelectedSubService] = useState("");

  //Handle change for main service
  const handleMainServiceChange = (event) => {
    const val = event.target.value;
    setSelectedMainService(val);
    setSelectedSubService("");
    if (!val) {
      setFormData({
        ...formData,
        mainService: "",
        subService: "",
      });
      return;
    }
    const index = servicesLanguage.MainService.indexOf(val);
    setFormData({
      ...formData,
      mainService: servicesEnglsih.MainService[index] || "",
      subService: "",
    });
  };

  //Handle change for sub service
  const handleSubServiceChange = (event) => {
    const val = event.target.value;
    setSelectedSubService(val);
    if (!val) {
      setFormData({
        ...formData,
        subService: "",
      });
      return;
    }
    const index = servicesLanguage.MainService.indexOf(selectedMainService);
    const subServiceArray = servicesLanguage.SubService[selectedMainService];
    const indexSub = subServiceArray.indexOf(val);
    const value =
      servicesEnglsih.SubService[servicesEnglsih.MainService[index]][indexSub];
    setFormData({
      ...formData,
      subService: value || "",
    });
  };

  //Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <FormLayout>
      {currentUser.userPro ? (
        <div className={`signup-pro-page ${theme}`}>
          <div className="already-pro-panel">
            <div className="success-icon-wrapper">
              <FaCheckCircle />
            </div>
            <h2>{getMarketingText("alreadyTitle", language)}</h2>
            <p>{getMarketingText("alreadyDesc", language)}</p>
            <div className="action-buttons">
              <Link to="/profile" className="secondary-action">
                <FaUser style={{ marginRight: "8px" }} />
                {getMarketingText("goProfile", language)}
              </Link>
              <Link to="/" className="primary-action">
                <FaHome style={{ marginRight: "8px" }} />
                {getMarketingText("goHome", language)}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className={`signup-pro-page ${theme}`}>
          <div className="signup-pro-card">
            {/* Left Marketing Panel */}
            <div className="marketing-panel">
              <h1 className="panel-title">{getMarketingText("title", language)}</h1>
              <p className="panel-description">{getMarketingText("desc", language)}</p>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <FaBriefcase className="benefit-icon" />
                  <div className="benefit-text">
                    <h3>{getMarketingText("b1_title", language)}</h3>
                    <p>{getMarketingText("b1_desc", language)}</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <FaTools className="benefit-icon" />
                  <div className="benefit-text">
                    <h3>{getMarketingText("b2_title", language)}</h3>
                    <p>{getMarketingText("b2_desc", language)}</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <FaCheckCircle className="benefit-icon" />
                  <div className="benefit-text">
                    <h3>{getMarketingText("b3_title", language)}</h3>
                    <p>{getMarketingText("b3_desc", language)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="form-panel">
              <h2 className="form-title">{getMarketingText("formTitle", language)}</h2>
              <p className="form-subtitle">{getMarketingText("formSubtitle", language)}</p>
              
              <form className="signup-pro-form" onSubmit={handleSubmit}>
                {/* Brand Name Input */}
                <div className="input-group">
                  <input
                    type="text"
                    id="brandName"
                    name="brandName"
                    value={formData.brandName || ""}
                    onChange={handleChange}
                    placeholder={getBrandName(language)}
                    required
                  />
                  <FaStore className="input-icon" />
                </div>

                {/* Service Dropdowns (Row) */}
                <div className="form-row">
                  <div className="input-group select-group">
                    <select
                      id="mainSerivce"
                      name="mainSerivce"
                      value={selectedMainService}
                      onChange={handleMainServiceChange}
                      required
                    >
                      <option value="">
                        {getSelect(language) + " " + getMainService(language)}
                      </option>
                      {servicesLanguage.MainService.map((mainservice) => (
                        <option key={mainservice} value={mainservice}>
                          {mainservice}
                        </option>
                      ))}
                    </select>
                    <FaBriefcase className="input-icon" />
                  </div>

                  <div className="input-group select-group">
                    <select
                      id="subService"
                      name="subService"
                      value={selectedSubService}
                      onChange={handleSubServiceChange}
                      disabled={!selectedMainService}
                      required
                    >
                      <option value="">
                        {getSelect(language) + " " + getSubService(language)}
                      </option>
                      {servicesLanguage.SubService[selectedMainService]?.map(
                        (subservice) => (
                          <option key={subservice} value={subservice}>
                            {subservice}
                          </option>
                        )
                      )}
                    </select>
                    <FaTools className="input-icon" />
                  </div>
                </div>

                {/* Location Dropdowns (Row) */}
                <div className="form-row">
                  <div className="input-group select-group">
                    <select
                      id="province"
                      name="province"
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      required
                    >
                      <option value="">
                        {getSelect(language) + " " + getProvince(language)}
                      </option>
                      {locationLanguage.Provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    <FaMapMarkerAlt className="input-icon" />
                  </div>

                  <div className="input-group select-group">
                    <select
                      id="city"
                      name="city"
                      value={selectedCity}
                      onChange={handleCityChange}
                      disabled={!selectedProvince}
                      required
                    >
                      <option value="">
                        {getSelect(language) + " " + getCity(language)}
                      </option>
                      {locationLanguage.Cities[selectedProvince]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <FaMapMarkerAlt className="input-icon" />
                  </div>
                </div>

                {/* Phone Input */}
                <div className="input-group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder={getPhone(language)}
                    required
                  />
                  <FaPhone className="input-icon" />
                </div>

                {/* Submit Action */}
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <FaSpinner className="spinner" />
                  ) : (
                    <FaUserPlus />
                  )}
                  <span>{getRequest(language)}</span>
                </button>

                {error && <div className="error-message">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      )}
    </FormLayout>
  );
};

export default SignUpPro;
