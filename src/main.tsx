import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async";
import './index.css'
import App from './App.tsx'

// index.html carries static SEO tags for non-JS crawlers; once the app runs,
// each page sets its own via Helmet, so drop the static copies to avoid duplicates.
document.querySelectorAll("[data-static-seo]").forEach((el) => el.remove());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
