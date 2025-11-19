import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Search, DollarSign, Receipt, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/helpers';
import Button from '../components/Common/Button';

const POSView = () => {
  const { products, registerEmployeeSale, currentUser } = useApp();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientName, setClientName] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(p => p.stock > 0);

  // Agregar al carrito
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('No hay suficiente stock disponible');
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Actualizar cantidad
  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > product.stock) {
      alert('No hay suficiente stock disponible');
      return;
    }

    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remover del carrito
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Calcular total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Completar venta
  const completeSale = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!clientName.trim()) {
      alert('Ingresa el nombre del cliente');
      return;
    }

    if (!window.confirm('¿Confirmar venta?')) {
      return;
    }

    const saleData = {
      items: cart,
      total,
      clientName: clientName.trim()
    };

    const result = await registerEmployeeSale(saleData);

    if (result.success) {
      setLastSale({ ...result.sale, employeeName: currentUser.fullName });
      setShowReceipt(true);
      setCart([]);
      setClientName('');
      setSearchTerm('');
    } else {
      alert(result.error || 'Error al registrar la venta');
    }
  };

  // Cancelar venta
  const cancelSale = () => {
    if (cart.length > 0 && window.confirm('¿Cancelar venta actual?')) {
      setCart([]);
      setClientName('');
    }
  };

  // Imprimir ticket
  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Panel izquierdo - Productos */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 overflow-hidden flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Punto de Venta</h2>
          
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Grid de productos */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-lg p-4 text-left transition border-2 border-transparent hover:border-indigo-300"
              >
                <h3 className="font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-indigo-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs bg-white px-2 py-1 rounded font-medium">
                    Stock: {product.stock}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Panel derecho - Carrito */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Carrito ({totalItems})
        </h3>

        {/* Cliente */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Cliente
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Cliente"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Items del carrito */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>Carrito vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-white border border-gray-300 rounded p-1 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-gray-800 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-white border border-gray-300 rounded p-1 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-gray-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total */}
        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-xl font-bold text-gray-800">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Items:</span>
            <span>{totalItems}</span>
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-2">
          <Button
            onClick={completeSale}
            variant="success"
            fullWidth
            disabled={cart.length === 0 || !clientName.trim()}
            icon={DollarSign}
          >
            Cobrar {formatPrice(total)}
          </Button>
          <Button
            onClick={cancelSale}
            variant="danger"
            fullWidth
            disabled={cart.length === 0}
          >
            Cancelar Venta
          </Button>
        </div>
      </div>

      {/* Modal de recibo */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Receipt className="w-6 h-6" />
                Venta Registrada
              </h3>
              <button
                onClick={() => setShowReceipt(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 border-t border-b py-4 my-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {formatPrice(lastSale.total)}
                </p>
                <p className="text-sm text-gray-600">Venta #{lastSale.id}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{new Date(lastSale.date).toLocaleString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{lastSale.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Atendido por:</span>
                  <span className="font-medium">{lastSale.employeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{lastSale.items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-semibold text-gray-700 mb-2">Productos:</h4>
                <div className="space-y-1 text-sm">
                  {lastSale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-gray-600">{item.name} x{item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={printReceipt}
                variant="secondary"
                fullWidth
                icon={Receipt}
              >
                Imprimir
              </Button>
              <Button
                onClick={() => setShowReceipt(false)}
                variant="primary"
                fullWidth
              >
                Nueva Venta
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSView;