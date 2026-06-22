import React from 'react';
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { FaPenAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ServiceCard.scss";

const ServiceCard = ({ service, onEdit, onDelete, onToggleStatus, isEditable = false }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const t = {
    price: { en: "Price", kh: "តម្លៃ", zh: "价格" },
    activeStatus: { en: "Active", kh: "សកម្ម", zh: "上架中" },
    draftStatus: { en: "Draft", kh: "ព្រាង", zh: "下架" },
    edit: { en: "Edit", kh: "កែសម្រួល", zh: "编辑" },
    delete: { en: "Delete", kh: "លុប", zh: "删除" },
  };

  const getLabel = (key) => t[key]?.[language] || t[key]?.["en"];

  // Default avatar if handyman user is populated
  const handymanAvatar = service.userRef?.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  const brandName = service.userRef?.brandName || service.userRef?.nameuser;

  const handleCardClick = () => {
    if (!isEditable) {
      navigate(`/service/detail/${service._id || service.id}`);
    }
  };

  return (
    <article 
      className={`service-card-item ${theme} ${!isEditable ? 'clickable' : ''}`}
      onClick={handleCardClick}
      style={!isEditable ? { cursor: 'pointer' } : {}}
    >
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
        
        {isEditable ? (
          <div 
            className={`status-badge-floating ${service.isActive !== false ? "active" : "draft"}`} 
            onClick={() => onToggleStatus && onToggleStatus(service.id, service.isActive !== false)}
            title="Click to toggle active/draft status"
          >
            <span className="status-dot"></span>
            <span className="status-text">{service.isActive !== false ? getLabel("activeStatus") : getLabel("draftStatus")}</span>
          </div>
        ) : (
          service.userRef && (
            <div className="service-provider-badge">
               <img src={handymanAvatar} alt={brandName} className="provider-avatar" />
               <span className="provider-name">{brandName}</span>
            </div>
          )
        )}
      </div>

      <div className="card-content-body">
        <h3 className="service-item-title">{service.name}</h3>
        <p className="service-item-desc">{service.description}</p>
      </div>

      {isEditable && (
        <div className="card-actions-footer">
          <button className="btn-edit" onClick={() => onEdit && onEdit(service.id)}>
            <FaPenAlt /> <span>{getLabel("edit")}</span>
          </button>
          <button className="btn-delete" onClick={() => onDelete && onDelete(service.id)}>
            <FaTrash /> <span>{getLabel("delete")}</span>
          </button>
        </div>
      )}
    </article>
  );
};

export default ServiceCard;
