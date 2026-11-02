import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import GameLayout, { Banner, SaveNote, Stat } from "../components/GameLayout"
import useBestScore from "../hooks/useBestScore"
import useSaveScore from "../hooks/useSaveScore"
import { useI18n } from "../i18n"

const DURATION = 30
const HOLES = 9

const WhackAMole = () => {
  const { t } = useI18n()
  const [status, setStatus] = useState("idle") // idle | playing | over
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [score, setScore] = useState(0)
  const [mole, setMole] = useState(null) // { hole, key }
  const [hit, setHit] = useState(null)
  const [newRecord, setNewRecord] = useState(false)
  const [best, submitBest] = useBestScore("whack")
  const { status: saveStatus, save, clear } = useSaveScore("whack-a-mole")
  const scoreRef = useRef(0)

  // Countdown, one tick per second. The last tick ends the game.
  useEffect(() => {
    if (status !== "playing") return
    const timer = setTimeout(() => {
      if (timeLeft > 1) {
        setTimeLeft(timeLeft - 1)
        return
      }
      setTimeLeft(0)
      setStatus("over")
      setMole(null)
      setNewRecord(submitBest(scoreRef.current))
      if (scoreRef.current > 0) save(scoreRef.current)
    }, 1000)
    return () => clearTimeout(timer)
  }, [status, timeLeft, submitBest, save])

  // Move the mole. It gets faster as time runs out.
  useEffect(() => {
    if (status !== "playing") return
    const speed = 450 + (timeLeft / DURATION) * 550
    const timer = setTimeout(() => {
      setMole((m) => {
        let hole
        do hole = Math.floor(Math.random() * HOLES)
        while (hole === m?.hole)
        return { hole, key: Date.now() }
      })
    }, speed)
    return () => clearTimeout(timer)
  }, [status, mole, timeLeft])

  const start = () => {
    scoreRef.current = 0
    setScore(0)
    setTimeLeft(DURATION)
    setMole(null)
    setNewRecord(false)
    clear()
    setStatus("playing")
  }

  const whack = (hole) => {
    if (status !== "playing" || mole?.hole !== hole) return
    scoreRef.current += 1
    setScore(scoreRef.current)
    setHit(hole)
    setMole(null)
    setTimeout(() => setHit(null), 200)
  }

  return (
    <GameLayout icon="🔨" title={t("games.whack-a-mole.title")} subtitle={t("whack.subtitle", { n: DURATION })}>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat label={t("common.score")} value={score} accent />
        <Stat label={t("common.time")} value={`${timeLeft}s`} />
        <Stat label={t("common.best")} value={best ?? "—"} />
      </div>

      <div className="panel p-4 sm:p-6">
        {/* time bar */}
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-subtle">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? "bg-lose" : "bg-brand-500"}`}
            style={{ width: `${(timeLeft / DURATION) * 100}%` }}
          />
        </div>

        <div className="mx-auto grid max-w-sm grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: HOLES }, (_, i) => (
            <button
              key={i}
              onMouseDown={() => whack(i)}
              onTouchStart={(e) => {
                e.preventDefault()
                whack(i)
              }}
              aria-label={t("whack.hole", { n: i + 1 })}
              className={`relative aspect-square overflow-hidden rounded-full border-4 transition-colors ${
                hit === i ? "border-win bg-win-soft" : "border-line bg-subtle"
              }`}
            >
              <div className="absolute inset-x-3 bottom-2 h-1/4 rounded-full bg-line" />
              <AnimatePresence>
                {mole?.hole === i && (
                  <motion.span
                    key={mole.key}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex cursor-pointer items-center justify-center text-4xl sm:text-5xl"
                  >
                    🐹
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {status === "over" && (
            <div className="mb-4">
              <Banner tone="win">
                {t("whack.over", { n: score })}
                {newRecord && ` 🏆 ${t("common.newBest")}`}
              </Banner>
              <SaveNote status={saveStatus} />
            </div>
          )}
          <button onClick={start} disabled={status === "playing"} className="btn-primary w-full">
            {status === "idle" ? t("whack.start") : status === "playing" ? t("whack.going") : t("common.playAgain")}
          </button>
        </div>
      </div>
    </GameLayout>
  )
}

export default WhackAMole
