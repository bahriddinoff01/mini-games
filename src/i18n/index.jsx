import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import en from "./en"
import uz from "./uz"
import ko from "./ko"
import ru from "./ru"
import { LANGUAGES } from "./languages"

const dictionaries = { en, uz, ko, ru }
const KEY = "mini-arcade-lang"

const detectLanguage = () => {
  try {
    const saved = localStorage.getItem(KEY)
    if (dictionaries[saved]) return saved
  } catch {
    /* ignore */
  }
  const browser = (navigator.language || "en").slice(0, 2).toLowerCase()
  return dictionaries[browser] ? browser : "en"
}

// Look up "a.b.c" in a nested object.
const lookup = (dict, key) => key.split(".").reduce((obj, part) => obj?.[part], dict)

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detectLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  // t("guess.won", { n: 3 }) → translated text with placeholders filled in.
  // Falls back to English, then to the key itself.
  const t = useCallback(
    (key, vars) => {
      let value = lookup(dictionaries[lang], key) ?? lookup(en, key) ?? key
      if (typeof value === "string" && vars) {
        value = value.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m))
      }
      return value
    },
    [lang]
  )

  const value = useMemo(() => {
    const locale = LANGUAGES.find((l) => l.code === lang)?.locale ?? "en-US"
    return { lang, setLang, t, locale }
  }, [lang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => useContext(I18nContext)
