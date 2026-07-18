import { useState } from 'react';
import SnitchButton from '../components/Button';
import { 
  SnitchSelect, 
  SnitchSelectContent, 
  SnitchSelectItem, 
  SnitchSelectTrigger, 
  SnitchSelectValue 
} from '../components/Select';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for the current product
const PRODUCT_DATA = {
  id: 'snitch-091',
  title: 'Luxury Suede Bomber Jacket',
  category: 'PREMIUM OUTERWEAR',
  price: { amount: 189.00, currency: 'USD', symbol: '$' },
  rating: 4.8,
  reviewCount: 124,
  description: 'Crafted from ultra-soft, ethically sourced faux suede, this bomber jacket offers a modern silhouette with classic rib-knit trims. Designed with a slim profile, premium matte black hardware, and an internal hidden pocket for seamless everyday utility.',
  details: [
    { title: 'Materials & Care', content: 'Shell: 100% Polyester Faux Suede. Lining: 100% Satin Satin-weave. Dry clean only. Iron on low heat if necessary.' },
    { title: 'Shipping & Returns', content: 'Complimentary express shipping on orders over $150. Easy 30-day returns and exchanges. Pre-paid return labels provided.' },
    { title: 'Fit & Sizing', content: 'Slim fit. True to size. Model is 6\'1" wearing a size Medium. If you prefer a relaxed or oversized fit, we recommend sizing up.' }
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  images: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop', // Substitute with your actual product asset URLs
    'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=800&auto=format&fit=crop'
  ]
};

