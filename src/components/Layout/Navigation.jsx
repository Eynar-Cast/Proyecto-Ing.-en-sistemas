import React from 'react';
import { useApp } from '../../context/AppContext';
import { VIEWS, USER_TYPES } from '../../constants';
import { Package, ShoppingCart, BarChart3, Users, Truck, Monitor, UserCog, ShoppingBag } from 'lucide-react';

const Navigation = () => {
  const { currentView, setCurrentView, userType } = useApp();

  // Navegación según tipo de usuario
  let navItems = [];

  if (userType === USER_TYPES.ADMIN) {
    navItems = [
      { id: VIEWS.CATALOG, label: 'Catálogo', icon: ShoppingCart },
      { id: VIEWS.INVENTORY, label: 'Inventario', icon: Package },
      { id: VIEWS.PURCHASES, label: 'Compras', icon: ShoppingBag },
      { id: VIEWS.SALES, label: 'Ventas', icon: BarChart3 },
      { id: VIEWS.SUPPLIERS, label: 'Proveedores', icon: Truck },
      { id: VIEWS.CLIENTS, label: 'Clientes', icon: Users },
      { id: VIEWS.EMPLOYEES, label: 'Empleados', icon: UserCog }
    ];
  } else if (userType === USER_TYPES.EMPLOYEE) {
    navItems = [
      { id: VIEWS.POS, label: 'Punto de Venta', icon: Monitor },
      { id: VIEWS.CATALOG, label: 'Productos', icon: Package }
    ];
  }

  // No mostrar navegación para clientes
  if (userType === USER_TYPES.CLIENT || navItems.length === 0) {
    return null;
  }

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