import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice, formatDate } from '../utils/helpers';
import Button from '../components/Common/Button';

const SalesView = () => {
  const { sales } = useApp();
  const [expandedSale, setExpandedSale] = useState(null);

  // Calcular estadísticas
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0;
  const totalItems = sales.reduce((sum, sale) => sum + sale.items.reduce((s, i) => s + i.quantity, 0), 0);

  // Productos más vendidos
  const productSales = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSales[item.name]) {
        productSales[item.name] = { quantity: 0, revenue: 0 };
      }
      productSales[item.name].quantity += item.quantity;
      productSales[item.name].revenue += item.price * item.quantity;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5);

  const generateSalesReport = () => {
    const reportLines = [
      'REPORTE DE VENTAS',
      'Fecha: ' + new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'RESUMEN GENERAL',
      '- Total de ventas: ' + sales.length,
      '- Ingresos totales: $' + totalRevenue.toFixed(2),
      '- Productos vendidos: ' + totalItems + ' unidades',
      '- Ticket promedio: $' + averageSale.toFixed(2),
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'TOP 5 PRODUCTOS MÁS VENDIDOS:',
      ...topProducts.map((item, index) =>
        `${index + 1}. ${item[0]}\n   Cantidad: ${item[1].quantity} unidades\n   Ingresos: $${item[1].revenue.toFixed(2)}`
      ),
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'DETALLE DE VENTAS:',
      ...sales.slice().reverse().map(sale =>
        `Venta #${sale.id} - ${new Date(sale.date).toLocaleString('es-ES')}\n` +
        `  Cliente: ${sale.clientName || 'Cliente'}\n` +
        `  Items: ${sale.items.reduce((sum, item) => sum + item.quantity, 0)}\n` +
        `  Total: $${sale.total.toFixed(2)}\n` +
        `  Productos:\n` +
        sale.items.map(item => `    - ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`).join('\n') +
        '\n  ---'
      ),
      '',
      '═══════════════════════════════════════════════════════════',
      'Generado por MaterialPro - Sistema de Gestión de Inventario'
    ];

    const reportContent = reportLines.join('\n');
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reporte_ventas_' + new Date().toISOString().split('T')[0] + '.txt';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ventas</h2>
          <p className="text-gray-600">Historial y estadísticas de ventas</p>
        </div>
        <Button
          onClick={generateSalesReport}
          variant="primary"
          icon={FileText}
        >
          Generar Reporte
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Ventas</p>
              <p className="text-2xl font-bold text-gray-800">{sales.length}</p>
            </div>
            <ShoppingBag className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Venta Promedio</p>
              <p className="text-2xl font-bold text-blue-600">{formatPrice(averageSale)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Items Vendidos</p>
              <p className="text-2xl font-bold text-purple-600">{totalItems}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Top Productos */}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Productos Más Vendidos</h3>
          <div className="space-y-3">
            {topProducts.map(([name, data], index) => (
              <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-600 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{name}</p>
                    <p className="text-sm text-gray-500">{data.quantity} unidades vendidas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatPrice(data.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de ventas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Historial de Ventas</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sales.length > 0 ? sales.slice().reverse().map(sale => (
            <div key={sale.id} className="p-4 hover:bg-gray-50 transition">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedSale(expandedSale === sale.id ? null : sale.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">Venta #{sale.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(sale.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cliente: {sale.clientName || 'Cliente'}</p>
                      <p className="text-sm text-gray-500">{sale.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-green-600">{formatPrice(sale.total)}</p>
                  {expandedSale === sale.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Detalle expandido */}
              {expandedSale === sale.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-3">Productos:</h4>
                  <div className="space-y-2">
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">x{item.quantity}</p>
                          <p className="text-sm text-gray-600">{formatPrice(item.price)} c/u</p>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="p-12 text-center text-gray-500">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg">No hay ventas registradas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesView;