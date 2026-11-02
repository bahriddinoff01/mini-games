import { useCallback, useState } from "react"

export const higherIsBetter = (a, b) => a > b
export const lowerIsBetter = (a, b) => a < b

const read = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw === null ? null : Number(raw)
  } catch {
    return null
  }
}

// Keeps a best score in localStorage.
// `better(a, b)` returns true when score `a` beats score `b`.
export default function useBestScore(key, better = higherIsBetter) {
  const storageKey = `mini-arcade-best-${key}`
  const [best, setBest] = useState(() => read(storageKey))

  // Returns true if the score was a new record. Stable between renders.
  const submit = useCallback(
    (score) => {
      const current = read(storageKey)
      if (current !== null && !better(score, current)) return false
      setBest(score)
      try {
        localStorage.setItem(storageKey, String(score))
      } catch {
        /* ignore */
      }
      return true
    },
    [storageKey, better]
  )

  return [best, submit]
}
