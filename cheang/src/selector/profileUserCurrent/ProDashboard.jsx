import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProAppLayout from "../../layouts/ProAppLayout";
import ProOverview from "./ProOverview";
import ServiceSelector from "../serviceSelector/ServiceSelector";
import ServiceCreate from "../serviceCreate/ServiceCreate";
import AboutUser from "../aboutUser/AboutUser";
import SaveUser from "../saveUser/SaveUser";
import SettingUser from "../settingUser/SettingUser";

const ProDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();

  // Sync active tab if passed via router state (e.g. from navbar dropdown clicking Settings)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  return (
    <ProAppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="pro-dashboard-content-card">
        {activeTab === "dashboard" && <ProOverview setActiveTab={setActiveTab} />}
        {activeTab === "service" && <ServiceSelector setActiveTab={setActiveTab} />}
        {activeTab === "addService" && <ServiceCreate />}
        {activeTab === "about" && <AboutUser />}
        {activeTab === "save" && <SaveUser />}
        {activeTab === "setting" && <SettingUser />}
      </div>
    </ProAppLayout>
  );
};

export default ProDashboard;
