"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PushToggle() {
  const [status, setStatus] = useState<"unknown" | "granted" | "denied" | "unsupported">("unknown")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported")
      return
    }
    setStatus(Notification.permission === "granted" ? "granted" : "denied")
  }, [])

  async function subscribe() {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.register("/sw.js")
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setStatus("denied")
        return
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      const json = sub.toJSON()
      await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
        }),
      })

      setStatus("granted")
    } catch (err) {
      console.error("Subscribe error:", err)
    } finally {
      setLoading(false)
    }
  }

  async function unsubscribe() {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js")
      const sub = await reg?.pushManager.getSubscription()
      if (sub) {
        await fetch("/api/push", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setStatus("denied")
    } catch (err) {
      console.error("Unsubscribe error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (status === "unsupported") return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={status === "granted" ? unsubscribe : subscribe}
      disabled={loading}
      style={{
        borderColor: status === "granted" ? "#C9922A" : undefined,
        color: status === "granted" ? "#C9922A" : undefined,
      }}
    >
      {status === "granted" ? (
        <>
          <Bell className="mr-2 h-4 w-4" />
          {loading ? "..." : "Notifications activées"}
        </>
      ) : (
        <>
          <BellOff className="mr-2 h-4 w-4" />
          {loading ? "..." : "Activer les notifications"}
        </>
      )}
    </Button>
  )
}
