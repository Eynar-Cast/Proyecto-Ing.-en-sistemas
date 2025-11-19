import React, { useState, useEffect } from 'react';
import { purchaseService } from '../../services';
import PurchaseModal from './PurchaseModal';
import './PurchaseList.css';

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [filterSupplier, setFilterSupplier] = useState('');

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setLoading(true);
    const data = await purchaseService.getAll();
    setPurchases(data);
    setLoading(false);
  };

  const handleCreatePurchase = async (purchaseData) => {
    await purchaseService.create(purchaseData);
    await loadPurchases();
  };

  const viewDetails = (purchase) => {
    setSelectedPurchase(purchase);
  };

  const closeDetails = () => {
    setSelectedPurchase(null);
  };

  const filteredPurchases = purchases.filter(p =>
    !filterSupplier || p.supplier_name.toLowerCase().includes(filterSupplier.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Cargando compras...</div>;
  }

  return (
    <div className="purchase-list-container">
      <div className="page-header">
        <h1>Compras a Proveedores</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Nueva Compra
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Filtrar por proveedor..."
          value={filterSupplier}
          onChange={(e) => setFilterSupplier(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="purchases-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Total</th>
              <th>Items</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map(purchase => (
              <tr key={purchase.id}>
                <td>#{purchase.id}</td>
                <td>{new Date(purchase.date).toLocaleDateString()}</td>
                <td>{purchase.supplier_name}</td>
                <td className="amount">${parseFloat(purchase.total).toFixed(2)}</td>
                <td>{purchase.items?.length || 0}</td>
                <td>{purchase.user}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => viewDetails(purchase)}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPurchases.length === 0 && (
          <p className="no-data">No hay compras registradas</p>
        )}
      </div>

      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPurchaseCreated={handleCreatePurchase}
      />

      {selectedPurchase && (
        <PurchaseDetailsModal
          purchase={selectedPurchase}
          onClose={closeDetails}
        />
      )}
    </div>
  );
};

// Modal de Detalles
const PurchaseDetailsModal = ({ purchase, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles de Compra #{purchase.id}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Proveedor:</strong>
              <span>{purchase.supplier_name}</span>
            </div>
            <div className="detail-item">
              <strong>Fecha:</strong>
              <span>{new Date(purchase.date).toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <strong>Usuario:</strong>
              <span>{purchase.user}</span>
            </div>
            <div className="detail-item">
              <strong>Total:</strong>
              <span className="amount">${parseFloat(purchase.total).toFixed(2)}</span>
            </div>
          </div>

          {purchase.notes && (
            <div className="notes">
              <strong>Notas:</strong>
              <p>{purchase.notes}</p>
            </div>
          )}

          <h3>Productos</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {purchase.items?.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>${parseFloat(item.price).toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseList;