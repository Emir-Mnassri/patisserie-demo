import { ReactNode } from "react"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/admin/sidebar"
import { MobileSidebar } from "@/components/admin/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { PushToggle } from "@/components/admin/push-toggle"
import { logout } from "./logout-action"
import { LogOut } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-white md:block">
        <div className="flex h-16 items-center border-b px-5">
          <span className="text-lg font-semibold">
            <span style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: "1.3em", color: "#33100E" }}>
              Caramel
            </span>{" "}
            Pâtisserie
          </span>
        </div>
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            <MobileSidebar storeName="Caramel Pâtisserie" />
            <div className="text-sm text-neutral-500">
              Connecté en tant que{" "}
              <span className="font-medium text-neutral-900">
                {session.user?.email}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PushToggle />
            <form action={logout}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
