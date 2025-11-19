import React from 'react';
import { Package, ShoppingCart, BarChart3, Users, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VIEWS, USER_TYPES } from '../../constants';

const Navigation = () => {
  const { currentView, setCurrentView, userType } = useApp();

  // Solo mostrar navegación para administradores
  if (userType !== USER_TYPES.ADMIN) {
    return null;
  }

  const navItems = [
    { id: VIEWS.CATALOG, label: 'Catálogo', icon: ShoppingCart },
    { id: VIEWS.INVENTORY, label: 'Inventario', icon: Package },
    { id: VIEWS.SALES, label: 'Ventas', icon: BarChart3 },
    { id: VIEWS.SUPPLIERS, label: 'Proveedores', icon: Truck },
    { id: VIEWS.CLIENTS, label: 'Clientes', icon: Users }
  ];

  return (
    <div className="bg-white shadow-md border-b sticky top-[88px] z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
