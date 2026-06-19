"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "./image-upload"
import {
  createProduct,
  updateProduct,
  type ProductInput,
} from "@/app/(admin)/admin/products/actions"

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

export function ProductForm({
  product,
  onDone,
}: {
  product?: Product
  onDone: () => void
}) {
  const [form, setForm] = useState<ProductInput>({
    name: product?.name ?? "",
    nameAr: product?.nameAr ?? "",
    unit: product?.unit ?? "KG",
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    category: product?.category ?? "",
    occasion: (product?.occasion as ProductInput["occasion"]) ?? "NONE",
    isActive: product?.isActive ?? true,
    images: product?.images ?? [],
  })

  // Store price and stock as strings while typing to allow decimals and empty state
  const [priceStr, setPriceStr] = useState(
    product?.price ? String(product.price) : ""
  )
  const [stockStr, setStockStr] = useState(
    product?.stock ? String(product.stock) : ""
  )

  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    setSaving(true)
    try {
      const finalForm: ProductInput = {
        ...form,
        price: parseFloat(priceStr) || 0,
        stock: parseFloat(stockStr) || 0,
      }
      if (product) {
        await updateProduct(product.id, finalForm)
      } else {
        await createProduct(finalForm)
      }
      onDone()
    } finally {
      setSaving(false)
    }
  }

  const set = (k: keyof ProductInput, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Photos du produit</Label>
        <ImageUpload
          images={form.images ?? []}
          onChange={(imgs) => set("images", imgs)}
        />
      </div>

      <div className="space-y-2">
        <Label>Nom (français)</Label>
        <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Nom (arabe)</Label>
        <Input
          value={form.nameAr}
          onChange={(e) => set("nameAr", e.target.value)}
          dir="rtl"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Unité</Label>
          <Select value={form.unit} onValueChange={(v) => set("unit", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KG">Au kilo</SelectItem>
              <SelectItem value="PIECE">À la pièce</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Prix ({form.unit === "KG" ? "DT/kg" : "DT/pièce"})</Label>
          <Input
            type="number"
            step="0.001"
            min="0"
            placeholder="0.000"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
            onFocus={(e) => {
              if (priceStr === "0" || priceStr === "") e.target.select()
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Stock ({form.unit === "KG" ? "kg" : "pièces"})</Label>
          <Input
            type="number"
            step="0.001"
            min="0"
            placeholder="0"
            value={stockStr}
            onChange={(e) => setStockStr(e.target.value)}
            onFocus={(e) => {
              if (stockStr === "0" || stockStr === "") e.target.select()
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Input
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Occasion</Label>
        <Select value={form.occasion} onValueChange={(v) => set("occasion", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">Aucune</SelectItem>
            <SelectItem value="RAMADAN">Ramadan</SelectItem>
            <SelectItem value="AID">Aïd</SelectItem>
            <SelectItem value="WEDDING">Mariage</SelectItem>
            <SelectItem value="BIRTHDAY">Anniversaire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => set("isActive", e.target.checked)}
        />
        Produit actif (visible en boutique)
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onDone} disabled={saving}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} disabled={saving || !form.name}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  )
}
