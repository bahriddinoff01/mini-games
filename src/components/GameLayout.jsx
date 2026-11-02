import { Link } from "react-router-dom"
import { motion } from "framer-motion"

// Shared page shell for every game: back link, icon, title, subtitle, content.
const GameLayout = ({ icon, title, subtitle, maxWidth = "max-w-xl", children }) => {
  return (
    <main className="px-4 sm:px-6 pt-8 pb-16 sm:pt-12">
      <div className={`mx-auto w-full ${maxWidth}`}>
        <Link to="/" className="btn-ghost -ml-3 mb-6 text-sm">
          ← All games
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl">
            {icon}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
        </motion.header>

        {children}
      </div>
    </main>
  )
}

// Small labelled number, used for scores, timers and attempts.
export const Stat = ({ label, value, accent = false }) => (
  <div className={`panel px-3 py-3 text-center ${accent ? "border-brand-200 bg-brand-50" : ""}`}>
    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`mt-1 text-2xl font-bold tabular-nums ${accent ? "text-brand-700" : ""}`}>{value}</div>
  </div>
)

// Colored message box for win / lose / neutral results.
const tones = {
  win: "bg-win-soft text-emerald-800 border-emerald-200",
  lose: "bg-lose-soft text-rose-800 border-rose-200",
  warn: "bg-warn-soft text-amber-800 border-amber-200",
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

export default GameLayout
