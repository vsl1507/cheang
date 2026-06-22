import React, { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import ProAppLayout from "../../layouts/ProAppLayout";
import ProOverview from "./ProOverview";
import ServiceSelector from "../serviceSelector/ServiceSelector";
import ServiceCreate from "../serviceCreate/ServiceCreate";
import AboutUser from "../aboutUser/AboutUser";
import SaveUser from "../saveUser/SaveUser";
import SettingUser from "../settingUser/SettingUser";
import BookingRequest from "../bookingRequest/BookingRequest";

const ProDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const location = useLocation();

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  // Sync active tab if passed via router state (e.g. from navbar dropdown clicking Settings)
  useEffect(() => {
    if (location.state?.activeTab) {
      setSearchParams({ tab: location.state.activeTab });
    }
  }, [location, setSearchParams]);

  return (
    <ProAppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="pro-dashboard-content-card">
        {activeTab === "dashboard" && <ProOverview setActiveTab={setActiveTab} />}
        {activeTab === "service" && <ServiceSelector setActiveTab={setActiveTab} />}
        {activeTab === "addService" && <ServiceCreate />}
        {activeTab === "about" && <AboutUser />}
        {activeTab === "save" && <SaveUser />}
        {activeTab === "bookings" && <BookingRequest />}
        {activeTab === "setting" && <SettingUser />}
      </div>
    </ProAppLayout>
  );
};

export default ProDashboard;
