const mongoose = require('mongoose');
const Product = require('./models/Product'); 

const productsData = [
  {
    name: "Logitech MX Master 3 Mouse",
    description: "Advanced wireless mouse with ultra-fast scrolling, ergonomic design, and customizable buttons. Perfect for productivity and creative work.",
    price: 89.99,
    discount: 15,
    discountedPrice: 76.49,
    category: "computer",
    brand: "Logitech",
    stock: 45,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyfP8ePz9MgUzBv8MNciZlN0DsSA4DWFMStQ&s",
    images: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyfP8ePz9MgUzBv8MNciZlN0DsSA4DWFMStQ&s" },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUqn_KDHQGVj2oI9DnYXod_z3WOufeeXeneQ&s" },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGoXp-7MEz7oMisDAZPch2rhNDTeIvVWeAXw&s" },
      { url: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["computer", "mouse", "Logitech", "wireless", "productivity", "ergonomic"],
    reviews: []
  },
  {
    name: "Gaming Chair Pro",
    description: "Professional gaming chair with RGB lighting, lumbar support, and premium leather upholstery.",
    price: 350,
    discount: 25,
    discountedPrice: 262.50,
    category: "Gaming Furniture",
    brand: "RazerMax",
    stock: 32,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxXHEMq5jRaeNMTzavdDdjtrXgY6t_anvU0A&s",
    images: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxXHEMq5jRaeNMTzavdDdjtrXgY6t_anvU0A&s" },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfTATLaCFhYnWI0eq0bhsNtXgQzUBjwWyDPg&s" },
      { url: "https://images-cdn.ubuy.co.in/6350ebdfc0dc9f18750b3051-iw-sk-imperator-works-gaming-chair.jpg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["gaming", "chair", "RGB", "leather", "ergonomic"],
    reviews: []
  },
  {
    name: "Organic Cucumber",
    description: "Farm-fresh organic cucumbers, crisp and perfect for salads and healthy snacking.",
    price: 2.49,
    discount: 8,
    discountedPrice: 2.29,
    category: "groceries",
    brand: "FreshFarm",
    stock: 150,
    image: "https://cdn.dummyjson.com/products/images/groceries/Cucumber/thumbnail.png",
    images: [
      { url: "https://cdn.dummyjson.com/products/images/groceries/Cucumber/1.png" },
      { url: "https://cdn.dummyjson.com/products/images/groceries/Cucumber/thumbnail.png" },
      { url: "https://images.pexels.com/photos/128536/pexels-photo-128536.jpeg" },
      { url: "https://images.pexels.com/photos/1482101/pexels-photo-1482101.jpeg" },
      { url: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["vegetables", "organic", "fresh", "healthy", "salad"],
    reviews: []
  },
  {
    name: "Free Range Eggs (12 Pack)",
    description: "Premium free-range eggs from grass-fed hens, perfect for breakfast, baking, and cooking.",
    price: 4.99,
    discount: 20,
    discountedPrice: 3.99,
    category: "groceries",
    brand: "FarmFresh",
    stock: 85,
    image: "https://cdn.dummyjson.com/products/images/groceries/Eggs/thumbnail.png",
    images: [
      { url: "https://cdn.dummyjson.com/products/images/groceries/Eggs/1.png" },
      { url: "https://cdn.dummyjson.com/products/images/groceries/Eggs/thumbnail.png" },
      { url: "https://images.pexels.com/photos/162712/eggs-food-ingredients-cooking-162712.jpeg" },
      { url: "https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["dairy", "eggs", "breakfast", "protein", "free-range"],
    reviews: []
  },
  {
    name: "Fresh Orange Juice",
    description: "100% pure fresh orange juice, rich in vitamin C and natural flavors. No added preservatives.",
    price: 5.49,
    discount: 12,
    discountedPrice: 4.83,
    category: "groceries",
    brand: "CitrusFresh",
    stock: 60,
    image: "https://cdn.dummyjson.com/products/images/groceries/Juice/thumbnail.png",
    images: [
      { url: "https://cdn.dummyjson.com/products/images/groceries/Juice/1.png" },
      { url: "https://cdn.dummyjson.com/products/images/groceries/Juice/thumbnail.png" },
      { url: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["beverages", "juice", "vitamin C", "fresh", "healthy"],
    reviews: []
  },
  {
    name: "Samsung 65\" 4K Smart TV",
    description: "Ultra HD 4K Smart TV with HDR technology, built-in streaming apps, and voice control.",
    price: 1599.99,
    discount: 18,
    discountedPrice: 1311.99,
    category: "electronics",
    brand: "Samsung",
    stock: 25,
    image: "https://images.pexels.com/photos/417458/pexels-photo-417458.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/417458/pexels-photo-417458.jpeg" },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStDN2wDQR3dAQSV0o4p-fPrrglNRaQ6GFcVA&s" },
      { url: "https://ledshop.pk/wp-content/uploads/2023/05/lg2-1.jpeg" },
      { url: "https://www.tclpakistan.com/media/catalog/product/cache/abd9e3bfa46ca9e24f4d847673043117/p/r/product_display_image_main.jpg" },
      { url: "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["TV", "4K", "smart-tv", "Samsung", "HDR", "streaming"],
    reviews: []
  },
  {
    name: "Chanel No. 5 Eau de Parfum",
    description: "The iconic Chanel No. 5 fragrance with timeless floral aldehydic notes. A classic luxury scent.",
    price: 149.99,
    discount: 10,
    discountedPrice: 134.99,
    category: "fragrances",
    brand: "Chanel",
    stock: 40,
    image: "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/thumbnail.png",
    images: [
      { url: "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/1.png" },
      { url: "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/2.png" },
      { url: "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/3.png" },
      { url: "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/thumbnail.png" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["fragrances", "Chanel", "luxury", "perfume", "classic"],
    reviews: []
  },
  {
    name: "Italian Leather Sofa",
    description: "Luxurious 3-seater Italian leather sofa with solid wood frame and premium cushioning.",
    price: 2499.99,
    discount: 30,
    discountedPrice: 1749.99,
    category: "furniture",
    brand: "LuxHome",
    stock: 15,
    image: "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.png",
    images: [
      { url: "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/1.png" },
      { url: "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/2.png" },
      { url: "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/3.png" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["furniture", "sofa", "leather", "Italian", "luxury"],
    reviews: []
  },
  {
    name: "Modern Wall Art Set",
    description: "Contemporary 3-piece canvas wall art set featuring abstract geometric designs in neutral colors.",
    price: 79.99,
    discount: 22,
    discountedPrice: 62.39,
    category: "home decor",
    brand: "ArtStudio",
    stock: 55,
    image: "https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Events/2024/BAU2024Sept/HomeDecor_1x._SY116_CB563137408_.jpg",
    images: [
      { url: "https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Events/2024/BAU2024Sept/HomeDecor_1x._SY116_CB563137408_.jpg" },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4cG-y-MccXDXqSTmstXoFbHdwjkSFIbVz5Q&s" },
      { url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" },
      { url: "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg" },
      { url: "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["home decor", "wall art", "modern", "abstract", "canvas"],
    reviews: []
  },
  {
    name: "Tom Ford Black Orchid",
    description: "Luxurious unisex fragrance with rich black orchid, vanilla, and patchouli notes. Bold and sophisticated.",
    price: 189.99,
    discount: 15,
    discountedPrice: 161.49,
    category: "fragrances",
    brand: "Tom Ford",
    stock: 30,
    image: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/thumbnail.png",
    images: [
      { url: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/1.png" },
      { url: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/2.png" },
      { url: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/3.png" },
      { url: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/thumbnail.png" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["fragrances", "Tom Ford", "unisex", "luxury", "orchid"],
    reviews: []
  },
  {
    name: "Extra Virgin Olive Oil",
    description: "Premium cold-pressed extra virgin olive oil from Mediterranean olives. Perfect for cooking and salads.",
    price: 12.99,
    discount: 5,
    discountedPrice: 12.34,
    category: "groceries",
    brand: "MediterraneanGold",
    stock: 120,
    image: "https://cdn.dummyjson.com/products/images/groceries/Cooking%20Oil/thumbnail.png",
    images: [
      { url: "https://cdn.dummyjson.com/products/images/groceries/Cooking%20Oil/1.png" },
      { url: "https://cdn.dummyjson.com/products/images/groceries/Cooking%20Oil/thumbnail.png" },
      { url: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["cooking oil", "olive oil", "Mediterranean", "extra virgin", "healthy"],
    reviews: []
  },
  {
    name: "Honeycrisp Apples (3 lbs)",
    description: "Sweet and crispy Honeycrisp apples, perfect for snacking or baking. Locally sourced and fresh.",
    price: 6.99,
    discount: 18,
    discountedPrice: 5.73,
    category: "groceries",
    brand: "OrchardFresh",
    stock: 95,
    image: "https://cdn.dummyjson.com/products/images/groceries/Apple/thumbnail.png",
    images: [
      { url: "https://cdn.dummyjson.com/products/images/groceries/Apple/1.png" },
      { url: "https://cdn.dummyjson.com/products/images/groceries/Apple/thumbnail.png" },
      { url: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg" },
      { url: "https://images.pexels.com/photos/209449/pexels-photo-209449.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["fruits", "apples", "Honeycrisp", "fresh", "organic"],
    reviews: []
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical gaming keyboard with blue switches, anti-ghosting, and programmable keys.",
    price: 129.99,
    discount: 28,
    discountedPrice: 93.59,
    category: "computer",
    brand: "SteelSeries",
    stock: 38,
    image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg" },
      { url: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg" },
      { url: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg" },
      { url: "https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg" },
      { url: "https://images.pexels.com/photos/841228/pexels-photo-841228.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["gaming", "keyboard", "mechanical", "RGB", "SteelSeries"],
    reviews: []
  },
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.",
    price: 199.99,
    discount: 35,
    discountedPrice: 129.99,
    category: "electronics",
    brand: "Sony",
    stock: 45,
    image: "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg" },
      { url: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg" },
      { url: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["headphones", "wireless", "Sony", "noise-cancelling", "bluetooth"],
    reviews: []
  },
  {
    name: "Smartphone 5G Pro",
    description: "Latest 5G smartphone with 128GB storage, triple camera system, and all-day battery life.",
    price: 899.99,
    discount: 12,
    discountedPrice: 791.99,
    category: "electronics",
    brand: "TechPro",
    stock: 28,
    image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg" },
      { url: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg" },
      { url: "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg" },
      { url: "https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["smartphone", "5G", "camera", "mobile", "technology"],
    reviews: []
  },
  {
    name: "Yoga Mat Premium",
    description: "Eco-friendly non-slip yoga mat with extra cushioning, perfect for yoga, pilates, and home workouts.",
    price: 49.99,
    discount: 24,
    discountedPrice: 37.99,
    category: "fitness",
    brand: "ZenFit",
    stock: 75,
    image: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg" },
      { url: "https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg" },
      { url: "https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg" },
      { url: "https://images.pexels.com/photos/3822774/pexels-photo-3822774.jpeg" },
      { url: "https://images.pexels.com/photos/4327022/pexels-photo-4327022.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["yoga", "fitness", "mat", "exercise", "eco-friendly"],
    reviews: []
  },
  {
    name: "Coffee Maker Deluxe",
    description: "Programmable drip coffee maker with thermal carafe, brew strength control, and 12-cup capacity.",
    price: 89.99,
    discount: 33,
    discountedPrice: 60.29,
    category: "kitchen",
    brand: "BrewMaster",
    stock: 42,
    image: "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg" },
      { url: "https://images.pexels.com/photos/2061327/pexels-photo-2061327.jpeg" },
      { url: "https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["coffee", "kitchen", "appliance", "brewing", "programmable"],
    reviews: []
  },
  {
    name: "Running Shoes Air Max",
    description: "Lightweight running shoes with air cushioning technology, breathable mesh upper, and durable sole.",
    price: 139.99,
    discount: 20,
    discountedPrice: 111.99,
    category: "footwear",
    brand: "Nike",
    stock: 65,
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" },
      { url: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg" },
      { url: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg" },
      { url: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["shoes", "running", "Nike", "sports", "athletic"],
    reviews: []
  },
  {
    name: "Skincare Vitamin C Serum",
    description: "Anti-aging vitamin C serum with hyaluronic acid, reduces dark spots and brightens skin tone.",
    price: 34.99,
    discount: 40,
    discountedPrice: 20.99,
    category: "beauty",
    brand: "GlowSkin",
    stock: 88,
    image: "https://images.pexels.com/photos/7755266/pexels-photo-7755266.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/7755266/pexels-photo-7755266.jpeg" },
      { url: "https://images.pexels.com/photos/4465121/pexels-photo-4465121.jpeg" },
      { url: "https://images.pexels.com/photos/6621336/pexels-photo-6621336.jpeg" },
      { url: "https://images.pexels.com/photos/7755105/pexels-photo-7755105.jpeg" },
      { url: "https://images.pexels.com/photos/4465833/pexels-photo-4465833.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["skincare", "serum", "vitamin C", "anti-aging", "beauty"],
    reviews: []
  },
  {
    name: "Protein Powder Whey",
    description: "Premium whey protein powder with 25g protein per serving, chocolate flavor, ideal for muscle building.",
    price: 59.99,
    discount: 16,
    discountedPrice: 50.39,
    category: "supplements",
    brand: "FitNutrition",
    stock: 52,
    image: "https://images.pexels.com/photos/4474052/pexels-photo-4474052.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/4474052/pexels-photo-4474052.jpeg" },
      { url: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg" },
      { url: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["protein", "supplements", "whey", "fitness", "nutrition"],
    reviews: []
  },
  {
    name: "Wooden Dining Table",
    description: "Solid oak dining table seats 6 people, perfect for family meals and entertaining guests.",
    price: 899.99,
    discount: 27,
    discountedPrice: 656.99,
    category: "furniture",
    brand: "WoodCraft",
    stock: 18,
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" },
      { url: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg" },
      { url: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg" },
      { url: "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["furniture", "dining table", "wood", "oak", "family"],
    reviews: []
  },
  {
    name: "Wireless Charger Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices, LED indicator, anti-slip design.",
    price: 29.99,
    discount: 37,
    discountedPrice: 18.89,
    category: "electronics",
    brand: "ChargeTech",
    stock: 110,
    image: "https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg",
    images: [
      { url: "https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg" },
      { url: "https://images.pexels.com/photos/163016/mobile-phone-android-apps-phone-163016.jpeg" },
      { url: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["wireless", "charger", "electronics", "smartphone", "accessories"],
    reviews: []
  },
  {
    name: "Designer Sunglasses",
    description: "Luxury aviator sunglasses with UV protection, polarized lenses, and premium metal frame.",
    price: 189.99,
    discount: 45,
    discountedPrice: 104.49,
    category: "accessories",
    brand: "LuxVision",
    stock: 37,
    image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg" },
      { url: "https://images.pexels.com/photos/713297/pexels-photo-713297.jpeg" },
      { url: "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg" },
      { url: "https://images.pexels.com/photos/704241/pexels-photo-704241.jpeg" },
      { url: "https://images.pexels.com/photos/119598/pexels-photo-119598.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["sunglasses", "accessories", "designer", "UV protection", "aviator"],
    reviews: []
  },
  {
    name: "Green Tea Organic",
    description: "Premium organic green tea leaves, rich in antioxidants, perfect for daily wellness routine.",
    price: 18.99,
    discount: 13,
    discountedPrice: 16.52,
    category: "groceries",
    brand: "TeaGarden",
    stock: 78,
    image: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg" },
      { url: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg" },
      { url: "https://images.pexels.com/photos/1638281/pexels-photo-1638281.jpeg" },
      { url: "https://images.pexels.com/photos/1638274/pexels-photo-1638274.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["tea", "organic", "green tea", "antioxidants", "wellness"],
    reviews: []
  },
  {
    name: "Gaming Monitor 144Hz",
    description: "27-inch gaming monitor with 144Hz refresh rate, 1ms response time, and G-Sync compatibility.",
    price: 399.99,
    discount: 23,
    discountedPrice: 307.99,
    category: "computer",
    brand: "ViewMax",
    stock: 29,
    image: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg" },
      { url: "https://images.pexels.com/photos/1714205/pexels-photo-1714205.jpeg" },
      { url: "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["monitor", "gaming", "144Hz", "computer", "G-Sync"],
    reviews: []
  },
  {
    name: "Hair Dryer Professional",
    description: "Ionic hair dryer with multiple heat settings, ceramic technology, and concentrator nozzle.",
    price: 79.99,
    discount: 31,
    discountedPrice: 55.19,
    category: "beauty",
    brand: "StylePro",
    stock: 64,
    image: "https://images.pexels.com/photos/3993212/pexels-photo-3993212.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/3993212/pexels-photo-3993212.jpeg" },
      { url: "https://images.pexels.com/photos/3785806/pexels-photo-3785806.jpeg" },
      { url: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg" },
      { url: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg" },
      { url: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["hair dryer", "beauty", "ionic", "professional", "styling"],
    reviews: []
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle keeps drinks cold for 24 hours, hot for 12 hours.",
    price: 24.99,
    discount: 19,
    discountedPrice: 20.24,
    category: "lifestyle",
    brand: "HydroFlask",
    stock: 89,
    image: "https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg" },
      { url: "https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg" },
      { url: "https://images.pexels.com/photos/1346155/pexels-photo-1346155.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["water bottle", "stainless steel", "insulated", "lifestyle", "hydration"],
    reviews: []
  },
  {
    name: "Bluetooth Speaker Portable",
    description: "Waterproof portable Bluetooth speaker with 20-hour battery life and powerful bass.",
    price: 69.99,
    discount: 26,
    discountedPrice: 51.79,
    category: "electronics",
    brand: "SoundWave",
    stock: 56,
    image: "https://images.pexels.com/photos/1444424/pexels-photo-1444424.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/1444424/pexels-photo-1444424.jpeg" },
      { url: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg" },
      { url: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg" },
      { url: "https://images.pexels.com/photos/1649769/pexels-photo-1649769.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["speaker", "bluetooth", "portable", "waterproof", "music"],
    reviews: []
  },
  {
    name: "Office Chair Ergonomic",
    description: "Ergonomic office chair with lumbar support, adjustable height, and breathable mesh back.",
    price: 249.99,
    discount: 32,
    discountedPrice: 169.99,
    category: "furniture",
    brand: "ComfortDesk",
    stock: 41,
    image: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg" },
      { url: "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg" },
      { url: "https://images.pexels.com/photos/7092611/pexels-photo-7092611.jpeg" },
      { url: "https://images.pexels.com/photos/7084302/pexels-photo-7084302.jpeg" },
      { url: "https://images.pexels.com/photos/7084308/pexels-photo-7084308.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["office chair", "ergonomic", "furniture", "lumbar support", "adjustable"],
    reviews: []
  },
  {
    name: "Pasta Premium Italian",
    description: "Authentic Italian pasta made from durum wheat, perfect texture and taste for gourmet meals.",
    price: 8.99,
    discount: 11,
    discountedPrice: 8.00,
    category: "groceries",
    brand: "Italiana",
    stock: 125,
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg" },
      { url: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg" },
      { url: "https://images.pexels.com/photos/803963/pexels-photo-803963.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["pasta", "Italian", "gourmet", "durum wheat", "cooking"],
    reviews: []
  },
  {
    name: "Leather Wallet Men's",
    description: "Genuine leather bifold wallet with RFID blocking, multiple card slots, and cash compartment.",
    price: 59.99,
    discount: 42,
    discountedPrice: 34.79,
    category: "accessories",
    brand: "LeatherCraft",
    stock: 73,
    image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg" },
      { url: "https://images.pexels.com/photos/934069/pexels-photo-934069.jpeg" },
      { url: "https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg" },
      { url: "https://images.pexels.com/photos/1445527/pexels-photo-1445527.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["wallet", "leather", "men's", "RFID", "accessories"],
    reviews: []
  },
  {
    name: "Electric Toothbrush Smart",
    description: "Smart electric toothbrush with app connectivity, pressure sensor, and 3 cleaning modes.",
    price: 119.99,
    discount: 38,
    discountedPrice: 74.39,
    category: "health",
    brand: "OralTech",
    stock: 48,
    image: "https://images.pexels.com/photos/3845457/pexels-photo-3845457.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/3845457/pexels-photo-3845457.jpeg" },
      { url: "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg" },
      { url: "https://images.pexels.com/photos/4465833/pexels-photo-4465833.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["toothbrush", "electric", "smart", "oral care", "health"],
    reviews: []
  },
  {
    name: "Candle Set Aromatherapy",
    description: "Set of 3 aromatherapy candles with lavender, vanilla, and eucalyptus scents for relaxation.",
    price: 39.99,
    discount: 29,
    discountedPrice: 28.39,
    category: "home decor",
    brand: "ZenScents",
    stock: 92,
    image: "https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg" },
      { url: "https://images.pexels.com/photos/1123261/pexels-photo-1123261.jpeg" },
      { url: "https://images.pexels.com/photos/1123264/pexels-photo-1123264.jpeg" },
      { url: "https://images.pexels.com/photos/1123265/pexels-photo-1123265.jpeg" },
      { url: "https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["candles", "aromatherapy", "home decor", "relaxation", "scented"],
    reviews: []
  },
  {
    name: "Laptop Stand Adjustable",
    description: "Aluminum laptop stand with adjustable height and angle, improves posture and ventilation.",
    price: 45.99,
    discount: 34,
    discountedPrice: 30.35,
    category: "computer",
    brand: "DeskPro",
    stock: 67,
    image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
      { url: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg" },
      { url: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["laptop stand", "adjustable", "aluminum", "ergonomic", "desk"],
    reviews: []
  },
  {
    name: "Face Mask Hydrating Set",
    description: "Pack of 10 hydrating face masks with hyaluronic acid and vitamin E for glowing skin.",
    price: 28.99,
    discount: 21,
    discountedPrice: 22.90,
    category: "beauty",
    brand: "SkinGlow",
    stock: 105,
    image: "https://images.pexels.com/photos/7755266/pexels-photo-7755266.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/7755266/pexels-photo-7755266.jpeg" },
      { url: "https://images.pexels.com/photos/4465833/pexels-photo-4465833.jpeg" },
      { url: "https://images.pexels.com/photos/6621336/pexels-photo-6621336.jpeg" },
      { url: "https://images.pexels.com/photos/7755105/pexels-photo-7755105.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["face mask", "hydrating", "skincare", "beauty", "vitamin E"],
    reviews: []
  },
  {
    name: "Backpack Travel",
    description: "Large capacity travel backpack with multiple compartments, laptop sleeve, and water-resistant material.",
    price: 89.99,
    discount: 36,
    discountedPrice: 57.59,
    category: "travel",
    brand: "AdventurePack",
    stock: 38,
    image: "https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg" },
      { url: "https://images.pexels.com/photos/2422914/pexels-photo-2422914.jpeg" },
      { url: "https://images.pexels.com/photos/2422285/pexels-photo-2422285.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["backpack", "travel", "laptop sleeve", "water-resistant", "adventure"],
    reviews: []
  },
  {
    name: "Air Fryer Digital",
    description: "6-quart digital air fryer with 8 preset cooking programs, touchscreen display, and recipe book.",
    price: 129.99,
    discount: 41,
    discountedPrice: 76.69,
    category: "kitchen",
    brand: "CookSmart",
    stock: 33,
    image: "https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg" },
      { url: "https://images.pexels.com/photos/4253301/pexels-photo-4253301.jpeg" },
      { url: "https://images.pexels.com/photos/2061327/pexels-photo-2061327.jpeg" },
      { url: "https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg" },
      { url: "https://images.pexels.com/photos/4253299/pexels-photo-4253299.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["air fryer", "kitchen", "digital", "cooking", "healthy"],
    reviews: []
  },
  {
    name: "Books Classic Literature Set",
    description: "Collection of 5 classic literature books including Pride and Prejudice, 1984, and To Kill a Mockingbird.",
    price: 49.99,
    discount: 14,
    discountedPrice: 42.99,
    category: "books",
    brand: "ClassicReads",
    stock: 82,
    image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg" },
      { url: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg" },
      { url: "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["books", "literature", "classic", "reading", "collection"],
    reviews: []
  },
  {
    name: "Smart Watch Fitness",
    description: "Fitness tracking smartwatch with heart rate monitor, GPS, sleep tracking, and 7-day battery life.",
    price: 199.99,
    discount: 25,
    discountedPrice: 149.99,
    category: "electronics",
    brand: "FitTracker",
    stock: 44,
    image: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg" },
      { url: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg" },
      { url: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg" },
      { url: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["smartwatch", "fitness", "heart rate", "GPS", "tracking"],
    reviews: []
  },
  {
    name: "Plant Pot Set Ceramic",
    description: "Set of 3 modern ceramic plant pots with drainage holes and saucers, perfect for indoor plants.",
    price: 34.99,
    discount: 17,
    discountedPrice: 29.04,
    category: "home decor",
    brand: "GreenThumb",
    stock: 96,
    image: "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg" },
      { url: "https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg" },
      { url: "https://images.pexels.com/photos/1084186/pexels-photo-1084186.jpeg" },
      { url: "https://images.pexels.com/photos/1084185/pexels-photo-1084185.jpeg" },
      { url: "https://images.pexels.com/photos/1084200/pexels-photo-1084200.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["plant pots", "ceramic", "indoor plants", "home decor", "gardening"],
    reviews: []
  },
  {
    name: "Resistance Bands Set",
    description: "Complete set of 5 resistance bands with different resistance levels, door anchor, and workout guide.",
    price: 24.99,
    discount: 48,
    discountedPrice: 12.99,
    category: "fitness",
    brand: "FitBands",
    stock: 87,
    image: "https://images.pexels.com/photos/4327022/pexels-photo-4327022.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/4327022/pexels-photo-4327022.jpeg" },
      { url: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg" },
      { url: "https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["resistance bands", "fitness", "home workout", "exercise", "strength"],
    reviews: []
  },
  


{
    name: "Nike Air Max 270 Running Shoes",
    description: "Lightweight running shoes with air cushioning technology, breathable mesh upper, and durable sole.",
    price: 139.99,
    discount: 20,
    discountedPrice: 111.99,
    category: "footwear",
    brand: "Nike",
    stock: 65,
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8439f823-86cf-4086-81d2-4f9ff9a66866/air-max-270-mens-shoes-KkLcGR.png",
    images: [
      { url: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8439f823-86cf-4086-81d2-4f9ff9a66866/air-max-270-mens-shoes-KkLcGR.png" },
      { url: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-mens-shoes-KkLcGR.png" },
      { url: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/i1-a73e717d-1ad9-4e86-b574-4d3c8bf81024/air-max-270-mens-shoes-KkLcGR.png" },
      { url: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/8439f823-86cf-4086-81d2-4f9ff9a66866/air-max-270-mens-shoes-KkLcGR.png" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["shoes", "running", "Nike", "sports", "athletic", "Air Max"],
    reviews: []
  },
    {
    name: "Honeycrisp Apples (3 lbs)",
    description: "Sweet and crispy Honeycrisp apples, perfect for snacking or baking. Locally sourced and fresh.",
    price: 6.99,
    discount: 18,
    discountedPrice: 5.73,
    category: "groceries",
    brand: "OrchardFresh",
    stock: 95,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=60",
    images: [
      { url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1581873372796-2ddf04206d59?w=600&auto=format&fit=crop&q=60" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["fruits", "apples", "Honeycrisp", "fresh", "organic"],
    reviews: []
  },
   {
    name: "Italian Leather Sofa",
    description: "Luxurious 3-seater Italian leather sofa with solid wood frame and premium cushioning.",
    price: 2499.99,
    discount: 30,
    discountedPrice: 1749.99,
    category: "furniture",
    brand: "LuxHome",
    stock: 15,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60",
    images: [
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1549497538-303791108f95?w=600&auto=format&fit=crop&q=60" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    tags: ["furniture", "sofa", "leather", "Italian", "luxury"],
    reviews: []
  },
    {
    name: "Modern Wall Art Set",
    description: "Contemporary 3-piece canvas wall art set featuring abstract geometric designs in neutral colors.",
    price: 79.99,
    discount: 22,
    discountedPrice: 62.39,
    category: "home decor",
    brand: "ArtStudio",
    stock: 55,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=60",
    images: [
      { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=60" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["home decor", "wall art", "modern", "abstract", "canvas"],
    reviews: []
  },
    {
    name: "Organic Cucumber",
    description: "Farm-fresh organic cucumbers, crisp and perfect for salads and healthy snacking.",
    price: 2.49,
    discount: 8,
    discountedPrice: 2.29,
    category: "groceries",
    brand: "FreshFarm",
    stock: 150,
    image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&auto=format&fit=crop&q=60",
    images: [
      { url: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1566281796817-93bc94d7dbd2?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&auto=format&fit=crop&q=60" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["vegetables", "organic", "fresh", "healthy", "salad"],
    reviews: []
  },
   {
    name: "Free Range Eggs (12 Pack)",
    description: "Premium free-range eggs from grass-fed hens, perfect for breakfast, baking, and cooking.",
    price: 4.99,
    discount: 20,
    discountedPrice: 3.99,
    category: "groceries",
    brand: "FarmFresh",
    stock: 85,
    image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=600&auto=format&fit=crop&q=60",
    images: [
      { url: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1563379091639-cdcb3c6728f2?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=60" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["dairy", "eggs", "breakfast", "protein", "free-range"],
    reviews: []
  },
   {
    name: "Twinings Earl Grey Tea",
    description: "Premium organic Earl Grey tea leaves, rich in bergamot flavor, perfect for daily wellness routine.",
    price: 18.99,
    discount: 13,
    discountedPrice: 16.52,
    category: "groceries",
    brand: "Twinings",
    stock: 78,
    image: "https://www.twinings.co.uk/dw/image/v2/BBDX_PRD/on/demandware.static/-/Sites-twinings-master-catalog/default/dw8c5a2f1e/images/large/F09583_Earl_Grey_100_Tea_Bags_UK.png",
    images: [
      { url: "https://www.twinings.co.uk/dw/image/v2/BBDX_PRD/on/demandware.static/-/Sites-twinings-master-catalog/default/dw8c5a2f1e/images/large/F09583_Earl_Grey_100_Tea_Bags_UK.png" },
      { url: "https://www.twinings.co.uk/dw/image/v2/BBDX_PRD/on/demandware.static/-/Sites-twinings-master-catalog/default/dw7f4c2b3a/images/large/F09584_Earl_Grey_50_Tea_Bags_UK.png" },
      { url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=60" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["tea", "Earl Grey", "bergamot", "wellness", "Twinings"],
    reviews: []
  },

  
  {
    name: "Honey Raw Organic",
    description: "Pure raw organic honey, unprocessed and unfiltered, sourced from local beekeepers.",
    price: 16.99,
    discount: 6,
    discountedPrice: 15.97,
    category: "groceries",
    brand: "PureHive",
    stock: 134,
    image: "https://www.pexels.com/photo/person-holding-a-spoon-and-a-glass-jar-of-honey-7936722/",
    images: [
      { url: "https://www.pexels.com/photo/person-holding-a-spoon-and-a-glass-jar-of-honey-7936722/" },
      { url: "https://www.pexels.com/photo/honeycomb-on-wooden-chopping-board-9220899/" },
      { url: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg" },
      { url: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["honey", "organic", "raw", "natural", "sweetener"],
    reviews: []
  },
  {
    name: "USB Hub 7-Port",
    description: "7-port USB 3.0 hub with individual switches, LED indicators, and high-speed data transfer.",
    price: 32.99,
    discount: 39,
    discountedPrice: 20.12,
    category: "computer",
    brand: "TechConnect",
    stock: 71,
    image: "https://www.pexels.com/photo/purple-flash-drive-near-laptop-computer-461461/",
    images: [
      { url: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg" },
      { url: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg" },
      { url: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["USB hub", "computer", "accessories", "data transfer", "connectivity"],
    reviews: []
  },
  
  {
    name: "Pillow Memory Foam",
    description: "Contour memory foam pillow with cooling gel layer, provides optimal neck and spine alignment.",
    price: 69.99,
    discount: 43,
    discountedPrice: 39.89,
    category: "home",
    brand: "SleepComfort",
    stock: 59,
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    images: [
      { url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" },
      { url: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg" },
      { url: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg" }
    ],
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    tags: ["pillow", "memory foam", "sleep", "comfort", "cooling"],
    reviews: []
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://Shafeeq:724@cluster0.3cohtbc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
      console.log('Connected to MongoDB');
    })
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const createdProducts = await Product.insertMany(productsData);
    console.log(`Successfully seeded ${createdProducts.length} products`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();






