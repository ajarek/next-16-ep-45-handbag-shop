export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewsCount: number;
  images: string[];
  colors: ColorOption[];
  tags: string[];
  style: string;
  description: string;
  material: string;
  dimensions: string;
  inStock: boolean;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string;
  description: string;
  featured: boolean;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  product: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface StyleItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
}

export interface CartItem {
  product: Product;
  selectedColor: ColorOption;
  quantity: number;
}
