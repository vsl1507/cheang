import { useTheme } from "../../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import "./ThemeSelector.scss";

const ThemeSelector = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle-btn ${theme}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      type="button"
    >
      <div className="icon-wrapper">
        {theme === "light" ? (
          <FaSun className="sun-icon" />
        ) : (
          <FaMoon className="moon-icon" />
        )}
      </div>
    </button>
  );
};

export default ThemeSelector;
