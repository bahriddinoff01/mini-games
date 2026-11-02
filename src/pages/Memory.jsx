import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import GameLayout, { Banner, SaveNote, Stat } from "../components/GameLayout"
import useBestScore, { lowerIsBetter } from "../hooks/useBestScore"
import useSaveScore from "../hooks/useSaveScore"
import { useI18n } from "../i18n"
import { formatTime } from "../lib/format"

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

const Memory = () => {
  const { t } = useI18n()
  const [cards, setCards] = useState(newDeck)
  const [flipped, setFlipped] = useState([]) // ids of up to 2 face-up, unmatched cards
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)
  const [newRecord, setNewRecord] = useState(false)
  const [best, submitBest] = useBestScore("memory", lowerIsBetter)
  const { status: saveStatus, save, clear } = useSaveScore("memory")

  const won = cards.every((c) => c.matched)

  // Timer runs from the first flip until all pairs are found.
  useEffect(() => {
    if (!started || won) return
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [started, won])

  const flip = (card) => {
    if (won || card.matched || flipped.includes(card.id) || flipped.length === 2) return
    setStarted(true)
    const next = [...flipped, card.id]
    setFlipped(next)
    if (next.length < 2) return

    const totalMoves = moves + 1
    setMoves(totalMoves)
    const [a, b] = next.map((id) => cards.find((c) => c.id === id))
    if (a.symbol === b.symbol) {
      const updated = cards.map((c) => (c.symbol === a.symbol ? { ...c, matched: true } : c))
      setCards(updated)
      setFlipped([])
      if (updated.every((c) => c.matched)) {
        setNewRecord(submitBest(totalMoves))
        save(totalMoves)
      }
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
    clear()
  }

  return (
    <GameLayout icon="🧠" title={t("games.memory.title")} subtitle={t("memory.subtitle")}>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat label={t("common.moves")} value={moves} accent />
        <Stat label={t("common.time")} value={formatTime(seconds)} />
        <Stat label={t("common.best")} value={best ?? "—"} />
      </div>

      <div className="panel p-3 sm:p-6">
        {won && (
          <div className="mb-4">
            <Banner tone="win">
              {t("memory.solved", { moves, time: formatTime(seconds) })}
              {newRecord && ` ${t("common.newBest")}`}
            </Banner>
            <SaveNote status={saveStatus} />
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {cards.map((card) => {
            const faceUp = card.matched || flipped.includes(card.id)
            return (
              <button
                key={card.id}
                onClick={() => flip(card)}
                aria-label={faceUp ? card.symbol : t("memory.hidden")}
                className="group aspect-square [perspective:600px]"
              >
                <motion.div
                  animate={{ rotateY: faceUp ? 180 : 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative h-full w-full [transform-style:preserve-3d]"
                >
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-ink text-xl text-brand-300 transition-colors [backface-visibility:hidden] group-hover:bg-ink-soft sm:rounded-2xl sm:text-2xl dark:text-white/70">
                    ?
                  </div>
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
          {won ? t("common.playAgain") : t("common.restart")}
        </button>
      </div>
    </GameLayout>
  )
}

export default Memory
