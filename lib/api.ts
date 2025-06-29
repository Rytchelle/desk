const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

export interface Product {
  id: string | number
  nome: string // backend usa 'nome' ao invés de 'name'
  categoria: string // backend usa 'categoria' ao invés de 'category'
  marca?: string
  modelo?: string
  preco: number // backend usa 'preco' ao invés de 'price'
  estoque: number // backend usa 'estoque' ao invés de 'stock'
  descricao?: string // backend usa 'descricao' ao invés de 'description'
  sku?: string
  imagem?: string // backend usa 'imagem' ao invés de 'image'
  createdAt?: string
  updatedAt?: string

  // Campos calculados para compatibilidade com o frontend
  name?: string
  category?: string
  price?: number
  stock?: number
  description?: string
  image?: string
  rating?: number
  originalPrice?: number
  isNew?: boolean
  isFeatured?: boolean
}

export interface Order {
  id: string | number
  items: Array<{
    productId: string | number
    productName: string
    quantity: number
    price: number
    total: number
  }>
  total: number
  status: "pending" | "completed" | "cancelled"
  customerEmail?: string
  customerName?: string
  createdAt: string
  updatedAt?: string
}

export interface SalesData {
  today: number
  week: number
  fifteenDays: number
  month: number
  totalOrders: number
  totalCustomers: number
  totalRevenue: number
  averageOrderValue: number
}

// Função para converter produto do backend para frontend
function transformProduct(backendProduct: any): Product {
  return {
    ...backendProduct,
    // Mapeamento dos campos do backend para frontend
    name: backendProduct.nome,
    category: backendProduct.categoria,
    price: backendProduct.preco,
    stock: backendProduct.estoque,
    description: backendProduct.descricao,
    image: backendProduct.imagem,
    rating: 4.5, // valor padrão
    isNew: false, // valor padrão
    isFeatured: backendProduct.preco > 5000, // produtos caros são featured
  }
}

// Função para converter produto do frontend para backend
function transformProductForBackend(frontendProduct: any) {
  return {
    nome: frontendProduct.name || frontendProduct.nome,
    categoria: frontendProduct.category || frontendProduct.categoria,
    marca: frontendProduct.marca || "Genérica",
    modelo: frontendProduct.modelo || "",
    preco: frontendProduct.price || frontendProduct.preco,
    estoque: frontendProduct.stock || frontendProduct.estoque,
    descricao: frontendProduct.description || frontendProduct.descricao,
    sku: frontendProduct.sku || `SKU-${Date.now()}`,
    imagem: frontendProduct.image || frontendProduct.imagem || "/placeholder.svg",
  }
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error (${url}):`, error)
      throw error
    }
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const backendProducts = await this.request<any[]>("/api/products")
    return backendProducts.map(transformProduct)
  }

  async getProduct(id: string): Promise<Product> {
    const backendProduct = await this.request<any>(`/api/products/${id}`)
    return transformProduct(backendProduct)
  }

  async createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const backendProduct = transformProductForBackend(product)
    const newProduct = await this.request<any>("/api/products", {
      method: "POST",
      body: JSON.stringify(backendProduct),
    })
    return transformProduct(newProduct)
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const backendProduct = transformProductForBackend(product)
    const updatedProduct = await this.request<any>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendProduct),
    })
    return transformProduct(updatedProduct)
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/api/products/${id}`, {
      method: "DELETE",
    })
  }

  // Orders - Sistema real de pedidos
  async createOrder(orderData: {
    items: Array<{
      productId: string
      quantity: number
      price: number
    }>
    total: number
    customerEmail?: string
    customerName?: string
  }): Promise<{ order: Order; checkoutUrl: string }> {
    return this.request<{ order: Order; checkoutUrl: string }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>("/api/orders")
  }

  async updateOrderStatus(orderId: string, status: "pending" | "completed" | "cancelled"): Promise<Order> {
    return this.request<Order>(`/api/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  // Sales Analytics - Dados reais baseados em pedidos
  async getSalesData(): Promise<SalesData> {
    return this.request<SalesData>("/api/analytics/sales")
  }

  // Admin Authentication
  async adminLogin(email: string, password: string): Promise<{ success: boolean; token?: string; user?: any }> {
    return this.request<{ success: boolean; token?: string; user?: any }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }
}

export const apiService = new ApiService()
