import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import GameLayout, { Banner } from "../components/GameLayout"
import { rankedGames, findGame } from "../data/activities"
import { supabase } from "../lib/supabase"
import { useI18n } from "../i18n"
import { useAuth } from "../context/AuthContext"
import { formatScore } from "../lib/format"

const medals = { 1: "🥇", 2: "🥈", 3: "🥉" }



const Leaderboard = () => {
  const { t } = useI18n()
  const { configured, user } = useAuth()
  const [params, setParams] = useSearchParams()
  const gameId = rankedGames.some((g) => g.id === params.get("game")) ? params.get("game") : rankedGames[0].id
  const game = findGame(gameId)

  // Results are stored per game id so switching tabs shows cached data instantly.
  const [data, setData] = useState({})

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    supabase.rpc("get_leaderboard", { game_id: gameId, max_rows: 50 }).then(({ data: rows, error }) => {
      if (!cancelled) setData((d) => ({ ...d, [gameId]: error ? "error" : rows }))
    })
    return () => {
      cancelled = true
    }
  }, [gameId])

  const rows = data[gameId]
  const myRow = Array.isArray(rows) ? rows.find((r) => r.user_id === user?.id) : null
  const hint =
    game.scoring.kind === "wins" ? t("board.winsCount") : game.scoring.lower ? t("board.lowerBetter") : t("board.higherBetter")

  return (
    <GameLayout icon="🏆" title={t("board.title")} subtitle={t("board.subtitle")} maxWidth="max-w-3xl">
      {/* game tabs — scroll sideways on small screens */}
      <div className="-mx-4 mb-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center">
          {rankedGames.map((g) => (
            <button
              key={g.id}
              onClick={() => setParams({ game: g.id }, { replace: true })}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                g.id === gameId
                  ? "border-ink bg-ink text-on-ink"
                  : "border-line bg-surface text-muted hover:border-brand-400 hover:text-brand-700"
              }`}
            >
              {g.icon} {t(`games.${g.id}.title`)}
            </button>
          ))}
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-6">
          <h2 className="font-semibold">
            {game.icon} {t(`games.${gameId}.title`)}
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted">
            {myRow && <span className="chip">{t("board.yourRank", { rank: myRow.rank })}</span>}
            <span>{hint}</span>
          </div>
        </div>

        {!configured ? (
          <div className="p-4 sm:p-6">
            <Banner tone="warn">{t("auth.notConfigured")}</Banner>
          </div>
        ) : rows === undefined ? (
          <p className="p-8 text-center text-muted">{t("common.loading")}</p>
        ) : rows === "error" ? (
          <div className="p-4 sm:p-6">
            <Banner tone="lose">{t("board.loadError")}</Banner>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted">{t("board.empty")}</p>
            <Link to={game.path} className="btn-primary mt-4">{t("common.play")}</Link>
          </div>
        ) : (
          <ol>
            <AnimatePresence initial={false}>
              {rows.map((r, i) => {
                const mine = r.user_id === user?.id
                return (
                  <motion.li
                    key={`${gameId}-${r.user_id}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i, 10) * 0.02 }}
                    className={`flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 sm:px-6 ${
                      mine ? "bg-brand-50" : ""
                    }`}
                  >
                    <span className="w-8 shrink-0 text-center text-lg font-bold tabular-nums text-muted">
                      {medals[r.rank] ?? r.rank}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {r.username}
                      {mine && <span className="ml-2 text-xs font-semibold text-brand-700">({t("board.youTag")})</span>}
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums">{formatScore(t, gameId, r.value)}</span>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ol>
        )}
      </div>

      {configured && !user && (
        <p className="mt-4 text-center text-sm">
          <Link to="/signup" className="font-medium text-brand-700 hover:underline">{t("common.loginToSave")}</Link>
        </p>
      )}
    </GameLayout>
  )
}

export default Leaderboard
