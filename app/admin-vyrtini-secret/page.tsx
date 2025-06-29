"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Mail, Eye, EyeOff, AlertCircle, Shield } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar se já está logado
    const isAuthenticated = localStorage.getItem("vytrini-admin-auth")
    if (isAuthenticated === "true") {
      router.push("/admin-vyrtini-secret/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Credenciais simples
    if (email === "admin@vytrini.com" && password === "vytrini2024") {
      localStorage.setItem("vytrini-admin-auth", "true")
      localStorage.setItem(
        "vytrini-admin-user",
        JSON.stringify({
          email: "admin@vytrini.com",
          name: "Administrador",
          loginTime: new Date().toISOString(),
        }),
      )
      router.push("/admin-vyrtini-secret/dashboard")
    } else {
      setError("Email ou senha incorretos")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--primary-dark)" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20"></div>

      <Card className="w-full max-w-md glass-card border-0 relative z-10 animate-slideInUp">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 animate-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl text-gradient mb-2">Painel Administrativo</CardTitle>
          <p className="text-gray-400">Acesso restrito para administradores</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@vytrini.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert className="bg-red-900/20 border-red-500/50 rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 btn-gradient font-semibold text-lg rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar no Painel"
              )}
            </Button>
          </form>

          <div className="glass p-4 rounded-xl">
            <p className="text-xs text-gray-400 text-center">
              <strong className="text-cyan-400">Credenciais de teste:</strong>
              <br />
              Email: admin@vytrini.com
              <br />
              Senha: vytrini2024
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
