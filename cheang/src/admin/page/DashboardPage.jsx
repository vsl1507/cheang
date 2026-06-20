import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Label from "../../components/label/Label";
import AdminAppLayout from "../layouts/AdminAppLayout";
import UserBreakdownChart from "../components/pieChart/UserBreakdownChart";
import { useLanguage } from "../../context/LanguageContext";
import { FaUsers, FaUser, FaWrench, FaArrowRight, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./DashboardPage.scss";

const DashboardPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { language } = useLanguage();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user/countusers");
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setUsers(data.data || data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUser]);

  const clientUsers = users.filter((user) => !user.userPro);
  const proUsers = users.filter((user) => user.userPro);

  // Get 5 most recent signups
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <AdminAppLayout>
      <div className="dashboard-contain">
        <Label label={language === "kh" ? "ផ្ទាំងគ្រប់គ្រង Admin" : "Admin Dashboard"} />

        {/* Stats Cards Grid */}
        <div className="users-container">
          <div className="user-box total-users-card">
            <div className="card-header">
              <h3>Total Users</h3>
              <span className="card-icon total-icon"><FaUsers /></span>
            </div>
            <p className="card-value">{users.length}</p>
            <span className="card-desc">Active accounts registered</span>
          </div>

          <div className="user-box clients-card">
            <div className="card-header">
              <h3>Clients</h3>
              <span className="card-icon clients-icon"><FaUser /></span>
            </div>
            <p className="card-value">{clientUsers.length}</p>
            <span className="card-desc">Standard homeowner accounts</span>
          </div>

          <div className="user-box pros-card">
            <div className="card-header">
              <h3>Handymen Pro</h3>
              <span className="card-icon pros-icon"><FaWrench /></span>
            </div>
            <p className="card-value">{proUsers.length}</p>
            <span className="card-desc">Verified service providers</span>
          </div>
        </div>

        {/* Main Dashboard Layout Grid */}
        <div className="dashboard-main-grid">
          {/* Left / Main Section */}
          <div className="dashboard-left-panel">
            {/* Recent Users List Card */}
            <div className="dashboard-card recent-users-card">
              <div className="card-title-bar">
                <div className="title-left">
                  <FaClock className="title-icon" />
                  <h4>Recent User Registrations</h4>
                </div>
                <span className="badge">New Signups</span>
              </div>
              
              {loading && <div className="card-loading">Loading recent activities...</div>}
              {error && <div className="card-error">Error: {error}</div>}
              
              {!loading && !error && (
                <div className="recent-users-list">
                  {recentUsers.length === 0 ? (
                    <p className="empty-list-txt">No recent users found.</p>
                  ) : (
                    recentUsers.map((user) => (
                      <div className="recent-user-item" key={user._id}>
                        <div className="user-avatar-display">
                          <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256"} alt={user.nameuser} />
                        </div>
                        <div className="user-info">
                          <span className="user-name">{user.nameuser}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                        <div className="user-role-badge">
                          <span className={`role-tag ${user.userPro ? "pro" : "client"}`}>
                            {user.userPro ? "Pro" : "Client"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right / Sidebar Section */}
          <div className="dashboard-right-panel">
            {/* Doughnut Chart Card */}
            <div className="dashboard-card chart-card">
              <h4>User Breakdown</h4>
              <div className="chart-wrapper">
                {!loading && !error && (
                  <UserBreakdownChart clientCount={clientUsers.length} proCount={proUsers.length} />
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="dashboard-card actions-card">
              <h4>Quick Shortcuts</h4>
              <div className="actions-button-grid">
                <Link to="/admin/dashboard/confirm" className="action-btn-link confirm-action">
                  <span>Confirm Handyman Requests</span>
                  <FaArrowRight />
                </Link>
                <Link to="/" className="action-btn-link view-site-action">
                  <span>Visit Marketplace</span>
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
};

export default DashboardPage;
