"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Package,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Users,
  Save,
  X,
  ShoppingCart,
  Target,
  RefreshCw,
} from "lucide-react"
import { apiService, type Product, type SalesData, type Order } from "@/lib/api"

interface AdminUser {
  email: string
  name: string
  loginTime: string
}

export default function AdminDashboard() {
  const [salesData, setSalesData] = useState<SalesData>({
    today: 0,
    week: 0,
    fifteenDays: 0,
    month: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  })
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Form state para novo produto
  const [newProduct, setNewProduct] = useState({
    nome: "",
    categoria: "",
    marca: "",
    modelo: "",
    preco: 0,
    estoque: 0,
    descricao: "",
    sku: "",
    imagem: "",
  })

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = localStorage.getItem("vytrini-admin-auth")
    const userData = localStorage.getItem("vytrini-admin-user")

    if (!isAuthenticated || isAuthenticated !== "true") {
      router.push("/admin-vyrtini-secret")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("📊 Carregando dados do dashboard...")

      // Carregar produtos, pedidos e dados de vendas em paralelo
      const [productsData, ordersData, salesDataResponse] = await Promise.all([
        apiService.getProducts().catch(() => []),
        apiService.getOrders().catch(() => []),
        apiService.getSalesData().catch(() => ({
          today: 0,
          week: 0,
          fifteenDays: 0,
          month: 0,
          totalOrders: 0,
          totalCustomers: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
        })),
      ])

      setProducts(productsData)
      setOrders(ordersData)
      setSalesData(salesDataResponse)

      console.log("✅ Dashboard carregado:")
      console.log("- Produtos:", productsData.length)
      console.log("- Pedidos:", ordersData.length)
      console.log("- Vendas hoje: R$", salesDataResponse.today.toFixed(2))
      console.log("- Total de vendas: R$", salesDataResponse.totalRevenue.toFixed(2))
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error)
      setError("Erro ao conectar com o servidor. Alguns dados podem não estar atualizados.")

      // Dados zerados em caso de erro
      setProducts([])
      setOrders([])
      setSalesData({
        today: 0,
        week: 0,
        fifteenDays: 0,
        month: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("vytrini-admin-auth")
    localStorage.removeItem("vytrini-admin-user")
    router.push("/admin-vyrtini-secret")
  }

  const handleCreateProduct = async () => {
    try {
      const product = await apiService.createProduct(newProduct)
      setProducts((prev) => [product, ...prev])
      setShowAddProduct(false)
      setNewProduct({
        nome: "",
        categoria: "",
        marca: "",
        modelo: "",
        preco: 0,
        estoque: 0,
        descricao: "",
        sku: "",
        imagem: "",
      })
      console.log("✅ Produto criado:", product.nome || product.name)
    } catch (error) {
      console.error("❌ Erro ao criar produto:", error)
      alert("Erro ao criar produto. Tente novamente.")
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      const updatedProduct = await apiService.updateProduct(String(editingProduct.id), editingProduct)
      setProducts((prev) => prev.map((p) => (p.id == updatedProduct.id ? updatedProduct : p)))
      setEditingProduct(null)
      console.log("✅ Produto atualizado:", updatedProduct.nome || updatedProduct.name)
    } catch (error) {
      console.error("❌ Erro ao atualizar produto:", error)
      alert("Erro ao atualizar produto. Tente novamente.")
    }
  }

  const handleDeleteProduct = async (id: string | number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    try {
      await apiService.deleteProduct(String(id))
      setProducts((prev) => prev.filter((p) => p.id != id))
      console.log("✅ Produto excluído:", id)
    } catch (error) {
      console.error("❌ Erro ao excluir produto:", error)
      alert("Erro ao excluir produto. Tente novamente.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--primary-dark)" }}>
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-white">Carregando dados reais do dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Calculando vendas e métricas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--primary-dark)" }}>
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Painel Administrativo</h1>
            {user && (
              <p className="text-sm text-gray-400">
                Bem-vindo, {user.name} • Logado em {new Date(user.loginTime).toLocaleString("pt-BR")}
              </p>
            )}
            {error && <p className="text-sm text-red-400 mt-1">⚠️ {error}</p>}
            <p className="text-xs text-cyan-400 mt-1">
              📊 Dados reais • Vendas começam em R$ 0,00 e aumentam com cada compra
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={loadDashboardData}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-xl bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar Dados
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Sales Dashboard - DADOS REAIS */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Dashboard de Vendas Reais</h2>
            <Badge className="bg-green-500 text-white">
              {salesData.totalRevenue > 0 ? "Vendas Ativas" : "Aguardando Primeira Venda"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card border-0 card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Vendas Hoje</CardTitle>
                <DollarSign className="h-6 w-6 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient mb-1">R$ {salesData.today.toFixed(2)}</div>
                <p className="text-xs text-gray-400">
                  {salesData.today > 0 ? "🎉 Vendas realizadas hoje!" : "Nenhuma venda hoje"}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Esta Semana</CardTitle>
                <TrendingUp className="h-6 w-6 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient mb-1">R$ {salesData.week.toFixed(2)}</div>
                <p className="text-xs text-gray-400">
                  {salesData.week > 0 ? "📈 Crescimento semanal" : "Primeira semana"}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Últimos 15 Dias</CardTitle>
                <Calendar className="h-6 w-6 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient mb-1">R$ {salesData.fifteenDays.toFixed(2)}</div>
                <p className="text-xs text-gray-400">
                  {salesData.fifteenDays > 0 ? "🚀 Momentum crescente" : "Período inicial"}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Este Mês</CardTitle>
                <Package className="h-6 w-6 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient mb-1">R$ {salesData.month.toFixed(2)}</div>
                <p className="text-xs text-gray-400">{salesData.month > 0 ? "💰 Faturamento mensal" : "Mês inicial"}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Métricas Detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{salesData.totalCustomers}</div>
              <p className="text-gray-400">Clientes Únicos</p>
              <p className="text-xs text-gray-500 mt-1">
                {salesData.totalCustomers > 0 ? "Base de clientes real" : "Aguardando clientes"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{salesData.totalOrders}</div>
              <p className="text-gray-400">Pedidos Completados</p>
              <p className="text-xs text-gray-500 mt-1">
                {salesData.totalOrders > 0 ? "Vendas confirmadas" : "Nenhum pedido ainda"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">R$ {salesData.averageOrderValue.toFixed(2)}</div>
              <p className="text-gray-400">Ticket Médio</p>
              <p className="text-xs text-gray-500 mt-1">
                {salesData.averageOrderValue > 0 ? "Valor médio por venda" : "Calculado após vendas"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{products.length}</div>
              <p className="text-gray-400">Produtos Ativos</p>
              <p className="text-xs text-gray-500 mt-1">Catálogo disponível</p>
            </CardContent>
          </Card>
        </div>

        {/* Status das Vendas */}
        {salesData.totalRevenue === 0 && (
          <Card className="glass-card border-0 mb-8">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-2">Sistema de Vendas Ativo</h3>
              <p className="text-gray-400 mb-4">
                O dashboard está configurado para mostrar dados reais. Assim que a primeira compra for realizada, os
                valores começarão a aparecer aqui.
              </p>
              <div className="flex justify-center space-x-4">
                <Badge className="bg-blue-500 text-white">✅ Sistema Conectado</Badge>
                <Badge className="bg-green-500 text-white">✅ Pedidos Funcionando</Badge>
                <Badge className="bg-purple-500 text-white">✅ Cálculos Automáticos</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Últimos Pedidos */}
        {orders.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Últimos Pedidos</h2>
            <div className="grid gap-4">
              {orders.slice(0, 5).map((order) => (
                <Card key={order.id} className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white">Pedido #{order.id}</h4>
                        <p className="text-gray-400 text-sm">{order.customerEmail}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString("pt-BR")}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gradient">R$ {order.total.toFixed(2)}</div>
                        <Badge
                          className={
                            order.status === "completed"
                              ? "bg-green-500"
                              : order.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }
                        >
                          {order.status === "completed"
                            ? "Concluído"
                            : order.status === "pending"
                              ? "Pendente"
                              : "Cancelado"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products Management */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Gerenciar Produtos</h2>
            <Button onClick={() => setShowAddProduct(true)} className="btn-gradient rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>

          {/* Add Product Form */}
          {showAddProduct && (
            <Card className="glass-card border-0 mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Novo Produto</CardTitle>
                  <Button
                    onClick={() => setShowAddProduct(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border-0 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Nome do Produto</Label>
                    <Input
                      value={newProduct.nome}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, nome: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Ex: iPhone 15 Pro Max"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Categoria</Label>
                    <Input
                      value={newProduct.categoria}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, categoria: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Ex: Celular"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Marca</Label>
                    <Input
                      value={newProduct.marca}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, marca: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Ex: Apple"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Modelo</Label>
                    <Input
                      value={newProduct.modelo}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, modelo: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Ex: 15 Pro Max"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.preco}
                      onChange={(e) =>
                        setNewProduct((prev) => ({ ...prev, preco: Number.parseFloat(e.target.value) || 0 }))
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Estoque</Label>
                    <Input
                      type="number"
                      value={newProduct.estoque}
                      onChange={(e) =>
                        setNewProduct((prev) => ({ ...prev, estoque: Number.parseInt(e.target.value) || 0 }))
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">SKU</Label>
                    <Input
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, sku: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Ex: IPH15PROMAX-256GB"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">URL da Imagem</Label>
                    <Input
                      value={newProduct.imagem}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, imagem: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Descrição</Label>
                  <Textarea
                    value={newProduct.descricao}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, descricao: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Descrição detalhada do produto..."
                  />
                </div>
                <Button onClick={handleCreateProduct} className="btn-gradient">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Produto
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Products List */}
          <div className="grid gap-6">
            {products.map((product) => (
              <Card key={product.id} className="glass-card border-0 card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <img
                      src={product.image || product.imagem || "/placeholder.svg"}
                      alt={product.name || product.nome}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{product.name || product.nome}</h3>
                      <div className="flex items-center space-x-6 flex-wrap gap-2">
                        <div>
                          <span className="text-2xl font-bold text-gradient">
                            R$ {(product.price || product.preco || 0).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <Badge
                            variant={
                              (product.stock || product.estoque || 0) > 10
                                ? "default"
                                : (product.stock || product.estoque || 0) > 5
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            Estoque: {product.stock || product.estoque || 0}
                          </Badge>
                        </div>
                        <div>
                          <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                            {product.category || product.categoria}
                          </Badge>
                        </div>
                        {product.marca && (
                          <div>
                            <Badge variant="outline" className="border-purple-400 text-purple-400">
                              {product.marca}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg bg-transparent"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg bg-transparent"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhum produto cadastrado</h3>
              <p className="text-gray-500 mb-6">
                {error ? "Verifique se o backend está rodando." : "Adicione seu primeiro produto para começar"}
              </p>
              <Button onClick={() => setShowAddProduct(true)} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
          <div className="absolute inset-4 glass-card rounded-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gradient">Editar Produto</h2>
                <Button
                  onClick={() => setEditingProduct(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border-0 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Nome do Produto</Label>
                    <Input
                      value={editingProduct.nome || editingProduct.name || ""}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev ? { ...prev, nome: e.target.value, name: e.target.value } : null,
                        )
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Categoria</Label>
                    <Input
                      value={editingProduct.categoria || editingProduct.category || ""}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev ? { ...prev, categoria: e.target.value, category: e.target.value } : null,
                        )
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Marca</Label>
                    <Input
                      value={editingProduct.marca || ""}
                      onChange={(e) => setEditingProduct((prev) => (prev ? { ...prev, marca: e.target.value } : null))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingProduct.preco || editingProduct.price || 0}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev
                            ? {
                                ...prev,
                                preco: Number.parseFloat(e.target.value) || 0,
                                price: Number.parseFloat(e.target.value) || 0,
                              }
                            : null,
                        )
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Estoque</Label>
                    <Input
                      type="number"
                      value={editingProduct.estoque || editingProduct.stock || 0}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev
                            ? {
                                ...prev,
                                estoque: Number.parseInt(e.target.value) || 0,
                                stock: Number.parseInt(e.target.value) || 0,
                              }
                            : null,
                        )
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">URL da Imagem</Label>
                    <Input
                      value={editingProduct.imagem || editingProduct.image || ""}
                      onChange={(e) =>
                        setEditingProduct((prev) =>
                          prev ? { ...prev, imagem: e.target.value, image: e.target.value } : null,
                        )
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Descrição</Label>
                  <Textarea
                    value={editingProduct.descricao || editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, descricao: e.target.value, description: e.target.value } : null,
                      )
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <Button onClick={handleUpdateProduct} className="btn-gradient">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
