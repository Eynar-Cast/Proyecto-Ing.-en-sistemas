import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

const SupplierModal = ({ isOpen, onClose, editingSupplier = null }) => {
  const { addSupplier, updateSupplier } = useApp();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    contact: ''
  });

  useEffect(() => {
    if (editingSupplier) {
      setFormData({
        name: editingSupplier.name,
        phone: editingSupplier.phone,
        email: editingSupplier.email || '',
        address: editingSupplier.address || '',
        contact: editingSupplier.contact || ''
      });
    } else {
      resetForm();
    }
  }, [editingSupplier, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      contact: ''
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name || !formData.phone) {
      setErrors({ general: 'El nombre y teléfono son obligatorios' });
      return;
    }

    setLoading(true);

    let result;
    if (editingSupplier) {
      result = await updateSupplier(editingSupplier.id, formData);
    } else {
      result = await addSupplier(formData);
    }

    setLoading(false);

    if (result.success) {
      alert(editingSupplier ? 'Proveedor actualizado' : 'Proveedor agregado');
      onClose();
      resetForm();
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSupplier ? 'Editar Proveedor' : 'Agregar Proveedor'}
      size="medium"
      footer={
        <>
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="primary" disabled={loading}>
            {loading ? 'Guardando...' : (editingSupplier ? 'Actualizar' : 'Agregar')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Proveedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Distribuidora XYZ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="123-456-7890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
            </label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="proveedor@ejemplo.com"
            />
        </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Persona de Contacto
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Juan Pérez"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Dirección completa del proveedor..."
          />
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default SupplierModal;
