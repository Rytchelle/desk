import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`🔍 Buscando produto ID: ${params.id}`)

  try {
    const response = await fetch(`${BACKEND_URL}/api/products/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const product = await response.json()
    console.log("✅ Produto encontrado:", product.nome)
    return NextResponse.json(product)
  } catch (error) {
    console.error("❌ Erro ao buscar produto:", error)
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`📝 Atualizando produto ID: ${params.id}`)

  try {
    const productData = await request.json()
    console.log("📦 Dados para atualização:", productData)

    const response = await fetch(`${BACKEND_URL}/api/products/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const updatedProduct = await response.json()
    console.log("✅ Produto atualizado:", updatedProduct.nome)
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("❌ Erro ao atualizar produto:", error)
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`🗑️ Excluindo produto ID: ${params.id}`)

  try {
    const response = await fetch(`${BACKEND_URL}/api/products/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    console.log("✅ Produto excluído com sucesso")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Erro ao excluir produto:", error)
    return NextResponse.json({ error: "Erro ao excluir produto" }, { status: 500 })
  }
}
