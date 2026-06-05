import { useEffect, useState } from "react";
import AdsModal from "../components/adsModal/AdsModal";
import AppLayout from "../layouts/AppLayout";
import UsersSelector from "../selector/userSelector/UsersSelector";

const HomePage = () => {
  // Initialize showAdModal based on stored values to prevent flash
  const [showAdModal, setShowAdModal] = useState(() => {
    const lastShownDate = localStorage.getItem("adModalLastShown");
    const shownDuringSession = sessionStorage.getItem(
      "adModalShownDuringSession"
    );

    // Show modal if it hasn't been shown today or during this session
    return (
      !lastShownDate ||
      new Date(lastShownDate).getDate() !== new Date().getDate() ||
      !shownDuringSession
    );
  });

  useEffect(() => {
    // Only update storage if modal should be shown
    if (showAdModal) {
      localStorage.setItem("adModalLastShown", new Date().toISOString());
      sessionStorage.setItem("adModalShownDuringSession", "true");
    }
  }, [showAdModal]);

  // Close Ad Modal
  const handleCloseAdModal = () => {
    setShowAdModal(false);
  };

  return (
    <AppLayout page="home">
      <UsersSelector />
      <div className="main-container">
        {showAdModal && <AdsModal onClose={handleCloseAdModal} />}
      </div>
    </AppLayout>
  );
};

export default HomePage;
