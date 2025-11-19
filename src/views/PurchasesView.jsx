import React, { useState } from 'react';
import { Plus, ShoppingBag, TrendingUp, DollarSign, Package, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice, formatDate } from '../utils/helpers';
import Button from '../components/Common/Button';
import PurchaseModal from '../components/Purchase/PurchaseModal';
import Modal from '../components/Common/Modal';

const PurchasesView = () => {
  const { purchases, suppliers, products, registerPurchase, currentUser } = useApp();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [expandedPurchase, setExpandedPurchase] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleNewPurchase = async (purchaseData) => {
    const result = await registerPurchase(purchaseData);
    if (result.success) {
      setShowPurchaseModal(false);
      return { success: true };
    }
    return result;
  };

  const viewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDetailModal(true);
  };

  // Calcular estadísticas
  const totalSpent = purchases.reduce((sum, p) => sum + p.total, 0);
  const totalItems = purchases.reduce((sum, p) => 
    sum + p.items.reduce((s, i) => s + i.quantity, 0), 0
  );
  const averagePurchase = purchases.length > 0 ? totalSpent / purchases.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Compras a Proveedores</h2>
          <p className="text-gray-600">Gestión de compras e inventario</p>
        </div>
        <Button 
          onClick={() => setShowPurchaseModal(true)}
          variant="primary" 
          icon={Plus}
        >
          Nueva Compra
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Compras</p>
              <p className="text-2xl font-bold text-gray-800">{purchases.length}</p>
            </div>
            <ShoppingBag className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Gastado</p>
              <p className="text-2xl font-bold text-red-600">{formatPrice(totalSpent)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Compra Promedio</p>
              <p className="text-2xl font-bold text-blue-600">{formatPrice(averagePurchase)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Items Comprados</p>
              <p className="text-2xl font-bold text-purple-600">{totalItems}</p>
            </div>
            <Package className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Lista de compras */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Historial de Compras</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {purchases.length > 0 ? purchases.slice().reverse().map(purchase => (
            <div key={purchase.id} className="p-4 hover:bg-gray-50 transition">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedPurchase(expandedPurchase === purchase.id ? null : purchase.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">Compra #{purchase.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(purchase.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Proveedor: {purchase.supplier_name}</p>
                      <p className="text-sm text-gray-500">{purchase.items?.length || 0} productos</p>
                    </div>
                    {purchase.notes && (
                      <div className="text-sm text-gray-500 italic">
                        "{purchase.notes}"
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewDetails(purchase);
                    }}
                    variant="secondary"
                    size="small"
                    icon={Eye}
                  >
                    Ver
                  </Button>
                  <p className="text-xl font-bold text-red-600">{formatPrice(purchase.total)}</p>
                  {expandedPurchase === purchase.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Detalle expandido */}
              {expandedPurchase === purchase.id && purchase.items && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-3">Productos comprados:</h4>
                  <div className="space-y-2">
                    {purchase.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div>
                          <p className="font-medium text-gray-800">{item.product_name}</p>
                          <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">{formatPrice(item.price)} c/u</p>
                          <p className="text-sm font-bold text-gray-800">
                            Total: {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="p-12 text-center text-gray-500">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg">No hay compras registradas</p>
              <p className="text-sm mt-2">Registra tu primera compra a un proveedor</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de nueva compra */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        suppliers={suppliers}
        products={products}
        onSubmit={handleNewPurchase}
        currentUser={currentUser}
      />

      {/* Modal de detalles */}
      {selectedPurchase && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPurchase(null);
          }}
          title={`Detalles de Compra #${selectedPurchase.id}`}
          size="large"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <p className="text-gray-900">{selectedPurchase.supplier_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <p className="text-gray-900">{formatDate(selectedPurchase.date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <p className="text-gray-900">{selectedPurchase.user}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <p className="text-2xl font-bold text-red-600">{formatPrice(selectedPurchase.total)}</p>
              </div>
            </div>

            {selectedPurchase.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedPurchase.notes}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Productos</label>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Producto</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Precio</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Cantidad</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedPurchase.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3">{item.product_name}</td>
                        <td className="px-4 py-3 text-right">{formatPrice(item.price)}</td>
                        <td className="px-4 py-3 text-right font-semibold">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PurchasesView;