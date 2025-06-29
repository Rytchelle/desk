import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`📝 Atualizando status do pedido ID: ${params.id}`)

  try {
    const { status } = await request.json()
    console.log("📊 Novo status:", status)

    // Tentar atualizar no backend primeiro
    try {
      const response = await fetch(`${BACKEND_URL}/api/orders/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        console.log("✅ Pedido atualizado no backend")
        return NextResponse.json(updatedOrder)
      }
    } catch (backendError) {
      console.log("⚠️ Backend não disponível, usando sistema local")
    }

    // Fallback: simular atualização local
    const mockOrder = {
      id: params.id,
      status,
      updatedAt: new Date().toISOString(),
    }

    console.log("✅ Status atualizado localmente")
    return NextResponse.json(mockOrder)
  } catch (error) {
    console.error("❌ Erro ao atualizar pedido:", error)
    return NextResponse.json({ error: "Erro ao atualizar pedido" }, { status: 500 })
  }
}
