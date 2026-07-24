import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
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
  X
} from 'lucide-react'

const SellerProductDetails = () => {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const { handleGetproductById ,handleAddProductVariant} = useProduct()

  // Main Component State
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiedSku, setCopiedSku] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showAddVariant, setShowAddVariant] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Single Image Input Field State (for adding up to 7 images)
  const [currentImageInput, setCurrentImageInput] = useState('')

  // Dynamic Multi-Attribute Variant Form State
  const [newVariant, setNewVariant] = useState({
    voltage: '',
    colorName: '',
    colorHex: '#334155',
    size: '',
    images: [], // Holds up to 7 image URLs
    sku: '',
    price: '',
    stock: 10
  })

  // Initial Variant Matrix State
  const [variants, setVariants] = useState([
    { 
      id: 'v1', 
      voltage: '220V', 
      colorName: 'Onyx Black', 
      colorHex: '#09090b', 
      size: 'Standard', 
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=300&auto=format&fit=crop'
      ], 
      sku: 'PROD-220V-BLK-STD', 
      price: 295.00, 
      stock: 18 
    }
  ])




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

  // Add Image to current Variant (Max 7)
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

  // Remove individual image from variant builder
  const handleRemoveImage = (indexToRemove) => {
    setNewVariant(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }))
  }

  // Add Dynamic Variant with Validations
  const handleAddDynamicVariant = async (e) => {
    e.preventDefault()

    // Business Logic Rule: At least ONE attribute (Voltage, Color, or Size) is required
    const hasVoltage = Boolean(newVariant.voltage.trim())
    const hasColor = Boolean(newVariant.colorName.trim())
    const hasSize = Boolean(newVariant.size.trim())

    if (!hasVoltage && !hasColor && !hasSize) {
      setValidationError('At least one attribute (Voltage, Color, or Size) is required to create a variant.')
      return
    }

    setValidationError('')

    // Generate fallback SKU if empty
    const generatedSku = newVariant.sku.trim() || 
      `SKU-${(newVariant.voltage || 'GEN').toUpperCase()}-${(newVariant.colorName || 'CLR').slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`

    const createdVariant = {
      id: `v-${Date.now()}`,
      voltage: newVariant.voltage.trim() || null,
      colorName: newVariant.colorName.trim() || null,
      colorHex: newVariant.colorName.trim() ? newVariant.colorHex : null,
      size: newVariant.size.trim() || null,
      images: newVariant.images, // Up to 7 images
      sku: generatedSku,
      price: newVariant.price !== '' ? parseFloat(newVariant.price) : null, // Price is optional
      stock: newVariant.stock !== '' ? parseInt(newVariant.stock) : 0
    }

    setVariants([...variants, createdVariant])
    setShowAddVariant(false)

    // Reset Form State
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

     await handleAddDynamicVariant(productId,variantToSave)
  }

  const handleDeleteVariant = (id) => {
    setVariants(variants.filter(v => v.id !== id))
  }

  const handleCopySku = (skuText) => {
    navigator.clipboard.writeText(skuText)
    setCopiedSku(true)
    setTimeout(() => setCopiedSku(false), 2000)
  }

  const handleSaveChanges = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  // Display Fallbacks
  const title = product?.title || product?.name || 'Architectural Wool Overcoat'
  const basePrice = product?.price?.amount || product?.price || 295.00
  const mainImage = product?.images?.[0] || product?.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'
  const totalStock = variants.reduce((acc, curr) => acc + Number(curr.stock || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin stroke-[1.25]" />
          <span className="text-xs font-light tracking-[0.2em] text-slate-400 uppercase">Loading Seller Catalog...</span>
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
              className="p-2 rounded-md border border-slate-800/80 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase">
                <span>Seller Studio</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400/90 font-medium">Dynamic Variant Studio</span>
              </div>
              <h1 className="text-lg font-serif font-light text-slate-100 tracking-wide truncate max-w-xs sm:max-w-md">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href={`/product/${productId}`} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-800/80 bg-slate-900/40 text-slate-300 hover:text-white text-xs font-light tracking-wider uppercase transition-all"
            >
              <Eye className="w-3.5 h-3.5 stroke-[1.5]" /> Store Preview
            </a>

            <button
              onClick={handleSaveChanges}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-md text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 shadow-lg ${
                isSaved ? 'bg-emerald-500 text-slate-950' : 'bg-white text-slate-950 hover:bg-slate-200'
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5 stroke-[2]" /> : <Save className="w-3.5 h-3.5 stroke-[1.5]" />}
              {isSaved ? 'Changes Saved' : 'Save Variants'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Quick Stats */}
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
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">Active Variants</span>
            <div className="text-xl font-mono font-light text-amber-300/90">{variants.length} Options</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">Rules Applied</span>
            <div className="text-xs font-light text-emerald-400 mt-1">1+ Attribute Req • Max 7 Img/Variant</div>
          </div>
        </div>

        {/* Dynamic Variants Matrix & Custom Builder */}
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
                Attach at least one attribute (Voltage, Color, or Size). Images (up to 7) & Price are optional.
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

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs font-light">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Expanded Dynamic Variant Creator Form */}
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

              {/* 1. Core Attributes (At least 1 required) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Voltage Option */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400" /> Voltage
                  </label>
                  <input 
                    type="text" 
                    value={newVariant.voltage} 
                    onChange={(e) => setNewVariant({...newVariant, voltage: e.target.value})}
                    placeholder="e.g. 110V, 220V, 12V"
                    className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {/* Color Swatch & Name */}
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
                      placeholder="e.g. Onyx Black"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                </div>

                {/* Size / Fit Option */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Ruler className="w-3 h-3 text-amber-400" /> Size
                  </label>
                  <input 
                    type="text" 
                    value={newVariant.size} 
                    onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
                    placeholder="e.g. S, M, L, XL, Standard"
                    className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

              </div>


              {/* 2. Multi-Image Section (Up to 7 Images - Optional) */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3 text-amber-400" /> Variant Images (Optional)
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {newVariant.images.length} / 7 Uploaded
                  </span>
                </div>

                {/* Input row to append images */}
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

                {/* Image Previews Thumbnails Grid (Up to 7) */}
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


              {/* 3. Pricing, Stock & SKU (Optional Price) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-900">
                <div>
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider block mb-1">
                    Variant Price ($) <span className="text-slate-600">(Optional)</span>
                  </label>
                  <input 
                    type="number" 
                    value={newVariant.price} 
                    onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                    placeholder="Defaults to base price if empty"
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
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider block mb-1">Custom SKU Code</label>
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
                Add Variant To Matrix
              </button>
            </form>
          )}

          {/* Dynamic Variant Matrix Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-800/60">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/50 text-[10px] font-light uppercase tracking-[0.2em] text-slate-400">
                  <th className="py-3.5 px-4">Variant Images (Max 7)</th>
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
                    
                    {/* Multi-Image Gallery Column */}
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
                        <div className="w-8 h-10 rounded bg-slate-950/50 border border-slate-800/50 flex items-center justify-center text-slate-600">
                          <ImageIcon className="w-3.5 h-3.5 stroke-[1]" />
                        </div>
                      )}
                    </td>

                    {/* Voltage */}
                    <td className="py-3 px-4 font-mono">
                      {v.voltage ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                          <Zap className="w-3 h-3" /> {v.voltage}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-sans text-[11px]">—</span>
                      )}
                    </td>

                    {/* Color Swatch & Name */}
                    <td className="py-3 px-4">
                      {v.colorName ? (
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full border border-white/20" 
                            style={{ backgroundColor: v.colorHex || '#334155' }} 
                          />
                          <span className="text-slate-200">{v.colorName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 font-sans text-[11px]">—</span>
                      )}
                    </td>

                    {/* Size */}
                    <td className="py-3 px-4">
                      {v.size ? (
                        <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50 font-mono text-[11px] text-slate-300">
                          {v.size}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-sans text-[11px]">—</span>
                      )}
                    </td>

                    {/* SKU Code */}
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span>{v.sku}</span>
                        <button 
                          onClick={() => handleCopySku(v.sku)} 
                          className="text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Price (Optional Display) */}
                    <td className="py-3 px-4 font-mono text-slate-100">
                      {v.price !== null && v.price !== undefined ? (
                        `$${Number(v.price).toFixed(2)}`
                      ) : (
                        <span className="text-slate-500 text-[11px] font-sans">Base Price</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 font-mono">
                      <span className={v.stock > 10 ? 'text-emerald-400' : v.stock > 0 ? 'text-amber-400' : 'text-rose-400'}>
                        {v.stock} units
                      </span>
                    </td>

                    {/* Delete Action */}
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleDeleteVariant(v.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-all"
                        title="Remove Variant"
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

      </main>

    </div>
  )
}

export default SellerProductDetails