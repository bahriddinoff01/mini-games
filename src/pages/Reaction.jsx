import { useEffect, useRef, useState } from "react"
import GameLayout, { SaveNote, Stat } from "../components/GameLayout"
import useBestScore, { lowerIsBetter } from "../hooks/useBestScore"
import useSaveScore from "../hooks/useSaveScore"
import { useI18n } from "../i18n"

// idle → waiting (red) → go (green) → result, or "early" if clicked too soon.
const screens = {
  idle: { bg: "bg-ink", title: "reaction.idleTitle", text: "reaction.idleText" },
  waiting: { bg: "bg-lose", title: "reaction.waitTitle", text: "reaction.waitText" },
  go: { bg: "bg-win", title: "reaction.goTitle", text: null },
  early: { bg: "bg-warn", title: "reaction.earlyTitle", text: "reaction.earlyText" },
  result: { bg: "bg-brand-500", title: null, text: "reaction.resultText" },
}

const Reaction = () => {
  const { t } = useI18n()
  const [state, setState] = useState("idle")
  const [last, setLast] = useState(null)
  const [results, setResults] = useState([])
  const [best, submitBest] = useBestScore("reaction", lowerIsBetter)
  const { status: saveStatus, save } = useSaveScore("reaction")
  const startTime = useRef(0)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleClick = () => {
    if (state === "waiting") {
      clearTimeout(timer.current)
      setState("early")
      return
    }
    if (state === "go") {
      const ms = Math.round(performance.now() - startTime.current)
      setLast(ms)
      setResults((r) => [ms, ...r].slice(0, 5))
      submitBest(ms)
      save(ms)
      setState("result")
      return
    }
    // idle, early or result → start a new round
    setState("waiting")
    const delay = 1500 + Math.random() * 2500
    timer.current = setTimeout(() => {
      startTime.current = performance.now()
      setState("go")
    }, delay)
  }

  const average = results.length ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : null
  const screen = screens[state]
  const ms = (v) => t("units.ms", { v })

  return (
    <GameLayout icon="⚡" title={t("games.reaction.title")} subtitle={t("reaction.subtitle")}>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat label={t("reaction.last")} value={last ? ms(last) : "—"} accent />
        <Stat label={t("reaction.average")} value={average ? ms(average) : "—"} />
        <Stat label={t("common.best")} value={best ? ms(best) : "—"} />
      </div>

      <button
        onMouseDown={handleClick}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault()
            handleClick()
          }
        }}
        className={`flex h-72 w-full select-none flex-col items-center justify-center rounded-2xl px-6 text-center text-white shadow-sm transition-colors duration-150 sm:h-80 ${screen.bg}`}
      >
        <span className="text-4xl font-extrabold sm:text-5xl">{state === "result" ? ms(last) : t(screen.title)}</span>
        {screen.text && <span className="mt-3 text-white/80">{t(screen.text)}</span>}
      </button>
      {state === "result" && <SaveNote status={saveStatus} />}

      {results.length > 0 && (
        <div className="panel mt-4 p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{t("reaction.lastTries")}</h2>
          <div className="flex flex-wrap gap-2">
            {results.map((v, i) => (
              <span
                key={i}
                className={`rounded-lg px-3 py-1 text-sm font-medium tabular-nums ${
                  v === best ? "bg-win-soft text-win-fg" : "bg-subtle text-fg"
                }`}
              >
                {ms(v)}
              </span>
            ))}
          </div>
        </div>
      )}
    </GameLayout>
  )
}

export default Reaction
