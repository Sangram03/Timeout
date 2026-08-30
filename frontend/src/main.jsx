import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

import "./index.css";
import App from "./App.jsx";
import Maintenance from "./Maintenance.jsx";

// Automatically log out user if token expires
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

const maintenance = false;

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={googleClientId}>
            {maintenance ? <Maintenance /> : <App />}
        </GoogleOAuthProvider>
    </StrictMode>
);