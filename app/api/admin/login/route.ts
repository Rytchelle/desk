import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002"

export async function POST(request: NextRequest) {
  console.log("🔐 Tentativa de login admin...")

  try {
    const { email, password } = await request.json()
    console.log("📧 Email:", email)

    // Tentar autenticar no backend primeiro
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Login realizado via backend")
        return NextResponse.json(result)
      }
    } catch (backendError) {
      console.log("⚠️ Backend não disponível, usando autenticação local")
    }

    // Fallback para autenticação simples local
    if (email === "admin@vytrini.com" && password === "vytrini2024") {
      const result = {
        success: true,
        user: {
          email: "admin@vytrini.com",
          name: "Administrador",
          role: "admin",
        },
        token: "mock_token_" + Date.now(),
      }
      console.log("✅ Login realizado via fallback")
      return NextResponse.json(result)
    }

    console.log("❌ Credenciais inválidas")
    return NextResponse.json({ success: false, error: "Credenciais inválidas" }, { status: 401 })
  } catch (error) {
    console.error("❌ Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
