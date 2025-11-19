import React, { useState } from 'react';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';
import Button from '../components/Common/Button';
import { generateSimpleInvoicePDF } from '../utils/pdfGenerator';

const CartModal = ({ isOpen, onClose }) => {
  const { completePurchase, currentUser } = useApp();
  const { cart, cartTotal, cartItemsCount, removeFromCart, updateCartQuantity } = useCart();
  const [lastSale, setLastSale] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCompletePurchase = async () => {
  if (window.confirm('¿Confirmar la compra?')) {
    const result = await completePurchase();
    
    if (result.success) {
      setLastSale(result.sale);
      setShowSuccessModal(true);
    } else {
      alert(result.error || 'Error al completar la compra');
    }
  }
};

const handleDownloadInvoice = () => {
  if (lastSale && currentUser) {
    generateSimpleInvoicePDF(lastSale, currentUser);
  }
};

const handleCloseSuccess = () => {
  setShowSuccessModal(false);
  setLastSale(null);
  onClose();
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-lg">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">Carrito de Compras</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
              <p className="text-gray-500 text-sm mt-2">Agrega productos desde el catálogo</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                    {/* Info del producto */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-indigo-600 font-bold mt-1">{formatPrice(item.price)}</p>
                    </div>

                    {/* Cantidad */}
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => updateCartQuantity(item.id, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right font-bold text-gray-800 min-w-[100px]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-xl font-bold text-gray-800">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total de items:</span>
                  <span className="font-semibold text-gray-800">
                    {cartItemsCount} unidades
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-lg">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Continuar Comprando
          </Button>
          <Button
            onClick={handleCompletePurchase}
            variant="success"
            disabled={cart.length === 0}
          >
            Completar Compra
                  </Button>
        </div>
      </div>

      {/* Modal de éxito con opción de factura */}
      {showSuccessModal && lastSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">¡Compra Exitosa!</h3>
              <p className="text-gray-600">Tu pedido ha sido procesado correctamente</p>
              <p className="text-3xl font-bold text-green-600 mt-4">
                {formatPrice(lastSale.total)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Orden #{lastSale.id}</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleDownloadInvoice}
                variant="primary"
                fullWidth
                icon={ShoppingCart}
              >
                Descargar Factura PDF
              </Button>
              <Button
                onClick={handleCloseSuccess}
                variant="secondary"
                fullWidth
              >
                Continuar Comprando
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartModal;
