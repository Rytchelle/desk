import type { Product } from "@/hooks/use-cart"

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 8999.99,
    originalPrice: 9999.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "O iPhone mais avançado já criado, com chip A17 Pro, câmera de 48MP e design em titânio premium.",
    stock: 15,
    rating: 4.9,
    category: "Smartphones",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "2",
    name: "AirPods Pro (3ª geração)",
    price: 1899.99,
    originalPrice: 2299.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Cancelamento de ruído adaptativo, áudio espacial personalizado e até 6 horas de reprodução.",
    stock: 25,
    rating: 4.8,
    category: "Áudio",
    isFeatured: true,
  },
  {
    id: "3",
    name: 'MacBook Pro 16" M3 Max',
    price: 15999.99,
    originalPrice: 17999.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Performance extrema para profissionais criativos com chip M3 Max e tela Liquid Retina XDR.",
    stock: 8,
    rating: 4.9,
    category: "Computadores",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Apple Watch Ultra 2",
    price: 4299.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "O Apple Watch mais resistente e capaz, projetado para aventuras extremas e esportes aquáticos.",
    stock: 12,
    rating: 4.7,
    category: "Wearables",
    isNew: true,
  },
  {
    id: "5",
    name: 'iPad Pro 12.9" M2',
    price: 6999.99,
    originalPrice: 7999.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Tela Liquid Retina XDR de 12,9 polegadas, chip M2 e compatibilidade com Apple Pencil (2ª geração).",
    stock: 18,
    rating: 4.8,
    category: "Tablets",
    isFeatured: true,
  },
  {
    id: "6",
    name: "Sony WH-1000XM5",
    price: 1699.99,
    originalPrice: 1999.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Headphone premium com cancelamento de ruído líder da indústria e qualidade de som excepcional.",
    stock: 20,
    rating: 4.6,
    category: "Áudio",
  },
  {
    id: "7",
    name: "Samsung Galaxy S24 Ultra",
    price: 7499.99,
    originalPrice: 8299.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Smartphone Android premium com S Pen integrada, câmera de 200MP e tela Dynamic AMOLED 2X.",
    stock: 14,
    rating: 4.7,
    category: "Smartphones",
    isFeatured: true,
  },
  {
    id: "8",
    name: "Nintendo Switch OLED",
    price: 2199.99,
    image: "/placeholder.svg?height=600&width=600",
    description: "Console híbrido com tela OLED vibrante de 7 polegadas e áudio aprimorado.",
    stock: 30,
    rating: 4.5,
    category: "Games",
    isNew: true,
  },
]
