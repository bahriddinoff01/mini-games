// Every activity on the site. Titles and descriptions live in src/i18n/*.js under games.<id>.
// To add a game: add an entry here, a route in App.jsx, texts in every language file,
// and (if it has a leaderboard) a rule in supabase/schema.sql.
//
// scoring.kind: "best" = each player's best single result, "wins" = total wins
// scoring.lower: true when a smaller number is better
// scoring.unit:  key in i18n "units"
export const activities = [
  { id: "todo", icon: "📝", path: "/todo", scoring: null },
  { id: "guess-number", icon: "🔢", path: "/guess-number", scoring: { kind: "best", lower: true, unit: "tries" } },
  { id: "rps", icon: "✊", path: "/rps", scoring: { kind: "wins", unit: "wins" } },
  { id: "tic-tac-toe", icon: "⭕", path: "/tic-tac-toe", scoring: { kind: "wins", unit: "wins" } },
  { id: "memory", icon: "🧠", path: "/memory", scoring: { kind: "best", lower: true, unit: "moves" } },
  { id: "reaction", icon: "⚡", path: "/reaction", scoring: { kind: "best", lower: true, unit: "ms" } },
  { id: "typing", icon: "⌨️", path: "/typing", scoring: { kind: "best", lower: false, unit: "wpm" } },
  { id: "whack-a-mole", icon: "🔨", path: "/whack-a-mole", scoring: { kind: "best", lower: false, unit: "points" } },
]

export const rankedGames = activities.filter((a) => a.scoring)
export const findGame = (id) => activities.find((a) => a.id === id)
