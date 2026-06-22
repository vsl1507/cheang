import { signOutUserSuccess } from "../redux/user/userSlice";

let refreshPromise = null;

export const setupFetchInterceptor = (store) => {
  const originalFetch = window.fetch;

  window.fetch = async function (url, options = {}) {
    // Standard response fetching
    let response;
    try {
      response = await originalFetch(url, options);
    } catch (error) {
      throw error;
    }

    // Identify if the request is an authentication path to avoid circular loops
    const urlString = typeof url === "string" ? url : url.url || "";
    const isAuthRoute = /\/api\/auth\/(signin|signup|google|signout|refresh-token)/.test(urlString);

    // If the response is unauthorized (401) or forbidden (403) and not an auth route
    if ((response.status === 401 || response.status === 403) && !isAuthRoute) {
      // If we don't have a currentUser in Redux, there's no session to refresh
      const state = store.getState();
      const currentUser = state.user?.currentUser;
      if (!currentUser) {
        return response;
      }

      // Lock / Queue to prevent multiple parallel refresh calls
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshRes = await originalFetch("/api/auth/refresh-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (refreshRes.ok) {
              const data = await refreshRes.json();
              return data.success;
            }
            return false;
          } catch (err) {
            console.error("Error refreshing token:", err);
            return false;
          }
        })();
      }

      const refreshSuccess = await refreshPromise;
      
      // Reset the promise after it finishes
      refreshPromise = null;

      if (refreshSuccess) {
        // Retry the original request
        try {
          return await originalFetch(url, options);
        } catch (retryError) {
          throw retryError;
        }
      } else {
        // Refresh token is invalid or expired. Clear session and log out.
        localStorage.removeItem("authToken");
        store.dispatch(signOutUserSuccess());
      }
    }

    return response;
  };
};
