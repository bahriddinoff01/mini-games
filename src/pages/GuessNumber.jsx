import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GameLayout, { Banner, Stat } from "../components/GameLayout"

const MAX = 1000
const TRIES = 7
const randomNumber = () => Math.floor(Math.random() * MAX) + 1

const GuessNumber = () => {
  const [target, setTarget] = useState(randomNumber)
  const [guess, setGuess] = useState("")
  const [history, setHistory] = useState([])
  const [error, setError] = useState("")
  const [status, setStatus] = useState("playing") // playing | won | lost
  const [range, setRange] = useState({ low: 1, high: MAX })
  const inputRef = useRef(null)

  const attemptsLeft = TRIES - history.length
  const gameOver = status !== "playing"

  const handleGuess = () => {
    const n = Number(guess)
    // Invalid input does not cost a try.
    if (guess.trim() === "" || !Number.isInteger(n) || n < 1 || n > MAX) {
      setError(`Enter a whole number from 1 to ${MAX}.`)
      return
    }
    if (history.some((h) => h.guess === n)) {
      setError(`You already tried ${n}.`)
      return
    }
    setError("")

    let feedback
    if (n === target) {
      feedback = "Correct!"
      setStatus("won")
    } else if (n < target) {
      feedback = "Higher ↑"
      setRange((r) => ({ ...r, low: Math.max(r.low, n + 1) }))
    } else {
      feedback = "Lower ↓"
      setRange((r) => ({ ...r, high: Math.min(r.high, n - 1) }))
    }

    const newHistory = [{ id: Date.now(), guess: n, feedback }, ...history]
    setHistory(newHistory)
    setGuess("")
    if (n !== target && newHistory.length >= TRIES) setStatus("lost")
    inputRef.current?.focus()
  }

  const handleReset = () => {
    setTarget(randomNumber())
    setGuess("")
    setHistory([])
    setError("")
    setStatus("playing")
    setRange({ low: 1, high: MAX })
    inputRef.current?.focus()
  }

  return (
    <GameLayout icon="🔢" title="Guess the Number" subtitle={`I'm thinking of a number from 1 to ${MAX}.`}>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat label="Tries left" value={attemptsLeft} accent />
        <Stat label="Range" value={`${range.low}–${range.high}`} />
      </div>

      <div className="panel p-4 sm:p-6">
        <form
          noValidate
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            handleGuess()
          }}
        >
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Your guess"
            className="input flex-1"
            disabled={gameOver}
            autoFocus
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1" disabled={gameOver}>Guess</button>
            <button type="button" onClick={handleReset} className="btn-secondary flex-1">Reset</button>
          </div>
        </form>

        {error && <p className="mt-2 text-sm text-lose">{error}</p>}

        <div className="mt-4 empty:hidden">
          {status === "won" && (
            <Banner tone="win">
              🎉 You got it in {history.length} {history.length === 1 ? "try" : "tries"}! The number was {target}.
            </Banner>
          )}
          {status === "lost" && <Banner tone="lose">Out of tries. The number was {target}.</Banner>}
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {history.map((entry, i) => (
              <motion.li
                key={entry.id}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  i === 0 ? "border-ink bg-ink text-white" : "border-slate-200 bg-slate-50"
                }`}
              >
                <span className="font-semibold tabular-nums">{entry.guess}</span>
                <span
                  className={`text-sm font-medium ${
                    entry.feedback === "Correct!" ? "text-win" : i === 0 ? "text-brand-300" : "text-slate-500"
                  }`}
                >
                  {entry.feedback}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {history.length === 0 && (
          <p className="mt-6 text-center text-slate-400">Make your first guess above.</p>
        )}
      </div>
    </GameLayout>
  )
}

export default GuessNumber
