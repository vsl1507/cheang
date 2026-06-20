import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useSelector } from "react-redux";
import Label from "../../components/label/Label";
import {
  FaPenAlt,
  FaTrash,
  FaPlusCircle,
  FaSearch,
  FaSortAmountDown,
  FaExclamationTriangle,
  FaTimes,
  FaWrench,
} from "react-icons/fa";
import ServiceUpdate from "../serviceUpdate/ServiceUpdate";
import "./ServiceSelector.scss";

const ServiceSelector = ({ setActiveTab }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Search & Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const t = {
    title: { en: "My Services", kh: "សេវាកម្មរបស់ខ្ញុំ", zh: "我的服务" },
    subtitle: { 
      en: "Manage and update your repair services listed in the marketplace.", 
      kh: "គ្រប់គ្រង និងកែសម្រួលសេវាកម្មជួសជុលរបស់អ្នកនៅក្នុងផ្សារ។", 
      zh: "管理和更新您在市场中列出的维修服务。" 
    },
    addNew: { en: "Add New Service", kh: "បន្ថែមសេវាកម្មថ្មី", zh: "添加新服务" },
    search: { en: "Search services...", kh: "ស្វែងរកសេវាកម្ម...", zh: "搜索服务..." },
    sortBy: { en: "Sort by", kh: "តម្រៀបតាម", zh: "排序方式" },
    sortNameAsc: { en: "Name: A to Z", kh: "ឈ្មោះ: A ទៅ Z", zh: "名称: A 到 Z" },
    sortNameDesc: { en: "Name: Z to Z", kh: "ឈ្មោះ: Z ទៅ A", zh: "名称: Z 到 A" },
    sortPriceAsc: { en: "Price: Low to High", kh: "តម្លៃ: ទាបទៅខ្ពស់", zh: "价格: 从低到高" },
    sortPriceDesc: { en: "Price: High to Low", kh: "តម្លៃ: ខ្ពស់ទៅទាប", zh: "价格: 从高到低" },
    edit: { en: "Edit", kh: "កែសម្រួល", zh: "编辑" },
    delete: { en: "Delete", kh: "លុប", zh: "删除" },
    confirmDeleteTitle: { en: "Confirm Deletion", kh: "បញ្ជាក់ការលុប", zh: "确认删除" },
    confirmDeleteText: { 
      en: "Are you sure you want to delete this service? This action cannot be undone.", 
      kh: "តើអ្នកប្រាកដជាចង់លុបសេវាកម្មនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានឡើយ។", 
      zh: "您确定要删除此服务吗？此操作无法撤销。" 
    },
    cancel: { en: "Cancel", kh: "បោះបង់", zh: "取消" },
    noServices: { en: "No services found matching your criteria.", kh: "រកមិនឃើញសេវាកម្មដែលត្រូវគ្នានឹងតម្រូវការរបស់អ្នកទេ។", zh: "未找到符合您条件的服务。" },
    price: { en: "Price", kh: "តម្លៃ", zh: "价格" }
  };

  const getLabel = (key) => t[key]?.[language] || t[key]?.["en"];

  useEffect(() => {
    if (currentUser) {
      fetchShowService();
    }
  }, [currentUser]);

  const fetchShowService = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/user/services/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setError(true);
        return;
      }
      setServices(data.data || data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceDelete = async () => {
    if (!selectedServiceId) return;
    try {
      const res = await fetch(`/api/service/delete/${selectedServiceId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.error(data.message);
        return;
      }
      setServices((prev) => prev.filter((s) => s._id !== selectedServiceId));
      setShowDeleteModal(false);
      setSelectedServiceId(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Modal helpers
  const handleOpenDeleteModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowDeleteModal(true);
  };

  const handleOpenEditModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowEditModal(true);
  };

  // Filter and Sort logic
  const filteredServices = services
    .filter((s) => s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "name-asc") return (a.name || "").localeCompare(b.name || "");
      if (sortOption === "name-desc") return (b.name || "").localeCompare(a.name || "");
      return 0;
    });

  return (
    <div className={`services-management-container ${theme}`}>
      {/* Header Panel */}
      <header className="services-page-header">
        <div className="header-info">
          <h1 className="header-title">{getLabel("title")}</h1>
          <p className="header-subtitle">{getLabel("subtitle")}</p>
        </div>
        <button className="add-service-btn" onClick={() => setActiveTab("addService")}>
          <FaPlusCircle /> <span>{getLabel("addNew")}</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className="services-toolbar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={getLabel("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
              <FaTimes />
            </button>
          )}
        </div>

        <div className="sort-wrapper">
          <FaSortAmountDown className="sort-icon" />
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="name-asc">{getLabel("sortNameAsc")}</option>
            <option value="name-desc">{getLabel("sortNameDesc")}</option>
            <option value="price-asc">{getLabel("sortPriceAsc")}</option>
            <option value="price-desc">{getLabel("sortPriceDesc")}</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <main className="services-content-main">
        {loading ? (
          <div className="loading-placeholder">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="empty-placeholder">
            <FaWrench className="empty-icon" />
            <p>{getLabel("noServices")}</p>
          </div>
        ) : (
          <div className="services-grid">
            {filteredServices.map((service) => (
              <article className="service-card-item" key={service._id}>
                <div className="card-image-wrapper">
                  <img
                    src={service.image}
                    alt={service.name}
                    onError={(e) => {
                      e.target.src =
                        "https://static-00.iconduck.com/assets.00/wrench-icon-2047x2048-jyerjpd9.png";
                    }}
                  />
                  <div className="card-price-overlay">
                    <span className="price-label">{getLabel("price")}</span>
                    <span className="price-value">${service.price}</span>
                  </div>
                </div>

                <div className="card-content-body">
                  <h3 className="service-item-title">{service.name}</h3>
                  <p className="service-item-desc">{service.description}</p>
                </div>

                <div className="card-actions-footer">
                  <button className="btn-edit" onClick={() => handleOpenEditModal(service._id)}>
                    <FaPenAlt /> <span>{getLabel("edit")}</span>
                  </button>
                  <button className="btn-delete" onClick={() => handleOpenDeleteModal(service._id)}>
                    <FaTrash /> <span>{getLabel("delete")}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Edit Service Modal */}
      {showEditModal && (
        <div className="pro-modal-overlay">
          <div className="pro-modal-wrapper edit-service-modal">
            <ServiceUpdate
              serviceId={selectedServiceId}
              onClose={() => {
                setShowEditModal(false);
                setSelectedServiceId(null);
              }}
              onSuccess={fetchShowService}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="pro-modal-overlay">
          <div className="pro-modal-wrapper confirmation-modal">
            <div className="modal-icon warning">
              <FaExclamationTriangle />
            </div>
            <h3>{getLabel("confirmDeleteTitle")}</h3>
            <p>{getLabel("confirmDeleteText")}</p>
            <div className="modal-buttons">
              <button className="btn-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                {getLabel("cancel")}
              </button>
              <button className="btn-modal-delete" onClick={handleServiceDelete}>
                <FaTrash style={{ marginRight: "6px" }} />
                {getLabel("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;
