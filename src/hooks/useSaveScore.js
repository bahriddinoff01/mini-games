import { useCallback, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

// Saves a game result to the leaderboard when the player is logged in.
// `status` is null (nothing yet), "guest", "saving", "saved" or "error" — show it with <SaveNote />.
export default function useSaveScore(game) {
  const { user } = useAuth()
  const [status, setStatus] = useState(null)

  const save = useCallback(
    async (score) => {
      if (!supabase || !user) {
        setStatus("guest")
        return
      }
      setStatus("saving")
      const { error } = await supabase.from("scores").insert({ game, score: Math.round(score) })
      setStatus(error ? "error" : "saved")
    },
    [game, user]
  )

  const clear = useCallback(() => setStatus(null), [])

  return { status, save, clear }
}
