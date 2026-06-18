import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import AdminAppLayout from "../layouts/AdminAppLayout";
import Label from "../../components/label/Label";
import "./ConfirmPage.scss";
import {
  FaArrowDown,
  FaArrowUp,
  FaLocationArrow,
  FaPeopleArrows,
  FaShopify,
  FaUser,
  FaWrench,
} from "react-icons/fa";
const ConfirmPage = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [confirmData, setConfirmData] = useState({
    userPro: true,
    Confirm: true,
    Request: false,
  });
  const [rejectData, setRejectData] = useState({
    Request: false,
    userPro: false,
    Confirm: false,
  });

  const handleShow = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
    }
  };

  const handleConfirm = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/updateconfirm/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(true);
        return;
      }
      setLoading(false);
      setUsers(data);
      window.location.reload();
    } catch (error) {
      setError(true);
    }
  };

  const handleReject = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/updateconfirm/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rejectData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(true);
        return;
      }
      setLoading(false);
      setUsers(data);
      window.location.reload();
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/usersreq");
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      setUsers(data);
      setLoading(false);
    };

    fetchUser();
  }, [currentUser]);

  return (
    <AdminAppLayout>
      <div className="confirm-contain">
        <Label label="Confirm Professional Accounts" />
        <div className="confirm-container">
          {loading && <div className="loading-state">Loading...</div>}
          {error && <div className="error-state">Error: {error}</div>}
          {!loading && !error && (
            <>
              {users.length === 0 ? (
                <div className="empty-state-card">
                  <p>No handyman requests pending confirmation.</p>
                </div>
              ) : (
                users.map((user) => (
                  <div className="list-user" key={user._id}>
                    <div className="user-confirm">
                      <img src={user.avatar} alt={user.nameuser} />
                      <div className="user-confirm-name">
                        <p>
                          <FaUser style={{ marginRight: "8px" }} />
                          Owner: <strong>{user.nameuser}</strong>
                        </p>
                        <p>
                          <FaWrench style={{ marginRight: "8px" }} />
                          Brand Name: <strong>{user.brandName}</strong>
                        </p>
                        <p>
                          <FaLocationArrow style={{ marginRight: "8px" }} />
                          Location: <strong>{user.city || "N/A"}, {user.province || "N/A"}</strong>
                        </p>
                      </div>
                      <div className="user-button">
                        <button onClick={() => handleConfirm(user._id)}>
                          Confirm
                        </button>
                        <button onClick={() => handleReject(user._id)}>
                          Reject
                        </button>
                      </div>
                    </div>
                    <div>
                      {expandedUserId === user._id ? (
                        <div className="user-show">
                          <div className="user-detail">
                            <p><strong>Description:</strong> {user.brandName || "No description provided."}</p>
                          </div>
                          <div className="user-confirm-detail">
                            <p><strong>Type Service:</strong> {user.typeService || "N/A"}</p>
                            <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                            <p><strong>Location:</strong> {user.city || "N/A"}, {user.province || "N/A"}</p>
                          </div>
                          <div className="see-more-btn-container">
                            <button className="see-more-toggle" onClick={() => handleShow(user._id)}>
                              See Less <FaArrowUp style={{ fontSize: "12px" }} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="see-more-btn-container">
                          <button className="see-more-toggle" onClick={() => handleShow(user._id)}>
                            See More <FaArrowDown style={{ fontSize: "12px" }} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </AdminAppLayout>
  );
};

export default ConfirmPage;
