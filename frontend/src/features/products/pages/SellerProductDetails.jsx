import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { useDispatch } from 'react-redux'
import { useProduct } from '../hooks/useProduct'
import { setProducts } from '../state/product.slice'
import { 
  Package, 
  Tag, 
  Plus, 
  Layers, 
  TrendingUp, 
  Eye, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  Copy, 
  Sliders, 
  Trash2, 
  Sparkles,
  RefreshCw,
  MoreVertical,
  Check
} from 'lucide-react'

const SellerProductDetails = () => {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const { handleGetproductById } = useProduct()

  // Component State
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('variants')
  const [copiedSku, setCopiedSku] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // New Variant Form State
  const [showAddVariant, setShowAddVariant] = useState(false)
  const [newVariant, setNewVariant] = useState({
    color: 'Onyx Black',
    size: 'M',
    sku: '',
    price: '',
    stock: 25
  })

  // Variants State
  const [variants, setVariants] = useState([
    { id: 'v1', color: 'Onyx Black', size: 'S', sku: 'WOOL-COAT-BLK-S', price: 295.00, stock: 12, status: 'In Stock' },
    { id: 'v2', color: 'Onyx Black', size: 'M', sku: 'WOOL-COAT-BLK-M', price: 295.00, stock: 28, status: 'In Stock' },
    { id: 'v3', color: 'Onyx Black', size: 'L', sku: 'WOOL-COAT-BLK-L', price: 295.00, stock: 4, status: 'Low Stock' },
    { id: 'v4', color: 'Slate Gray', size: 'M', sku: 'WOOL-COAT-GRY-M', price: 310.00, stock: 0, status: 'Out of Stock' },
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
        
        // If product has variants from backend, populate them
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

  // Helper Handlers
  const handleCopySku = (skuText) => {
    navigator.clipboard.writeText(skuText)
    setCopiedSku(true)
    setTimeout(() => setCopiedSku(false), 2000)
  }

  const handleAddVariant = (e) => {
    e.preventDefault()
    if (!newVariant.sku || !newVariant.price) return

    const created = {
      id: `v-${Date.now()}`,
      color: newVariant.color,
      size: newVariant.size,
      sku: newVariant.sku,
      price: parseFloat(newVariant.price),
      stock: parseInt(newVariant.stock) || 0,
      status: parseInt(newVariant.stock) > 5 ? 'In Stock' : parseInt(newVariant.stock) > 0 ? 'Low Stock' : 'Out of Stock'
    }

    setVariants([...variants, created])
    setShowAddVariant(false)
    setNewVariant({ color: 'Onyx Black', size: 'M', sku: '', price: '', stock: 25 })
  }

  const handleDeleteVariant = (id) => {
    setVariants(variants.filter(v => v.id !== id))
  }

  const handleSaveChanges = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  // Fallbacks for display
  const title = product?.title || product?.name || 'Architectural Wool Overcoat'
  const category = product?.category || 'Atelier Outerwear'
  const baseSku = product?.sku || `ATELIER-${productId?.slice(0, 6) || '8839'}`
  const basePrice = product?.price?.amount || product?.price || 295.00
  const mainImage = product?.images?.[0] || product?.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'
  const totalStock = variants.reduce((acc, curr) => acc + Number(curr.stock), 0)

  // Loading State View
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin stroke-[1.25]" />
          <span className="text-xs font-light tracking-[0.2em] text-slate-400 uppercase">Syncing Seller Catalog...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Top Navigation & Status Bar */}
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
                <span className="text-amber-400/90 font-medium">Product Management</span>
              </div>
              <h1 className="text-lg font-serif font-light text-slate-100 tracking-wide truncate max-w-xs sm:max-w-md">
                {title}
              </h1>
            </div>
          </div>

          {/* Action Header Controls */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-light uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Listing
            </span>

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
                isSaved
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white text-slate-950 hover:bg-slate-200'
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5 stroke-[2]" /> : <Save className="w-3.5 h-3.5 stroke-[1.5]" />}
              {isSaved ? 'Changes Saved' : 'Save Product'}
            </button>
          </div>

        </div>
      </header>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">Base Price</span>
            <div className="text-xl font-mono font-light text-slate-100">${Number(basePrice).toFixed(2)}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">Total Inventory</span>
            <div className="text-xl font-mono font-light text-slate-100 flex items-center gap-2">
              {totalStock} <span className="text-xs font-sans font-light text-slate-500">Units</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">Active Variants</span>
            <div className="text-xl font-mono font-light text-amber-300/90">{variants.length} SKU Options</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-slate-400 block mb-1">30-Day Sales</span>
            <div className="text-xl font-mono font-light text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 stroke-[1.5]" /> $4,280.00
            </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Overview & Variant Matrix (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Product Overview Card */}
            <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/40">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400/90 stroke-[1.25]" />
                  <h2 className="text-sm font-serif font-light text-slate-100 tracking-wide uppercase">General Specifications</h2>
                </div>
                <span className="text-[10px] font-mono font-light text-slate-500 uppercase tracking-widest">{baseSku}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Product Image Stage */}
                <div className="aspect-[4/5] rounded-lg bg-slate-950 border border-slate-800/60 overflow-hidden relative group">
                  <img src={mainImage} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-3 py-1.5 bg-slate-950/80 border border-white/10 rounded text-[10px] font-light uppercase tracking-widest text-slate-200">
                      Update Image
                    </button>
                  </div>
                </div>

                {/* Form Specs */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase block mb-1.5">Product Title</label>
                    <input 
                      type="text" 
                      defaultValue={title} 
                      className="w-full bg-slate-950/60 border border-slate-800/80 rounded-md px-3.5 py-2.5 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase block mb-1.5">Category</label>
                      <input 
                        type="text" 
                        defaultValue={category} 
                        className="w-full bg-slate-950/60 border border-slate-800/80 rounded-md px-3.5 py-2.5 text-xs font-light text-slate-200 focus:outline-none focus:border-amber-400/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase block mb-1.5">Base Price ($)</label>
                      <input 
                        type="number" 
                        defaultValue={basePrice} 
                        className="w-full bg-slate-950/60 border border-slate-800/80 rounded-md px-3.5 py-2.5 text-xs font-mono font-light text-slate-200 focus:outline-none focus:border-amber-400/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase block mb-1.5">Description</label>
                    <textarea 
                      rows={3} 
                      defaultValue={product?.description || 'Tailored outerwear with structured lines and heavy-gauge wool.'} 
                      className="w-full bg-slate-950/60 border border-slate-800/80 rounded-md p-3 text-xs font-light text-slate-300 leading-relaxed focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* VARIANTS MANAGEMENT SECTION */}
            <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/40">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400/90 stroke-[1.25]" />
                    <h2 className="text-sm font-serif font-light text-slate-100 tracking-wide uppercase">Product Variants</h2>
                  </div>
                  <p className="text-xs font-light text-slate-400 mt-0.5">Manage colorways, sizes, individual SKUs, and inventory thresholds.</p>
                </div>

                <button
                  onClick={() => setShowAddVariant(!showAddVariant)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-light tracking-wider uppercase transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[1.5]" /> Add Variant
                </button>
              </div>

              {/* Add Variant Form Drawer */}
              {showAddVariant && (
                <form onSubmit={handleAddVariant} className="p-4 rounded-lg bg-slate-950/80 border border-amber-400/30 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-light uppercase tracking-[0.2em] text-amber-400">Create New Stock Variant</span>
                    <button type="button" onClick={() => setShowAddVariant(false)} className="text-xs text-slate-500 hover:text-white">Cancel</button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="text-[9px] font-light text-slate-400 uppercase tracking-wider block mb-1">Color</label>
                      <input 
                        type="text" 
                        value={newVariant.color} 
                        onChange={(e) => setNewVariant({...newVariant, color: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200" 
                        placeholder="Color"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-light text-slate-400 uppercase tracking-wider block mb-1">Size</label>
                      <select 
                        value={newVariant.size} 
                        onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                      >
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-light text-slate-400 uppercase tracking-wider block mb-1">Variant SKU</label>
                      <input 
                        type="text" 
                        value={newVariant.sku} 
                        onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200" 
                        placeholder="COAT-BLK-M"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-light text-slate-400 uppercase tracking-wider block mb-1">Price ($)</label>
                      <input 
                        type="number" 
                        value={newVariant.price} 
                        onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200" 
                        placeholder="295"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-light text-slate-400 uppercase tracking-wider block mb-1">Stock</label>
                      <input 
                        type="number" 
                        value={newVariant.stock} 
                        onChange={(e) => setNewVariant({...newVariant, stock: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2 bg-amber-400/90 hover:bg-amber-300 text-slate-950 font-medium text-xs uppercase tracking-[0.15em] rounded transition-colors"
                  >
                    Confirm Variant Addition
                  </button>
                </form>
              )}

              {/* Variant Data Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-800/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/50 text-[10px] font-light uppercase tracking-[0.2em] text-slate-400">
                      <th className="py-3 px-4">Variant Options</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-xs font-light">
                    {variants.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-900/40 transition-colors group">
                        
                        {/* Option / Color & Size */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-white/20" />
                            <span className="text-slate-200">{v.color}</span>
                            <span className="text-slate-600">•</span>
                            <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50 text-[10px] font-mono text-slate-300">
                              {v.size}
                            </span>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span>{v.sku}</span>
                            <button onClick={() => handleCopySku(v.sku)} className="text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-mono text-slate-200">
                          ${Number(v.price).toFixed(2)}
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {v.stock} pcs
                        </td>

                        {/* Status Tag */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-light ${
                            v.stock > 10 ? 'text-emerald-400' : v.stock > 0 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              v.stock > 10 ? 'bg-emerald-400' : v.stock > 0 ? 'bg-amber-400' : 'bg-rose-400'
                            }`} />
                            {v.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button 
                            onClick={() => handleDeleteVariant(v.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-all"
                            title="Delete Variant"
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

          </div>


          {/* RIGHT COLUMN: Inventory & Seller Insights (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Inventory Health Card */}
            <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
                <span className="text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase">Fulfillment State</span>
                <Sliders className="w-3.5 h-3.5 text-amber-400/80 stroke-[1.25]" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-light">
                  <span className="text-slate-400">Stock Threshold Warning</span>
                  <span className="font-mono text-slate-200">5 Units</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/60">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '68%' }} />
                </div>
                <p className="text-[11px] font-light text-slate-500 leading-relaxed">
                  Automatic reorder alerts will trigger when any variant drops below 5 items.
                </p>
              </div>
            </div>

            {/* Sales Channel Insights */}
            <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
                <span className="text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase">Listing Performance</span>
                <BarChart3 className="w-3.5 h-3.5 text-amber-400/80 stroke-[1.25]" />
              </div>

              <div className="space-y-3 text-xs font-light">
                <div className="flex justify-between py-1.5 border-b border-slate-800/30">
                  <span className="text-slate-400">Conversion Rate</span>
                  <span className="font-mono text-emerald-400">3.4%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/30">
                  <span className="text-slate-400">Views (Last 7 Days)</span>
                  <span className="font-mono text-slate-200">1,240</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Return Rate</span>
                  <span className="font-mono text-slate-200">0.8%</span>
                </div>
              </div>
            </div>

            {/* Seller Tip Box */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-light uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" /> Optimization Tip
              </div>
              <p className="text-xs font-light text-slate-400 leading-relaxed">
                Products with at least 3 size options and consistent colorway variants receive <span className="text-slate-200">24% higher engagement</span> in store catalogs.
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default SellerProductDetails