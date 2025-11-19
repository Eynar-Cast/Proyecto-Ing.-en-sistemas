import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { filterProducts, sortProducts, hasLowStock } from '../utils/helpers';

export const useProducts = () => {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');

  // Productos filtrados y ordenados
  const filteredProducts = useMemo(() => {
    const filters = {
      searchTerm,
      category: selectedCategory,
      priceMin: priceFilter.min,
      priceMax: priceFilter.max
    };

    const filtered = filterProducts(products, filters);
    return sortProducts(filtered, sortBy);
  }, [products, searchTerm, selectedCategory, priceFilter, sortBy]);

  // Productos con stock bajo
  const lowStockProducts = useMemo(() => {
    return products.filter(hasLowStock);
  }, [products]);

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todas');
    setPriceFilter({ min: '', max: '' });
    setSortBy('name');
  };

  return {
    products,
    filteredProducts,
    lowStockProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    priceFilter,
    setPriceFilter,
    sortBy,
    setSortBy,
    resetFilters
  };
};
