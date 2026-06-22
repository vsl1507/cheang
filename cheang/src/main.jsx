import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { setupFetchInterceptor } from "./utils/setupFetchInterceptor.js";
import { ToastProvider } from "./context/ToastContext.jsx";

// Hook fetch interceptor with store
setupFetchInterceptor(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </PersistGate>
  </Provider>
);
