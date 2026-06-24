"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import { deleteProduct } from "@/app/(admin)/admin/products/actions"
import { formatTND } from "@/lib/utils"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"

type Product = {
  id: string
  name: string
  nameAr: string | null
  unit: "KG" | "PIECE"
  price: number
  stock: number
  category: string | null
  occasion: string | null
  isActive: boolean
  images: string[]
}

export function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.nameAr ?? "").toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q)
    )
  }, [products, query])

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce produit définitivement ?")) return
    setDeletingId(id)
    try {
      await deleteProduct(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size={isMobile ? "sm" : "default"}>
              <Plus className="mr-1 h-4 w-4" />
              {isMobile ? "Ajouter" : "Ajouter un produit"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau produit</DialogTitle>
            </DialogHeader>
            <ProductForm onDone={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile card layout */}
      {isMobile ? (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-md border bg-white p-8 text-center text-sm text-neutral-500">
              Aucun produit trouvé.
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-neutral-50">
                    {p.images.length > 0 ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">
                        {p.unit === "KG" ? "🍯" : "🎂"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">
                          {p.name}
                        </p>
                        {p.nameAr && (
                          <p className="text-xs text-neutral-400 truncate" dir="rtl">
                            {p.nameAr}
                          </p>
                        )}
                      </div>
                      {p.isActive ? (
                        <Badge className="shrink-0 text-xs" style={{ backgroundColor: "#33100E", color: "#E8B84B" }}>
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          Inactif
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span style={{ color: "#C9922A", fontWeight: 700 }}>
                        {formatTND(p.price)}
                        <span className="text-xs text-neutral-400 font-normal">
                          {p.unit === "KG" ? " / kg" : " / pièce"}
                        </span>
                      </span>
                      <span className="text-neutral-500">
                        Stock: {p.stock} {p.unit === "KG" ? "kg" : "pcs"}
                      </span>
                      {p.category && (
                        <span className="text-neutral-400 text-xs">
                          {p.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex justify-end gap-2 border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(p)}
                    style={{ borderColor: "#C9922A", color: "#C9922A" }}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="border-red-200 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Supprimer
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Desktop table layout */
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                    Aucun produit trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {p.images.length > 0 && (
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded border bg-neutral-50">
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-contain p-0.5"
                              sizes="32px"
                            />
                          </div>
                        )}
                        <div>
                          {p.name}
                          {p.nameAr && (
                            <span className="ml-2 text-sm text-neutral-400">
                              {p.nameAr}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{p.category ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      {formatTND(p.price)}
                      <span className="text-neutral-400">
                        {p.unit === "KG" ? " / kg" : " / pièce"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {p.stock} {p.unit === "KG" ? "kg" : "pcs"}
                    </TableCell>
                    <TableCell>
                      {p.isActive ? (
                        <Badge>Actif</Badge>
                      ) : (
                        <Badge variant="secondary">Inactif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditing(p)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-sm text-neutral-500">
        {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProductForm
              product={editing}
              onDone={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
