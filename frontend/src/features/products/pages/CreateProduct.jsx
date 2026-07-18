
import { useState, useRef } from 'react';
import SnitchButton from '../components/Button';
import SnitchInput from '../components/Input';
import SnitchLabel from '../components/Label';
import SnitchTextarea from '../components/TextArea';
import { 
  SnitchSelect, 
  SnitchSelectContent, 
  SnitchSelectItem, 
  SnitchSelectTrigger, 
  SnitchSelectValue 
} from '../components/Select';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useProduct } from '../hooks/useProduct';



export default function ProductPage() {

  const {handelCreateProduct} = useProduct()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'USD',
  });

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCurrencyChange = (value) => {
    setFormData(prev => ({
      ...prev,
      priceCurrency: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        continue;
      }

      if (images.length + newImages.length >= 7) {
        toast.error('Maximum 7 images allowed');
        break;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result;
        setImages(prev => [...prev, {
          id: `${Date.now()}-${i}`,
          file,
          preview,
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!formData.title.trim()) {
      toast.error('Product title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return;
    }

    if (!formData.priceAmount || parseFloat(formData.priceAmount) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    if (images.length === 0) {
      toast.error('At least one product image is required');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const productData = {
        title: formData.title,
        description: formData.description,
        price: {
          amount: parseFloat(formData.priceAmount),
          currency: formData.priceCurrency,
        },
        images: images.map(img => ({
          id: img.id,
          name: img.file.name,
          size: img.file.size,
        })),
      };

      console.log('Product created:', productData);
      toast.success('Product created successfully!');

      await handelCreateProduct(productData)
      setFormData({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'USD',
      });
      setImages([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    

    } catch (error) {
      toast.error('Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header with logo */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/manus-storage/snitch-logo_8905b12e.png"
              alt="Snitch"
              className="w-8 h-8"
            />
            <span className="text-xl font-semibold tracking-tight">Snitch</span>
          </div>
          <nav className="hidden sm:flex items-center gap-8">
            <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              Home
            </a>
            <a href="/product" className="text-sm text-white font-medium">
              Create Product
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Page title */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-3">
            Create Product
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Add a new product to your collection. Fill in the details and upload up to 7 high-quality images.
          </p>
        </div>

        {/* Form container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Title */}
              <div className="space-y-3">
                <SnitchLabel htmlFor="title">
                  Title
                </SnitchLabel>
                <SnitchInput
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>

              {/* Product Description */}
              <div className="space-y-3">
                <SnitchLabel htmlFor="description">
                  Description
                </SnitchLabel>
                <SnitchTextarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Materials, fit, care instructions..."
                  rows={6}
                />
              </div>

              {/* Price section */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <SnitchLabel htmlFor="priceAmount">
                    Price
                  </SnitchLabel>
                  <SnitchInput
                    id="priceAmount"
                    name="priceAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.priceAmount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="font-mono text-lg"
                  />
                </div>

                <div className="space-y-3">
                  <SnitchLabel htmlFor="currency">
                    Currency
                  </SnitchLabel>
                  <SnitchSelect value={formData.priceCurrency} onValueChange={handleCurrencyChange}>
                    <SnitchSelectTrigger>
                      <SnitchSelectValue />
                    </SnitchSelectTrigger>
                    <SnitchSelectContent>
                      <SnitchSelectItem value="USD">USD ($)</SnitchSelectItem>
                      <SnitchSelectItem value="EUR">EUR (€)</SnitchSelectItem>
                      <SnitchSelectItem value="GBP">GBP (£)</SnitchSelectItem>
                      <SnitchSelectItem value="INR">INR (₹)</SnitchSelectItem>
                      <SnitchSelectItem value="JPY">JPY (¥)</SnitchSelectItem>
                      <SnitchSelectItem value="AUD">AUD (A$)</SnitchSelectItem>
                      <SnitchSelectItem value="CAD">CAD (C$)</SnitchSelectItem>
                    </SnitchSelectContent>
                  </SnitchSelect>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <SnitchButton
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Product'
                  )}
                </SnitchButton>
              </div>
            </form>
          </div>

          {/* Image upload section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Upload area */}
              <div className="space-y-3">
                <SnitchLabel className="text-sm font-semibold text-slate-200">
                  Product Images
                </SnitchLabel>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500/50 hover:bg-slate-800/30 transition-all duration-200 group"
                >
                  <Upload className="w-8 h-8 mx-auto mb-3 text-slate-500 group-hover:text-amber-500 transition-colors" />
                  <p className="text-sm font-medium text-slate-300 mb-1">
                    Click to upload
                  </p>
                  <p className="text-xs text-slate-500">
                    PNG, JPG, WebP up to 5MB
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    {images.length}/7 images
                  </p>
                </div>

                <SnitchInput
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image preview grid */}
              {images.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Uploaded Images
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Product ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border border-slate-700 group-hover:border-amber-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          {image.file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info box */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Tips
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Use high-quality images</li>
                  <li>• Show product from multiple angles</li>
                  <li>• First image is the main thumbnail</li>
                  <li>• Max 5MB per image</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

