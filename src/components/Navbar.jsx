import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { activities } from "../data/activities"

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const playRandom = () => {
    const game = activities[Math.floor(Math.random() * activities.length)]
    setOpen(false)
    navigate(game.path)
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "text-brand-700 bg-brand-50" : "text-slate-600 hover:text-brand-700"
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-lg">🎮</span>
          <span className="text-lg font-bold tracking-tight">
            Mini<span className="text-brand-600">Arcade</span>
          </span>
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <Link to="/#games" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-700">
            Games
          </Link>
          <button onClick={playRandom} className="btn-primary ml-2 py-2 text-sm">
            🎲 Random game
          </button>
        </div>

        {/* mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="btn-ghost md:hidden text-xl"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
              {activities.map((a) => (
                <NavLink key={a.id} to={a.path} className={linkClass} onClick={() => setOpen(false)}>
                  {a.icon} {a.title}
                </NavLink>
              ))}
              <button onClick={playRandom} className="btn-primary mt-2">🎲 Random game</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
