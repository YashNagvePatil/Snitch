import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useProduct } from '../hooks/useProduct'
import { setProducts } from '../state/product.slice'
import { 
  Package, 
  Plus, 
  Layers, 
  TrendingUp, 
  Eye, 
  Save, 
  ArrowLeft, 
  Copy, 
  Sliders, 
  Trash2, 
  Sparkles,
  RefreshCw,
  Check,
  Zap,
  Palette,
  Ruler,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react'

const SellerProductDetails = () => {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const { handleGetproductById } = useProduct()

  // Component State
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiedSku, setCopiedSku] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showAddVariant, setShowAddVariant] = useState(false)

  // Dynamic Multi-Attribute Variant Form State
  const [newVariant, setNewVariant] = useState({
    voltage: '220V',
    colorName: 'Onyx Black',
    colorHex: '#09090b',
    size: 'Standard',
    imageUrl: '',
    sku: '',
    price: '',
    stock: 15
  })

  // Dynamic Variants Matrix
  const [variants, setVariants] = useState([
    { 
      id: 'v1', 
      voltage: '220V', 
      colorName: 'Onyx Black', 
      colorHex: '#09090b', 
      size: 'Standard', 
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=300&auto=format&fit=crop', 
      sku: 'PROD-220V-BLK-STD', 
      price: 295.00, 
      stock: 18 
    },
    { 
      id: 'v2', 
      voltage: '110V', 
      colorName: 'Slate Gray', 
      colorHex: '#334155', 
      size: 'Compact', 
      imageUrl: 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=300&auto=format&fit=crop', 
      sku: 'PROD-110V-GRY-CMP', 
      price: 280.00, 
      stock: 6 
    },
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

  // Handlers
  const handleCopySku = (skuText) => {
    navigator.clipboard.writeText(skuText)
    setCopiedSku(true)
    setTimeout(() => setCopiedSku(false), 2000)
  }

  const handleAddDynamicVariant = (e) => {
    e.preventDefault()
    if (!newVariant.price) return

    // Auto-generate fallback SKU if left empty
    const generatedSku = newVariant.sku || 
      `SKU-${newVariant.voltage}-${newVariant.colorName.slice(0, 3).toUpperCase()}-${newVariant.size.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`

    const createdVariant = {
      id: `v-${Date.now()}`,
      voltage: newVariant.voltage || 'N/A',
      colorName: newVariant.colorName || 'Default',
      colorHex: newVariant.colorHex || '#334155',
      size: newVariant.size || 'Standard',
      imageUrl: newVariant.imageUrl || mainImage,
      sku: generatedSku,
      price: parseFloat(newVariant.price),
      stock: parseInt(newVariant.stock) || 0
    }

    setVariants([...variants, createdVariant])
    setShowAddVariant(false)

    // Reset Form
    setNewVariant({
      voltage: '220V',
      colorName: 'Onyx Black',
      colorHex: '#09090b',
      size: 'Standard',
      imageUrl: '',
      sku: '',
      price: '',
      stock: 15
    })
  }

  const handleDeleteVariant = (id) => {
    setVariants(variants.filter(v => v.id !== id))
  }

  const handleSaveChanges = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  // Display Fallbacks
  const title = product?.title || product?.name || 'Architectural Wool Overcoat'
  const category = product?.category || 'Atelier Outerwear'
  const baseSku = product?.sku || `ATELIER-${productId?.slice(0, 6) || '8839'}`
  const basePrice = product?.price?.amount || product?.price || 295.00
  const mainImage = product?.images?.[0] || product?.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'
  const totalStock = variants.reduce((acc, curr) => acc + Number(curr.stock), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin stroke-[1.25]" />
          <span className="text-xs font-light tracking-[0.2em] text-slate-400 uppercase">Syncing Seller Studio...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Navigation Bar */}
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
                <span className="text-amber-400/90 font-medium">Dynamic Variant Manager</span>
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
        
        {/* Quick KPI Stats */}
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
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">30-Day Revenue</span>
            <div className="text-xl font-mono font-light text-emerald-400">$4,280.00</div>
          </div>
        </div>

        {/* Dynamic Variants Matrix & Custom Builder */}
        <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/40">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400/90 stroke-[1.25]" />
                <h2 className="text-sm font-serif font-light text-slate-100 tracking-wide uppercase">
                  Dynamic Variant Builder
                </h2>
              </div>
              <p className="text-xs font-light text-slate-400 mt-0.5">
                Configure Voltage, Color swatches, Image URLs, Sizes, Price & Stock dynamically per option.
              </p>
            </div>

            <button
              onClick={() => setShowAddVariant(!showAddVariant)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-light tracking-wider uppercase transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[1.5]" /> Create Custom Variant
            </button>
          </div>

          {/* Expanded Dynamic Variant Creator Form */}
          {showAddVariant && (
            <form onSubmit={handleAddDynamicVariant} className="p-5 rounded-lg bg-slate-950/90 border border-amber-400/30 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <span className="text-[11px] font-light uppercase tracking-[0.2em] text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Define Variant Attributes
                </span>
                <button type="button" onClick={() => setShowAddVariant(false)} className="text-xs font-light text-slate-500 hover:text-white">
                  Cancel
                </button>
              </div>

              {/* Dynamic Attribute Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Voltage Selection / Custom Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400" /> Voltage Option
                  </label>
                  <input 
                    type="text" 
                    value={newVariant.voltage} 
                    onChange={(e) => setNewVariant({...newVariant, voltage: e.target.value})}
                    placeholder="e.g. 110V, 220V, 12V, Universal"
                    className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {/* 2. Color (Name & Hex Swatch) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3 h-3 text-amber-400" /> Color Name & Swatch
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
                      placeholder="Color Name (e.g. Midnight Blue)"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                </div>

                {/* 3. Size Option */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Ruler className="w-3 h-3 text-amber-400" /> Size / Dimensions
                  </label>
                  <input 
                    type="text" 
                    value={newVariant.size} 
                    onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
                    placeholder="e.g. S, M, L, 42mm, Standard"
                    className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {/* 4. Variant Specific Image URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3 text-amber-400" /> Variant Image URL
                  </label>
                  <input 
                    type="url" 
                    value={newVariant.imageUrl} 
                    onChange={(e) => setNewVariant({...newVariant, imageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

              </div>

              {/* Price, Stock & SKU Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-900">
                <div>
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider block mb-1">Variant Price ($)</label>
                  <input 
                    type="number" 
                    value={newVariant.price} 
                    onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                    placeholder="295.00"
                    className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider block mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    value={newVariant.stock} 
                    onChange={(e) => setNewVariant({...newVariant, stock: e.target.value})}
                    placeholder="15"
                    className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono font-light text-slate-200 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-light text-slate-400 uppercase tracking-wider block mb-1">Custom SKU (Optional)</label>
                  <input 
                    type="text" 
                    value={newVariant.sku} 
                    onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                    placeholder="Auto-generated if blank"
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
                  <th className="py-3.5 px-4">Variant Image</th>
                  <th className="py-3.5 px-4">Voltage</th>
                  <th className="py-3.5 px-4">Colorway</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">SKU Code</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Inventory</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs font-light">
                {variants.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-900/40 transition-colors group">
                    
                    {/* Image Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-10 h-12 rounded bg-slate-950 border border-slate-800 overflow-hidden">
                        <img 
                          src={v.imageUrl || mainImage} 
                          alt={v.colorName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Voltage Badge */}
                    <td className="py-3 px-4 font-mono text-slate-200">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                        <Zap className="w-3 h-3" /> {v.voltage}
                      </span>
                    </td>

                    {/* Color Swatch & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full border border-white/20" 
                          style={{ backgroundColor: v.colorHex }} 
                        />
                        <span className="text-slate-200">{v.colorName}</span>
                      </div>
                    </td>

                    {/* Size Pill */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50 font-mono text-[11px] text-slate-300">
                        {v.size}
                      </span>
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

                    {/* Price */}
                    <td className="py-3 px-4 font-mono text-slate-100">
                      ${Number(v.price).toFixed(2)}
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

export default SellerProductDetails;