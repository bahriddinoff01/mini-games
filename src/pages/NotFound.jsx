import { Link } from "react-router-dom"
import { useI18n } from "../i18n"

const NotFound = () => {
  const { t } = useI18n()
  return (
    <main className="flex flex-col items-center px-4 py-24 text-center">
      <div className="mb-4 text-6xl">👾</div>
      <h1 className="text-3xl font-bold">{t("common.notFoundTitle")}</h1>
      <p className="mt-2 text-muted">{t("common.notFoundText")}</p>
      <Link to="/" className="btn-primary mt-6">{t("common.backHome")}</Link>
    </main>
  )
}

export default NotFound
