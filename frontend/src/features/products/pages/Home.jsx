import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hooks/useProduct'
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  ArrowRight, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react'
import { useNavigate } from 'react-router'

const Home = () => {
  const products = useSelector(state => state.product.products)
  const { handleGetAllProduct} = useProduct()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    handleGetAllProduct()
  }, [])

  // Safely ensure products is an array
  const productList = Array.isArray(products) ? products : []

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans antialiased">
      
  {/* Hero Banner Section */}
  <section 
    style={{ backgroundImage: "url('home.png')", backgroundSize: "cover", backgroundPosition: "center" }} 
    className="relative border-b border-slate-800/40 overflow-hidden py-24 sm:py-32"
  >
    {/* Dark Editorial Overlay Mask for Photo Contrast */}
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/30 pointer-events-none" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent_60%)] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-xl">
        
        {/* Subtle Luxury Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-amber-400/90 text-[10px] font-light uppercase tracking-[0.2em] mb-6">
          <Sparkles className="w-3 h-3 stroke-[1.5]" /> New Season Collection
        </span>

        {/* Serif Light Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl font-serif font-extralight tracking-wide mb-6 leading-[1.15] text-slate-50">
          Elevated Essentials <br />
          <span className="text-slate-300/80 font-sans text-2xl sm:text-4xl font-extralight tracking-normal italic block mt-1">
            For the Modern Wardrobe
          </span>
        </h1>

        <p className="text-slate-300/70 text-sm sm:text-base font-light leading-relaxed mb-10 max-w-md">
          Discover signature silhouettes crafted with ultra-premium fabrics, clean lines, and a dark luxury editorial aesthetic.
        </p>

        <a 
          href="#catalog" 
          className="inline-flex items-center gap-3 bg-white/95 text-slate-950 px-7 py-3.5 rounded-md font-medium text-xs uppercase tracking-[0.15em] hover:bg-white transition-all duration-300 hover:tracking-[0.2em]"
        >
          Explore Collection <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
        </a>

      </div>
    </div>
  </section>

  {/* Main Product Catalog Section */}
  <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
    
    {/* Header & Filter Controls */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-800/40">
      <div>
        <span className="text-[10px] font-medium tracking-[0.25em] text-amber-400/80 uppercase block mb-1">Curated Catalog</span>
        <h2 className="text-2xl sm:text-3xl font-serif font-light tracking-wide text-slate-100">Featured Products</h2>
      </div>

      {/* Minimal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        {['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-md text-[11px] uppercase tracking-wider font-light transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? 'border-amber-400/50 bg-amber-500/10 text-amber-300 font-normal'
                : 'border-slate-800/60 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>

    {/* Product Grid */}
    {productList.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((product) => {
          const productId = product._id || product.id
          const isWishlisted = wishlist.includes(productId)
          const imageSrc = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop'
          const price = typeof product.price === 'object' ? product.price.amount : product.price
          const currencySymbol = product.price?.currency === 'USD' ? '$' : (product.price?.symbol || '$')

          return (
            <div 
              onClick={()=>navigate(`/product/${product._id}`)}
              key={productId} 
              className="bg-slate-900/30 border border-slate-800/50 rounded-lg overflow-hidden group hover:border-slate-700/80 transition-all duration-300 flex flex-col"
            >
              {/* Image Stage */}
              <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden">
                <img 
                  src={imageSrc} 
                  alt={product.title || product.name} 
                  className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                />

                {/* Glass Category Tag */}
                {product.category && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-slate-950/70 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded text-[9px] font-light tracking-[0.2em] text-slate-300 uppercase">
                      {product.category}
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(productId)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
                    isWishlisted
                      ? 'bg-rose-950/70 border-rose-500/40 text-rose-400 scale-105'
                      : 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-white hover:bg-slate-950/80'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 stroke-[1.5] ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Minimal Overlay CTA */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-full bg-white/95 text-slate-950 font-medium py-2.5 px-3 rounded-md text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-xl">
                    <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" /> Add To Bag
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400/80 mb-1.5 font-light">
                    <div className="flex items-center gap-1 text-amber-400/90">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-light text-slate-300 text-xs">{product.rating || '4.8'}</span>
                      <span className="text-slate-500 text-[10px]">({product.reviewCount || 18})</span>
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">{product.sku || 'SNITCH'}</span>
                  </div>

                  <h3 className="font-normal text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-1 text-sm tracking-wide">
                    {product.title || product.name || 'Untitled Product'}
                  </h3>

                  {product.description && (
                    <p className="text-xs text-slate-400/80 font-light line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Price Tag */}
                <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between">
                  <span className="text-sm font-mono font-normal tracking-tight text-slate-100">
                    {currencySymbol}{typeof price === 'number' ? price.toFixed(2) : price || '0.00'}
                  </span>
                  <span className="text-[11px] font-light text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-1 tracking-wider uppercase">
                    View <ArrowRight className="w-3 h-3 stroke-[1.5]" />
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    ) : (
      /* Empty State */
      <div className="text-center py-20 border border-slate-800/40 bg-slate-900/20 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <SlidersHorizontal className="w-4 h-4 stroke-[1.5] animate-pulse" />
        </div>
        <h3 className="text-base font-light tracking-wide text-slate-300">Loading Collection...</h3>
        <p className="text-xs text-slate-500 font-light mt-1 max-w-sm mx-auto">
          Connecting to store database. Please ensure your backend service is running.
        </p>
      </div>
    )}
  </main>
</div>
  )
}

export default Home