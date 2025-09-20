import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
// import logo from "./assets/logo.jpg"; 
// const link = document.querySelector("link[rel~='icon']");
// if (link) {
//   link.href = logo;
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="576242058085-d7olhva4s8fadk5qen85l65hjide2do5.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)