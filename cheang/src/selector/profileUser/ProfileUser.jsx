import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  FaComment,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegBookmark,
  FaBookmark,
  FaTrash,
  FaWrench,
  FaCheck,
  FaSpinner,
  FaPaperPlane,
  FaStar,
} from "react-icons/fa";
import Tag from "../../components/tag/Tag";
import Label from "../../components/label/Label";
import Profile from "../../components/profile/Profile";
import StarRating from "../../components/starRating/StarRating ";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";
import ShowStar from "../../components/starRating/ShowStar";
import "./ProfileUser.scss";
import TextBorder from "../../components/textBorder/TextBorder";
import ServiceSelectorUser from "../serviceSelectorUser/ServiceSelectorUser";
import AboutUser from "../aboutUser/AboutUser";

const ProfileUser = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [normal, setNormal] = useState("service");
  const dispatch = useDispatch();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  
  // Custom submit loading indicators
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);

  useEffect(() => {
    if (user) {
      setNormal(user.userPro ? "service" : "about");
    }
  }, [user]);

  // Rating Change Handler
  const handleRatingChange = (newRating) => {
    setFormData({
      ...formData,
      userRating: newRating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userRating) return;
    try {
      setIsSubmittingRating(true);
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/rating/${params.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: formData.userRating,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setIsSubmittingRating(false);
        return;
      }

      setUser(data.data || data);

      const updatedUserResponse = await fetch(
        `/api/user/getUser/${params.userId}`
      );
      const updatedUserData = await updatedUserResponse.json();
      setUser(updatedUserData.data || updatedUserData);
      setIsSubmittingRating(false);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setIsSubmittingRating(false);
    }
  };

  const averageRating =
    user && user.ratings && user.ratings.length > 0
      ? user.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
        user.ratings.length
      : 0;

  // Comments
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      setIsSubmittingComment(true);
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/comment/${params.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameuser: currentUser.nameuser,
          avatar: currentUser.avatar,
          comment: newComment,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setIsSubmittingComment(false);
        return;
      }
      setUser(data.data || data);

      const updatedUserResponse = await fetch(
        `/api/user/getUser/${params.userId}`
      );
      const updatedUserData = await updatedUserResponse.json();
      setUser(updatedUserData.data || updatedUserData);

      setNewComment("");
      setIsSubmittingComment(false);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setIsSubmittingComment(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/deletecomment/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user._id,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      setUser(data.data || data);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // Save User
  const handleSave = async () => {
    try {
      setIsSavingUser(true);
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/save/${params.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
      } else {
        dispatch(updateUserSuccess(data.data || data));
      }
      setIsSavingUser(false);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setIsSavingUser(false);
    }
  };

  const isAlreadySaved = currentUser?.saves.some(
    (save) => save.userId === params.userId
  );

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getUser/${params.userId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setUser(data.data || data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchService();
  }, [params.userId]);

  return (
    <div className={`ProfileContainer ${theme}`}>
      {/* 1. Full-bleed Hero Cover Banner */}
      <div className={`profile-hero-banner ${user?.userPro ? "pro-banner" : "client-banner"}`}></div>

      {/* 2. Overlapping Profile Header Block */}
      {user && !loading && !error && (
        <div className="profile-hero-header-wrapper">
          <div className="profile-hero-header">
            <div className="profile-hero-left">
              <div className="profile-avatar-wrapper">
                <Profile src={user.avatar} />
                <span className={`account-badge ${user.userPro ? "pro-badge" : "client-badge"}`}>
                  {user.userPro ? "Pro" : "Client"}
                </span>
              </div>
              
              <div className="profile-hero-details">
                <h1 className="profile-brand-title">
                  {user.userPro ? (user.brandName || "Repair Provider") : user.nameuser}
                </h1>
                {user.userPro && <p className="profile-owner-name">Owner: {user.nameuser}</p>}
                
                <div className="profile-hero-tags">
                  {user.userPro ? (
                    <>
                      {user.mainService && user.mainService !== "None" && user.mainService !== "NONE" && <Tag label={user.mainService} />}
                      {user.subService && user.subService !== "None" && user.subService !== "NONE" && <Tag label={user.subService} />}
                      {(!user.mainService || user.mainService === "None" || user.mainService === "NONE") && <Tag label="Handyman Account" />}
                    </>
                  ) : (
                    <Tag label="Client Account" />
                  )}
                </div>
              </div>
            </div>

            <div className="profile-hero-right">
              {user.userPro && (
                <div className="profile-hero-rating-summary">
                  <div className="hero-rating-row">
                    <ShowStar rating={averageRating.toFixed(2)} />
                    <span className="rating-num">{averageRating.toFixed(2)}</span>
                  </div>
                  <span className="rating-count">({user.ratings?.length || 0} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Centered Content Grid */}
      <div className="ProfileContainer-container">
        {/* Left Column Card: Contact Location Info & Rating Widget */}
        <div className="ProfileContainer-container-left">
          {loading && (
            <div className="loading-card">
              <FaSpinner className="spin loading-icon" />
              <p className="loading-text">Loading...</p>
            </div>
          )}
          {error && (
            <div className="error-card">
              <p className="error-text">Something went wrong!</p>
            </div>
          )}
          {user && !loading && !error && (
            <div className="profile-details-sidebar-card">
              <h3 className="sidebar-card-title">Contact & Location</h3>
              
              <div className="sidebar-details-list">
                <TextBorder
                  label={<FaMapMarkerAlt />}
                  text={
                    (user.city && user.city !== "None" && user.city !== "NONE") || 
                    (user.province && user.province !== "None" && user.province !== "NONE") ?
                    (user.city + " , " + user.province) :
                    "Location not set"
                  }
                />
                <TextBorder
                  label={<FaPhoneAlt />}
                  text={user.phone && user.phone !== "None" && user.phone !== "NONE" ? user.phone : "No phone added"}
                />
              </div>

              {user.userPro && (
                <div className="userserviceDetail-container-rating">
                  <h4 className="rating-widget-title">Rate this provider</h4>
                  <StarRating
                    userId={params.userId}
                    onChange={handleRatingChange}
                  />
                  <button 
                    type="button" 
                    className="btn-submit-rating"
                    onClick={handleSubmit} 
                    disabled={isSubmittingRating || !formData.userRating}
                  >
                    {isSubmittingRating ? <FaSpinner className="spin" /> : <FaCheck />}
                    <span>{isSubmittingRating ? "Submitting..." : "Submit Rating"}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Workspace Sub-sections */}
        <div className="ProfileContainer-container-right">
          <div className="profileTodo">
            {user && !loading && !error && (
              user.userPro ? (
                <>
                  {normal === "service" ? (
                    <>
                      <div className="serviceDetail-container">
                        <button className="disabled" disabled>
                          <FaWrench />
                          <span>Service</span>
                        </button>
                        <button type="button" onClick={() => setNormal("about")}>
                          <FaInfoCircle />
                          <span>About</span>
                        </button>
                        <button type="button" className="save-profile-btn" onClick={handleSave} disabled={isSavingUser}>
                          {isSavingUser ? (
                            <FaSpinner className="spin" />
                          ) : isAlreadySaved ? (
                            <FaBookmark />
                          ) : (
                            <FaRegBookmark />
                          )}
                          <span>{isAlreadySaved ? "Saved" : "Save"}</span>
                        </button>
                      </div>
                      <ServiceSelectorUser />
                    </>
                  ) : normal === "about" ? (
                    <>
                      <div className="serviceDetail-container">
                        <button type="button" onClick={() => setNormal("service")}>
                          <FaWrench />
                          <span>Service</span>
                        </button>
                        <button className="disabled" disabled>
                          <FaInfoCircle />
                          <span>About</span>
                        </button>
                        <button type="button" className="save-profile-btn" onClick={handleSave} disabled={isSavingUser}>
                          {isSavingUser ? (
                            <FaSpinner className="spin" />
                          ) : isAlreadySaved ? (
                            <FaBookmark />
                          ) : (
                            <FaRegBookmark />
                          )}
                          <span>{isAlreadySaved ? "Saved" : "Save"}</span>
                        </button>
                      </div>
                      <AboutUser />
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  {normal === "about" ? (
                    <>
                      <div className="serviceDetail-container">
                        <button className="disabled" disabled>
                          <FaInfoCircle />
                          <span>About</span>
                        </button>
                        <button type="button" className="save-profile-btn" onClick={handleSave} disabled={isSavingUser}>
                          {isSavingUser ? (
                            <FaSpinner className="spin" />
                          ) : isAlreadySaved ? (
                            <FaBookmark />
                          ) : (
                            <FaRegBookmark />
                          )}
                          <span>{isAlreadySaved ? "Saved" : "Save"}</span>
                        </button>
                      </div>
                      <AboutUser />
                    </>
                  ) : null}
                </>
              )
            )}
          </div>
        </div>
      </div>

      {/* 4. Guestbook Reviews Segment */}
      {user && !loading && !error && user.userPro && (
        <div className="ProfileContainer-container-bottom">
          <Label label="Community Reviews" />
          
          <div className="comment-container">
            <div className="comment-avatar-wrapper">
              <Profile src={currentUser?.avatar} />
            </div>
            <textarea
              className="comment-box"
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Leave a review or comment on this handyman..."
            />
            <button type="button" className="btn-comment-submit" onClick={handleCommentSubmit} disabled={isSubmittingComment || !newComment.trim()}>
              {isSubmittingComment ? <FaSpinner className="spin" /> : <FaPaperPlane />}
              <span>{isSubmittingComment ? "Posting..." : "Comment"}</span>
            </button>
          </div>
          
          <div className="comment-area">
            <ul>
              {user?.comments && user.comments.length > 0 ? (
                user.comments.map((comment, index) => (
                  <li className="comment-item" key={index}>
                    <div className="comment-item-header">
                      <div className="comment-area-profile">
                        <Profile src={comment.userAvatar} />
                        <p className="commenter-name">{comment.userName}</p>
                      </div>
                      
                      {currentUser && (currentUser._id === comment.userComment || currentUser.isAdmin) && (
                        <button 
                          type="button" 
                          className="delete-comment-btn"
                          onClick={() => handleCommentDelete(comment._id)}
                          title="Delete comment"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                    
                    <div className="comment-area-comments">
                      <p className="comment-text">{comment.comment}</p>
                    </div>
                  </li>
                ))
              ) : (
                <div className="no-comments-fallback">
                  <p>No reviews or comments yet. Be the first to write one!</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUser;
