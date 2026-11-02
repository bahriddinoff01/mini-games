import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { activities } from "../data/activities"
import { useI18n } from "../i18n"
import { LANGUAGES } from "../i18n/languages"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

const LanguageMenu = () => {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  const current = LANGUAGES.find((l) => l.code === lang)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-ghost px-2.5 text-sm font-semibold"
        aria-label={t("common.language")}
        aria-expanded={open}
      >
        🌐 {current?.short}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="panel absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden p-1 shadow-lg"
          >
            {LANGUAGES.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => {
                    setLang(l.code)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    l.code === lang ? "bg-brand-50 font-semibold text-brand-700" : "hover:bg-subtle"
                  }`}
                >
                  {l.label}
                  <span className="text-xs text-faint">{l.short}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const label = theme === "dark" ? t("common.lightMode") : t("common.darkMode")
  return (
    <button onClick={toggleTheme} className="btn-ghost px-2.5 text-lg" aria-label={label} title={label}>
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  )
}

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { t } = useI18n()
  const { configured, user, profile, signOut } = useAuth()

  const close = () => setOpen(false)

  const playRandom = () => {
    const game = activities[Math.floor(Math.random() * activities.length)]
    close()
    navigate(game.path)
  }

  const handleSignOut = async () => {
    close()
    await signOut()
    navigate("/")
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "text-brand-700 bg-brand-50" : "text-muted hover:text-brand-700"
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={close}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-lg">🎮</span>
          <span className="text-lg font-bold tracking-tight">
            Mini<span className="text-brand-600">Arcade</span>
          </span>
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" end className={linkClass}>{t("common.home")}</NavLink>
          <Link to="/#games" className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-brand-700">
            {t("common.games")}
          </Link>
          <NavLink to="/leaderboard" className={linkClass}>{t("common.leaderboard")}</NavLink>
          <button onClick={playRandom} className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-brand-700">
            🎲 {t("common.randomGame")}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <LanguageMenu />
          <ThemeToggle />

          {/* desktop account */}
          {configured && (
            <div className="ml-1 hidden items-center gap-2 lg:flex">
              {user ? (
                <>
                  <NavLink to="/profile" className="btn-secondary py-2 text-sm">
                    👤 {profile?.username ?? "…"}
                  </NavLink>
                  <button onClick={handleSignOut} className="btn-ghost text-sm">{t("common.logout")}</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost text-sm">{t("common.login")}</Link>
                  <Link to="/signup" className="btn-primary py-2 text-sm">{t("common.signup")}</Link>
                </>
              )}
            </div>
          )}

          {/* mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="btn-ghost px-2.5 text-xl lg:hidden"
            aria-label={t("common.menu")}
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line lg:hidden"
          >
            <div className="flex max-h-[75vh] flex-col gap-1 overflow-y-auto px-4 py-3">
              {configured && (
                <div className="mb-2 flex gap-2">
                  {user ? (
                    <>
                      <Link to="/profile" onClick={close} className="btn-secondary flex-1 py-2 text-sm">
                        👤 {profile?.username ?? "…"}
                      </Link>
                      <button onClick={handleSignOut} className="btn-ghost text-sm">{t("common.logout")}</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={close} className="btn-secondary flex-1 py-2 text-sm">{t("common.login")}</Link>
                      <Link to="/signup" onClick={close} className="btn-primary flex-1 py-2 text-sm">{t("common.signup")}</Link>
                    </>
                  )}
                </div>
              )}
              <NavLink to="/" end className={linkClass} onClick={close}>{t("common.home")}</NavLink>
              <NavLink to="/leaderboard" className={linkClass} onClick={close}>🏆 {t("common.leaderboard")}</NavLink>
              <div className="my-1 border-t border-line" />
              {activities.map((a) => (
                <NavLink key={a.id} to={a.path} className={linkClass} onClick={close}>
                  {a.icon} {t(`games.${a.id}.title`)}
                </NavLink>
              ))}
              <button onClick={playRandom} className="btn-primary mt-2">🎲 {t("common.randomGame")}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
