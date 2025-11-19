import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

const CategoryModal = ({ isOpen, onClose }) => {
  const { categories, products, addCategory, deleteCategory } = useApp();
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      alert('Ingresa un nombre para la categoría');
      return;
    }

    setLoading(true);
    const result = await addCategory(newCategory.trim());
    setLoading(false);

    if (result.success) {
      alert('Categoría agregada correctamente');
      setNewCategory('');
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (categoryName) => {
    const productsInCategory = products.filter(p => p.category === categoryName);
    
    if (productsInCategory.length > 0) {
      alert(`No se puede eliminar. Hay ${productsInCategory.length} productos en esta categoría`);
      return;
    }

    if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)) {
      const result = await deleteCategory(categoryName);
      if (result.success) {
        alert('Categoría eliminada correctamente');
      } else {
        alert(result.error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestionar Categorías"
      size="medium"
    >
      <div className="space-y-6">
        {/* Agregar nueva categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nueva Categoría
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Nombre de la categoría"
            />
            <Button
              onClick={handleAdd}
              variant="primary"
              icon={Plus}
              disabled={loading}
            >
              Agregar
            </Button>
          </div>
        </div>

        {/* Lista de categorías */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Categorías Existentes ({categories.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {categories.map(cat => {
              const productCount = products.filter(p => p.category === cat).length;
              return (
                <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-800">{cat}</p>
                    <p className="text-sm text-gray-500">{productCount} producto(s)</p>
                  </div>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="text-red-600 hover:text-red-800 p-2 transition"
                    title="Eliminar categoría"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="secondary">
          Cerrar
        </Button>
      </div>
    </Modal>
  );
};

export default CategoryModal;