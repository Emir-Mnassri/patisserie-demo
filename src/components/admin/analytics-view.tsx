"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAnalytics, type Period } from "@/app/(admin)/admin/analytics/actions"
import { formatTND } from "@/lib/utils"
import { TrendingUp, ShoppingBag, Clock } from "lucide-react"

type Analytics = Awaited<ReturnType<typeof getAnalytics>>

export function AnalyticsView({ initial }: { initial: Analytics }) {
  const [period, setPeriod] = useState<Period>("day")
  const [data, setData] = useState<Analytics>(initial)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getAnalytics(period)
      .then(setData)
      .finally(() => setLoading(false))
  }, [period])

  const PERIOD_LABELS: Record<Period, string> = {
    day: "30 derniers jours",
    month: "12 derniers mois",
    year: "5 dernières années",
  }

  return (
    <div className="space-y-6">
      {/* Period switcher */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList>
          <TabsTrigger value="day">Jour</TabsTrigger>
          <TabsTrigger value="month">Mois</TabsTrigger>
          <TabsTrigger value="year">Année</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              Chiffre d'affaires
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatTND(data.summary.totalRevenue)}
            </p>
            <p className="text-xs text-neutral-500">{PERIOD_LABELS[period]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              Commandes confirmées
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.summary.totalOrders}</p>
            <p className="text-xs text-neutral-500">{PERIOD_LABELS[period]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              En attente d'approbation
            </CardTitle>
            <Clock className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.summary.pendingCount}</p>
            <p className="text-xs text-neutral-500">Toutes périodes</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue over time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Chiffre d'affaires — {PERIOD_LABELS[period]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
              Chargement...
            </div>
          ) : data.revenueChart.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
              Aucune donnée pour cette période.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v} DT`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatTND(value),
                    "Chiffre d'affaires",
                  ]}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#111"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Produits les plus vendus — {PERIOD_LABELS[period]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
              Chargement...
            </div>
          ) : data.topProducts.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
              Aucune donnée pour cette période.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={data.topProducts}
                layout="vertical"
                margin={{ left: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  tickFormatter={(v) => `${v} DT`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatTND(value),
                    "Chiffre d'affaires",
                  ]}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar
                  dataKey="totalRevenue"
                  fill="#111"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
