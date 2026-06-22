import React, { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import "./ToastContext.scss";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  }, [removeToast]);

  const getIcon = (type) => {
    switch (type) {
      case "error": return <FaExclamationCircle />;
      case "warning": return <FaExclamationTriangle />;
      case "info": return <FaInfoCircle />;
      default: return <FaCheckCircle />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Overlay Wrapper */}
      <div className="toast-overlay-wrapper">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card-item ${toast.type}`}>
            <span className="toast-icon-box">{getIcon(toast.type)}</span>
            <span className="toast-message-text">{toast.message}</span>
            <button 
              className="toast-close-btn" 
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
