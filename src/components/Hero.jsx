import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { activities } from "../data/activities"
import { useI18n } from "../i18n"

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative isolate overflow-hidden px-4 py-20 text-center sm:px-6 md:py-28">
      {/* background accent blobs */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/25 blur-3xl sm:h-125 sm:w-125" />
      <div className="absolute right-0 top-0 -z-10 h-48 w-48 rounded-full bg-brand-300/30 blur-3xl" />

      <motion.div variants={container} initial="hidden" animate="visible" className="mx-auto max-w-2xl">
        <motion.span variants={item} className="chip mb-5">
          {t("hero.badge", { n: activities.length })}
        </motion.span>

        <motion.h1 variants={item} className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          {t("hero.title1")} <span className="text-brand-600">{t("hero.title2")}</span>
        </motion.h1>

        <motion.p variants={item} className="mb-8 text-lg text-muted">
          {t("hero.text")}
        </motion.p>

        <motion.div variants={item} className="flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#games" className="btn-primary">{t("hero.cta")}</a>
          <Link to="/leaderboard" className="btn-secondary">🏆 {t("hero.cta2")}</Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
