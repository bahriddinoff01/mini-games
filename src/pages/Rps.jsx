import { useState } from "react"
import { motion } from "framer-motion"
import GameLayout, { Banner, SaveNote, Stat } from "../components/GameLayout"
import { useI18n } from "../i18n"
import useSaveScore from "../hooks/useSaveScore"

const WIN_SCORE = 5
const choices = [
  { id: "rock", icon: "✊", beats: "scissors" },
  { id: "paper", icon: "✋", beats: "rock" },
  { id: "scissors", icon: "✌️", beats: "paper" },
]
const byId = Object.fromEntries(choices.map((c) => [c.id, c]))
const randomChoice = () => choices[Math.floor(Math.random() * choices.length)].id

const Hand = ({ choice, label, roundKey }) => (
  <div className="flex flex-1 flex-col items-center gap-2">
    <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
    <motion.div
      key={roundKey}
      initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="flex h-24 w-24 items-center justify-center rounded-2xl bg-subtle text-5xl sm:h-28 sm:w-28 sm:text-6xl"
    >
      {choice ? byId[choice].icon : "❔"}
    </motion.div>
  </div>
)

const Rps = () => {
  const { t } = useI18n()
  const [score, setScore] = useState({ you: 0, cpu: 0 })
  const [round, setRound] = useState(null) // { you, cpu, result, n }
  const { status: saveStatus, save, clear } = useSaveScore("rps")

  const winner = score.you >= WIN_SCORE ? "you" : score.cpu >= WIN_SCORE ? "cpu" : null
  const name = (id) => t(`rps.${id}`)

  const play = (id) => {
    if (winner) return
    const cpu = randomChoice()
    const result = id === cpu ? "draw" : byId[id].beats === cpu ? "win" : "lose"
    setRound({ you: id, cpu, result, n: (round?.n ?? 0) + 1 })
    if (result === "win") {
      const you = score.you + 1
      setScore({ ...score, you })
      if (you === WIN_SCORE) save(1)
    }
    if (result === "lose") setScore({ ...score, cpu: score.cpu + 1 })
  }

  const reset = () => {
    setScore({ you: 0, cpu: 0 })
    setRound(null)
    clear()
  }

  return (
    <GameLayout icon="✊" title={t("games.rps.title")} subtitle={t("rps.subtitle", { n: WIN_SCORE })}>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat label={t("common.you")} value={score.you} accent />
        <Stat label={t("common.computer")} value={score.cpu} />
      </div>

      <div className="panel p-4 sm:p-6">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <Hand choice={round?.you} label={t("common.you")} roundKey={`y${round?.n}`} />
          <span className="text-lg font-bold text-faint">VS</span>
          <Hand choice={round?.cpu} label={t("common.computer")} roundKey={`c${round?.n}`} />
        </div>

        <div className="mt-6">
          {winner ? (
            <>
              <Banner tone={winner === "you" ? "win" : "lose"}>
                {winner === "you" ? t("rps.matchWon") : t("rps.matchLost")}
              </Banner>
              {winner === "you" && <SaveNote status={saveStatus} />}
            </>
          ) : round ? (
            <Banner tone={round.result === "win" ? "win" : round.result === "lose" ? "lose" : "warn"}>
              {round.result === "win" && t("rps.roundWin", { a: name(round.you), b: name(round.cpu).toLowerCase() })}
              {round.result === "lose" && t("rps.roundLose", { a: name(round.cpu), b: name(round.you).toLowerCase() })}
              {round.result === "draw" && t("rps.draw")}
            </Banner>
          ) : (
            <Banner>{t("rps.choose")}</Banner>
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {choices.map((c) => (
            <motion.button
              key={c.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => play(c.id)}
              disabled={!!winner}
              className="flex flex-col items-center gap-1 rounded-2xl border-2 border-line bg-surface py-4 transition-colors enabled:hover:border-brand-500 enabled:hover:bg-brand-50 disabled:opacity-40"
            >
              <span className="text-4xl sm:text-5xl">{c.icon}</span>
              <span className="text-sm font-semibold">{name(c.id)}</span>
            </motion.button>
          ))}
        </div>

        <button onClick={reset} className="btn-secondary mt-6 w-full">
          {winner ? t("common.playAgain") : t("rps.resetMatch")}
        </button>
      </div>
    </GameLayout>
  )
}

export default Rps
