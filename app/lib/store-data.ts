export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  featured?: boolean
  new?: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  count: number
}

export const categories: Category[] = [
  { id: 'ceramics', name: 'Ceramics', description: 'Handcrafted vessels and objects', count: 12 },
  { id: 'textiles', name: 'Textiles', description: 'Natural fibers, thoughtfully woven', count: 8 },
  { id: 'lighting', name: 'Lighting', description: 'Soft illumination for quiet spaces', count: 6 },
  { id: 'furniture', name: 'Furniture', description: 'Pieces that age gracefully', count: 4 },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Wabi Sabi Vase',
    description: 'An imperfect vessel celebrating the beauty of natural forms. Each piece unique in its gentle asymmetry.',
    price: 185,
    category: 'ceramics',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&h=800&fit=crop',
    featured: true,
  },
  {
    id: '2',
    name: 'Linen Throw',
    description: 'Stonewashed Belgian linen in a soft oatmeal tone. Softens with every wash.',
    price: 220,
    category: 'textiles',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop',
    featured: true,
  },
  {
    id: '3',
    name: 'Paper Pendant',
    description: 'Hand-folded rice paper lamp casting the gentlest of shadows.',
    price: 340,
    category: 'lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=800&fit=crop',
    featured: true,
  },
  {
    id: '4',
    name: 'Oak Side Table',
    description: 'Solid white oak with hand-finished edges. A quiet presence in any room.',
    price: 680,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop',
    new: true,
  },
  {
    id: '5',
    name: 'Stoneware Bowl',
    description: 'Wood-fired stoneware with natural ash glaze. Each firing creates unique patterns.',
    price: 95,
    category: 'ceramics',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=800&fit=crop',
    new: true,
  },
  {
    id: '6',
    name: 'Wool Blanket',
    description: 'Pure merino wool in undyed natural tones. Made by artisans in Portugal.',
    price: 295,
    category: 'textiles',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop',
  },
  {
    id: '7',
    name: 'Ceramic Lamp Base',
    description: 'Hand-thrown ceramic in a warm bisque finish. Pairs beautifully with linen shades.',
    price: 245,
    category: 'lighting',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=800&fit=crop',
  },
  {
    id: '8',
    name: 'Meditation Cushion',
    description: 'Buckwheat-filled zafu in organic cotton. A place for stillness.',
    price: 125,
    category: 'textiles',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&h=800&fit=crop',
  },
]

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.category === categoryId)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}

export function getNewProducts(): Product[] {
  return products.filter(p => p.new)
}
