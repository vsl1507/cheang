import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./Card.scss";
import { FaMapMarkerAlt, FaWrench, FaTools, FaPhoneAlt, FaStar } from "react-icons/fa";

const Card = (props) => {
  const { theme } = useTheme();
  const ImgBackGround =
    "https://img.freepik.com/premium-vector/abstract-pattern-background-with-futuristic-modern-style-concept_7505-2436.jpg";
  const { avatar, brandName, province, mainService, subService, phone, ratings, ID } = props;

  // Calculate average rating
  const ratingsArray = ratings || [];
  const averageRating = ratingsArray.length > 0
    ? ratingsArray.reduce((acc, curr) => acc + curr.rating, 0) / ratingsArray.length
    : 0;
  const totalReviews = ratingsArray.length;

  return (
    <div className={`card pro-card ${theme}`}>
      <div className="pro-card-cover">
        <img src={ImgBackGround} alt="Cover" className="cover-img" />
        {averageRating > 0 && (
          <div className="pro-card-rating-badge">
            <FaStar className="star-icon" />
            <span>{averageRating.toFixed(1)}</span>
            <span className="reviews-count">({totalReviews})</span>
          </div>
        )}
      </div>

      <div className="pro-card-body">
        <div className="pro-card-avatar-wrapper">
          <img
            src={avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            alt={brandName}
            className="avatar-img"
          />
        </div>
        <h2 className="pro-brand-name">{brandName || "Repair Specialist"}</h2>
        
        <div className="pro-info-list">
          <div className="pro-info-item">
            <div className="icon-box"><FaWrench /></div>
            <span className="info-text">{mainService || "General Services"}</span>
          </div>
          {subService && (
            <div className="pro-info-item">
              <div className="icon-box"><FaTools /></div>
              <span className="info-text">{subService}</span>
            </div>
          )}
          <div className="pro-info-item">
            <div className="icon-box"><FaMapMarkerAlt /></div>
            <span className="info-text">{province || "Location not specified"}</span>
          </div>
          {phone && (
            <div className="pro-info-item">
              <div className="icon-box"><FaPhoneAlt /></div>
              <span className="info-text">{phone}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pro-card-footer">
        <Link to={`/profile/${ID}`} className="pro-view-btn">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default Card;
