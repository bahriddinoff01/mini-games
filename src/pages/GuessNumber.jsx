import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GameLayout, { Banner, SaveNote, Stat } from "../components/GameLayout"
import { useI18n } from "../i18n"
import useSaveScore from "../hooks/useSaveScore"

const MAX = 1000
const TRIES = 7
const randomNumber = () => Math.floor(Math.random() * MAX) + 1

const GuessNumber = () => {
  const { t } = useI18n()
  const [target, setTarget] = useState(randomNumber)
  const [guess, setGuess] = useState("")
  const [history, setHistory] = useState([]) // newest first: { id, guess, feedback: "higher" | "lower" | "correct" }
  const [error, setError] = useState(null) // { key, vars }
  const [status, setStatus] = useState("playing") // playing | won | lost
  const [range, setRange] = useState({ low: 1, high: MAX })
  const inputRef = useRef(null)
  const { status: saveStatus, save, clear } = useSaveScore("guess-number")

  const attemptsLeft = TRIES - history.length
  const gameOver = status !== "playing"

  const handleGuess = () => {
    const n = Number(guess)
    // Invalid input does not cost a try.
    if (guess.trim() === "" || !Number.isInteger(n) || n < 1 || n > MAX) {
      setError({ key: "guess.errorRange", vars: { max: MAX } })
      return
    }
    if (history.some((h) => h.guess === n)) {
      setError({ key: "guess.errorRepeat", vars: { n } })
      return
    }
    setError(null)

    let feedback
    if (n === target) {
      feedback = "correct"
      setStatus("won")
      save(history.length + 1)
    } else if (n < target) {
      feedback = "higher"
      setRange((r) => ({ ...r, low: Math.max(r.low, n + 1) }))
    } else {
      feedback = "lower"
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
    setError(null)
    setStatus("playing")
    setRange({ low: 1, high: MAX })
    clear()
    inputRef.current?.focus()
  }

  return (
    <GameLayout icon="🔢" title={t("games.guess-number.title")} subtitle={t("guess.subtitle", { max: MAX })}>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat label={t("guess.triesLeft")} value={attemptsLeft} accent />
        <Stat label={t("guess.range")} value={`${range.low}–${range.high}`} />
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
            placeholder={t("guess.placeholder")}
            className="input flex-1"
            disabled={gameOver}
            autoFocus
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1" disabled={gameOver}>{t("guess.guess")}</button>
            <button type="button" onClick={handleReset} className="btn-secondary flex-1">{t("common.reset")}</button>
          </div>
        </form>

        {error && <p className="mt-2 text-sm text-lose-fg">{t(error.key, error.vars)}</p>}

        {gameOver && (
          <div className="mt-4">
            {status === "won" ? (
              <Banner tone="win">{t("guess.won", { n: history.length, target })}</Banner>
            ) : (
              <Banner tone="lose">{t("guess.lost", { target })}</Banner>
            )}
            {status === "won" && <SaveNote status={saveStatus} />}
          </div>
        )}

        <ul className="mt-4 flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {history.map((entry, i) => (
              <motion.li
                key={entry.id}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  i === 0 ? "border-ink bg-ink text-on-ink" : "border-line bg-canvas"
                }`}
              >
                <span className="font-semibold tabular-nums">{entry.guess}</span>
                <span
                  className={`text-sm font-medium ${
                    entry.feedback === "correct" ? "text-win" : i === 0 ? "text-brand-200 dark:text-white/80" : "text-muted"
                  }`}
                >
                  {t(`guess.${entry.feedback}`)}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {history.length === 0 && <p className="mt-6 text-center text-faint">{t("guess.first")}</p>}
      </div>
    </GameLayout>
  )
}

export default GuessNumber