// Mock data for the recommendations carousel
const RELATED_PRODUCTS = [
  { id: '1', title: 'Modular Cargo Pants', price: '$89', img: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=500&auto=format&fit=crop' },
  { id: '2', title: 'Heavyweight Pima Tee', price: '$45', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500&auto=format&fit=crop' },
  { id: '3', title: 'Cuban Link Silver Chain', price: '$65', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop' },
  { id: '4', title: 'Minimalist Leather Boots', price: '$210', img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=500&auto=format&fit=crop' }
];

const  ProductViewPage = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openDetailIndex, setOpenDetailIndex] = useState(null);

  const toggleDetail = (index) => {
    setOpenDetailIndex(openDetailIndex === index ? null : index);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size before adding to cart');
      return;
    }
    toast.success(`Added ${PRODUCT_DATA.title} (Size ${selectedSize}) to your bag!`);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist', {
      icon: <Heart className={`w-4 h-4 ${!isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Universal Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/snitch-logo_8905b12e.png" alt="Snitch" className="w-8 h-8" />
            <span className="text-xl font-semibold tracking-tight">Snitch</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Home</a>
            <a href="/product/new" className="text-sm text-slate-400 hover:text-white transition-colors">Create Product</a>
            <button className="relative p-1 text-slate-300 hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">2</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Interactive Display */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-slate-800/80 group">
              <img 
                src={PRODUCT_DATA.images[activeImageIndex]} 
                alt={`${PRODUCT_DATA.title} showcase view`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Product link copied to clipboard');
                }}
                className="absolute top-4 right-4 p-2 bg-slate-950/60 hover:bg-slate-950 backdrop-blur-md border border-slate-800 rounded-full transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* Thumbnail Navigation Row */}
            <div className="grid grid-cols-4 gap-3">
              {PRODUCT_DATA.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-[4/5] rounded-lg overflow-hidden bg-slate-900 border-2 transition-all duration-200 ${
                    activeImageIndex === idx ? 'border-amber-500 scale-[0.98]' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail view" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 lg:pl-4 space-y-8">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-500/90 uppercase">{PRODUCT_DATA.category}</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-1 mb-3">{PRODUCT_DATA.title}</h1>
              
              {/* Ratings & Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(PRODUCT_DATA.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-300">{PRODUCT_DATA.rating}</span>
                <span className="text-sm text-slate-500">|</span>
                <button className="text-sm text-slate-400 hover:text-amber-500 underline transition-colors">
                  {PRODUCT_DATA.reviewCount} Verified Reviews
                </button>
              </div>
            </div>

            {/* Price Segment */}
            <div className="border-y border-slate-800/60 py-4 flex items-center justify-between">
              <span className="text-3xl font-mono font-semibold tracking-tight text-white">
                {PRODUCT_DATA.price.symbol}{PRODUCT_DATA.price.amount.toFixed(2)}
              </span>
              <span className="text-xs bg-slate-800 border border-slate-700 px-2.5 py-1 rounded text-slate-400 font-mono">
                In stock & ready to ship
              </span>
            </div>

            {/* Description Summary */}
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              {PRODUCT_DATA.description}
            </p>

            {/* Sizes Box */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-200">Select Size</span>
                <button className="text-xs text-slate-400 hover:text-white underline transition-colors">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {PRODUCT_DATA.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 border text-sm font-medium rounded-md transition-all flex items-center justify-center ${
                      selectedSize === size
                        ? 'border-amber-500 bg-amber-500 text-slate-950 font-bold scale-[0.97]'
                        : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Actions */}
            <div className="flex gap-4 pt-2">
              <div className="flex-1">
                <SnitchButton 
                  onClick={handleAddToCart}
                  className="w-full h-14 bg-white text-slate-950 hover:bg-slate-200 font-semibold text-base transition-transform active:scale-[0.99]"
                >
                  <ShoppingBag className="w-5 h-5 mr-2 inline" /> Add To Bag
                </SnitchButton>
              </div>
              <button
                type="button"
                onClick={toggleWishlist}
                className={`w-14 h-14 border rounded-xl flex items-center justify-center transition-all ${
                  isWishlisted 
                    ? 'border-rose-500 bg-rose-950/20 text-rose-500 scale-[0.97]' 
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Brand Core Promises */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900/40 border border-slate-900 rounded-xl p-4 text-center">
              <div className="space-y-1">
                <Truck className="w-5 h-5 mx-auto text-amber-500/80" />
                <p className="text-[11px] font-medium text-slate-300">Free Delivery</p>
              </div>
              <div className="space-y-1 border-x border-slate-800/80">
                <RotateCcw className="w-5 h-5 mx-auto text-amber-500/80" />
                <p className="text-[11px] font-medium text-slate-300">30-Day Return</p>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 mx-auto text-amber-500/80" />
                <p className="text-[11px] font-medium text-slate-300">100% Authentic</p>
              </div>
            </div>

            {/* Custom Interactive Accordion Drops */}
            <div className="border-t border-slate-800/60 divide-y divide-slate-800/60">
              {PRODUCT_DATA.details.map((detail, index) => (
                <div key={index} className="py-4">
                  <button
                    type="button"
                    onClick={() => toggleDetail(index)}
                    className="w-full flex justify-between items-center text-left text-sm font-medium text-slate-200 hover:text-white transition-colors group"
                  >
                    <span>{detail.title}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${openDetailIndex === index ? 'rotate-90 text-amber-500' : 'group-hover:text-slate-300'}`} />
                  </button>
                  <div className={`mt-2 text-xs leading-relaxed text-slate-400 transition-all duration-300 overflow-hidden ${openDetailIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <p className="pb-2">{detail.content}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Section: Related Items Loop */}
        <section className="mt-20 sm:mt-28 border-t border-slate-800/40 pt-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Curated For You</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1">Complete The Look</h2>
            </div>
            <a href="/shop" className="text-sm text-amber-500 hover:text-amber-400 font-medium transition-colors">View collection →</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {RELATED_PRODUCTS.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-900 border border-slate-800/60 relative mb-3">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-slate-950/80 backdrop-blur-sm p-2 rounded-md block text-slate-300 hover:text-white">
                      <ShoppingBag className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">{item.title}</h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">{item.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

 export default ProductViewPage