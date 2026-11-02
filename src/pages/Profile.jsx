import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import GameLayout, { Banner } from "../components/GameLayout"
import { rankedGames } from "../data/activities"
import { supabase } from "../lib/supabase"
import { useI18n } from "../i18n"
import { useAuth } from "../context/AuthContext"
import { formatScore } from "../lib/format"

const Profile = () => {
  const { t, locale } = useI18n()
  const { configured, loading, user, profile, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [ranks, setRanks] = useState(null)
  const [confirmText, setConfirmText] = useState("")
  const [showDelete, setShowDelete] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [deleting, setDeleting] = useState(false)

  const userId = user?.id
  useEffect(() => {
    if (!supabase || !userId) return
    supabase.rpc("get_my_ranks").then(({ data }) => {
      setRanks(Object.fromEntries((data ?? []).map((r) => [r.game, r])))
    })
  }, [userId])

  if (deleting && !user) return <Navigate to="/" replace />
  if (!configured || (!loading && !user)) return <Navigate to="/login" replace />
  if (loading || !profile) {
    return <p className="py-24 text-center text-muted">{t("common.loading")}</p>
  }

  const totalPlays = ranks ? Object.values(ranks).reduce((sum, r) => sum + Number(r.plays), 0) : "…"
  const joined = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(profile.created_at)
  )

  const handleDelete = async () => {
    setDeleteError("")
    setDeleting(true)
    const result = await deleteAccount()
    if (result.error) {
      setDeleting(false)
      return setDeleteError(result.error)
    }
    navigate("/")
  }

  return (
    <GameLayout icon="👤" title={profile.username} subtitle={t("profile.memberSince", { date: joined })} maxWidth="max-w-3xl">
      <div className="panel mb-6 flex items-center justify-between p-4 sm:p-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">{t("profile.plays")}</div>
          <div className="mt-1 text-3xl font-bold tabular-nums text-brand-700">{totalPlays}</div>
        </div>
        <Link to="/leaderboard" className="btn-primary">🏆 {t("common.leaderboard")}</Link>
      </div>

      <h2 className="mb-3 text-lg font-bold">{t("common.myResults")}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rankedGames.map((g) => {
          const r = ranks?.[g.id]
          return (
            <Link
              key={g.id}
              to={r ? `/leaderboard?game=${g.id}` : g.path}
              className="panel flex items-center gap-4 p-4 transition-colors hover:border-brand-400"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                {g.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{t(`games.${g.id}.title`)}</div>
                <div className="text-sm text-muted">
                  {ranks === null ? "…" : r ? formatScore(t, g.id, r.value) : t("profile.notPlayed")}
                </div>
              </div>
              {r && <span className="chip shrink-0">{t("profile.rank", { rank: r.rank })}</span>}
            </Link>
          )
        })}
      </div>

      {/* delete account */}
      <div className="panel mt-10 border-lose/30 p-4 sm:p-6">
        <h2 className="font-bold text-lose-fg">{t("profile.dangerTitle")}</h2>
        <p className="mt-1 text-sm text-muted">{t("profile.dangerText")}</p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="btn mt-4 border border-lose/40 text-lose-fg hover:bg-lose-soft">
            {t("profile.dangerTitle")}
          </button>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <label className="text-sm font-medium">
              {t("profile.typeToConfirm")}: <span className="font-mono">{profile.username}</span>
              <input
                className="input mt-1.5"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoComplete="off"
              />
            </label>
            {deleteError && <Banner tone="lose">{t(deleteError)}</Banner>}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleDelete}
                disabled={confirmText !== profile.username}
                className="btn flex-1 bg-lose text-white hover:opacity-90"
              >
                {t("profile.deleteForever")}
              </button>
              <button
                onClick={() => {
                  setShowDelete(false)
                  setConfirmText("")
                }}
                className="btn-secondary flex-1"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  )
}

export default Profile
