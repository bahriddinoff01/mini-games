import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GameLayout from "../components/GameLayout"
import Segmented from "../components/Segmented"
import { useI18n } from "../i18n"

const STORAGE_KEY = "mini-arcade-todos"

const loadTasks = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

const Todo = () => {
  const { t } = useI18n()
  const [inputValue, setInputValue] = useState("")
  const [tasks, setTasks] = useState(loadTasks)
  const [filter, setFilter] = useState("all")

  // Save tasks so they survive a page refresh.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      /* storage unavailable — tasks just won't persist */
    }
  }, [tasks])

  const addTask = () => {
    const text = inputValue.trim()
    if (!text) return
    setTasks([...tasks, { id: Date.now(), text, completed: false }])
    setInputValue("")
  }

  const toggleComplete = (id) =>
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))

  const deleteTask = (id) => setTasks(tasks.filter((task) => task.id !== id))
  const clearDone = () => setTasks(tasks.filter((task) => !task.completed))

  const visible = tasks.filter((task) =>
    filter === "active" ? !task.completed : filter === "done" ? task.completed : true
  )
  const doneCount = tasks.filter((task) => task.completed).length

  return (
    <GameLayout icon="📝" title={t("games.todo.title")} subtitle={t("todo.subtitle")}>
      <div className="panel p-4 sm:p-6">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            addTask()
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t("todo.placeholder")}
            className="input flex-1"
          />
          <button type="submit" className="btn-primary">{t("todo.add")}</button>
        </form>

        {/* progress + filters */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Segmented
            options={[["all", t("todo.all")], ["active", t("todo.active")], ["done", t("todo.done")]]}
            value={filter}
            onChange={setFilter}
          />
          <span className="text-sm text-muted">{t("todo.progress", { done: doneCount, total: tasks.length })}</span>
        </div>

        {tasks.length > 0 && (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-subtle">
            <motion.div
              className="h-full rounded-full bg-brand-500"
              animate={{ width: `${(doneCount / tasks.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* task list */}
        <ul className="mt-5 flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {visible.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3"
              >
                <button
                  onClick={() => toggleComplete(task.id)}
                  aria-label={task.completed ? t("todo.markUndone") : t("todo.markDone")}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                    task.completed ? "border-brand-500 bg-brand-500" : "border-line bg-surface hover:border-brand-400"
                  }`}
                >
                  {task.completed && <span className="text-sm text-white">✓</span>}
                </button>
                <span className={`flex-1 break-words ${task.completed ? "text-faint line-through" : ""}`}>
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label={t("todo.delete")}
                  className="shrink-0 rounded-lg p-1 text-faint transition-colors hover:bg-lose-soft hover:text-lose"
                >
                  🗑
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {visible.length === 0 && (
          <p className="mt-6 text-center text-faint">
            {tasks.length === 0 ? t("todo.empty") : t("todo.emptyFilter")}
          </p>
        )}

        {doneCount > 0 && (
          <button onClick={clearDone} className="btn-ghost mt-4 w-full text-sm">
            {t("todo.clearDone", { n: doneCount })}
          </button>
        )}
      </div>
    </GameLayout>
  )
}

export default Todo
