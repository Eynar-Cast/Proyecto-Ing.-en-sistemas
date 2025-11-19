import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UNITS } from '../../constants';
import { validateProductForm } from '../../utils/helpers';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

const ProductModal = ({ isOpen, onClose, editingProduct = null }) => {
  const { categories, suppliers, addProduct, updateProduct } = useApp();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    unit: 'unidad',
    description: '',
    minStock: '10',
    image: '',
    supplierId: ''
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price.toString(),
        stock: editingProduct.stock.toString(),
        unit: editingProduct.unit,
        description: editingProduct.description || '',
        minStock: editingProduct.minStock?.toString() || '10',
        image: editingProduct.image || '',
        supplierId: editingProduct.supplierId || ''
      });
    } else {
      resetForm();
    }
  }, [editingProduct, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      unit: 'unidad',
      description: '',
      minStock: '10',
      image: '',
      supplierId: ''
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar
    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      unit: formData.unit,
      description: formData.description,
      minStock: parseInt(formData.minStock) || 10,
      image: formData.image,
      supplierId: formData.supplierId
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData);
    } else {
      result = await addProduct(productData);
    }

    setLoading(false);

    if (result.success) {
      alert(editingProduct ? 'Producto actualizado' : 'Producto agregado');
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
      title={editingProduct ? 'Editar Producto' : 'Agregar Producto'}
      size="large"
      footer={
        <>
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="primary" disabled={loading}>
            {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Agregar')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Cemento Portland"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Actual <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>

          {/* Unidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unidad de Medida
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          {/* Stock Mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Mínimo
            </label>
            <input
              type="number"
              name="minStock"
              value={formData.minStock}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="10"
            />
          </div>

          {/* Proveedor */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor
            </label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sin proveedor</option>
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.id}>{sup.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Descripción detallada del producto..."
          />
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del Producto
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="text-xs text-gray-500 mt-1">Tamaño máximo: 2MB</p>
          
          {formData.image && (
            <div className="mt-3 relative inline-block">
              <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded border-2 border-gray-300" />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Error general */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default ProductModal;