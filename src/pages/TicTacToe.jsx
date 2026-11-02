import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import GameLayout, { Banner, SaveNote, Stat } from "../components/GameLayout"
import Segmented from "../components/Segmented"
import { useI18n } from "../i18n"
import useSaveScore from "../hooks/useSaveScore"

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

const getWinner = (board) => {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { player: board[a], line: [a, b, c] }
  }
  return board.every(Boolean) ? { player: "draw", line: [] } : null
}

// Minimax: the computer (O) never loses on "hard".
const minimax = (board, isO) => {
  const result = getWinner(board)
  if (result) return { score: result.player === "O" ? 1 : result.player === "X" ? -1 : 0 }
  let best = { score: isO ? -Infinity : Infinity, index: -1 }
  board.forEach((cell, i) => {
    if (cell) return
    const next = [...board]
    next[i] = isO ? "O" : "X"
    const { score } = minimax(next, !isO)
    if (isO ? score > best.score : score < best.score) best = { score, index: i }
  })
  return best
}

const computerMove = (board, level) => {
  const empty = board.map((c, i) => (c ? null : i)).filter((i) => i !== null)
  if (level === "easy" && Math.random() < 0.6) return empty[Math.floor(Math.random() * empty.length)]
  return minimax(board, true).index
}

const emptyBoard = () => Array(9).fill(null)

const TicTacToe = () => {
  const { t } = useI18n()
  const [board, setBoard] = useState(emptyBoard)
  const [xTurn, setXTurn] = useState(true)
  const [mode, setMode] = useState("cpu") // cpu | friend
  const [level, setLevel] = useState("hard")
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 })
  const { status: saveStatus, save, clear } = useSaveScore("tic-tac-toe")

  const result = getWinner(board)
  const cpuTurn = mode === "cpu" && !xTurn && !result

  const place = (i, current = board) => {
    if (current[i] || getWinner(current)) return
    const next = [...current]
    next[i] = xTurn ? "X" : "O"
    setBoard(next)
    setXTurn(!xTurn)
    const r = getWinner(next)
    if (r) setScore((s) => ({ ...s, [r.player]: s[r.player] + 1 }))
    // Only wins against the computer count for the leaderboard.
    if (r?.player === "X" && mode === "cpu") save(1)
  }

  // Let the computer play after a short pause.
  useEffect(() => {
    if (!cpuTurn) return
    const timer = setTimeout(() => place(computerMove(board, level)), 450)
    return () => clearTimeout(timer)
  })

  const newRound = () => {
    setBoard(emptyBoard())
    setXTurn(true)
    clear()
  }

  const changeMode = (m) => {
    setMode(m)
    setScore({ X: 0, O: 0, draw: 0 })
    newRound()
  }

  const xName = mode === "cpu" ? t("common.you") : t("ttt.playerX")
  const oName = mode === "cpu" ? t("common.computer") : t("ttt.playerO")

  let message
  if (result?.player === "draw") {
    message = <Banner tone="warn">{t("ttt.draw")}</Banner>
  } else if (result) {
    if (mode === "cpu") {
      message =
        result.player === "X" ? <Banner tone="win">{t("ttt.youWon")}</Banner> : <Banner tone="lose">{t("ttt.cpuWon")}</Banner>
    } else {
      message = <Banner tone="win">{t("ttt.playerWon", { name: result.player === "X" ? xName : oName })}</Banner>
    }
  } else {
    const text = cpuTurn ? t("ttt.thinking") : mode === "cpu" ? t("ttt.yourTurn") : t("ttt.turnOf", { name: xTurn ? xName : oName })
    message = <Banner>{text}</Banner>
  }

  return (
    <GameLayout icon="⭕" title={t("games.tic-tac-toe.title")} subtitle={t("ttt.subtitle")}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <Segmented
          className="flex-1"
          options={[["cpu", t("ttt.vsComputer")], ["friend", t("ttt.vsFriend")]]}
          value={mode}
          onChange={changeMode}
        />
        {mode === "cpu" && (
          <Segmented
            className="flex-1"
            options={[["easy", t("ttt.easy")], ["hard", t("ttt.hard")]]}
            value={level}
            onChange={setLevel}
          />
        )}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat label={xName} value={score.X} accent />
        <Stat label={t("common.draws")} value={score.draw} />
        <Stat label={oName} value={score.O} />
      </div>

      <div className="panel p-4 sm:p-6">
        {message}
        {result?.player === "X" && mode === "cpu" && <SaveNote status={saveStatus} />}
        <div className="mx-auto mt-5 grid max-w-xs grid-cols-3 gap-2 sm:max-w-sm sm:gap-3">
          {board.map((cell, i) => {
            const inLine = result?.line.includes(i)
            return (
              <button
                key={i}
                onClick={() => !cpuTurn && place(i)}
                disabled={!!cell || !!result || cpuTurn}
                aria-label={`${t("ttt.square", { n: i + 1 })}${cell ? `, ${cell}` : ""}`}
                className={`flex aspect-square items-center justify-center rounded-2xl border-2 text-5xl font-extrabold transition-colors sm:text-6xl ${
                  inLine
                    ? "border-win bg-win-soft"
                    : "border-line bg-canvas enabled:hover:border-brand-400 enabled:hover:bg-brand-50"
                }`}
              >
                {cell && (
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className={cell === "X" ? "text-fg" : "text-brand-600"}
                  >
                    {cell}
                  </motion.span>
                )}
              </button>
            )
          })}
        </div>
        <button onClick={newRound} className="btn-primary mt-6 w-full">
          {result ? t("ttt.nextRound") : t("ttt.restartRound")}
        </button>
      </div>
    </GameLayout>
  )
}

export default TicTacToe
