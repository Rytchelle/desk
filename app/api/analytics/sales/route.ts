import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002"

export async function GET() {
  console.log("📊 Calculando dados de vendas reais...")

  try {
    // Tentar buscar do backend primeiro
    try {
      const response = await fetch(`${BACKEND_URL}/api/analytics/sales`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const salesData = await response.json()
        console.log("✅ Dados de vendas do backend")
        return NextResponse.json(salesData)
      }
    } catch (backendError) {
      console.log("⚠️ Backend não disponível, calculando localmente")
    }

    // Fallback: calcular vendas baseado nos pedidos locais
    const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/orders`)
    const orders = ordersResponse.ok ? await ordersResponse.json() : []

    console.log("📈 Calculando vendas de", orders.length, "pedidos")

    // Filtrar apenas pedidos completados
    const completedOrders = orders.filter((order: any) => order.status === "completed")

    // Calcular datas
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fifteenDaysAgo = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Calcular vendas por período
    const salesData = {
      today: completedOrders
        .filter((order: any) => new Date(order.createdAt) >= today)
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0),

      week: completedOrders
        .filter((order: any) => new Date(order.createdAt) >= weekAgo)
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0),

      fifteenDays: completedOrders
        .filter((order: any) => new Date(order.createdAt) >= fifteenDaysAgo)
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0),

      month: completedOrders
        .filter((order: any) => new Date(order.createdAt) >= monthAgo)
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0),

      totalOrders: completedOrders.length,
      totalCustomers: new Set(completedOrders.map((order: any) => order.customerEmail)).size,
      totalRevenue: completedOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0),
      averageOrderValue:
        completedOrders.length > 0
          ? completedOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0) / completedOrders.length
          : 0,
    }

    console.log("📊 Dados de vendas calculados:", salesData)
    return NextResponse.json(salesData)
  } catch (error) {
    console.error("❌ Erro ao calcular vendas:", error)

    // Dados zerados se houver erro
    const emptySalesData = {
      today: 0,
      week: 0,
      fifteenDays: 0,
      month: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
    }

    return NextResponse.json(emptySalesData)
  }
}
