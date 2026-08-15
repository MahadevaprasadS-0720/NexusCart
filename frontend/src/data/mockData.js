export const initialCategories = [
  { id: 'cat-1', name: 'Mobiles', slug: 'mobiles', icon: 'Smartphone' },
  { id: 'cat-2', name: 'Electronics', slug: 'electronics', icon: 'Tv' },
  { id: 'cat-3', name: 'Fashion', slug: 'fashion', icon: 'Shirt' },
  { id: 'cat-4', name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'Home' },
  { id: 'cat-5', name: 'Appliances', slug: 'appliances', icon: 'Refrigerator' },
  { id: 'cat-6', name: 'Beauty & Toys', slug: 'beauty-toys', icon: 'Sparkles' }
];

export const initialProducts = [
  {
    id: 'prod-101',
    _id: 'prod-101',
    name: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
    title: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
    slug: 'apple-iphone-15-pro-max',
    category: 'Mobiles',
    brand: 'Apple',
    price: 134900,
    originalPrice: 159900,
    discountPercentage: 15,
    rating: 4.8,
    reviewCount: 3420,
    stock: 24,
    isFeatured: true,
    isDealOfTheDay: true,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    specifications: {
      'Display': '6.7-inch Super Retina XDR display with ProMotion',
      'Processor': 'A17 Pro chip with 6-core GPU',
      'Camera': '48MP Main | 12MP Ultra Wide | 12MP 5x Telephoto',
      'Battery': 'Up to 29 hours video playback',
      'Operating System': 'iOS 17'
    }
  },
  {
    id: 'prod-102',
    _id: 'prod-102',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB RAM, 512GB)',
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB RAM, 512GB)',
    slug: 'samsung-galaxy-s24-ultra',
    category: 'Mobiles',
    brand: 'Samsung',
    price: 129999,
    originalPrice: 144999,
    discountPercentage: 10,
    rating: 4.7,
    reviewCount: 2150,
    stock: 18,
    isFeatured: true,
    isDealOfTheDay: true,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.',
    specifications: {
      'Display': '6.8-inch QHD+ Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Camera': '200MP + 50MP + 12MP + 10MP Quad Camera',
      'Stylus': 'Built-in S Pen',
      'Battery': '5000 mAh Fast Charging'
    }
  },
  {
    id: 'prod-103',
    _id: 'prod-103',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones - Black',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones - Black',
    slug: 'sony-wh1000xm5-headphones',
    category: 'Electronics',
    brand: 'Sony',
    price: 26990,
    originalPrice: 34990,
    discountPercentage: 23,
    rating: 4.6,
    reviewCount: 1890,
    stock: 45,
    isFeatured: true,
    isDealOfTheDay: false,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Industry-leading noise canceling with two processors and 8 microphones for unprecedented sound quality and crystal-clear call performance.',
    specifications: {
      'Battery Life': 'Up to 30 hours',
      'Noise Canceling': 'Dual Processor HD Noise Canceling QN1',
      'Connectivity': 'Bluetooth 5.2 / 3.5mm Aux',
      'Weight': '250 grams'
    }
  },
  {
    id: 'prod-104',
    _id: 'prod-104',
    name: 'Apple MacBook Air 15-inch M2 Chip (8GB RAM, 256GB SSD) - Starlight',
    title: 'Apple MacBook Air 15-inch M2 Chip (8GB RAM, 256GB SSD) - Starlight',
    slug: 'macbook-air-15-m2',
    category: 'Electronics',
    brand: 'Apple',
    price: 114900,
    originalPrice: 134900,
    discountPercentage: 15,
    rating: 4.9,
    reviewCount: 980,
    stock: 12,
    isFeatured: true,
    isDealOfTheDay: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Impossibly thin and incredibly fast. MacBook Air features a spacious Liquid Retina display and unbelievable battery life.',
    specifications: {
      'Processor': 'Apple M2 8-core CPU',
      'RAM': '8GB Unified Memory',
      'Storage': '256GB Superfast SSD',
      'Display': '15.3-inch Liquid Retina with True Tone'
    }
  },
  {
    id: 'prod-105',
    _id: 'prod-105',
    name: 'Nike Air Jordan 1 Retro High OG - Chicago Colorway',
    title: 'Nike Air Jordan 1 Retro High OG - Chicago Colorway',
    slug: 'nike-air-jordan-1-retro',
    category: 'Fashion',
    brand: 'Nike',
    price: 16995,
    originalPrice: 19995,
    discountPercentage: 15,
    rating: 4.8,
    reviewCount: 4120,
    stock: 30,
    isFeatured: false,
    isDealOfTheDay: false,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Iconic high-top basketball sneaker built with premium full-grain leather, padded collar, and legendary Air-Sole cushioning.',
    specifications: {
      'Material': 'Premium Full Grain Leather',
      'Sole': 'Rubber with Air Cushioning',
      'Color': 'Varsity Red / White / Black',
      'Closure': 'Lace-Up'
    }
  },
  {
    id: 'prod-106',
    _id: 'prod-106',
    name: 'Dyson V15 Detect Cordless Vacuum Cleaner with Laser Detection',
    title: 'Dyson V15 Detect Cordless Vacuum Cleaner with Laser Detection',
    slug: 'dyson-v15-detect-vacuum',
    category: 'Home & Kitchen',
    brand: 'Dyson',
    price: 62900,
    originalPrice: 69900,
    discountPercentage: 10,
    rating: 4.7,
    reviewCount: 650,
    stock: 8,
    isFeatured: true,
    isDealOfTheDay: false,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Dyson’s most powerful, intelligent cordless vacuum. Reveals microscopic dust and automatically adapts suction power.',
    specifications: {
      'Run Time': 'Up to 60 minutes',
      'Suction Power': '230 AW',
      'Filtration': '99.99% down to 0.3 microns',
      'Display': 'LCD Screen with particle count'
    }
  },
  {
    id: 'prod-107',
    _id: 'prod-107',
    name: 'LG 55-inch 4K Ultra HD Smart OLED TV (OLED55C3PSA)',
    title: 'LG 55-inch 4K Ultra HD Smart OLED TV (OLED55C3PSA)',
    slug: 'lg-55-4k-oled-tv',
    category: 'Appliances',
    brand: 'LG',
    price: 119990,
    originalPrice: 169990,
    discountPercentage: 29,
    rating: 4.9,
    reviewCount: 1420,
    stock: 14,
    isFeatured: true,
    isDealOfTheDay: true,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Self-lit OLED pixels create infinite contrast, 100% color fidelity, and ultra-fast 0.1ms response time for gaming.',
    specifications: {
      'Display Type': 'OLED 4K UHD (3840x2160)',
      'Refresh Rate': '120Hz Native',
      'Processor': 'a9 AI Processor Gen6',
      'Sound': '40W 2.2 Channel Dolby Atmos'
    }
  },
  {
    id: 'prod-108',
    _id: 'prod-108',
    name: 'Ray-Ban Wayfarer Classic Sunglasses - Polarized Green G-15',
    title: 'Ray-Ban Wayfarer Classic Sunglasses - Polarized Green G-15',
    slug: 'rayban-wayfarer-sunglasses',
    category: 'Fashion',
    brand: 'Ray-Ban',
    price: 9890,
    originalPrice: 11990,
    discountPercentage: 17,
    rating: 4.5,
    reviewCount: 880,
    stock: 50,
    isFeatured: false,
    isDealOfTheDay: false,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The standard for timeless style. Acetate black frames with crystal green polarized lenses offering 100% UV protection.',
    specifications: {
      'Frame Material': 'Acetate',
      'Lens Color': 'Polarized G-15 Green',
      'UV Protection': '100% UV400 Protection',
      'Size': '50mm Lens Width'
    }
  }
];

export const initialUsers = [
  {
    id: 'usr-admin-1',
    _id: 'usr-admin-1',
    name: 'Admin Manager',
    email: 'admin@ecommerce.com',
    role: 'admin',
    createdAt: new Date('2026-01-01').toISOString()
  },
  {
    id: 'usr-customer-1',
    _id: 'usr-customer-1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'user',
    createdAt: new Date('2026-02-10').toISOString()
  }
];

export const initialOrders = [
  {
    id: 'ORD-98421',
    _id: 'ORD-98421',
    userId: 'usr-customer-1',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@example.com',
    items: [
      {
        productId: 'prod-103',
        title: 'Sony WH-1000XM5 Wireless Headphones',
        price: 26990,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 26990,
    totalPrice: 26990,
    shippingAddress: {
      fullName: 'Alex Johnson',
      address: 'Flat 402, Skyline Towers, MG Road',
      city: 'Bengaluru',
      postalCode: '560001',
      country: 'India',
      phone: '+91 9876543210'
    },
    paymentMethod: 'UPI / NetBanking',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];
