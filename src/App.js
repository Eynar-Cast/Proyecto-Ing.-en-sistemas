import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import LoginModal from './components/Auth/LoginModal';
import RegisterModal from './components/Auth/RegisterModal';
import { VIEWS } from './constants';

// Importar vistas
import CatalogView from './views/CatalogView';
import InventoryView from './views/InventoryView';
import SalesView from './views/SalesView';
import SuppliersView from './views/SuppliersView';
import ClientsView from './views/ClientsView';
import POSView from './views/POSView';
import EmployeesView from './views/EmployeesView';
import AdminLoginModal from './components/Auth/AdminLoginModal';
import CartModal from './views/CartModal';
import PurchasesView from './views/PurchasesView';

function AppContent() {
  const { currentView, isAuthenticated, loading } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Renderizar vista según el estado actual
  const renderView = () => {
    switch (currentView) {
      case VIEWS.CATALOG:
        return <CatalogView />;
      case VIEWS.INVENTORY:
        return <InventoryView />;
      case VIEWS.PURCHASES:
        return <PurchasesView />;
      case VIEWS.SALES:
        return <SalesView />;
      case VIEWS.SUPPLIERS:
        return <SuppliersView />;
      case VIEWS.CLIENTS:
        return <ClientsView />;
      case VIEWS.POS:
        return <POSView />;
      case VIEWS.EMPLOYEES:
        return <EmployeesView />;
      default:
        return <CatalogView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onShowCart={() => setShowCart(true)} 
        onShowLogin={() => setShowLoginModal(true)}
        onShowAdminLogin={() => setShowAdminLogin(true)}
      />

      {/* Navigation (solo para admin) */}
      {isAuthenticated && <Navigation />}

      {/* Contenido principal */}
      <main className="w-full">
        <div className={currentView === VIEWS.CATALOG ? '' : 'max-w-7xl mx-auto px-4 py-6'}>
          {renderView()}
        </div>
      </main>

      {/* Modales */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
      
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;