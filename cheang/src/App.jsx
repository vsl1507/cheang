import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpPage from "./page/SignUpPage";
import HomePage from "./page/HomePage";
import SignInPage from "./page/SignInPage";
import NotFoundPage from "./page/NotFoundPage";
import MainNavbar from "./layouts/navbar/MainNavbar";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import Dashboard from "./admin/page/DashboardPage";
import "./App.scss";
import SignUpPro from "./selector/formSelector/SignUpPro";
import AdminSignInPage from "./admin/page/SignInPage";
import DashboardPage from "./admin/page/DashboardPage";
import ShowPieChart from "./admin/components/pieChart/ShowPieChart";
import ConfirmPage from "./admin/page/ConfirmPage";
import AboutPage from "./page/AboutPage";
import GuidelinesPage from "./page/GuidelinesPage";
import FAQPage from "./page/FAQPage";
import HelpPage from "./page/HelpPage";
import ContactPage from "./page/ContactPage";
import PrivacyPage from "./page/PrivacyPage";
import TermsPage from "./page/TermsPage";
import CookiesPage from "./page/CookiesPage";
import CancellationPage from "./page/CancellationPage";
import UsersList from "./page/UsersListPage";
import SearchFilter from "./components/searchFilter/SearchFilter";
import ProfileUserPage from "./page/ProfileUserPage";
import PrivateRoute from "./components/privateRoutes/PrivateRoute";
import PrivateRouteAdmin from "./components/privateRoutes/PrivateRouteAdmin";
import AllUsersListPage from "./page/AllUsersListPage";
import ProfileUserCurrentPage from "./page/ProfileUserCurrentPage";
import PrivateRouteUser from "./components/privateRoutes/PrivateRouteUser";
import ForgotPassword from "./page/ForgotPassword";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" Component={HomePage} />
            <Route path="*" Component={NotFoundPage} />

            {/* User */}
            {/* <Route path="/signup" Component={SignUpPage} />
            <Route path="/signin" Component={SignInPage} /> */}
            <Route path="/signup-pro" Component={SignUpPro} />
            <Route path="/about" Component={AboutPage} />
            <Route path="/guidelines" Component={GuidelinesPage} />
            <Route path="/faq" Component={FAQPage} />
            <Route path="/help" Component={HelpPage} />
            <Route path="/contact" Component={ContactPage} />
            <Route path="/privacy" Component={PrivacyPage} />
            <Route path="/terms" Component={TermsPage} />
            <Route path="/cookies" Component={CookiesPage} />
            <Route path="/cancellation-policy" Component={CancellationPage} />
            <Route path="userlist/:typeservice" Component={UsersList} />
            <Route path="service" Component={AllUsersListPage} />
            <Route path="forgetpassword" Component={ForgotPassword} />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="profile/:userId" Component={ProfileUserPage} />
              <Route path="profile" Component={ProfileUserCurrentPage} />
            </Route>

            <Route element={<PrivateRouteUser />}>
              <Route path="/signup" Component={SignUpPage} />
              <Route path="/signin" Component={SignInPage} />
            </Route>

            {/* Admin */}
            <Route element={<PrivateRouteAdmin />}>
              <Route path="/admin/dashboard" Component={DashboardPage} />
              <Route path="/admin/dashboard/confirm" Component={ConfirmPage} />
            </Route>
            <Route path="/admin/signin" Component={AdminSignInPage} />

            {/* Test */}
            <Route path="test" Component={SearchFilter} />
            <Route path="pie" Component={ShowPieChart} />
          </Routes>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
