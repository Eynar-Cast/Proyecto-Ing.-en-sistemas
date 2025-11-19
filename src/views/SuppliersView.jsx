import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Truck, Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/Common/Button';
import SupplierModal from '../components/Supplier/SupplierModal';

const SuppliersView = () => {
  const { suppliers, deleteSupplier, products } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  const handleDelete = async (supplierId, supplierName) => {
    const productsWithSupplier = products.filter(p => p.supplierId === supplierId.toString());
    
    if (productsWithSupplier.length > 0) {
      alert(`No se puede eliminar. Hay ${productsWithSupplier.length} productos asociados a este proveedor`);
      return;
    }

    if (window.confirm(`¿Estás seguro de eliminar el proveedor "${supplierName}"?`)) {
      const result = await deleteSupplier(supplierId);
      if (result.success) {
        alert('Proveedor eliminado correctamente');
      } else {
        alert(result.error || 'Error al eliminar el proveedor');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Proveedores</h2>
          <p className="text-gray-600">Gestión de proveedores</p>
        </div>
        <Button 
          onClick={() => {
            setEditingSupplier(null);
            setShowModal(true);
          }}
          variant="primary" 
          icon={Plus}
        >
          Agregar Proveedor
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3">
          <Truck className="w-10 h-10 text-indigo-600" />
          <div>
            <p className="text-gray-500 text-sm">Total de Proveedores</p>
            <p className="text-3xl font-bold text-gray-800">{suppliers.length}</p>
          </div>
        </div>
      </div>

      {/* Grid de proveedores */}
      {suppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map(supplier => {
            const supplierProducts = products.filter(p => p.supplierId === supplier.id.toString());
            
            return (
              <div key={supplier.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Truck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{supplier.name}</h3>
                      {supplier.contact && (
                        <p className="text-sm text-gray-500">{supplier.contact}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{supplier.address}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-3">
                    {supplierProducts.length} producto(s) asociado(s)
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(supplier)}
                      className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(supplier.id, supplier.name)}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No hay proveedores registrados</p>
          <p className="text-gray-500 text-sm mt-2">Agrega tu primer proveedor para comenzar</p>
          <Button 
            onClick={() => setShowModal(true)}
            variant="primary" 
            icon={Plus}
            className="mt-4"
          >
            Agregar Proveedor
          </Button>
        </div>
      )}

      {/* Modal */}
      <SupplierModal
        isOpen={showModal}
        onClose={handleCloseModal}
        editingSupplier={editingSupplier}
      />
    </div>
  );
};

export default SuppliersView;