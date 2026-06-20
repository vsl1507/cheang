import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  FaComment,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegSave,
  FaSave,
  FaThumbsDown,
  FaWrench,
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
import Button from "../../components/button/Button";
import ServiceSelectorUser from "../serviceSelectorUser/ServiceSelectorUser";
import { NavigationLink } from "../../components/navigationLink/NavigationLink";
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

  useEffect(() => {
    if (user) {
      setNormal(user.userPro ? "service" : "about");
    }
  }, [user]);

  ////////////////Rating////////////////////////////
  const [userRating, setUserRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setFormData({
      ...formData,
      userRating: newRating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        return;
      }

      setUser(data.data || data);

      const updatedUserResponse = await fetch(
        `/api/user/getUser/${params.userId}`
      );
      const updatedUserData = await updatedUserResponse.json();
      setUser(updatedUserData.data || updatedUserData);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const averageRating =
    user && user.ratings && user.ratings.length > 0
      ? user.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
        user.ratings.length
      : 0;

  ///////////Comments//////////
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (e) => {
    try {
      e.preventDefault();

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
        return;
      }
      setUser(data.data || data);

      const updatedUserResponse = await fetch(
        `/api/user/getUser/${params.userId}`
      );
      const updatedUserData = await updatedUserResponse.json();
      setUser(updatedUserData.data || updatedUserData);

      setNewComment("");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
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

  ///////////Save User//////////
  const handleSave = async () => {
    try {
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
    } catch (error) {
      dispatch(updateUserFailure(error.message));
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
      <div className="ProfileContainer-container">
        <div className="ProfileContainer-container-left">
          {loading && <p className="loading-text">Loading...</p>}
          {error && <p className="error-text">Something went wrong!</p>}
          {user && !loading && !error && (
            user.userPro ? (
              <div className={`userprofileDetail ${theme} pro-card`}>
                <div className="profile-banner pro-banner"></div>
                <div className="userserviceDetail-container" key={user.id}>
                  <div className="profile-avatar-wrapper">
                    <Profile src={user.avatar} />
                    <span className="account-badge pro-badge">Pro</span>
                  </div>
                  <Label label={user.brandName || "Repair Provider"} />
                  <h3 className="profile-owner-name">Owner: {user.nameuser}</h3>
                  <div className="userserviceDetail-container-tag">
                    {user.mainService && user.mainService !== "None" && user.mainService !== "NONE" && <Tag label={user.mainService} />}
                    {user.subService && user.subService !== "None" && user.subService !== "NONE" && <Tag label={user.subService} />}
                    {(!user.mainService || user.mainService === "None" || user.mainService === "NONE") && <Tag label="Handyman Account" />}
                  </div>
                  <div className="userserviceDetail-container-rate">
                    <ShowStar rating={averageRating.toFixed(2)} />
                    <p>{averageRating.toFixed(2)}</p>
                  </div>
                  <div className="userserviceDetail-container-detail">
                    <div className="TextBorder-container">
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
                  </div>
                  <div className="userserviceDetail-container-rating">
                    <StarRating
                      userId={params.userId}
                      onChange={handleRatingChange}
                    />
                    <button onClick={handleSubmit}>Submit Rating</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`userprofileDetail ${theme} client-card`}>
                <div className="profile-banner client-banner"></div>
                <div className="userserviceDetail-container" key={user.id}>
                  <div className="profile-avatar-wrapper">
                    <Profile src={user.avatar} />
                    <span className="account-badge client-badge">Client</span>
                  </div>
                  <Label label={user.nameuser} />
                  <div className="userserviceDetail-container-detail">
                    <div className="TextBorder-container">
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
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        <div className="ProfileContainer-container-right">
          <div className="profileTodo">
            {user && !loading && !error && (
              user.userPro ? (
                <>
                  {normal === "service" ? (
                    <>
                      <div className="serviceDetail-container">
                        <button className="disabled" disabled>
                          <FaWrench style={{ marginRight: "8px" }} />
                          Service
                        </button>
                        <button onClick={() => setNormal("about")}>
                          <FaInfoCircle style={{ marginRight: "8px" }} />
                          About
                        </button>
                        <button onClick={handleSave}>
                          {isAlreadySaved ? (
                            <>
                              <FaRegSave style={{ marginRight: "8px" }} />
                              Unsave
                            </>
                          ) : (
                            <>
                              <FaSave style={{ marginRight: "8px" }} />
                              Save
                            </>
                          )}
                        </button>
                      </div>
                      <ServiceSelectorUser />
                    </>
                  ) : normal === "about" ? (
                    <>
                      <div className="serviceDetail-container">
                        <button onClick={() => setNormal("service")}>
                          <FaWrench style={{ marginRight: "8px" }} />
                          Service
                        </button>
                        <button className="disabled" disabled>
                          <FaInfoCircle style={{ marginRight: "8px" }} />
                          About
                        </button>
                        <button onClick={handleSave}>
                          {isAlreadySaved ? (
                            <>
                              <FaRegSave style={{ marginRight: "8px" }} />
                              Unsave
                            </>
                          ) : (
                            <>
                              <FaSave style={{ marginRight: "8px" }} />
                              Save
                            </>
                          )}
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
                          <FaInfoCircle style={{ marginRight: "8px" }} />
                          About
                        </button>
                        <button onClick={handleSave}>
                          {isAlreadySaved ? (
                            <>
                              <FaRegSave style={{ marginRight: "8px" }} />
                              Unsave
                            </>
                          ) : (
                            <>
                              <FaSave style={{ marginRight: "8px" }} />
                              Save
                            </>
                          )}
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

      {user && !loading && !error && user.userPro && (
        <div className="ProfileContainer-container-bottom">
          <Label label="Comments" />
          <div className="comment-container">
            <Profile src={currentUser?.avatar} />
            <textarea
              className="comment-box"
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Type your comment..."
            />
            <button onClick={handleCommentSubmit}>
              <FaComment style={{ marginRight: "8px" }} />
              Comments
            </button>
          </div>
          <div className="comment-area">
            <ul>
              {user?.comments.map((comment, index) => (
                <li className="comment-item" key={index}>
                  <div className="comment-area-profile">
                    <Profile src={comment.userAvatar} />
                    <p>{comment.userName}</p>
                  </div>
                  <div className="comment-area-comments">
                    <p>{comment.comment}</p>
                    {currentUser && (currentUser._id === comment.userComment || currentUser.isAdmin) && (
                      <NavigationLink
                        onClick={() => handleCommentDelete(comment._id)}
                        value="Delete"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUser;
