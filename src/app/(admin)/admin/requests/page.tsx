import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"

const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  CONFIRMED: "Confirmé",
  DECLINED: "Refusé",
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  NEW: "default",
  CONTACTED: "secondary",
  CONFIRMED: "secondary",
  DECLINED: "destructive",
}

export default async function RequestsPage() {
  const requests = await prisma.customCakeRequest.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Demandes sur mesure</h1>
        <p className="text-sm text-neutral-500">
          Clients qui ont demandé un gâteau personnalisé
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-md border bg-white p-12 text-center text-neutral-500">
          Aucune demande pour le moment.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((r) => (
            <div key={r.id} className="rounded-md border bg-white p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-neutral-900">{r.customerName}</p>
                  <p className="text-sm text-neutral-500">{r.customerPhone}</p>
                </div>
                <Badge variant={STATUS_VARIANT[r.status]}>
                  {STATUS_LABELS[r.status]}
                </Badge>
              </div>

              {(r.occasion || r.eventDate || r.servings) && (
                <div className="flex gap-4 text-sm text-neutral-500 flex-wrap">
                  {r.occasion && <span>🎉 {r.occasion}</span>}
                  {r.eventDate && (
                    <span>
                      📅 {new Date(r.eventDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                  )}
                  {r.servings && <span>👥 {r.servings} personnes</span>}
                </div>
              )}

              <p className="text-sm text-neutral-700 bg-neutral-50 rounded p-2 leading-relaxed">
                {r.message}
              </p>

              <p className="text-xs text-neutral-400">
                Reçue le {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
