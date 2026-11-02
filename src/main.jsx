import { StrictMode } from "react"
import { BrowserRouter } from "react-router-dom"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { I18nProvider } from "./i18n"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
