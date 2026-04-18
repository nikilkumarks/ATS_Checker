import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from './context/ThemeContext';
import { ToggleProvider } from './context/ToggleContext';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const appTree = (
  <BrowserRouter>
    <ThemeProvider>
      <ToggleProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </ToggleProvider>
    </ThemeProvider>
  </BrowserRouter>
);

createRoot(document.getElementById('root')).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      {appTree}
    </GoogleOAuthProvider>
  ) : (
    appTree
  )
)

