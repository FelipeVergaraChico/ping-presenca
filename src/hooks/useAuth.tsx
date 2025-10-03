import { useState, useEffect, useCallback } from "react";
import Keycloak, { type KeycloakTokenParsed } from "keycloak-js";

let keycloakInstance: Keycloak | null = null;
let initializationPromise: Promise<{ keycloak: Keycloak; authenticated: boolean }> | null = null;
let refreshTokenInterval: number | null = null;

const useAuth = () => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<unknown>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const updateUserData = useCallback((kc: Keycloak) => {
    if (kc && kc.authenticated && kc.tokenParsed) {
      setUserData(kc.tokenParsed);
      setToken(kc.token ?? null);
      localStorage.setItem("token", kc.token || "");
    } else {
      setUserData(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  }, []);

  const logout = useCallback(() => {
    if (keycloak && keycloak?.authenticated) {
      setIsAuthenticated(false);
      setUserData(null);
      setToken(null);
      localStorage.removeItem("token");
      keycloakInstance = null;
      initializationPromise = null;
      if (refreshTokenInterval) {
        clearInterval(refreshTokenInterval);
        refreshTokenInterval = null;
      }
      keycloak.logout({ redirectUri: `${window.location.origin}/login` });
    } else {
      console.warn("No active session to logout from.");
      setIsAuthenticated(false);
      setUserData(null);
      setToken(null);
      localStorage.removeItem("token");
      keycloakInstance = null;
      initializationPromise = null;
      window.location.href = "/login";
    }
  }, [keycloak]);

  const checkTokenRefresh = useCallback(() => {
    if (keycloak && keycloak.authenticated) {
      try {
        const tokenParsed = keycloak.tokenParsed as KeycloakTokenParsed | undefined;
        const currentTime = Math.floor(new Date().getTime() / 1000);

        if (tokenParsed && tokenParsed.exp) {
          const timeToExpire = tokenParsed.exp - currentTime;

          if (timeToExpire < 10) {
            logout();
            return false;
          }

          if (timeToExpire < 60) {
            keycloak
              .updateToken(70)
              .then((refreshed) => {
                if (refreshed) {
                  console.log("Token refreshed successfully");
                  updateUserData(keycloak);
                  setKeycloak({ ...keycloak } as Keycloak);
                } else {
                  console.warn("Failed to refresh token");
                }
              })
              .catch((error) => {
                console.error("Error refreshing token:", error);
              });
          }
        } else {
          if (keycloak.isTokenExpired()) {
            console.warn("Token expired, logging out");
            logout();
            return false;
          }
        }
        return true;
      } catch (error) {
        console.error("Error checking token expiration:", error);
        logout();
        return false;
      }
    }
    return false;
  }, [keycloak, logout, updateUserData]);

  useEffect(() => {
    if (isInitialized && keycloak?.authenticated) {
      updateUserData(keycloak);

      const handleRouteChange = () => {
        checkTokenRefresh();
      };

      window.addEventListener("popstate", handleRouteChange);
      const originalPushState = window.history.pushState;
      window.history.pushState = function (...args) {
        originalPushState.apply(this, args);
        checkTokenRefresh();
      };

      if (!refreshTokenInterval) {
        refreshTokenInterval = setInterval(() => {
          checkTokenRefresh();
        }, 5000);
      }
      return () => {
        window.removeEventListener("popstate", handleRouteChange);
        window.history.pushState = originalPushState;
        if (refreshTokenInterval) {
          clearInterval(refreshTokenInterval);
          refreshTokenInterval = null;
        }
      };
    }
  }, [isInitialized, keycloak, checkTokenRefresh, updateUserData]);

  useEffect(() => {
    if (keycloakInstance && keycloakInstance.authenticated !== undefined) {
      setKeycloak(keycloakInstance);
      setIsAuthenticated(keycloakInstance.authenticated);
      setIsInitialized(true);
      if (keycloakInstance.authenticated) {
        updateUserData(keycloakInstance);
      }
      return;
    }
    if (initializationPromise) {
      initializationPromise
        .then((result) => {
          setKeycloak(result.keycloak);
          setIsAuthenticated(result.authenticated);
          setIsInitialized(true);
          if (result.authenticated) {
            updateUserData(result.keycloak);
          }
        })
        .catch((error) => {
          console.error("Keycloak initialization error:", error);
          setIsInitialized(true);
        });
      return;
    }

    const keycloakConfig = {
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    }
    if (!keycloakConfig.url || !keycloakConfig.realm || !keycloakConfig.clientId) {
      console.error("Keycloak configuration is missing. Please check environment variables.", keycloakConfig);
      setIsInitialized(true);
      return;
    }
    const kc = new Keycloak(keycloakConfig);
    keycloakInstance = kc;

    initializationPromise = new Promise<{ keycloak: Keycloak; authenticated: boolean }>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Keycloak initialization timed out"));
      }, 10000);

      kc.init({
        onLoad: "check-sso",
        checkLoginIframe: false,
        pkceMethod: "S256",
        flow: "standard",
      })
        .then((auth) => {
          clearTimeout(timeout);
          console.log("Keycloak initialized:", auth);
          resolve({ keycloak: kc, authenticated: auth });
        })
        .catch((error) => {
          clearTimeout(timeout);
          console.log("Keycloak init error:", error);
          reject(error);
        });
    });

    initializationPromise
      .then((result) => {
        setKeycloak(result.keycloak);
        setIsAuthenticated(result.authenticated);
        setIsInitialized(true);
        if (result.authenticated) {
          updateUserData(result.keycloak);
        }
      })
      .catch((error) => {
        console.error("Keycloak initialization error:", error);
        setIsInitialized(true);
        setIsAuthenticated(false);
      });
  }, [updateUserData]);

  const login = useCallback(() => {
    if (keycloak && !isAuthenticated) {
      keycloak.login({ redirectUri: `${window.location.origin}/dashboard` });
    }
  }, [keycloak, isAuthenticated]);

  return {
    isAuthenticated,
    userData,
    token,
    isInitialized,
    login,
    logout,
    keycloak,
  };
};

export default useAuth;