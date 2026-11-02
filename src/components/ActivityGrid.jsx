import ActivityCard from "./ActivityCard"
import { activities } from "../data/activities"
import { useI18n } from "../i18n"

const ActivityGrid = () => {
  const { t } = useI18n()
  return (
    <section id="games" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("grid.title")}</h2>
          <p className="mt-1 text-muted">{t("grid.subtitle")}</p>
        </div>
        <span className="text-sm text-faint">{t("grid.count", { n: activities.length })}</span>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {activities.map((item, i) => (
          <ActivityCard key={item.id} index={i} {...item} />
        ))}
      </div>
    </section>
  )
}

export default ActivityGrid
