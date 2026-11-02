import { useEffect, useRef, useState } from "react"
import GameLayout, { Banner, Stat } from "../components/GameLayout"
import useBestScore from "../hooks/useBestScore"

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "Small steps every day add up to big results.",
  "Practice makes progress, not perfection.",
  "A good programmer looks both ways before crossing a one-way street.",
  "Coffee in one hand, confidence in the other.",
  "Every expert was once a beginner who never gave up.",
  "Simple things done well are better than complex things done poorly.",
  "The best time to start was yesterday; the next best time is now.",
]

const pickSentence = (current) => {
  const options = SENTENCES.filter((s) => s !== current)
  return options[Math.floor(Math.random() * options.length)]
}

const Typing = () => {
  const [sentence, setSentence] = useState(() => pickSentence())
  const [typed, setTyped] = useState("")
  const [startTime, setStartTime] = useState(null)
  const [now, setNow] = useState(null)
  const [finished, setFinished] = useState(false)
  const [newRecord, setNewRecord] = useState(false)
  const [best, submitBest] = useBestScore("typing")
  const inputRef = useRef(null)

  // Update the clock while typing.
  useEffect(() => {
    if (!startTime || finished) return
    const t = setInterval(() => setNow(performance.now()), 200)
    return () => clearInterval(t)
  }, [startTime, finished])

  const elapsed = startTime && now ? (now - startTime) / 1000 : 0
  const correctChars = [...typed].filter((ch, i) => ch === sentence[i]).length
  const wpm = elapsed > 0 ? Math.round(correctChars / 5 / (elapsed / 60)) : 0
  const accuracy = typed.length ? Math.round((correctChars / typed.length) * 100) : 100

  const handleChange = (e) => {
    if (finished) return
    const value = e.target.value.slice(0, sentence.length)
    const t = performance.now()
    if (!startTime) setStartTime(t)
    setNow(t)
    setTyped(value)
    if (value.length === sentence.length) {
      setFinished(true)
      const secs = (t - (startTime ?? t)) / 1000
      const correct = [...value].filter((ch, i) => ch === sentence[i]).length
      const finalWpm = secs > 0 ? Math.round(correct / 5 / (secs / 60)) : 0
      setNewRecord(submitBest(finalWpm))
    }
  }

  const restart = () => {
    setSentence(pickSentence(sentence))
    setTyped("")
    setStartTime(null)
    setNow(null)
    setFinished(false)
    setNewRecord(false)
    inputRef.current?.focus()
  }

  return (
    <GameLayout icon="⌨️" title="Typing Speed" subtitle="Type the sentence below as fast and accurately as you can." maxWidth="max-w-2xl">
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="WPM" value={wpm} accent />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Time" value={`${elapsed.toFixed(1)}s`} />
        <Stat label="Best WPM" value={best ?? "—"} />
      </div>

      <div className="panel p-4 sm:p-6">
        {/* sentence with per-letter coloring */}
        <p
          onClick={() => inputRef.current?.focus()}
          className="mb-5 cursor-text rounded-xl bg-slate-50 p-4 font-mono text-lg leading-relaxed sm:text-xl"
        >
          {[...sentence].map((ch, i) => {
            let cls = "text-slate-400"
            if (i < typed.length) cls = typed[i] === ch ? "text-ink" : "bg-lose-soft text-lose"
            if (i === typed.length && !finished) cls += " border-b-2 border-brand-500 text-slate-500"
            return (
              <span key={i} className={cls}>
                {ch}
              </span>
            )
          })}
        </p>

        <input
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          onPaste={(e) => e.preventDefault()}
          disabled={finished}
          placeholder={startTime ? "" : "Start typing here — the timer begins on your first key"}
          className="input font-mono"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {finished && (
          <div className="mt-4">
            <Banner tone={accuracy >= 90 ? "win" : "warn"}>
              {wpm} WPM with {accuracy}% accuracy.{newRecord && " 🏆 New best!"}
            </Banner>
          </div>
        )}

        <button onClick={restart} className="btn-primary mt-5 w-full">
          {finished ? "Next sentence" : "New sentence"}
        </button>
      </div>
    </GameLayout>
  )
}

export default Typing
