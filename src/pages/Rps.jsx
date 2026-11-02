import { useState } from "react"
import { motion } from "framer-motion"
import GameLayout, { Banner, Stat } from "../components/GameLayout"

const WIN_SCORE = 5
const choices = [
  { id: "rock", icon: "✊", label: "Rock", beats: "scissors" },
  { id: "paper", icon: "✋", label: "Paper", beats: "rock" },
  { id: "scissors", icon: "✌️", label: "Scissors", beats: "paper" },
]
const byId = Object.fromEntries(choices.map((c) => [c.id, c]))
const randomChoice = () => choices[Math.floor(Math.random() * choices.length)].id

const Hand = ({ choice, label, roundKey }) => (
  <div className="flex flex-1 flex-col items-center gap-2">
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
    <motion.div
      key={roundKey}
      initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-5xl sm:h-28 sm:w-28 sm:text-6xl"
    >
      {choice ? byId[choice].icon : "❔"}
    </motion.div>
  </div>
)

const Rps = () => {
  const [score, setScore] = useState({ you: 0, cpu: 0 })
  const [round, setRound] = useState(null) // { you, cpu, result, n }

  const winner = score.you >= WIN_SCORE ? "you" : score.cpu >= WIN_SCORE ? "cpu" : null

  const play = (id) => {
    if (winner) return
    const cpu = randomChoice()
    const result = id === cpu ? "draw" : byId[id].beats === cpu ? "win" : "lose"
    setRound({ you: id, cpu, result, n: (round?.n ?? 0) + 1 })
    if (result === "win") setScore((s) => ({ ...s, you: s.you + 1 }))
    if (result === "lose") setScore((s) => ({ ...s, cpu: s.cpu + 1 }))
  }

  const reset = () => {
    setScore({ you: 0, cpu: 0 })
    setRound(null)
  }

  return (
    <GameLayout icon="✊" title="Rock Paper Scissors" subtitle={`First to ${WIN_SCORE} points wins the match.`}>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat label="You" value={score.you} accent />
        <Stat label="Computer" value={score.cpu} />
      </div>

      <div className="panel p-4 sm:p-6">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <Hand choice={round?.you} label="You" roundKey={`y${round?.n}`} />
          <span className="text-lg font-bold text-slate-300">VS</span>
          <Hand choice={round?.cpu} label="Computer" roundKey={`c${round?.n}`} />
        </div>

        <div className="mt-6">
          {winner ? (
            <Banner tone={winner === "you" ? "win" : "lose"}>
              {winner === "you" ? "🏆 You won the match!" : "The computer won the match."}
            </Banner>
          ) : round ? (
            <Banner tone={round.result === "win" ? "win" : round.result === "lose" ? "lose" : "warn"}>
              {round.result === "win" && `${byId[round.you].label} beats ${byId[round.cpu].label} — point for you!`}
              {round.result === "lose" && `${byId[round.cpu].label} beats ${byId[round.you].label} — point for the computer.`}
              {round.result === "draw" && "It's a draw. Go again!"}
            </Banner>
          ) : (
            <Banner>Choose your move below.</Banner>
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
              className="flex flex-col items-center gap-1 rounded-2xl border-2 border-slate-200 bg-white py-4 transition-colors hover:border-brand-500 hover:bg-brand-50 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white"
            >
              <span className="text-4xl sm:text-5xl">{c.icon}</span>
              <span className="text-sm font-semibold">{c.label}</span>
            </motion.button>
          ))}
        </div>

        <button onClick={reset} className="btn-secondary mt-6 w-full">
          {winner ? "Play again" : "Reset match"}
        </button>
      </div>
    </GameLayout>
  )
}

export default Rps
