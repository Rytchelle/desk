"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Heart, ShoppingCart, Plus, Minus, Share2, Shield, Truck, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { apiService, type Product } from "@/lib/api"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { addToCart, cart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      const [productData, allProducts] = await Promise.all([apiService.getProduct(params.id), apiService.getProducts()])

      setProduct(productData)

      // Filtrar produtos relacionados da mesma categoria
      const related = allProducts
        .filter((p) => p.category === productData.category && p.id !== productData.id)
        .slice(0, 4)
      setRelatedProducts(related)
    } catch (error) {
      console.error("Erro ao carregar produto:", error)
      setError("Produto não encontrado ou erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
      setQuantity(1)
    }
  }

  const isInCart = product ? cart.some((item) => item.id === product.id) : false
  const cartQuantity = product ? cart.find((item) => item.id === product.id)?.quantity || 0 : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--primary-dark)" }}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--primary-dark)" }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{error || "Produto não encontrado"}</h2>
          <Button onClick={() => router.push("/")} className="btn-gradient">
            Voltar à loja
          </Button>
        </div>
      </div>
    )
  }

  // Imagens mockadas para galeria (você pode expandir isso no backend)
  const productImages = [
    product.image,
    "/placeholder.svg?height=600&width=600&text=Imagem+2",
    "/placeholder.svg?height=600&width=600&text=Imagem+3",
    "/placeholder.svg?height=600&width=600&text=Imagem+4",
  ]

  return (
    <div className="min-h-screen" style={{ background: "var(--primary-dark)" }}>
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border-0 p-0"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>
              <h1 className="text-2xl font-bold text-gradient cursor-pointer" onClick={() => router.push("/")}>
                Vytrini
              </h1>
            </div>

            <Button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border-0 p-0">
              <Share2 className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl overflow-hidden">
              <img
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`glass-card rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-cyan-400" : "border-transparent hover:border-white/30"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                  {product.category}
                </Badge>
                <div className="flex items-center space-x-2">
                  {product.isNew && (
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">Novo</Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      Destaque
                    </Badge>
                  )}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-300">({product.rating})</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">156 avaliações</span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">{product.description}</p>
            </div>

            {/* Preço */}
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl font-bold text-gradient">R$ {product.price.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex flex-col">
                      <span className="text-lg text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                      <span className="text-sm text-green-400">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-300">Estoque disponível:</span>
                  <span className={`font-semibold ${product.stock > 5 ? "text-green-400" : "text-yellow-400"}`}>
                    {product.stock} unidades
                  </span>
                </div>

                {/* Controles de Quantidade */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-gray-300">Quantidade:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border-0 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center text-white font-semibold text-lg">{quantity}</span>
                    <Button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border-0 p-0"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex space-x-4 mb-6">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 btn-gradient font-semibold py-4 rounded-xl text-lg"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.stock === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
                  </Button>

                  <Button
                    onClick={() => toggleFavorite(product.id)}
                    className={`w-14 h-14 rounded-xl border-0 p-0 transition-all ${
                      isFavorite(product.id)
                        ? "bg-gradient-to-r from-pink-500 to-purple-500"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorite(product.id) ? "fill-current text-white" : "text-white"}`} />
                  </Button>
                </div>

                {isInCart && (
                  <div className="glass p-4 rounded-xl">
                    <p className="text-cyan-400 text-center">
                      ✓ {cartQuantity} {cartQuantity === 1 ? "item" : "itens"} no carrinho
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações de Entrega */}
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Informações de Entrega</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-white font-medium">Frete Grátis</p>
                      <p className="text-gray-400 text-sm">Para compras acima de R$ 299</p>
                    </div>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-white font-medium">Garantia de 1 ano</p>
                      <p className="text-gray-400 text-sm">Cobertura completa do fabricante</p>
                    </div>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-white font-medium">Troca em 30 dias</p>
                      <p className="text-gray-400 text-sm">Sem perguntas, sem complicações</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="glass-card card-hover overflow-hidden border-0 cursor-pointer"
                  onClick={() => router.push(`/produto/${relatedProduct.id}`)}
                >
                  <CardContent className="p-0">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-2">{relatedProduct.name}</h3>
                      <p className="text-gradient font-bold">R$ {relatedProduct.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
