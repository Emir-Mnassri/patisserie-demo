import { getAnalytics } from "./actions"
import { AnalyticsView } from "@/components/admin/analytics-view"

export default async function AnalyticsPage() {
  // Load "day" (last 30 days) as the default — matches your chosen focus
  const initial = await getAnalytics("day")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytiques</h1>
        <p className="text-sm text-neutral-500">
          Suivez vos ventes et vos produits les plus populaires
        </p>
      </div>

      <AnalyticsView initial={initial} />
    </div>
  )
}
