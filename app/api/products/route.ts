import { type NextRequest, NextResponse } from "next/server"

// Seu backend está na porta 3000, então vamos usar 3002 para evitar conflito
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002"

export async function GET() {
  console.log("🔍 Frontend solicitou produtos...")
  console.log("🌐 Tentando conectar com backend:", BACKEND_URL)

  try {
    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const products = await response.json()
    console.log("✅ Produtos carregados do backend:", products.length, "produtos")
    return NextResponse.json(products)
  } catch (error) {
    console.error("❌ Erro ao conectar com backend:", error)
    console.log("🔄 Usando dados de fallback...")

    // Fallback com dados mockados no formato do seu backend
    const fallbackProducts = [
      {
        id: "fallback-1",
        nome: "iPhone 15 Pro Max (Fallback)",
        categoria: "Celular",
        marca: "Apple",
        modelo: "15 Pro Max",
        preco: 8999.99,
        estoque: 15,
        descricao: "⚠️ Este é um produto de fallback - Backend não conectado. Configure o BACKEND_URL no .env.local",
        sku: "IPH15PROMAX-FALLBACK",
        imagem: "/placeholder.svg?height=600&width=600",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "fallback-2",
        nome: "AirPods Pro (Fallback)",
        categoria: "Audio",
        marca: "Apple",
        modelo: "Pro 3ª Gen",
        preco: 1899.99,
        estoque: 25,
        descricao: "⚠️ Este é um produto de fallback - Backend não conectado. Configure o BACKEND_URL no .env.local",
        sku: "AIRPODS-PRO-FALLBACK",
        imagem: "/placeholder.svg?height=600&width=600",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "fallback-3",
        nome: "MacBook Pro M3 (Fallback)",
        categoria: "Computador",
        marca: "Apple",
        modelo: "MacBook Pro 16",
        preco: 15999.99,
        estoque: 8,
        descricao: "⚠️ Este é um produto de fallback - Backend não conectado. Configure o BACKEND_URL no .env.local",
        sku: "MBP-M3-FALLBACK",
        imagem: "/placeholder.svg?height=600&width=600",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json(fallbackProducts)
  }
}

export async function POST(request: NextRequest) {
  console.log("📝 Criando novo produto...")

  try {
    const productData = await request.json()
    console.log("📦 Dados do produto:", productData)

    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const newProduct = await response.json()
    console.log("✅ Produto criado no backend:", newProduct)
    return NextResponse.json(newProduct)
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro ao criar produto - Backend não conectado" }, { status: 500 })
  }
}
