"use client"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Sidebar } from "@/components/admin/sidebar"
import { PushToggle } from "@/components/admin/push-toggle"
import { Button } from "@/components/ui/button"

export function MobileSidebar({ storeName }: { storeName: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col">
            <div className="flex h-16 items-center justify-between border-b px-5">
              <span className="text-lg font-semibold">{storeName}</span>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div onClick={() => setOpen(false)} className="flex-1">
              <Sidebar />
            </div>
            <div className="border-t p-3">
              <PushToggle compact />
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
