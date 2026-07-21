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

const Home = () => {
  const products = useSelector(state => state.product.products)
  const { handleGetAllProduct} = useProduct()

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      
      {/* Hero Banner Section */}
      <section className="relative border-b border-slate-800/60 overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" /> New Season Collection
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight mb-4">
              Elevated Essentials <br />
              <span className="text-slate-400 font-sans text-3xl sm:text-5xl font-light">For the Modern Wardrobe</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
              Discover our signature silhouettes crafted with ultra-premium fabrics, clean lines, and dark luxury aesthetic.
            </p>
            <a href="#catalog" className="inline-flex items-center gap-2 bg-white text-slate-950 px-6 py-3.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-transform active:scale-[0.98]">
              Explore Collection <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800/60">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">Curated Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1">Featured Products</h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-semibold'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-700'
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
                  key={productId} 
                  className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden group hover:border-slate-700 transition-all duration-300 flex flex-col"
                >
                  {/* Image Stage */}
                  <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
                    <img 
                      src={imageSrc} 
                      alt={product.title || product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Category Badge */}
                    {product.category && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                          {product.category}
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(productId)}
                      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all ${
                        isWishlisted
                          ? 'bg-rose-950/80 border-rose-500/50 text-rose-500 scale-105'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Hover Action Bar */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <button className="flex-1 bg-white text-slate-950 font-semibold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors shadow-lg">
                        <ShoppingBag className="w-3.5 h-3.5" /> Add To Bag
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-medium text-slate-300">{product.rating || '4.8'}</span>
                          <span className="text-slate-600">({product.reviewCount || 18})</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase text-slate-500">{product.sku || 'SNITCH'}</span>
                      </div>

                      <h3 className="font-medium text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-1 text-base">
                        {product.title || product.name || 'Untitled Product'}
                      </h3>

                      {product.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-lg font-mono font-bold text-white">
                        {currencySymbol}{typeof price === 'number' ? price.toFixed(2) : price || '0.00'}
                      </span>
                      <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-1 font-medium">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty / Loading State */
          <div className="text-center py-20 border border-slate-800/60 bg-slate-900/20 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
              <SlidersHorizontal className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-slate-300">Loading Products...</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Connecting to store database. Please ensure your backend is active.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home