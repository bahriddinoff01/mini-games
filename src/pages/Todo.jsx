import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GameLayout from "../components/GameLayout"

const STORAGE_KEY = "mini-arcade-todos"

const loadTasks = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

const filters = ["all", "active", "done"]

const Todo = () => {
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
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id))
  const clearDone = () => setTasks(tasks.filter((t) => !t.completed))

  const visible = tasks.filter((t) =>
    filter === "active" ? !t.completed : filter === "done" ? t.completed : true
  )
  const doneCount = tasks.filter((t) => t.completed).length

  return (
    <GameLayout icon="📝" title="To-Do List" subtitle="Plan your day, one task at a time.">
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
            placeholder="Add a new task..."
            className="input flex-1"
          />
          <button type="submit" className="btn-primary">Add task</button>
        </form>

        {/* progress + filters */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  filter === f ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-sm text-slate-500">
            {doneCount} of {tasks.length} done
          </span>
        </div>

        {tasks.length > 0 && (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
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
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <button
                  onClick={() => toggleComplete(task.id)}
                  aria-label={task.completed ? "Mark as not done" : "Mark as done"}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                    task.completed ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white hover:border-brand-400"
                  }`}
                >
                  {task.completed && <span className="text-sm text-white">✓</span>}
                </button>
                <span
                  className={`flex-1 break-words ${task.completed ? "text-slate-400 line-through" : ""}`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                  className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-lose-soft hover:text-lose"
                >
                  🗑
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {visible.length === 0 && (
          <p className="mt-6 text-center text-slate-400">
            {tasks.length === 0 ? "No tasks yet — add one above." : "Nothing here."}
          </p>
        )}

        {doneCount > 0 && (
          <button onClick={clearDone} className="btn-ghost mt-4 w-full text-sm">
            Clear completed ({doneCount})
          </button>
        )}
      </div>
    </GameLayout>
  )
}

export default Todo
