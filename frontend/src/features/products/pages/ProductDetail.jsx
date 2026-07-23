import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useProduct } from '../hooks/useProduct'
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  ChevronRight, 
  Minus, 
  Plus, 
  ArrowLeft, 
  Share2,
  Sparkles,
  Info
} from 'lucide-react'

const ProductDetail = () => {
  const { productId } = useParams()
  const { handleGetproductById } = useProduct()
  const navigate = useNavigate()
  // State Management
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  async function fetchProductDetails() {
    try {
      setLoading(true)
      const data = await handleGetproductById(productId)
      setProduct(data)
    } catch (error) {
      console.error("Failed to fetch product:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProductDetails()
    }
  }, [productId])

  // Normalizing Product Data safely
  const images = product?.images?.length 
    ? product.images 
    : [product?.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop']

  const price = typeof product?.price === 'object' ? product?.price?.amount : product?.price
  const originalPrice = product?.originalPrice || (price ? (price * 1.25).toFixed(2) : null)
  const currencySymbol = product?.price?.currency === 'USD' ? '$' : (product?.price?.symbol || '$')
  const availableSizes = product?.sizes || ['XS', 'S', 'M', 'L', 'XL']
  const colors = product?.colors || [
    { name: 'Onyx Black', hex: '#09090b' },
    { name: 'Slate Gray', hex: '#334155' },
    { name: 'Raw Parchment', hex: '#e2e8f0' }
  ]

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  // Loading Skeleton View
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-7 aspect-[4/5] bg-slate-900/60 rounded-xl" />
          <div className="lg:col-span-5 space-y-6 py-4">
            <div className="h-4 bg-slate-900 rounded w-1/4" />
            <div className="h-10 bg-slate-900 rounded w-3/4" />
            <div className="h-6 bg-slate-900 rounded w-1/3" />
            <div className="h-24 bg-slate-900 rounded w-full" />
            <div className="h-12 bg-slate-900 rounded w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Not Found View
  if (!product && !loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-500">
          <Info className="w-5 h-5 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-serif font-light text-slate-200 mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6 font-light">
          The requested item couldn't be loaded or may no longer be available in our current seasonal collection.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-md transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return To Catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Top Breadcrumb Header */}
      <header className="border-b border-slate-800/40 bg-slate-950/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[11px] font-light text-slate-400 tracking-wider uppercase">
            <Link to="/" className="hover:text-slate-200 transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" /> Catalog
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-500 truncate max-w-[120px] sm:max-w-none">{product?.category || 'Collection'}</span>
            <ChevronRight className="w-3 h-3 text-slate-600 hidden sm:block" />
            <span className="text-amber-400/90 hidden sm:inline-block font-normal truncate max-w-[180px]">
              {product?.title || product?.name}
            </span>
          </nav>

          <button className="text-slate-400 hover:text-white p-2 rounded-full transition-colors">
            <Share2 className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* Main PDP Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* LEFT: Image Stage & Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[580px] scrollbar-none py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative flex-shrink-0 w-16 md:w-20 aspect-[4/5] rounded-md overflow-hidden border transition-all duration-300 ${
                      selectedImage === idx
                        ? 'border-amber-400/80 opacity-100 ring-1 ring-amber-400/30'
                        : 'border-slate-800/80 opacity-60 hover:opacity-90 hover:border-slate-700'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-[4/5] bg-slate-950 border border-slate-800/60 rounded-xl overflow-hidden group">
              <img 
                src={images[selectedImage]} 
                alt={product?.title || product?.name} 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />

              {/* Tag / Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-[10px] font-light text-amber-400 uppercase tracking-[0.2em]">
                  <Sparkles className="w-3 h-3 stroke-[1.5]" /> Handcrafted Edition
                </span>
              </div>

              {/* Wishlist Action */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
                  isWishlisted
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-400 scale-105'
                    : 'bg-slate-950/60 border-white/10 text-slate-300 hover:text-white hover:bg-slate-950/90'
                }`}
              >
                <Heart className={`w-4 h-4 stroke-[1.5] ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>


          {/* RIGHT: Product Details & Purchase Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            
            <div className="space-y-6">
              
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-[11px] font-light tracking-[0.2em] text-slate-400 uppercase">
                <span className="text-amber-400/90 font-medium">{product?.category || 'Atelier Collection'}</span>
                <span className="font-mono text-slate-500">{product?.sku || `ITEM-${productId?.slice(0, 6) || '8839'}`}</span>
              </div>

              {/* Title & Rating */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-extralight tracking-wide text-slate-50 leading-tight mb-3">
                  {product?.title || product?.name || 'Architectural Wool Overcoat'}
                </h1>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < Math.floor(product?.rating || 4.9) ? 'fill-current' : 'text-slate-700'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-light text-slate-300">{product?.rating || '4.9'}</span>
                  <span className="text-slate-600 text-xs">•</span>
                  <span className="text-xs font-light text-slate-400 underline underline-offset-4 decoration-slate-700 cursor-pointer hover:text-slate-200">
                    {product?.reviewCount || 34} Verified Reviews
                  </span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="flex items-baseline gap-4 pt-2 border-t border-slate-800/40">
                <span className="text-3xl font-mono font-light text-slate-50 tracking-tight">
                  {currencySymbol}{typeof price === 'number' ? price.toFixed(2) : price || '295.00'}
                </span>
                {originalPrice && (
                  <span className="text-sm font-mono text-slate-500 line-through">
                    {currencySymbol}{originalPrice}
                  </span>
                )}
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-light ml-auto">
                  Taxes & Duty Included
                </span>
              </div>

              {/* Short Description */}
              <p className="text-slate-300/80 text-xs sm:text-sm font-light leading-relaxed">
                {product?.description || 
                  'Engineered with structured lines and premium heavy-gauge wool. Features a relaxed drape, clean concealed closures, and signature interior tailoring.'}
              </p>

              {/* Color Selector */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-light">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Color Palette</span>
                  <span className="text-slate-200 font-normal">{colors[selectedColor]?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(idx)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full transition-all border ${
                        selectedColor === idx 
                          ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 border-white/20 scale-110' 
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-light">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Select Fit</span>
                  <button className="text-[11px] text-amber-400/80 hover:text-amber-300 underline underline-offset-2 tracking-wider">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-xs font-light rounded-md border uppercase tracking-wider transition-all ${
                        selectedSize === size
                          ? 'border-amber-400/80 bg-amber-500/10 text-amber-300 font-normal'
                          : 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="pt-4 space-y-3">
                <div className="flex gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-800 bg-slate-900/40 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-slate-400 hover:text-white transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-light text-slate-200">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-slate-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Bag CTA */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-md text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${
                      addedToCart
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-white text-slate-950 hover:bg-slate-200 hover:tracking-[0.25em]'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2]" /> Added To Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 stroke-[1.5]" /> Add To Bag
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Guarantees / Value Props */}
              <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-800/40 text-center">
                <div className="p-3 bg-slate-900/20 rounded-lg border border-slate-800/40 flex flex-col items-center">
                  <Truck className="w-4 h-4 stroke-[1.25] text-amber-400/80 mb-1.5" />
                  <span className="text-[10px] font-light uppercase tracking-wider text-slate-300">Complimentary Shipping</span>
                </div>
                <div className="p-3 bg-slate-900/20 rounded-lg border border-slate-800/40 flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 stroke-[1.25] text-amber-400/80 mb-1.5" />
                  <span className="text-[10px] font-light uppercase tracking-wider text-slate-300">Authenticity Guaranteed</span>
                </div>
                <div className="p-3 bg-slate-900/20 rounded-lg border border-slate-800/40 flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 stroke-[1.25] text-amber-400/80 mb-1.5" />
                  <span className="text-[10px] font-light uppercase tracking-wider text-slate-300">30-Day Returns</span>
                </div>
              </div>

            </div>

            {/* Accordion / Informational Tabs */}
            <div className="border-t border-slate-800/40 pt-6">
              <div className="flex border-b border-slate-800/60 mb-4 gap-6">
                {['details', 'care', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-[11px] uppercase tracking-[0.2em] font-light transition-all ${
                      activeTab === tab
                        ? 'border-b-2 border-amber-400 text-amber-300'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400 font-light leading-relaxed min-h-[60px]">
                {activeTab === 'details' && (
                  <ul className="list-disc list-inside space-y-1 text-slate-300/80">
                    <li>100% sustainably sourced Italian wool blend</li>
                    <li>Double-breasted button closure with horn buttons</li>
                    <li>Dual exterior welt pockets and interior passport pocket</li>
                  </ul>
                )}
                {activeTab === 'care' && (
                  <p>Dry clean only. Do not tumble dry. Low-heat iron with press cloth when needed.</p>
                )}
                {activeTab === 'shipping' && (
                  <p>Orders dispatched within 24 hours. Express 2-day delivery available at checkout.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}

export default ProductDetail