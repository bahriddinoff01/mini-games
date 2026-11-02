import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useI18n } from "../i18n"
import { useAuth } from "../context/AuthContext"
import { Banner } from "../components/GameLayout"

const Field = ({ label, hint, ...props }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium">{label}</span>
    <input className="input" {...props} />
    {hint && <span className="mt-1 block text-xs text-faint">{hint}</span>}
  </label>
)

// One component for both pages: mode = "login" | "signup".
const Auth = ({ mode }) => {
  const isSignup = mode === "signup"
  const { t } = useI18n()
  const { configured, user, loading, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [sentTo, setSentTo] = useState("")
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to="/profile" replace />

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setBusy(true)
    const email = form.email.trim()
    const result = isSignup
      ? await signUp({ email, password: form.password, username: form.username.trim() })
      : await signIn({ email, password: form.password })
    setBusy(false)
    if (result.error) return setError(result.error)
    if (result.needsConfirmation) return setSentTo(email)
    navigate("/profile")
  }

  return (
    <main className="px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl">
            {isSignup ? "✨" : "👋"}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSignup ? t("auth.signupTitle") : t("auth.loginTitle")}
          </h1>
          <p className="mt-2 text-muted">{isSignup ? t("auth.signupSubtitle") : t("auth.loginSubtitle")}</p>
        </div>

        <div className="panel p-5 sm:p-7">
          {!configured ? (
            <Banner tone="warn">{t("auth.notConfigured")}</Banner>
          ) : sentTo ? (
            <Banner tone="win">{t("auth.checkEmail", { email: sentTo })}</Banner>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
              {isSignup && (
                <Field
                  label={t("auth.username")}
                  hint={t("auth.usernameHint")}
                  value={form.username}
                  onChange={update("username")}
                  autoComplete="username"
                  maxLength={20}
                  required
                />
              )}
              <Field
                label={t("auth.email")}
                type="email"
                value={form.email}
                onChange={update("email")}
                autoComplete="email"
                required
              />
              <Field
                label={t("auth.password")}
                hint={isSignup ? t("auth.passwordHint") : null}
                type="password"
                value={form.password}
                onChange={update("password")}
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={isSignup ? 8 : undefined}
                required
              />

              {error && <p className="rounded-lg bg-lose-soft px-3 py-2 text-sm text-lose-fg">{t(error)}</p>}

              <button type="submit" className="btn-primary mt-1 w-full" disabled={busy}>
                {busy ? t("common.loading") : isSignup ? t("auth.submitSignup") : t("auth.submitLogin")}
              </button>

              {isSignup && <p className="text-center text-xs text-muted">{t("auth.privacy")}</p>}
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          {isSignup ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
          <Link to={isSignup ? "/login" : "/signup"} className="font-semibold text-brand-700 hover:underline">
            {isSignup ? t("common.login") : t("common.signup")}
          </Link>
        </p>
      </motion.div>
    </main>
  )
}

export default Auth
