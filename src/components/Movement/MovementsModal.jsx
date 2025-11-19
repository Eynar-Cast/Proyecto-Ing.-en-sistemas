import React, { useState } from 'react';
import { FileText, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/helpers';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

const MovementsModal = ({ isOpen, onClose }) => {
  const { movements } = useApp();
  const [filter, setFilter] = useState('all');

  const filteredMovements = filter === 'all' 
    ? movements 
    : movements.filter(m => m.type === filter);

  const getTypeColor = (type) => {
    switch (type) {
      case 'entrada':
        return 'bg-green-100 text-green-800';
      case 'salida':
        return 'bg-orange-100 text-orange-800';
      case 'venta':
        return 'bg-purple-100 text-purple-800';
      case 'ajuste':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'entrada':
        return 'Entrada';
      case 'salida':
        return 'Salida';
      case 'venta':
        return 'Venta';
      case 'ajuste':
        return 'Ajuste';
      default:
        return type;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Historial de Movimientos"
      size="xlarge"
    >
      <div className="space-y-4">
        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('entrada')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'entrada' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setFilter('salida')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'salida' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Salidas
          </button>
          <button
            onClick={() => setFilter('venta')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'venta' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Ventas
          </button>
        </div>

        {/* Tabla de movimientos */}
        {filteredMovements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMovements.slice().reverse().map(movement => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(movement.date)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {movement.productName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${getTypeColor(movement.type)}`}>
                        {getTypeLabel(movement.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                      {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {movement.reason}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {movement.user}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No hay movimientos registrados</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="secondary">
          Cerrar
        </Button>
      </div>
    </Modal>
  );
};

export default MovementsModal;