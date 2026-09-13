import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 overflow-hidden">
      {/* background accent blob */}
      <div className="absolute top-1/2 left-1/2 w-125 h-125 bg-purple-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 -z-10" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        <motion.span
          variants={item}
          className="inline-block text-sm uppercase tracking-widest text-gray-500 mb-4"
        >
          Personal Project
        </motion.span>

        <motion.h1
          variants={item}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          A little arcade of mini activities
        </motion.h1>

        <motion.p
          variants={item}
          className="text-gray-600 text-lg mb-8"
        >
          A growing collection of small interactive projects — to-do lists,
          quick games, and other tiny tools — built one at a time.
        </motion.p>

        <motion.a
          variants={item}
          href="#activities"
          className="inline-block px-6 py-3 border rounded-md bg-gray-900 text-white font-medium hover:scale-105 active:scale-90 duration-200 hover:bg-white hover:text-black transition-all"
        >
          Explore Activities
        </motion.a>
      </motion.div>
    </section>
  );
}