import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import GameLayout, { Banner, Stat } from "../components/GameLayout"

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

const Toggle = ({ options, value, onChange }) => (
  <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
    {options.map(([id, label]) => (
      <button
        key={id}
        onClick={() => onChange(id)}
        className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          value === id ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-ink"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
)

const emptyBoard = () => Array(9).fill(null)

const TicTacToe = () => {
  const [board, setBoard] = useState(emptyBoard)
  const [xTurn, setXTurn] = useState(true)
  const [mode, setMode] = useState("cpu") // cpu | friend
  const [level, setLevel] = useState("hard")
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 })

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
  }

  // Let the computer play after a short pause.
  useEffect(() => {
    if (!cpuTurn) return
    const t = setTimeout(() => place(computerMove(board, level)), 450)
    return () => clearTimeout(t)
  })

  const newRound = () => {
    setBoard(emptyBoard())
    setXTurn(true)
  }

  const changeMode = (m) => {
    setMode(m)
    setScore({ X: 0, O: 0, draw: 0 })
    newRound()
  }

  const oName = mode === "cpu" ? "Computer" : "Player O"
  const xName = mode === "cpu" ? "You" : "Player X"

  let message
  if (result?.player === "draw") message = <Banner tone="warn">It's a draw!</Banner>
  else if (result) {
    const won = result.player === "X" || mode === "friend"
    const who = result.player === "X" ? xName : oName
    message = <Banner tone={won ? "win" : "lose"}>{who === "You" ? "You won" : `${who} won`} this round!</Banner>
  } else {
    const turnText = cpuTurn
      ? "Computer is thinking…"
      : mode === "cpu"
        ? "Your turn (X)"
        : `${xTurn ? xName : oName}'s turn`
    message = <Banner>{turnText}</Banner>
  }

  return (
    <GameLayout icon="⭕" title="Tic-Tac-Toe" subtitle="Get three in a row to win.">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Toggle options={[["cpu", "vs Computer"], ["friend", "vs Friend"]]} value={mode} onChange={changeMode} />
        </div>
        {mode === "cpu" && (
          <div className="flex-1">
            <Toggle options={[["easy", "Easy"], ["hard", "Hard"]]} value={level} onChange={setLevel} />
          </div>
        )}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat label={xName} value={score.X} accent />
        <Stat label="Draws" value={score.draw} />
        <Stat label={oName} value={score.O} />
      </div>

      <div className="panel p-4 sm:p-6">
        {message}
        <div className="mx-auto mt-5 grid max-w-xs grid-cols-3 gap-2 sm:max-w-sm sm:gap-3">
          {board.map((cell, i) => {
            const inLine = result?.line.includes(i)
            return (
              <button
                key={i}
                onClick={() => !cpuTurn && place(i)}
                disabled={!!cell || !!result || cpuTurn}
                aria-label={`Square ${i + 1}${cell ? `, ${cell}` : ""}`}
                className={`flex aspect-square items-center justify-center rounded-2xl border-2 text-5xl font-extrabold transition-colors sm:text-6xl ${
                  inLine
                    ? "border-win bg-win-soft"
                    : "border-slate-200 bg-slate-50 enabled:hover:border-brand-400 enabled:hover:bg-brand-50"
                }`}
              >
                {cell && (
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className={cell === "X" ? "text-ink" : "text-brand-600"}
                  >
                    {cell}
                  </motion.span>
                )}
              </button>
            )
          })}
        </div>
        <button onClick={newRound} className="btn-primary mt-6 w-full">
          {result ? "Next round" : "Restart round"}
        </button>
      </div>
    </GameLayout>
  )
}

export default TicTacToe
