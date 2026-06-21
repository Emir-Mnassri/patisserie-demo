"use client"
import { useState, useEffect } from "react"
import { Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PushToggle({ compact = false }: { compact?: boolean }) {
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
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) {
        console.error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set")
        return
      }

      const reg = await navigator.serviceWorker.register("/sw.js")
      await navigator.serviceWorker.ready

      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setStatus("denied")
        return
      }

      // Convert VAPID key from base64 to Uint8Array
      const padding = "=".repeat((4 - (vapidKey.length % 4)) % 4)
      const base64 = (vapidKey + padding).replace(/-/g, "+").replace(/_/g, "/")
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: outputArray,
      })

      const json = sub.toJSON()
      const res = await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
        }),
      })

      if (!res.ok) {
        console.error("Failed to save subscription", await res.text())
        return
      }

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

  if (compact) {
    return (
      <button
        onClick={status === "granted" ? unsubscribe : subscribe}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: status === "granted" ? "#FBF1E0" : "transparent",
          color: status === "granted" ? "#C9922A" : "#5C2620",
          fontSize: "0.875rem",
          fontWeight: 500,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {status === "granted"
          ? <Bell style={{ width: "16px", height: "16px" }} />
          : <BellOff style={{ width: "16px", height: "16px" }} />
        }
        {loading ? "..." : status === "granted" ? "Notifications activées" : "Activer les notifications"}
      </button>
    )
  }

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
