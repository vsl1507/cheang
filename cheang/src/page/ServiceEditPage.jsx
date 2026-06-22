import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import ProAppLayout from "../layouts/ProAppLayout";
import AppLayout from "../layouts/AppLayout";
import ServiceUpdate from "../selector/serviceUpdate/ServiceUpdate";

const ServiceEditPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const [serviceName, setServiceName] = useState("");

  const handleClose = () => {
    // Go back to the dashboard services view
    if (currentUser?.userPro) {
      navigate("/profile", { state: { activeTab: "service" } });
    } else {
      navigate(-1);
    }
  };

  const handleSuccess = () => {
    if (currentUser?.userPro) {
      navigate("/profile", { state: { activeTab: "service" } });
    } else {
      navigate(-1);
    }
  };

  // If Pro user, wrap in the specialized dashboard layout context and match pro card style
  if (currentUser?.userPro) {
    return (
      <ProAppLayout
        activeTab="service"
        breadcrumbActiveLabel={serviceName ? `Edit: ${serviceName}` : "Edit Service"}
      >
        <div className="pro-dashboard-content-card">
          <ServiceUpdate
            serviceId={serviceId}
            onClose={handleClose}
            onSuccess={handleSuccess}
            onServiceLoaded={setServiceName}
          />
        </div>
      </ProAppLayout>
    );
  }

  // Fallback for regular or admin views
  return (
    <AppLayout>
      <div
        className="service-edit-page-wrapper"
        style={{
          padding: "2rem 1.5rem",
          maxWidth: "960px",
          margin: "0 auto",
          minHeight: "calc(100vh - 12rem)",
        }}
      >
        <div
          className="pro-dashboard-content-card"
          style={{
            background: theme === "dark" ? "#1e1b19" : "#ffffff",
            border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.06)",
            borderRadius: "1rem",
            padding: "2.25rem",
            boxShadow: theme === "dark" ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : "0 10px 30px -10px rgba(0, 0, 0, 0.06)",
          }}
        >
          <ServiceUpdate
            serviceId={serviceId}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default ServiceEditPage;
