import { PrismaClient } from "@prisma/client"

import { generateOrderNumber } from "../src/lib/utils"
const prisma = new PrismaClient()
// Realistic daily order counts for a small pâtisserie

// Index 0 = 29 days ago, index 29 = today

const DAILY_PATTERN = [

2, 1, 3, 4, 2, 6, 8,  // week 1 — builds toward weekend

2, 2, 3, 3, 2, 7, 9,  // week 2 — busy weekend

1, 2, 4, 3, 2, 8, 10, // week 3 — Ramadan spike

2, 3, 3, 4, 3, 9, 11, // week 4 — growing

3, 4,                  // last 2 days

]
const PRODUCTS = [

{ name: "Assortiment de pâtisseries orientales", unit: "KG" as const, price: 45.0 },

{ name: "Baklawa aux amandes", unit: "KG" as const, price: 52.0 },

{ name: "Mlabes & Dragées", unit: "KG" as const, price: 38.0 },

{ name: "Zlabia & Mkharek", unit: "KG" as const, price: 28.0 },

{ name: "Gâteau d'anniversaire personnalisé", unit: "PIECE" as const, price: 90.0 },

{ name: "Tarte aux fraises", unit: "PIECE" as const, price: 35.0 },

]
const CUSTOMERS = [

{ name: "Mohamed Ben Ali", phone: "+216 22 345 678", address: "12 Rue de la Liberté", city: "Tunis", wilaya: "Tunis", zone: "Tunis Centre", fee: 5.0 },

{ name: "Fatma Trabelsi", phone: "+216 55 123 456", address: "45 Avenue Bourguiba", city: "Ariana", wilaya: "Ariana", zone: "Ariana", fee: 7.0 },

{ name: "Sarra Mejri", phone: "+216 98 765 432", address: "8 Rue Ibn Khaldoun", city: "La Marsa", wilaya: "Tunis", zone: "Banlieue Nord", fee: 8.0 },

{ name: "Karim Jouini", phone: "+216 50 111 222", address: "23 Rue de Carthage", city: "Carthage", wilaya: "Tunis", zone: "Banlieue Nord", fee: 8.0 },

{ name: "Ines Belhaj", phone: "+216 71 234 567", address: "67 Avenue de la République", city: "Ben Arous", wilaya: "Ben Arous", zone: "Ben Arous", fee: 7.0 },

{ name: "Youssef Chahed", phone: "+216 25 987 654", address: "3 Rue des Jasmins", city: "Manouba", wilaya: "Manouba", zone: "Tunis Centre", fee: 5.0 },

{ name: "Amira Nasri", phone: "+216 90 456 789", address: "15 Rue Alain Savary", city: "Tunis", wilaya: "Tunis", zone: "Tunis Centre", fee: 5.0 },

]
const STATUSES = ["APPROVED", "APPROVED", "APPROVED", "PREPARING", "READY", "DELIVERED", "DELIVERED"] as const
function pick<T>(arr: readonly T[]): T {

return arr[Math.floor(Math.random() * arr.length)]

}
function randomQty(unit: "KG" | "PIECE"): number {

if (unit === "KG") {

const options = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0]

return pick(options)

}

