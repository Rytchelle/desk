import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002"

// Simulação de banco de dados em memória para pedidos (em produção, use seu MySQL)
const orders: any[] = []
let orderIdCounter = 1

export async function POST(request: NextRequest) {
  console.log("🛒 Criando novo pedido...")

  try {
    const orderData = await request.json()
    console.log("📦 Dados do pedido:", orderData)

    // Tentar criar no backend primeiro
    try {
      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Pedido criado no backend:", result)
        return NextResponse.json(result)
      }
    } catch (backendError) {
      console.log("⚠️ Backend não disponível, usando sistema local")
    }

    // Fallback: criar pedido localmente
    const newOrder = {
      id: orderIdCounter++,
      items: orderData.items.map((item: any) => ({
        productId: item.productId,
        productName: `Produto ${item.productId}`,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      total: orderData.total,
      status: "completed", // Marcar como completado para contar nas vendas
      customerEmail: orderData.customerEmail || "cliente@exemplo.com",
      customerName: orderData.customerName || "Cliente Anônimo",
      createdAt: new Date().toISOString(),
    }

    // Salvar o pedido na "base de dados" local
    orders.push(newOrder)

    // Simular checkout do Mercado Pago
    const mockCheckoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=mock_${newOrder.id}`

    const result = {
      order: newOrder,
      checkoutUrl: mockCheckoutUrl,
    }

    console.log("✅ Pedido criado localmente:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("❌ Erro ao criar pedido:", error)
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 })
  }
}

export async function GET() {
  console.log("📋 Buscando pedidos...")

  try {
    // Tentar buscar do backend primeiro
    const response = await fetch(`${BACKEND_URL}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const backendOrders = await response.json()
      console.log("✅ Pedidos carregados do backend:", backendOrders.length)
      return NextResponse.json(backendOrders)
    }
  } catch (error) {
    console.log("⚠️ Backend não disponível, usando dados locais")
  }

  // Fallback: retornar pedidos locais
  console.log("📊 Pedidos locais:", orders.length)
  return NextResponse.json(orders)
}
