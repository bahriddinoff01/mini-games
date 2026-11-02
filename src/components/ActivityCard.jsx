import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useI18n } from "../i18n"

const ActivityCard = ({ id, path, icon, index = 0 }) => {
  const { t } = useI18n()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay: (index % 4) * 0.06 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link
        to={path}
        className="group panel flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl hover:shadow-brand-600/10"
      >
        <div className="relative flex h-40 items-center justify-center bg-linear-to-br from-brand-50 to-brand-100">
          <span className="text-6xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
            {icon}
          </span>
          <span className="chip absolute left-3 top-3 bg-surface/80">{t(`games.${id}.category`)}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-xl font-bold">{t(`games.${id}.title`)}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t(`games.${id}.description`)}</p>
          <span className="btn-primary mt-5 w-full py-2.5">{t("common.play")}</span>
        </div>
      </Link>
    </motion.div>
  )
}

export default ActivityCard
