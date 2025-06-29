import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    // Aqui você integraria com o seu backend Node.js
    // Exemplo de chamada para o backend:
    const backendResponse = await fetch("https://seu-backend.com/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    })

    if (!backendResponse.ok) {
      throw new Error("Erro no backend")
    }

    const { checkoutUrl } = await backendResponse.json()

    return NextResponse.json({ checkoutUrl })
  } catch (error) {
    console.error("Erro no checkout:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
