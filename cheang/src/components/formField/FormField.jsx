import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./FormField.scss";

const FormField = ({
  type,
  name,
  step,
  value,
  onChange,
  placeholder,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="formField-wrapper" style={{ position: "relative", width: "100%" }}>
      <input
        className="formField-input"
        type={isPassword && showPassword ? "text" : type}
        id={name}
        name={name}
        step={step}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={isPassword ? { paddingRight: "2.5rem", width: "100%" } : { width: "100%" }}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "#888",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10
          }}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      )}
    </div>
  );
};

export default FormField;
