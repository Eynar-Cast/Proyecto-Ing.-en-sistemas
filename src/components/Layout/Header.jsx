import React from 'react';
import { LogOut, ShoppingCart, User, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../hooks/useCart';
import { USER_TYPES } from '../../constants';
import Button from '../Common/Button';

  const Header = ({ onShowCart, onShowLogin, onShowAdminLogin }) => {
  const { isAuthenticated, currentUser, userType, logout } = useApp();
  const { cartItemsCount } = useCart();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">MaterialPro</h1>
              <p className="text-sm text-indigo-200">Materiales de Construcción</p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Carrito (solo para clientes) */}
                {userType === USER_TYPES.CLIENT && (
                  <button
                    onClick={onShowCart}
                    className="relative p-2 hover:bg-indigo-700 rounded-lg transition"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Info de usuario */}
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{currentUser?.fullName || currentUser?.username}</span>
                  <span className="text-xs bg-indigo-700 px-2 py-1 rounded">
                    {userType === USER_TYPES.ADMIN ? 'Admin' : 'Cliente'}
                  </span>
                </div>

                {/* Botón logout */}
                <Button
                  onClick={logout}
                  variant="secondary"
                  size="small"
                  icon={LogOut}
                >
                  Salir
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={onShowLogin}
                  variant="secondary"
                  size="small"
                  icon={User}
                >
                  Cliente
                </Button>
                <Button
                  onClick={onShowAdminLogin}
                  variant="secondary"
                  size="small"
                  icon={User}
                >
                  Personal
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