return pick([1, 2])

}
async function main() {

console.log("Seeding pastry database with 30 days of data...")
await prisma.orderItem.deleteMany()

await prisma.order.deleteMany()

await prisma.customCakeRequest.deleteMany()

await prisma.deliveryZone.deleteMany()

await prisma.product.deleteMany()
// Products

await Promise.all(

PRODUCTS.map((p) =>

prisma.product.create({

data: {

name: p.name,

unit: p.unit,

price: p.price,

stock: 999, // high stock so seed doesn't block

isActive: true,

},

})

)

)
// Delivery zones

await prisma.deliveryZone.createMany({

data: [

{ name: "Tunis Centre", minOrder: 30.0, deliveryFee: 5.0 },

{ name: "Banlieue Nord (La Marsa, Carthage)", minOrder: 50.0, deliveryFee: 8.0 },

{ name: "Ariana", minOrder: 40.0, deliveryFee: 7.0 },

{ name: "Ben Arous", minOrder: 40.0, deliveryFee: 7.0 },

],

})
// Generate orders across the last 30 days

let totalOrders = 0

const now = new Date()
for (let dayOffset = 0; dayOffset < DAILY_PATTERN.length; dayOffset++) {

const orderCount = DAILY_PATTERN[dayOffset]

const orderDate = new Date(now)

orderDate.setDate(orderDate.getDate() - (DAILY_PATTERN.length - 1 - dayOffset))

orderDate.setHours(9, 0, 0, 0)
for (let i = 0; i < orderCount; i++) {
  const customer = pick(CUSTOMERS)
  const status = pick(STATUSES)

  // Pick 1-2 random products for this order
  const numItems = Math.random() > 0.4 ? 2 : 1
  const shuffled = [...PRODUCTS].sort(() => Math.random() - 0.5)
  const chosenProducts = shuffled.slice(0, numItems)

  const itemsData = chosenProducts.map((p) => {
    const qty = randomQty(p.unit)
    const lineTotal = Math.round(qty * p.price * 1000) / 1000
    return {
      productName: p.name,
      unit: p.unit,
      quantity: qty,
      unitPrice: p.price,
      lineTotal,
      // productId will be linked below
    }
  })

  const subtotal = itemsData.reduce((sum, it) => sum + it.lineTotal, 0)
  const deliveryFee = customer.fee
  const totalAmount = Math.round((subtotal + deliveryFee) * 1000) / 1000

  // Stagger order times across the day
  const orderTime = new Date(orderDate)
  orderTime.setHours(9 + Math.floor(Math.random() * 10))
  orderTime.setMinutes(Math.floor(Math.random() * 60))

  const fulfillmentDate = new Date(orderTime)
  fulfillmentDate.setDate(fulfillmentDate.getDate() + 1)

  // Find product IDs from DB
  const productRecords = await Promise.all(
    chosenProducts.map((p) =>
      prisma.product.findFirst({ where: { name: p.name } })
    )
  )

  await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      status,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      customerCity: customer.city,
      customerWilaya: customer.wilaya,
      fulfillmentType: "DELIVERY",
      fulfillmentDate,
      deliveryZone: customer.zone,
      deliveryFee,
      totalAmount,
      createdAt: orderTime,
      items: {
        create: itemsData.map((it, idx) => ({
          productId: productRecords[idx]!.id,
          productName: it.productName,
          unit: it.unit,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          lineTotal: it.lineTotal,
        })),
      },
    },
  })

  totalOrders++
}
}
// One pending order for today

const todayProduct = PRODUCTS[0]

const todayProductRecord = await prisma.product.findFirst({

where: { name: todayProduct.name },

})

await prisma.order.create({

data: {

orderNumber: generateOrderNumber(),

status: "PENDING",

customerName: "Nour Gharbi",

customerPhone: "+216 77 321 654",

customerAddress: "9 Rue du Lac",

customerCity: "Tunis",

customerWilaya: "Tunis",

fulfillmentType: "DELIVERY",

fulfillmentDate: new Date(now.getTime() + 86400000),

deliveryZone: "Tunis Centre",

deliveryFee: 5.0,

totalAmount: 72.5,

items: {

create: [

{

productId: todayProductRecord!.id,

productName: todayProduct.name,

unit: "KG",

quantity: 1.5,

unitPrice: 45.0,

lineTotal: 67.5,

},

],

},

},

})
// Custom cake request

await prisma.customCakeRequest.create({

data: {

customerName: "Sarra Mejri",

customerPhone: "+216 98 765 432",

occasion: "Mariage",

eventDate: new Date(now.getTime() + 7 * 86400000),

servings: 50,

message: "Gâteau de mariage 3 étages, thème blanc et doré.",

status: "NEW",

},

})
console.log(✅ Seeded ${PRODUCTS.length} products, 4 zones, ${totalOrders + 1} orders, 1 custom request.)

}
main()

.catch((e) => { console.error(e); process.exit(1) })

.finally(() => prisma.$disconnect())
