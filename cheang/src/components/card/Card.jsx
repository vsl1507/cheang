/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Label from "../label/Label";
import TextBorder from "../textBorder/TextBorder";
import ShowStar from "../starRating/ShowStar";
import "./Card.scss";
import { FaMapMarkerAlt, FaWrench } from "react-icons/fa";

const Card = (props) => {
  const { theme } = useTheme();
  const ImgBackGround =
    "https://img.freepik.com/premium-vector/abstract-pattern-background-with-futuristic-modern-style-concept_7505-2436.jpg";
  const { avatar, brandName, province, mainService, ratings, ID } =
    props;

  // Calculate average rating
  const ratingsArray = ratings || [];
  const averageRating = ratingsArray.length > 0
    ? ratingsArray.reduce((acc, curr) => acc + curr.rating, 0) / ratingsArray.length
    : 0;

  return (
    <div className={`card ${theme}`}>
      <div className="card-container">
        <img className="card-image" src={ImgBackGround} alt="Cover Image" />
        <img
          className="card-profile"
          src={avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
          alt="Profile Image"
        />
        <div className="card-detail">
          <Label label={brandName || "Repair Specialist"} />
          <div className="card-detail-content">
            <TextBorder
              label={<FaWrench style={{ marginRight: "8px" }} />}
              text={mainService}
            />
            <TextBorder
              label={<FaMapMarkerAlt style={{ marginRight: "8px" }} />}
              text={province}
            />
            {averageRating > 0 && (
              <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShowStar rating={averageRating} size="1rem" />
                <span style={{ fontSize: "0.85rem", color: theme === "dark" ? "#ccc" : "#555" }}>
                  ({averageRating.toFixed(1)})
                </span>
              </div>
            )}
          </div>
          <div className="card-detail-action">
            <Link to={`/profile/${ID}`}>
              <button style={{ width: "6rem" }}>See more</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
