import { useEffect, useRef, useState } from "react"
import GameLayout, { Banner, SaveNote, Stat } from "../components/GameLayout"
import useBestScore from "../hooks/useBestScore"
import useSaveScore from "../hooks/useSaveScore"
import { useI18n } from "../i18n"

const pickIndex = (count, current) => {
  let i
  do i = Math.floor(Math.random() * count)
  while (count > 1 && i === current)
  return i
}

const nowMs = () => performance.now()

const countCorrect =(typed, sentence) => [...typed].filter((ch, i) => ch === sentence[i]).length

const Typing = () => {
  const { t, lang } = useI18n()
  const sentences = t("typing.sentences")
  const [index, setIndex] = useState(() => pickIndex(7))
  const [typed, setTyped] = useState("")
  const [startTime, setStartTime] = useState(null)
  const [now, setNow] = useState(null)
  const [finished, setFinished] = useState(false)
  const [newRecord, setNewRecord] = useState(false)
  const [best, submitBest] = useBestScore("typing")
  const { status: saveStatus, save, clear } = useSaveScore("typing")
  const inputRef = useRef(null)
  const sentence = sentences[index % sentences.length]

  // Start over when the language changes, since the sentence changes too.
  const [prevLang, setPrevLang] = useState(lang)
  if (prevLang !== lang) {
    setPrevLang(lang)
    setTyped("")
    setStartTime(null)
    setNow(null)
    setFinished(false)
    setNewRecord(false)
  }

  // Update the clock while typing.
  useEffect(() => {
    if (!startTime || finished) return
    const timer = setInterval(() => setNow(nowMs()), 200)
    return () => clearInterval(timer)
  }, [startTime, finished])

  const elapsed = startTime && now ? (now - startTime) / 1000 : 0
  const correctChars = countCorrect(typed, sentence)
  const wpm = elapsed > 0 ? Math.round(correctChars / 5 / (elapsed / 60)) : 0
  const accuracy = typed.length ? Math.round((correctChars / typed.length) * 100) : 100

  const handleChange = (e) => {
    if (finished) return
    const value = e.target.value.slice(0, sentence.length)
    const time = nowMs()
    if (!startTime) setStartTime(time)
    setNow(time)
    setTyped(value)
    if (value.length === sentence.length) {
      setFinished(true)
      const secs = (time - (startTime ?? time)) / 1000
      const correct = countCorrect(value, sentence)
      const finalWpm = secs > 0 ? Math.round(correct / 5 / (secs / 60)) : 0
      setNewRecord(submitBest(finalWpm))
      // Only reasonably accurate runs go to the leaderboard.
      if (finalWpm > 0 && correct / value.length >= 0.8) save(Math.min(finalWpm, 250))
    }
  }

  const restart = () => {
    setIndex(pickIndex(sentences.length, index))
    setTyped("")
    setStartTime(null)
    setNow(null)
    setFinished(false)
    setNewRecord(false)
    clear()
    inputRef.current?.focus()
  }

  return (
    <GameLayout icon="⌨️" title={t("games.typing.title")} subtitle={t("typing.subtitle")} maxWidth="max-w-2xl">
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t("typing.wpm")} value={wpm} accent />
        <Stat label={t("typing.accuracy")} value={`${accuracy}%`} />
        <Stat label={t("common.time")} value={`${elapsed.toFixed(1)}s`} />
        <Stat label={t("typing.bestWpm")} value={best ?? "—"} />
      </div>

      <div className="panel p-4 sm:p-6">
        {/* sentence with per-letter coloring */}
        <p
          onClick={() => inputRef.current?.focus()}
          className="mb-5 cursor-text rounded-xl bg-canvas p-4 font-mono text-lg leading-relaxed sm:text-xl"
        >
          {[...sentence].map((ch, i) => {
            let cls = "text-faint"
            if (i < typed.length) cls = typed[i] === ch ? "text-fg" : "bg-lose-soft text-lose-fg"
            if (i === typed.length && !finished) cls += " border-b-2 border-brand-500"
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
          placeholder={startTime ? "" : t("typing.placeholder")}
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
              {t("typing.result", { wpm, acc: accuracy })}
              {newRecord && ` 🏆 ${t("common.newBest")}`}
            </Banner>
            <SaveNote status={saveStatus} />
          </div>
        )}

        <button onClick={restart} className="btn-primary mt-5 w-full">
          {finished ? t("typing.nextSentence") : t("typing.newSentence")}
        </button>
      </div>
    </GameLayout>
  )
}

export default Typing
