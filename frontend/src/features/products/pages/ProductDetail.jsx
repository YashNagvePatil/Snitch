import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useProduct } from '../hooks/useProduct'
import { setProducts } from '../state/product.slice'
import { 
  Package, 
  Plus, 
  Layers, 
  Eye, 
  Save, 
  ArrowLeft, 
  Copy, 
  Trash2, 
  Sparkles,
  RefreshCw,
  Check,
  Zap,
  Palette,
  Ruler,
  Image as ImageIcon,
  AlertCircle,
  X,
  ShoppingBag,
  Info,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react'

const SellerProductDetails = () => {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const { handleGetproductById } = useProduct()

  // Mode Switch State: 'management' vs 'preview'
  const [activeTab, setActiveTab] = useState('management') // 'management' | 'preview'

  // Main Product Data & Loading State
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [showAddVariant, setShowAddVariant] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Single Image Input Field State (for adding up to 7 images per variant)
  const [currentImageInput, setCurrentImageInput] = useState('')

  // New Variant Form State
  const [newVariant, setNewVariant] = useState({
    voltage: '',
    colorName: '',
    colorHex: '#334155',
    size: '',
    images: [],
    sku: '',
    price: '',
    stock: 10
  })

  // Variant Matrix State
  const [variants, setVariants] = useState([
    { 
      id: 'v1', 
      voltage: '220V High-Power', 
      colorName: 'Obsidian Black', 
      colorHex: '#09090b', 
      size: null, // Will trigger Base Size fallback in preview
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=600&auto=format&fit=crop'
      ], 
      sku: 'PROD-220V-BLK', 
      price: 320.00, 
      stock: 18 
    },
    { 
      id: 'v2', 
      voltage: null, // Will trigger Base Voltage fallback
      colorName: 'Anodized Silver', 
      colorHex: '#94a3b8', 
      size: 'XL Studio', 
      images: [], // Will trigger Base Images fallback
      sku: 'PROD-SLV-XL', 
      price: null, // Will trigger Base Price fallback
      stock: 6 
    }
  ])

  // Customer Preview Interactive State
  const [selectedVoltage, setSelectedVoltage] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [activePreviewImageIdx, setActivePreviewImageIdx] = useState(0)

  // Fetch Product Details
  async function fetchProductDetails() {
    try {
      setLoading(true)
      const data = await handleGetproductById(productId)
      const fetchedProduct = data?.product || data

      if (fetchedProduct) {
        setProduct(fetchedProduct)
        dispatch(setProducts(fetchedProduct))
        if (fetchedProduct.variants?.length) {
          setVariants(fetchedProduct.variants)
        }
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProductDetails()
    }
  }, [productId])

  // Base Product Specs (Fallbacks)
  const baseTitle = product?.title || product?.name || 'Aura Modular Studio Equipment'
  const basePrice = product?.price?.amount || product?.price || 295.00
  const baseVoltage = product?.voltage || '110V Standard'
  const baseColorName = product?.colorName || 'Charcoal Grey'
  const baseColorHex = product?.colorHex || '#334155'
  const baseSize = product?.size || 'Standard Fit'
  const baseImages = product?.images?.length ? product.images : [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'
  ]

  // Add Image to Variant Builder (Max 7)
  const handleAddImage = () => {
    if (!currentImageInput.trim()) return
    if (newVariant.images.length >= 7) {
      setValidationError('Maximum limit of 7 images per variant reached.')
      return
    }
    setNewVariant(prev => ({
      ...prev,
      images: [...prev.images, currentImageInput.trim()]
    }))
    setCurrentImageInput('')
    setValidationError('')
  }

  const handleRemoveImage = (indexToRemove) => {
    setNewVariant(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }))
  }

  // Add Dynamic Variant (At least 1 attribute required)
  const handleAddDynamicVariant = (e) => {
    e.preventDefault()

    const hasVoltage = Boolean(newVariant.voltage.trim())
    const hasColor = Boolean(newVariant.colorName.trim())
    const hasSize = Boolean(newVariant.size.trim())

    if (!hasVoltage && !hasColor && !hasSize) {
      setValidationError('At least one attribute (Voltage, Color, or Size) is required to create a variant.')
      return
    }

    setValidationError('')

    const generatedSku = newVariant.sku.trim() || 
      `SKU-${(newVariant.voltage || 'GEN').slice(0, 3).toUpperCase()}-${(newVariant.colorName || 'CLR').slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`

    const createdVariant = {
      id: `v-${Date.now()}`,
      voltage: newVariant.voltage.trim() || null,
      colorName: newVariant.colorName.trim() || null,
      colorHex: newVariant.colorName.trim() ? newVariant.colorHex : null,
      size: newVariant.size.trim() || null,
      images: newVariant.images,
      sku: generatedSku,
      price: newVariant.price !== '' ? parseFloat(newVariant.price) : null,
      stock: newVariant.stock !== '' ? parseInt(newVariant.stock) : 0
    }

    setVariants([...variants, createdVariant])
    setShowAddVariant(false)
    setNewVariant({
      voltage: '',
      colorName: '',
      colorHex: '#334155',
      size: '',
      images: [],
      sku: '',
      price: '',
      stock: 10
    })
    setCurrentImageInput('')
  }

  const handleDeleteVariant = (id) => {
    setVariants(variants.filter(v => v.id !== id))
  }

  const handleSaveChanges = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  // --- CUSTOMER PREVIEW & FALLBACK RESOLUTION LOGIC ---

  // Aggregate Available Attribute Options Across Variants + Main Base Defaults
  const availableOptions = useMemo(() => {
    const voltages = new Set([baseVoltage])
    const colors = new Map([[baseColorName, baseColorHex]])
    const sizes = new Set([baseSize])

    variants.forEach(v => {
      if (v.voltage) voltages.add(v.voltage)
      if (v.colorName) colors.set(v.colorName, v.colorHex || '#334155')
      if (v.size) sizes.add(v.size)
    })

    return {
      voltages: Array.from(voltages),
      colors: Array.from(colors.entries()).map(([name, hex]) => ({ name, hex })),
      sizes: Array.from(sizes)
    }
  }, [variants, baseVoltage, baseColorName, baseColorHex, baseSize])

  // Active Variant Matching
  const activeMatchedVariant = useMemo(() => {
    return variants.find(v => {
      const matchVoltage = !selectedVoltage || v.voltage === selectedVoltage
      const matchColor = !selectedColor || v.colorName === selectedColor
      const matchSize = !selectedSize || v.size === selectedSize
      return matchVoltage && matchColor && matchSize
    }) || null
  }, [selectedVoltage, selectedColor, selectedSize, variants])

  // RESOLVED ATTRIBUTES WITH FALLBACK TO BASE PRODUCT VALUES
  const resolvedPreview = useMemo(() => {
    const voltage = (activeMatchedVariant && activeMatchedVariant.voltage)
      ? { value: activeMatchedVariant.voltage, isFallback: false }
      : { value: baseVoltage, isFallback: Boolean(selectedVoltage && selectedVoltage !== baseVoltage) || !activeMatchedVariant?.voltage }

    const color = (activeMatchedVariant && activeMatchedVariant.colorName)
      ? { name: activeMatchedVariant.colorName, hex: activeMatchedVariant.colorHex, isFallback: false }
      : { name: baseColorName, hex: baseColorHex, isFallback: Boolean(selectedColor && selectedColor !== baseColorName) || !activeMatchedVariant?.colorName }

    const size = (activeMatchedVariant && activeMatchedVariant.size)
      ? { value: activeMatchedVariant.size, isFallback: false }
      : { value: baseSize, isFallback: Boolean(selectedSize && selectedSize !== baseSize) || !activeMatchedVariant?.size }

    const price = (activeMatchedVariant && activeMatchedVariant.price !== null && activeMatchedVariant.price !== undefined)
      ? { amount: activeMatchedVariant.price, isFallback: false }
      : { amount: basePrice, isFallback: Boolean(activeMatchedVariant && activeMatchedVariant.price === null) }

    const images = (activeMatchedVariant && activeMatchedVariant.images && activeMatchedVariant.images.length > 0)
      ? { list: activeMatchedVariant.images, isFallback: false }
      : { list: baseImages, isFallback: Boolean(activeMatchedVariant && (!activeMatchedVariant.images || activeMatchedVariant.images.length === 0)) }

    const stock = activeMatchedVariant ? activeMatchedVariant.stock : 10

    return { voltage, color, size, price, images, stock }
  }, [activeMatchedVariant, selectedVoltage, selectedColor, selectedSize, baseVoltage, baseColorName, baseColorHex, baseSize, basePrice, baseImages])

  const currentHeroImage = resolvedPreview.images.list[activePreviewImageIdx] || resolvedPreview.images.list[0]
  const totalStock = variants.reduce((acc, curr) => acc + Number(curr.stock || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin stroke-[1.25]" />
          <span className="text-xs font-light tracking-[0.2em] text-slate-400 uppercase">Loading Product Details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Header Bar */}
      <header className="border-b border-slate-800/40 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              to="/seller/products" 
              className="p-2 rounded-md border border-slate-800/80 bg-slate-900/40 text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase">
                <span>Seller Studio</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400/90 font-medium">Product Details & Variants</span>
              </div>
              <h1 className="text-lg font-serif font-light text-slate-100 tracking-wide truncate max-w-xs sm:max-w-md">
                {baseTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab Switcher */}
            <div className="p-1 rounded-lg bg-slate-900 border border-slate-800 flex gap-1">
              <button
                onClick={() => setActiveTab('management')}
                className={`px-3 py-1.5 rounded-md text-xs font-light tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  activeTab === 'management' ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Variant Matrix
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md text-xs font-light tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  activeTab === 'preview' ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Storefront Preview
              </button>
            </div>

            <button
              onClick={handleSaveChanges}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-md text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 shadow-lg ${
                isSaved ? 'bg-emerald-500 text-slate-950' : 'bg-white text-slate-950 hover:bg-slate-200'
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5 stroke-[2]" /> : <Save className="w-3.5 h-3.5 stroke-[1.5]" />}
              {isSaved ? 'Saved' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Quick Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">Base Price</span>
            <div className="text-xl font-mono font-light text-slate-100">${Number(basePrice).toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">Total Stock</span>
            <div className="text-xl font-mono font-light text-slate-100">{totalStock} Units</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">Configured Variants</span>
            <div className="text-xl font-mono font-light text-amber-300/90">{variants.length} Options</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">Fallback Rules</span>
            <div className="text-xs font-light text-emerald-400 mt-1">1+ Attribute Req • Base Fallback Active</div>
          </div>
        </div>

        {/* TAB 1: SELLER VARIANT MANAGEMENT */}
        {activeTab === 'management' && (
          <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/40">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400/90 stroke-[1.25]" />
                  <h2 className="text-sm font-serif font-light text-slate-100 tracking-wide uppercase">
                    Variant Configuration
                  </h2>
                </div>
                <p className="text-xs font-light text-slate-400 mt-0.5">
                  Attach at least one attribute (Voltage, Color, or Size). Unspecified attributes default to main product values. Max 7 images per variant.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAddVariant(!showAddVariant)
                  setValidationError('')
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-light tracking-wider uppercase transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[1.5]" /> Create Variant
              </button>
            </div>

            {validationError && (
              <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs font-light">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Expanded Variant Creator Form */}
            {showAddVariant && (
              <form onSubmit={handleAddDynamicVariant} className="p-5 rounded-lg bg-slate-950/90 border border-amber-400/30 space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <span className="text-[11px] font-light uppercase tracking-[0.2em] text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Define Variant Attributes
                  </span>
                  <span className="text-[10px] font-light text-slate-500 uppercase tracking-widest">
                    * At least 1 attribute required
                  </span>
                </div>

                {/* Attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-400" /> Voltage
                    </label>
                    <input 
                      type="text" 
                      value={newVariant.voltage} 
                      onChange={(e) => setNewVariant({...newVariant, voltage: e.target.value})}
                      placeholder="e.g. 220V High-Power"
                      className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3 h-3 text-amber-400" /> Color Name & Hex
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={newVariant.colorHex} 
                        onChange={(e) => setNewVariant({...newVariant, colorHex: e.target.value})}
                        className="w-9 h-9 p-0.5 rounded bg-slate-900 border border-slate-800 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={newVariant.colorName} 
                        onChange={(e) => setNewVariant({...newVariant, colorName: e.target.value})}
                        placeholder="e.g. Obsidian Black"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Ruler className="w-3 h-3 text-amber-400" /> Size
                    </label>
                    <input 
                      type="text" 
                      value={newVariant.size} 
                      onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
                      placeholder="e.g. XL Studio"
                      className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                </div>

                {/* Images (Up to 7) */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3 text-amber-400" /> Variant Images (Optional - Max 7)
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {newVariant.images.length} / 7 Uploaded
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={currentImageInput} 
                      onChange={(e) => setCurrentImageInput(e.target.value)}
                      placeholder="Enter image URL (https://...)"
                      disabled={newVariant.images.length >= 7}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      disabled={newVariant.images.length >= 7 || !currentImageInput.trim()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-light uppercase tracking-wider rounded-md transition-all"
                    >
                      Add Image
                    </button>
                  </div>

                  {newVariant.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {newVariant.images.map((img, idx) => (
                        <div key={idx} className="relative w-14 h-16 rounded bg-slate-900 border border-slate-800 overflow-hidden group">
                          <img src={img} alt={`Variant img ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-rose-950/80 text-rose-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-0 left-0 right-0 bg-slate-950/80 text-[8px] font-mono text-center text-slate-400 py-0.5">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-900">
                  <div>
                    <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider block mb-1">
                      Price ($) <span className="text-slate-600">(Optional)</span>
                    </label>
                    <input 
                      type="number" 
                      value={newVariant.price} 
                      onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                      placeholder="Defaults to Base Price if empty"
                      className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider block mb-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      value={newVariant.stock} 
                      onChange={(e) => setNewVariant({...newVariant, stock: e.target.value})}
                      placeholder="10"
                      className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider block mb-1">SKU Code</label>
                    <input 
                      type="text" 
                      value={newVariant.sku} 
                      onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                      placeholder="Auto-generated if left empty"
                      className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-amber-400/90 hover:bg-amber-300 text-slate-950 font-medium text-xs uppercase tracking-[0.15em] rounded-md transition-colors"
                >
                  Add Variant
                </button>
              </form>
            )}

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-800/60">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/50 text-[10px] font-light uppercase tracking-[0.2em] text-slate-400">
                    <th className="py-3.5 px-4">Images (Max 7)</th>
                    <th className="py-3.5 px-4">Voltage</th>
                    <th className="py-3.5 px-4">Color</th>
                    <th className="py-3.5 px-4">Size</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs font-light">
                  {variants.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-900/40 transition-colors group">
                      <td className="py-3 px-4">
                        {v.images && v.images.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            {v.images.slice(0, 3).map((img, i) => (
                              <div key={i} className="w-8 h-10 rounded bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {v.images.length > 3 && (
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-1 rounded border border-slate-800">
                                +{v.images.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600 font-sans text-[11px] italic">Main Images Used</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        {v.voltage ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                            <Zap className="w-3 h-3" /> {v.voltage}
                          </span>
                        ) : (
                          <span className="text-slate-600 font-sans text-[11px] italic">Base ({baseVoltage})</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {v.colorName ? (
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: v.colorHex || '#334155' }} />
                            <span className="text-slate-200">{v.colorName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600 font-sans text-[11px] italic">Base ({baseColorName})</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {v.size ? (
                          <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50 font-mono text-[11px] text-slate-300">
                            {v.size}
                          </span>
                        ) : (
                          <span className="text-slate-600 font-sans text-[11px] italic">Base ({baseSize})</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {v.sku}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-100">
                        {v.price !== null && v.price !== undefined ? (
                          `$${Number(v.price).toFixed(2)}`
                        ) : (
                          <span className="text-slate-500 text-[11px] font-sans italic">Base (${Number(basePrice).toFixed(2)})</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className={v.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {v.stock} units
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => handleDeleteVariant(v.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: LIVE STOREFRONT PREVIEW WITH FALLBACKS */}
        {activeTab === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
            
            {/* Gallery Section */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden group">
                <img 
                  src={currentHeroImage} 
                  alt={baseTitle} 
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />

                {resolvedPreview.images.isFallback && (
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] uppercase font-light tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-amber-400" /> Default Base Product Gallery
                  </div>
                )}
              </div>

              {resolvedPreview.images.list.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {resolvedPreview.images.list.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePreviewImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border transition-all flex-shrink-0 ${
                        activePreviewImageIdx === idx ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selection & Fallback Display */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-amber-400 font-light mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Customer Interactive Preview
                </div>
                
                <h2 className="text-2xl font-serif font-light text-slate-100 mb-2">
                  {baseTitle}
                </h2>

                <div className="flex items-baseline gap-3 pt-2 pb-4 border-b border-slate-800/60">
                  <span className="text-3xl font-mono font-light text-slate-100">
                    ${resolvedPreview.price.amount.toFixed(2)}
                  </span>
                  
                  {resolvedPreview.price.isFallback && (
                    <span className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-light flex items-center gap-1">
                      <Info className="w-3 h-3" /> Base Price Used
                    </span>
                  )}
                </div>
              </div>

              {/* Attributes Configurator */}
              <div className="space-y-5">
                
                {/* Voltage Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-light uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Voltage
                    </span>
                    <span className="text-slate-300 font-mono text-[11px] flex items-center gap-1">
                      {resolvedPreview.voltage.value}
                      {resolvedPreview.voltage.isFallback && (
                        <span className="text-[9px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">(Base Default)</span>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableOptions.voltages.map((volt) => {
                      const isSelected = selectedVoltage === volt
                      return (
                        <button
                          key={volt}
                          onClick={() => setSelectedVoltage(isSelected ? null : volt)}
                          className={`px-3 py-1.5 rounded-md text-xs font-light transition-all border ${
                            isSelected 
                              ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-medium' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {volt}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-light uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-400" /> Color Finish
                    </span>
                    <span className="text-slate-300 font-mono text-[11px] flex items-center gap-1">
                      {resolvedPreview.color.name}
                      {resolvedPreview.color.isFallback && (
                        <span className="text-[9px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">(Base Default)</span>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {availableOptions.colors.map((clr) => {
                      const isSelected = selectedColor === clr.name
                      return (
                        <button
                          key={clr.name}
                          onClick={() => setSelectedColor(isSelected ? null : clr.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-light border transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-amber-400/10 text-slate-100'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: clr.hex }} />
                          <span>{clr.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-light uppercase tracking-wider flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-amber-400" /> Size
                    </span>
                    <span className="text-slate-300 font-mono text-[11px] flex items-center gap-1">
                      {resolvedPreview.size.value}
                      {resolvedPreview.size.isFallback && (
                        <span className="text-[9px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">(Base Default)</span>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableOptions.sizes.map((sz) => {
                      const isSelected = selectedSize === sz
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(isSelected ? null : sz)}
                          className={`px-3 py-1.5 rounded-md text-xs font-light transition-all border ${
                            isSelected 
                              ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-medium' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {sz}
                        </button>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Purchase Action Preview */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-light flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Stock Status
                  </span>
                  <span className={`font-mono text-[11px] ${resolvedPreview.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {resolvedPreview.stock > 0 ? `${resolvedPreview.stock} units available` : 'Out of Stock'}
                  </span>
                </div>

                <button
                  disabled={resolvedPreview.stock <= 0}
                  className="w-full py-3.5 bg-white hover:bg-slate-200 disabled:bg-slate-800 text-slate-950 font-medium text-xs uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Cart Preview
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  )
}

export default SellerProductDetails