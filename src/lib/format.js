import { findGame } from "../data/activities"

// "312 ms", "5 wins", ... in the current language.
export const formatScore = (t, gameId, value) => t(`units.${findGame(gameId).scoring.unit}`, { v: value })

export const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
