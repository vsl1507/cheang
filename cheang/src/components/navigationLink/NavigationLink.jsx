import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./NavigationLink.scss";

export function NavigationLink(props) {
  const { theme } = useTheme();
  const { href, value, style, onClick } = props;
  return (
    <NavLink
      className={({ isActive }) => `navigationLink ${theme} ${isActive ? "active" : ""}`}
      style={style}
      to={href}
      onClick={onClick}
    >
      {value}
    </NavLink>
  );
}

export function NavigationLinkDisabled({ value }) {
  const { theme } = useTheme();
  return (
    <span className={`navigationLinkDisabled ${theme}`}>
      {value}
    </span>
  );
}
