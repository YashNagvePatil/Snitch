import { useState } from 'react';
import SnitchButton from '../components/Button';
import SnitchInput from '../components/Input';
import { 
  SnitchSelect, 
  SnitchSelectContent, 
  SnitchSelectItem, 
  SnitchSelectTrigger, 
  SnitchSelectValue 
} from '../components/Select';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

// Mock Initial Products Data matching the brand vibe
const INITIAL_PRODUCTS = [
  { id: 'snitch-091', title: 'Luxury Suede Bomber Jacket', sku: 'JKT-SUE-001', stock: 14, price: 189.00, sales: 48, status: 'active', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200&auto=format&fit=crop' },
  { id: 'snitch-042', title: 'Modular Cargo Pants', sku: 'PNT-CRG-004', stock: 3, price: 89.00, sales: 112, status: 'low_stock', image: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=200&auto=format&fit=crop' },
  { id: 'snitch-018', title: 'Heavyweight Pima Tee', sku: 'TEE-PIM-012', stock: 85, price: 45.00, sales: 340, status: 'active', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200&auto=format&fit=crop' },
  { id: 'snitch-077', title: 'Cuban Link Silver Chain', sku: 'ACC-SLV-007', stock: 0, price: 65.00, sales: 89, status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop' },
  { id: 'snitch-005', title: 'Minimalist Leather Boots', sku: 'BTS-LTH-002', stock: 8, price: 210.00, sales: 24, status: 'active', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=200&auto=format&fit=crop' }
];

export default function SellerDashboard() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Interactive Action Handlers
  const handleDeleteProduct = (id, title) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    toast.success(`"${title}" has been permanently removed.`);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  // Filter Pipeline
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'active') return matchesSearch && product.stock > 5;
    if (statusFilter === 'low_stock') return matchesSearch && product.stock <= 5 && product.stock > 0;
    if (statusFilter === 'out_of_stock') return matchesSearch && product.stock === 0;
    
    return matchesSearch;
  });

  // Calculate high-level performance insights dynamically
  const totalRevenue = products.reduce((acc, curr) => acc + (curr.price * curr.sales), 0);
  const totalSalesCount = products.reduce((acc, curr) => acc + curr.sales, 0);
  const totalItemsCount = products.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/snitch-logo_8905b12e.png" alt="Snitch" className="w-8 h-8" />
            <span className="text-xl font-semibold tracking-tight">Snitch <span className="text-xs text-amber-500 font-mono tracking-normal ml-1">Studio</span></span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="/dashboard" className="text-sm text-white font-medium">Dashboard</a>
            <a href="/product/new" className="text-sm text-slate-400 hover:text-white transition-colors">Create Product</a>
            <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Storefront</a>
          </nav>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Dashboard Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight mb-2">Inventory Console</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Monitor catalog volumes, stock threshold levels, and aggregate collection sales metrics.
            </p>
          </div>
          <div>
            <a href="/product/new">
              <SnitchButton className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-200">
                <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" /> Add Product
              </SnitchButton>
            </a>
          </div>
        </div>

        {/* Core KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Revenue Metric */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-amber-500">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">Gross Revenue</p>
            <h3 className="text-3xl font-mono font-bold mt-4 tracking-tight">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span className="text-emerald-500 font-medium">↑ 12.4%</span> vs baseline track
            </p>
          </div>

          {/* Unit Volume Sales Metric */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-amber-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">Units Dispatched</p>
            <h3 className="text-3xl font-mono font-bold mt-4 tracking-tight">{totalSalesCount} units</h3>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              Based on global lifecycle orders
            </p>
          </div>

          {/* Active Listings Metric */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
            <div className="absolute right-4 top-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-amber-500">
              <Layers className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">Live Products</p>
            <h3 className="text-3xl font-mono font-bold mt-4 tracking-tight">{totalItemsCount} Catalogued</h3>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              {products.filter(p => p.stock === 0).length} marked out of stock
            </p>
          </div>
        </div>

        {/* Live Filter Controls Bar */}
        <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-4 sm:p-6 mb-8 flex flex-col md:flex-row gap-6 items-end justify-between">
          <div className="w-full md:flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            {/* Live Text Query Filter */}
            <div className="sm:col-span-2 relative">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Search Products</label>
              <div className="relative">
                <Search className="absolute left-0 top-3 w-4 h-4 text-slate-600" />
                <SnitchInput 
                  placeholder="Filter by title or item SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-6 py-1.5 text-base"
                />
              </div>
            </div>

            {/* Custom Interactive Select Filter Dropdown */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Status Filter</label>
              <SnitchSelect value={statusFilter} onValueChange={handleStatusChange}>
                <SnitchSelectTrigger className="py-2">
                  <SnitchSelectValue />
                </SnitchSelectTrigger>
                <SnitchSelectContent>
                  <SnitchSelectItem value="all">All Statuses</SnitchSelectItem>
                  <SnitchSelectItem value="active">In Stock</SnitchSelectItem>
                  <SnitchSelectItem value="low_stock">Low Inventory</SnitchSelectItem>
                  <SnitchSelectItem value="out_of_stock">Archived / Out</SnitchSelectItem>
                </SnitchSelectContent>
              </SnitchSelect>
            </div>
          </div>
        </div>

        {/* Primary Data Grid Showcase Table */}
        <div className="border border-slate-800/80 bg-slate-950/40 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 text-[11px] uppercase tracking-widest font-semibold select-none">
                  <th className="py-4 px-6">Product Core Details</th>
                  <th className="py-4 px-6">SKU Identifier</th>
                  <th className="py-4 px-6">Inventory Volume</th>
                  <th className="py-4 px-6">Base Price</th>
                  <th className="py-4 px-6">Sales Made</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-900/20 group transition-colors">
                      {/* Title & Image Composite Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-14 rounded bg-slate-900 overflow-hidden border border-slate-800 shrink-0">
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="truncate max-w-xs sm:max-w-sm">
                            <p className="font-medium text-slate-200 group-hover:text-white transition-colors truncate">{product.title}</p>
                            <span className="text-[10px] font-mono text-slate-500">ID: {product.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* SKU Identification Column */}
                      <td className="py-4 px-6 font-mono text-slate-400 text-xs">
                        {product.sku}
                      </td>

                      {/* Interactive Stock Status Indicator Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {product.stock === 0 ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Out of Stock
                            </span>
                          ) : product.stock <= 5 ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Low Stock ({product.stock})
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {product.stock} Available
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Monospaced Pricing Column */}
                      <td className="py-4 px-6 font-mono font-medium text-slate-200">
                        ${product.price.toFixed(2)}
                      </td>

                      {/* Units Sold Accumulator Column */}
                      <td className="py-4 px-6 font-mono text-slate-400">
                        {product.sales}
                      </td>

                      {/* Actions Cluster Trigger Panel */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => toast(`Navigating to view mode for ${product.title}...`)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-md transition-all"
                            title="View Public Storefront Page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => toast(`Opening workspace editing module for SKU ${product.sku}...`)}
                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-900 rounded-md transition-all"
                            title="Edit Core Configuration"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id, product.title)}
                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-900 rounded-md transition-all"
                            title="Purge From Catalog Inventory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-16 px-6 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <AlertCircle className="w-6 h-6 mx-auto text-slate-600" />
                        <p className="text-sm font-medium text-slate-400">No products match your parameters</p>
                        <p className="text-xs text-slate-600">Try adjusting your keyword keywords or checking alternative toggle states.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Bottom Ledger Bar */}
          <div className="bg-slate-900/20 border-t border-slate-800 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredProducts.length} of {products.length} registered item variations</span>
            <span>Console Sync: Real-Time Active</span>
          </div>
        </div>

      </main>
    </div>
  );
}