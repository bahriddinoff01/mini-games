import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const ActivityCard = ({ path, title, icon, category, description, index = 0 }) => {
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
          <span className="text-6xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            {icon}
          </span>
          <span className="chip absolute left-3 top-3 bg-white/80">{category}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
          <span className="btn-primary mt-5 w-full py-2.5 group-hover:bg-brand-600">Play</span>
        </div>
      </Link>
    </motion.div>
  )
}

export default ActivityCard
