import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const ActivityCard = ({ path, title, image, description }) => {
  return (
    <motion.div
      className="card border rounded-lg overflow-hidden bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileHover={{ y: -6, boxShadow: "0px 12px 24px rgba(0,0,0,0.08)" }}
    >
      <img
        src={image}
        alt="an img of the game"
        className="w-full h-64 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h1 className="text-2xl text-center font-bold">{title}</h1>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <Link to={path}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-4 py-2 rounded-lg border bg-gray-900 text-white hover:bg-white hover:text-black transition-colors duration-200"
          >
            Play
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

export default ActivityCard