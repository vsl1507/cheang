/* eslint-disable react/prop-types */
import "./Button.scss";

const Button = ({ value, icon, onClick, disabled, type }) => {
  return (
    <div className="btn">
      <button className="btn" onClick={onClick} disabled={disabled} type={type}>
        {icon}
        {value}
      </button>
    </div>
  );
};

export default Button;
