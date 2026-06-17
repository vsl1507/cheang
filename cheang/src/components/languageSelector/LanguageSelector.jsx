/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { FaGlobe, FaChevronDown } from "react-icons/fa";
import "./LanguageSelector.scss";

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English", short: "EN" },
    { code: "kh", name: "ភាសាខ្មែរ", short: "KH" },
    { code: "zh", name: "中文", short: "ZH" },
  ];

  const currentLangObj =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (code) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className="language-selector-custom" ref={dropdownRef}>
      <button
        type="button"
        className={`lang-btn ${isOpen ? "active" : ""}`}
        onClick={toggleDropdown}
      >
        <FaGlobe className="globe-icon" />
        <span className="lang-text">{currentLangObj.short}</span>
        <FaChevronDown className={`chevron-icon ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <ul className="lang-dropdown-menu">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                className={`lang-option ${
                  lang.code === currentLanguage ? "selected" : ""
                }`}
                onClick={() => handleSelectLanguage(lang.code)}
              >
                <span className="option-name">{lang.name}</span>
                {lang.code === currentLanguage && (
                  <span className="check-mark">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
