import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Todo = () => {
  const [inputValue, setInputValue] = useState("")
  const [tasks, setTasks] = useState([])

  const toggleComplete = (id) => {
    const newTasks = []
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed }
        newTasks.push(updatedTask)
      } else {
        newTasks.push(task)
      }
    }
    setTasks(newTasks)
  }

  const deleteTask = (id) => {
    const newTasks = []
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      if (task.id !== id) {
        newTasks.push(task)
      }
    }
    setTasks(newTasks)
  }

  const addTask = () => {
    if (inputValue.trim() === "") return
    const newTask = { id: Date.now(), text: inputValue, completed: false }
    setTasks([...tasks, newTask])
    setInputValue("")
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-24 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          To-Do List
        </h1>

        {/* input row */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
          />
          <button
            onClick={addTask}
            className="px-5 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 active:scale-95 transition-all"
          >
            Add
          </button>
        </div>

        {/* task list */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3"
              >
                <button
                  onClick={() => toggleComplete(task.id)}
                  className={`w-6 h-6 flex items-center justify-center rounded-md border-2 transition-colors ${
                    task.completed
                      ? "bg-gray-900 border-gray-900"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <AnimatePresence>
                    {task.completed && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="text-white text-sm"
                      >
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <span
                  className={`flex-1 transition-colors ${
                    task.completed ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {task.text}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  🗑
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <p className="text-center text-gray-400 mt-8">
              No tasks yet — add one above.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Todo