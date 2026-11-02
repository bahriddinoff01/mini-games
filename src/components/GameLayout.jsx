import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useI18n } from "../i18n"
import { useAuth } from "../context/AuthContext"

// Shared page shell for every game: back link, icon, title, subtitle, content.
const GameLayout = ({ icon, title, subtitle, maxWidth = "max-w-xl", children }) => {
  const { t } = useI18n()
  return (
    <main className="px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className={`mx-auto w-full ${maxWidth}`}>
        <Link to="/" className="btn-ghost -ml-3 mb-6 text-sm">
          ← {t("common.allGames")}
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl">
            {icon}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
        </motion.header>

        {children}
      </div>
    </main>
  )
}

// Small labelled number, used for scores, timers and attempts.
export const Stat = ({ label, value, accent = false }) => (
  <div className={`panel px-3 py-3 text-center ${accent ? "border-brand-200 bg-brand-50" : ""}`}>
    <div className="hyphens-auto break-words text-[10px] font-semibold uppercase leading-tight tracking-wide text-muted sm:text-xs sm:tracking-wider">
      {label}
    </div>
    <div className={`mt-1 truncate text-2xl font-bold tabular-nums ${accent ? "text-brand-700" : ""}`}>{value}</div>
  </div>
)

// Colored message box for win / lose / neutral results.
const tones = {
  win: "bg-win-soft text-win-fg border-win/30",
  lose: "bg-lose-soft text-lose-fg border-lose/30",
  warn: "bg-warn-soft text-warn-fg border-warn/30",
  info: "bg-brand-50 text-brand-700 border-brand-200",
}
export const Banner = ({ tone = "info", children }) => (
  <motion.div
    key={String(children)}
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-xl border px-4 py-3 text-center font-medium ${tones[tone]}`}
  >
    {children}
  </motion.div>
)

// Small line under a result: "Saved ✓" or "Log in to save".
export const SaveNote = ({ status }) => {
  const { t } = useI18n()
  const { configured } = useAuth()
  if (!status || status === "saving" || !configured) return null
  if (status === "saved") return <p className="mt-2 text-center text-sm text-win-fg">{t("common.saved")}</p>
  if (status === "error") return <p className="mt-2 text-center text-sm text-lose-fg">{t("auth.genericError")}</p>
  return (
    <p className="mt-2 text-center text-sm text-muted">
      <Link to="/login" className="font-medium text-brand-700 underline-offset-2 hover:underline">
        {t("common.loginToSave")}
      </Link>
    </p>
  )
}

export default GameLayout
