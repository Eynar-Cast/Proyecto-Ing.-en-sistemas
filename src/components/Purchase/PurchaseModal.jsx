import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';

const PurchaseModal = ({ isOpen, onClose, suppliers, products, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    notes: ''
  });
  
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Resetear al cerrar
      setFormData({ supplierId: '', supplierName: '', notes: '' });
      setItems([]);
      setSelectedProduct('');
      setQuantity('');
      setPrice('');
    }
  }, [isOpen]);

  const handleSupplierChange = (e) => {
    const supplierId = e.target.value;
    const supplier = suppliers.find(s => s.id.toString() === supplierId);
    
    setFormData({
      ...formData,
      supplierId,
      supplierName: supplier ? supplier.name : ''
    });
  };

  const addItem = () => {
    if (!selectedProduct || !quantity || !price) {
      alert('Complete todos los campos del producto');
      return;
    }

    const product = products.find(p => p.id.toString() === selectedProduct);
    if (!product) return;

    const existingItem = items.find(item => item.productId === product.id);
    if (existingItem) {
      alert('Este producto ya está en la lista');
      return;
    }

    const newItem = {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      subtotal: parseFloat(price) * parseInt(quantity)
    };

    setItems([...items, newItem]);
    setSelectedProduct('');
    setQuantity('');
    setPrice('');
  };

  const removeItem = (productId) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async () => {
    if (!formData.supplierId) {
      alert('Selecciona un proveedor');
      return;
    }

    if (items.length === 0) {
      alert('Agrega al menos un producto');
      return;
    }

    if (!window.confirm('¿Confirmar compra?')) {
      return;
    }

    setLoading(true);

    const purchaseData = {
      supplierId: parseInt(formData.supplierId),
      supplierName: formData.supplierName,
      items,
      total: calculateTotal(),
      notes: formData.notes,
      user: currentUser?.username || 'admin'
    };

    const result = await onSubmit(purchaseData);
    
    setLoading(false);

    if (result.success) {
      alert('Compra registrada exitosamente');
      onClose();
    } else {
      alert(result.error || 'Error al registrar la compra');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Nueva Compra a Proveedor</h2>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Proveedor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.supplierId}
                onChange={handleSupplierChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Seleccionar proveedor...</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Número de factura, observaciones, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Agregar productos */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Agregar Producto</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                    const product = products.find(p => p.id.toString() === e.target.value);
                    if (product) {
                      setPrice(product.price.toString());
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Seleccionar...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - Stock actual: {product.stock}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Unitario
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addItem}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Productos ({items.length})</h3>
            {items.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map(item => (
                      <tr key={item.productId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{item.productName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                        <td className="px-4 py-3 text-right text-sm">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-semibold">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-800">${item.subtotal.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay productos agregados</p>
              </div>
            )}
          </div>

          {/* Total */}
          {items.length > 0 && (
            <div className="mt-6 bg-indigo-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">TOTAL:</span>
                <span className="text-3xl font-bold text-indigo-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || items.length === 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;