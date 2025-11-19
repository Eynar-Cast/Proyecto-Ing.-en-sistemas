import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Download, AlertCircle, Grid as GridIcon, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/helpers';
import Button from '../components/Common/Button';
import ProductModal from '../components/Product/ProductModal';
import CategoryModal from '../components/Category/CategoryModal';
import MovementsModal from '../components/Movement/MovementsModal';

const InventoryView = () => {
  const { products, deleteProduct, categories, suppliers } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showMovementsModal, setShowMovementsModal] = useState(false);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`¿Estás seguro de eliminar "${productName}"?`)) {
      const result = await deleteProduct(productId);
      if (result.success) {
        alert('Producto eliminado correctamente');
      } else {
        alert(result.error || 'Error al eliminar el producto');
      }
    }
  };

  const exportInventory = () => {
    const json = JSON.stringify(products, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventario-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 10));
    const outOfStockProducts = products.filter(p => p.stock === 0);
    
    const categorySummary = categories.map(cat => {
      const catProducts = products.filter(p => p.category === cat);
      return {
        category: cat,
        count: catProducts.length,
        value: catProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)
      };
    }).filter(c => c.count > 0);

    const reportLines = [
      'REPORTE DE INVENTARIO',
      'Fecha: ' + new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'RESUMEN GENERAL',
      '- Total de productos: ' + products.length,
      '- Valor total del inventario: $' + totalValue.toFixed(2),
      '- Productos con stock bajo: ' + lowStockProducts.length,
      '- Productos sin stock: ' + outOfStockProducts.length,
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'RESUMEN POR CATEGORÍA:',
      ...categorySummary.map(c => `${c.category}: ${c.count} productos - Valor: $${c.value.toFixed(2)}`),
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'PRODUCTOS CON STOCK BAJO:',
      lowStockProducts.length > 0 
        ? lowStockProducts.map(p => `- ${p.name}: ${p.stock} ${p.unit}(es) (Min: ${p.minStock})`).join('\n')
        : 'No hay productos con stock bajo',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'LISTADO COMPLETO DE PRODUCTOS:',
      ...products.map(p => 
        `${p.name}\n  Categoría: ${p.category}\n  Precio: $${p.price.toFixed(2)} por ${p.unit}\n  Stock: ${p.stock} ${p.unit}(es)\n  Estado: ${p.stock > (p.minStock || 10) ? 'Disponible' : p.stock > 0 ? 'Stock Bajo' : 'Sin Stock'}\n  ---`
      ),
      '',
      '═══════════════════════════════════════════════════════════',
      'Generado por MaterialPro - Sistema de Gestión de Inventario'
    ];

    const reportContent = reportLines.join('\n');
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reporte_inventario_' + new Date().toISOString().split('T')[0] + '.txt';
    link.click();
  };

  // Productos con stock bajo
  const lowStock = products.filter(p => p.stock <= (p.minStock || 10));
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Inventario</h2>
          <p className="text-gray-600">Total de productos: {products.length}</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCategoryModal(true)}
            variant="secondary"
            icon={GridIcon}
          >
            Categorías
          </Button>
          <Button
              onClick={() => setShowMovementsModal(true)}
              variant="secondary"
              icon={FileText}
            >
              Movimientos
          </Button>
          <Button
            onClick={generateReport}
            variant="secondary"
            icon={FileText}
          >
            Generar Reporte
          </Button>
          <Button
            onClick={exportInventory}
            variant="secondary"
            icon={Download}
          >
            Exportar
          </Button>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            variant="primary"
            icon={Plus}
          >
            Agregar Producto
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm">Total Productos</p>
          <p className="text-3xl font-bold text-indigo-600">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm">Valor Inventario</p>
          <p className="text-3xl font-bold text-green-600">{formatPrice(totalValue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm">Stock Bajo</p>
          <p className="text-3xl font-bold text-yellow-600">{lowStock.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-sm">Categorías</p>
          <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
        </div>
      </div>

      {/* Alerta de stock bajo */}
      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800">Stock Bajo</h3>
              <p className="text-yellow-700 text-sm">
                {lowStock.length} producto(s) necesitan reabastecimiento: {lowStock.map(p => p.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Mín.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length > 0 ? products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {formatPrice(product.price)}
                    <div className="text-xs text-gray-500">por {product.unit}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                      product.stock <= (product.minStock || 10)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.minStock || 10}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.supplierId ? (
                      suppliers.find(s => s.id.toString() === product.supplierId)?.name || 'N/A'
                    ) : (
                      <span className="text-gray-400">Sin proveedor</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-800 p-2"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No hay productos en el inventario
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ProductModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        editingProduct={editingProduct}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />
      <MovementsModal
        isOpen={showMovementsModal}
        onClose={() => setShowMovementsModal(false)}
      />
    </div>
  );
};

export default InventoryView;