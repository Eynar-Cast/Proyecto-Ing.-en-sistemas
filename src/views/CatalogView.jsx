import React, { useState, useEffect } from 'react';
import { Grid, List, Search, Package, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { USER_TYPES } from '../constants';
import { formatPrice, hasLowStock } from '../utils/helpers';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';

const CatalogView = () => {
  const { userType, isAuthenticated, categories } = useApp();
  const { addToCart } = useCart();
  const {
    filteredProducts,
    lowStockProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceFilter,
    setPriceFilter
  } = useProducts();

  const [viewMode, setViewMode] = useState('grid');
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Imágenes del carrusel
  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=600&fit=crop',
      title: 'Materiales de Construcción de Calidad',
      subtitle: 'Todo lo que necesitas para tu proyecto'
    },
    {
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=600&fit=crop',
      title: 'Herramientas Profesionales',
      subtitle: 'Las mejores marcas del mercado'
    },
    {
      url: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=1200&h=600&fit=crop',
      title: 'Asesoría Especializada',
      subtitle: 'Te ayudamos a elegir lo mejor'
    }
  ];

  // Auto-avanzar carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleAddToCart = (product) => {
    if (isAuthenticated && userType === USER_TYPES.CLIENT) {
      addToCart(product, 1);
      alert(`${product.name} agregado al carrito`);
    } else if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
    }
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
      {/* Imagen o placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg mb-3 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <Package className="w-16 h-16 text-indigo-400" />
        )}
      </div>

      {/* Info del producto */}
      <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {product.description || 'Sin descripción'}
      </p>

      {/* Precio y stock */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-2xl font-bold text-indigo-600">
          {formatPrice(product.price)}
        </span>
        <span className={`text-sm font-medium px-2 py-1 rounded ${
          hasLowStock(product)
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'
        }`}>
          Stock: {product.stock}
        </span>
      </div>

      {/* Botón agregar al carrito */}
      {userType === USER_TYPES.CLIENT && (
        <Button
          onClick={() => handleAddToCart(product)}
          variant="primary"
          fullWidth
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
        </Button>
      )}

      {/* Ver detalles para admin */}
      {userType === USER_TYPES.ADMIN && (
        <Button
          onClick={() => {
            setSelectedProduct(product);
            setShowProductModal(true);
          }}
          variant="secondary"
          fullWidth
        >
          Ver Detalles
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SECCIÓN 1: CARRUSEL - Solo visible para clientes */}
      {userType !== USER_TYPES.ADMIN && (
        <div className="relative w-full h-[90vh] overflow-hidden bg-gray-900">
          {/* Imágenes del carrusel */}
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay oscuro */}
              <div className="absolute inset-0 bg-black bg-opacity-50" />
              
              {/* Contenido */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center animate-fade-in">
                  MaterialPro
                </h1>
                <p className="text-2xl md:text-4xl mb-2 text-center">{image.title}</p>
                <p className="text-lg md:text-xl text-gray-300 text-center">{image.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* SECCIÓN 2: CATÁLOGO DE PRODUCTOS */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {/* Alertas de stock bajo (solo admin) */}
          {userType === USER_TYPES.ADMIN && lowStockProducts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Alerta de Stock Bajo
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    Hay {lowStockProducts.length} producto(s) con stock bajo que requieren reabastecimiento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Título de sección */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Nuestros Productos</h2>
            <p className="text-gray-600 text-lg">Encuentra todo lo que necesitas para tu construcción</p>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categoría */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Todas">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Ordenar */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="name">Nombre</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="stock">Stock</option>
                </select>
              </div>
            </div>

            {/* Filtros de precio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio Mínimo</label>
                <input
                  type="number"
                  value={priceFilter.min}
                  onChange={(e) => setPriceFilter(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="$0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio Máximo</label>
                <input
                  type="number"
                  value={priceFilter.max}
                  onChange={(e) => setPriceFilter(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="$999.99"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setPriceFilter({ min: '', max: '' })}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>

            {/* Modo de vista */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-600">
                {filteredProducts.length} producto(s) encontrado(s)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid de productos */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No se encontraron productos</p>
              <p className="text-gray-500 text-sm mt-2">
                Intenta ajustar tus filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 3: FOOTER */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Columna 1 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">MaterialPro</h3>
              <p className="text-gray-400">
                Tu socio de confianza en materiales de construcción. 
                Calidad garantizada desde 2024.
              </p>
            </div>

            {/* Columna 2 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 Teléfono: (+591) 69880053 </li>
                <li>📧 Email: info@materialpro.com</li>
                <li>📍 Dirección: Calle Principal #123</li>
              </ul>
            </div>

            {/* Columna 3 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Horario</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Lunes a Viernes: 8:00 AM - 6:00 PM</li>
                <li>Sábados: 9:00 AM - 2:00 PM</li>
                <li>Domingos: Cerrado</li>
              </ul>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-gray-800 pt-8">
            <div className="text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} MaterialPro. Todos los derechos reservados.</p>
              <p className="text-sm mt-2">
                Desarrollado por Eynar-Cast para tu negocio de construcción
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de detalles del producto */}
      {selectedProduct && (
        <Modal
          isOpen={showProductModal}
          onClose={() => {
            setShowProductModal(false);
            setSelectedProduct(null);
          }}
          title={selectedProduct.name}
          size="medium"
        >
          <div className="space-y-4">
            {/* Imagen */}
            {selectedProduct.image && (
              <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <p className="text-gray-900">{selectedProduct.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <p className="text-gray-900 text-xl font-bold">{formatPrice(selectedProduct.price)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <p className="text-gray-900">{selectedProduct.stock} {selectedProduct.unit}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                <p className="text-gray-900">{selectedProduct.minStock || 'No definido'}</p>
              </div>
            </div>
            
            {selectedProduct.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <p className="text-gray-900">{selectedProduct.description}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${
                selectedProduct.stock > (selectedProduct.minStock || 10)
                  ? 'bg-green-100 text-green-800'
                  : selectedProduct.stock > 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedProduct.stock > (selectedProduct.minStock || 10) 
                  ? 'Disponible' 
                  : selectedProduct.stock > 0 
                  ? 'Stock Bajo' 
                  : 'Sin Stock'}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              onClick={() => {
                setShowProductModal(false);
                setSelectedProduct(null);
              }} 
              variant="secondary"
            >
              Cerrar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CatalogView;