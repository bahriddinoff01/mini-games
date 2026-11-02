import { useI18n } from "../i18n"

const Footer = () => {
  const { t } = useI18n()
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          <span className="font-semibold text-fg">Mini Arcade</span> · {t("common.footerTagline")}
        </p>
        <p>© {new Date().getFullYear()} Abdulaziz</p>
      </div>
    </footer>
  )
}

export default Footer
