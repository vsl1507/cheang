import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../../firebase";
import { signInSuccess } from "../../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useTheme } from "../../../context/ThemeContext";
import "../../../components/oAuth/OAuth.scss";

const AdminOAuth = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameuser: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      const user = data.data?.user;
      if (!user || (!user.admin && user.role?.name !== "Admin")) {
        console.error("Access denied. Administrative privileges required.");
        return;
      }
      dispatch(signInSuccess(user));
      navigate("/admin/dashboard");
    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };

  return (
    <button
      type="button"
      className={`google-auth-btn ${theme}`}
      onClick={handleGoogleClick}
    >
      <FcGoogle className="google-icon" />
      <span>Continue with Google</span>
    </button>
  );
};

export default AdminOAuth;
