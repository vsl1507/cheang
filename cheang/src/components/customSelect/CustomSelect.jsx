import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { FaChevronDown } from "react-icons/fa";
import "./CustomSelect.scss";

const CustomSelect = ({ value, onChange, options = [], placeholder, icon, disabled }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    // Return standard event-like object structure for compatibility with native change handlers
    onChange({ target: { value: option } });
    setIsOpen(false);
  };

  const getOptionLabel = (option) => {
    return typeof option === "object" && option !== null ? option.label : option;
  };

  const getOptionValue = (option) => {
    return typeof option === "object" && option !== null ? option.value : option;
  };

  const selectedOption = options.find((o) => getOptionValue(o) === value);
  const triggerText = selectedOption ? getOptionLabel(selectedOption) : (value || placeholder);

  return (
    <div
      className={`custom-select-container ${theme} ${disabled ? "disabled" : ""} ${isOpen ? "open" : ""}`}
      ref={containerRef}
    >
      <div className="custom-select-trigger" onClick={handleToggle}>
        {icon && <span className="custom-select-icon">{icon}</span>}
        <span className="custom-select-text">
          {triggerText}
        </span>
        <span className="custom-select-arrow">
          <FaChevronDown />
        </span>
      </div>
      
      {isOpen && (
        <div className="custom-select-options-list">
          {placeholder && (
            <div
              className={`custom-select-option placeholder-option ${value === "" ? "selected" : ""}`}
              onClick={() => handleSelect("")}
            >
              {placeholder}
            </div>
          )}
          {options.map((option) => {
            const optVal = getOptionValue(option);
            const optLabel = getOptionLabel(option);
            return (
              <div
                key={optVal}
                className={`custom-select-option ${value === optVal ? "selected" : ""}`}
                onClick={() => handleSelect(optVal)}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
