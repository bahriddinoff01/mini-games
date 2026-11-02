import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import GameLayout, { Banner, Stat } from "../components/GameLayout"
import useBestScore, { lowerIsBetter } from "../hooks/useBestScore"

const SYMBOLS = ["🍎", "🚀", "🎧", "🌵", "🐙", "⚽", "🍩", "🦊"]

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const newDeck = () =>
  shuffle([...SYMBOLS, ...SYMBOLS]).map((symbol, i) => ({ id: i, symbol, matched: false }))

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

const Memory = () => {
  const [cards, setCards] = useState(newDeck)
  const [flipped, setFlipped] = useState([]) // ids of up to 2 face-up, unmatched cards
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)
  const [newRecord, setNewRecord] = useState(false)
  const [best, submitBest] = useBestScore("memory", lowerIsBetter)

  const pairsFound = cards.filter((c) => c.matched).length / 2
  const won = pairsFound === SYMBOLS.length

  // Timer runs from the first flip until all pairs are found.
  useEffect(() => {
    if (!started || won) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [started, won])

  const flip = (card) => {
    if (won || card.matched || flipped.includes(card.id) || flipped.length === 2) return
    setStarted(true)
    const next = [...flipped, card.id]
    setFlipped(next)
    if (next.length < 2) return

    setMoves((m) => m + 1)
    const [a, b] = next.map((id) => cards.find((c) => c.id === id))
    if (a.symbol === b.symbol) {
      const updated = cards.map((c) => (c.symbol === a.symbol ? { ...c, matched: true } : c))
      setCards(updated)
      setFlipped([])
      if (updated.every((c) => c.matched)) setNewRecord(submitBest(moves + 1))
    } else {
      setTimeout(() => setFlipped([]), 800)
    }
  }

  const restart = () => {
    setCards(newDeck())
    setFlipped([])
    setMoves(0)
    setSeconds(0)
    setStarted(false)
    setNewRecord(false)
  }

  return (
    <GameLayout icon="🧠" title="Memory Match" subtitle="Find all 8 pairs in as few moves as possible.">
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat label="Moves" value={moves} accent />
        <Stat label="Time" value={formatTime(seconds)} />
        <Stat label="Best" value={best ?? "—"} />
      </div>

      <div className="panel p-3 sm:p-6">
        {won && (
          <div className="mb-4">
            <Banner tone="win">
              🎉 Solved in {moves} moves and {formatTime(seconds)}!{newRecord && " New best score!"}
            </Banner>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {cards.map((card) => {
            const faceUp = card.matched || flipped.includes(card.id)
            return (
              <button
                key={card.id}
                onClick={() => flip(card)}
                aria-label={faceUp ? card.symbol : "Hidden card"}
                className="aspect-square [perspective:600px]"
              >
                <motion.div
                  animate={{ rotateY: faceUp ? 180 : 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative h-full w-full [transform-style:preserve-3d]"
                >
                  {/* back */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-ink text-xl text-brand-300 [backface-visibility:hidden] hover:bg-ink-soft sm:rounded-2xl sm:text-2xl">
                    ?
                  </div>
                  {/* front */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 text-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] sm:rounded-2xl sm:text-5xl ${
                      card.matched ? "border-win bg-win-soft" : "border-brand-300 bg-brand-50"
                    }`}
                  >
                    {card.symbol}
                  </div>
                </motion.div>
              </button>
            )
          })}
        </div>

        <button onClick={restart} className="btn-primary mt-6 w-full">
          {won ? "Play again" : "Restart"}
        </button>
      </div>
    </GameLayout>
  )
}

export default Memory
