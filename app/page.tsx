"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Plus, Minus, X, Star, Heart, Search, Filter, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { apiService, type Product } from "@/lib/api"

export default function EcommercePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { cart, addToCart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiService.getProducts()
      setProducts(data)
      console.log("📦 Produtos carregados no frontend:", data.length)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      setError("Erro ao carregar produtos. Verifique se o servidor está rodando.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: String(item.id),
          quantity: item.quantity,
          price: item.price || item.preco || 0,
        })),
        total: getTotalPrice(),
        customerEmail: "cliente@exemplo.com", // Em produção, pegar do formulário
        customerName: "Cliente Vytrini", // Em produção, pegar do formulário
      }

      console.log("🛒 Processando checkout:", orderData)
      const { checkoutUrl } = await apiService.createOrder(orderData)

      // Simular sucesso da compra (em produção, isso seria feito via webhook do Mercado Pago)
      setTimeout(() => {
        alert("🎉 Compra realizada com sucesso! Os dados de vendas foram atualizados no painel admin.")
        // Limpar carrinho após compra
        cart.forEach((item) => removeFromCart(item.id))
      }, 2000)

      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Erro no checkout:", error)
      alert("Erro ao processar pagamento. Tente novamente.")
    }
  }

  const filteredProducts = products.filter((product) =>
    (product.name || product.nome || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const favoriteProducts = products.filter((product) => isFavorite(String(product.id)))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--primary-dark)" }}>
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gradient text-lg font-medium">Carregando produtos incríveis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--primary-dark)" }}>
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gradient cursor-pointer" onClick={() => router.push("/")}>
                Vytrini
              </h1>
              <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0">Premium Store</Badge>
              {error && <Badge className="bg-red-500 text-white border-0">Backend Offline</Badge>}
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`relative px-4 py-2 rounded-full font-semibold transition-all ${
                  showFavorites
                    ? "bg-gradient-to-r from-pink-500 to-purple-500"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${favorites.length > 0 ? "fill-current" : ""}`} />
                Favoritos
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </Badge>
                )}
              </Button>

              <Button
                onClick={() => setIsCartOpen(true)}
                className="btn-gradient relative px-6 py-2 rounded-full font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrinho
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Search mobile */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!showFavorites && (
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold text-gradient mb-6 animate-slideInUp">
              Tecnologia do Futuro
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slideInUp">
              Descubra os produtos mais inovadores com design premium e tecnologia de ponta
            </p>
            <div className="animate-float">
              <Button onClick={loadProducts} className="btn-gradient px-8 py-4 text-lg font-semibold rounded-full">
                {error ? "Tentar Reconectar" : "Explorar Coleção"}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-white">
            {showFavorites ? `Seus Favoritos (${favorites.length})` : `Produtos em Destaque (${products.length})`}
          </h3>
          {!showFavorites && (
            <Button
              onClick={loadProducts}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black bg-transparent"
            >
              <Filter className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          )}
        </div>

        {showFavorites && favoriteProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Nenhum favorito ainda</h3>
            <p className="text-gray-500 mb-6">Adicione produtos aos seus favoritos clicando no coração</p>
            <Button onClick={() => setShowFavorites(false)} className="btn-gradient">
              Explorar Produtos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {(showFavorites ? favoriteProducts : filteredProducts).map((product, index) => (
              <Card
                key={product.id}
                className="glass-card card-hover overflow-hidden border-0 animate-slideInUp cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image || product.imagem || "/placeholder.svg"}
                      alt={product.name || product.nome}
                      className="w-full h-64 object-cover"
                      onClick={() => router.push(`/produto/${product.id}`)}
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">Novo</Badge>
                      )}
                      {product.isFeatured && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                          Destaque
                        </Badge>
                      )}
                      {product.marca && (
                        <Badge variant="outline" className="border-white/30 text-white bg-black/50">
                          {product.marca}
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => toggleFavorite(String(product.id))}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border-0 p-0"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isFavorite(String(product.id)) ? "fill-pink-500 text-pink-500 scale-110" : "text-white"
                        }`}
                      />
                    </Button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                        {product.category || product.categoria}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-300">{product.rating || 4.5}</span>
                      </div>
                    </div>

                    <h3
                      className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-gradient transition-all"
                      onClick={() => router.push(`/produto/${product.id}`)}
                    >
                      {product.name || product.nome}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description || product.descricao}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gradient">
                          R$ {(product.price || product.preco || 0).toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-400">Estoque: {product.stock || product.estoque || 0}</span>
                    </div>

                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full btn-gradient font-semibold py-3 rounded-xl"
                      disabled={(product.stock || product.estoque || 0) === 0}
                    >
                      {(product.stock || product.estoque || 0) === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mb-6">
              {error
                ? "Verifique se o backend está rodando e configurado corretamente."
                : "Não há produtos cadastrados."}
            </p>
            <Button onClick={loadProducts} className="btn-gradient">
              Tentar Novamente
            </Button>
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md glass-card border-l border-white/20">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-gradient">Seu Carrinho</h2>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border-0 p-0"
                >
                  <X className="w-5 h-5 text-white" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center mt-12">
                    <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Seu carrinho está vazio</p>
                    <p className="text-gray-500 text-sm">Adicione alguns produtos incríveis!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="glass p-4 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image || item.imagem || "/placeholder.svg"}
                            alt={item.name || item.nome}
                            className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                            onClick={() => router.push(`/produto/${item.id}`)}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-sm">{item.name || item.nome}</h3>
                            <p className="text-gradient font-bold">R$ {(item.price || item.preco || 0).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border-0 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border-0 p-0"
                              disabled={item.quantity >= (item.stock || item.estoque || 0)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 border-0 p-0 ml-2"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-white/20 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-semibold text-white">Total:</span>
                    <span className="text-3xl font-bold text-gradient">R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full btn-gradient font-semibold py-4 rounded-xl text-lg"
                  >
                    Finalizar Compra
                  </Button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    💡 Compras são registradas no painel admin em tempo real
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
