import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateCartTotal, calculateCartItemsCount } from '../utils/helpers';

export const useCart = () => {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useApp();

  // Total del carrito
  const cartTotal = useMemo(() => {
    return calculateCartTotal(cart);
  }, [cart]);

  // Cantidad total de items
  const cartItemsCount = useMemo(() => {
    return calculateCartItemsCount(cart);
  }, [cart]);

  // Verificar si el carrito está vacío
  const isEmpty = cart.length === 0;

  return {
    cart,
    cartTotal,
    cartItemsCount,
    isEmpty,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
  };
};
