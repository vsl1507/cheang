import { useSelector } from "react-redux";
import AppLayout from "../layouts/AppLayout";
import ProfileUserCurrent from "../selector/profileUserCurrent/ProfileUserCurrent";
import ProDashboard from "../selector/profileUserCurrent/ProDashboard";

const ProfileUserCurrentPage = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (currentUser?.userPro) {
    return <ProDashboard />;
  }

  return (
    <AppLayout>
      <ProfileUserCurrent />
    </AppLayout>
  );
};

export default ProfileUserCurrentPage;
