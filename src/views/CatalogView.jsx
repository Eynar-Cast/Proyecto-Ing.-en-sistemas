import React, { useState } from 'react';
import { Grid, List, Search, Package, AlertCircle } from 'lucide-react';
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