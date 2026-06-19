import webpush from "web-push"

webpush.setVapidDetails(
  "mailto:admin@caramel-patisserie.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function sendPushToAll(payload: {
  title: string
  body: string
  url?: string
}) {
  const { prisma } = await import("@/lib/prisma")
  const subscriptions = await prisma.pushSubscription.findMany()

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload)
      )
    )
  )

  // Clean up expired subscriptions
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (result.status === "rejected") {
      await prisma.pushSubscription.delete({
        where: { endpoint: subscriptions[i].endpoint },
      }).catch(() => {})
    }
  }
}
