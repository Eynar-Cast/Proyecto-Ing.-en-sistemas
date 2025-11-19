import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Genera una factura en PDF
 */
export const generateInvoicePDF = async (sale, clientInfo, companyInfo = null) => {
  // Crear elemento temporal con la factura
  const invoiceElement = createInvoiceHTML(sale, clientInfo, companyInfo);
  
  // Agregar al DOM temporalmente
  document.body.appendChild(invoiceElement);
  
  try {
    // Convertir HTML a canvas
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    // Crear PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Guardar PDF
    pdf.save(`Factura-${sale.id}.pdf`);
    
  } finally {
    // Limpiar elemento temporal
    document.body.removeChild(invoiceElement);
  }
};

/**
 * Genera factura simple con jsPDF (sin HTML)
 */
export const generateSimpleInvoicePDF = (sale, clientInfo, companyInfo = null) => {
  const doc = new jsPDF();
  
  // Configuración de la empresa
  const company = companyInfo || {
    name: 'MaterialPro',
    subtitle: 'Materiales de Construcción',
    address: 'Calle Principal #123, Ciudad',
    phone: '(123) 456-7890',
    email: 'contacto@materialpro.com',
    taxId: 'RFC: XAXX010101000'
  };
  
  let yPosition = 20;
  
  // Encabezado de la empresa
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name, 105, yPosition, { align: 'center' });
  
  yPosition += 7;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(company.subtitle, 105, yPosition, { align: 'center' });
  
  yPosition += 15;
  
  // Información de la empresa
  doc.setFontSize(9);
  doc.text(company.address, 105, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text(`Tel: ${company.phone} | Email: ${company.email}`, 105, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text(company.taxId, 105, yPosition, { align: 'center' });
  
  yPosition += 10;
  
  // Línea divisoria
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  
  yPosition += 10;
  
  // Título FACTURA
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA', 105, yPosition, { align: 'center' });
  
  yPosition += 10;
  
  // Información de la factura
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Columna izquierda
  doc.text(`Factura #: ${sale.id}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Fecha: ${new Date(sale.date).toLocaleDateString('es-ES')}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Hora: ${new Date(sale.date).toLocaleTimeString('es-ES')}`, 20, yPosition);
  
  yPosition -= 12;
  
  // Columna derecha - Cliente
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 120, yPosition);
  doc.setFont('helvetica', 'normal');
  yPosition += 6;
  doc.text(clientInfo.fullName || sale.clientName, 120, yPosition);
  yPosition += 6;
  if (clientInfo.email) {
    doc.text(clientInfo.email, 120, yPosition);
    yPosition += 6;
  }
  if (clientInfo.phone) {
    doc.text(clientInfo.phone, 120, yPosition);
  }
  
  yPosition += 15;
  
  // Línea divisoria
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  
  yPosition += 8;
  
  // Encabezado de la tabla
  doc.setFillColor(79, 70, 229); // Indigo
  doc.rect(20, yPosition, 170, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Producto', 22, yPosition + 5.5);
  doc.text('Cantidad', 110, yPosition + 5.5);
  doc.text('Precio Unit.', 135, yPosition + 5.5);
  doc.text('Total', 170, yPosition + 5.5);
  
  yPosition += 10;
  
  // Resetear color de texto
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // Items de la venta
  sale.items.forEach((item, index) => {
    // Verificar si necesitamos nueva página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Alternar color de fondo
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, yPosition - 3, 170, 7, 'F');
    }
    
    doc.text(item.name, 22, yPosition);
    doc.text(item.quantity.toString(), 110, yPosition);
    doc.text(`$${item.price.toFixed(2)}`, 135, yPosition);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, yPosition);
    
    yPosition += 7;
  });
  
  yPosition += 5;
  
  // Línea divisoria
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  
  yPosition += 8;
  
  // Resumen de totales
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  
  const subtotal = sale.total;
  const iva = subtotal * 0.16; // 16% IVA (ajusta según tu país)
  const totalConIva = subtotal + iva;
  
  doc.text('Subtotal:', 135, yPosition);
  doc.text(`$${subtotal.toFixed(2)}`, 170, yPosition);
  
  yPosition += 6;
  doc.text('IVA (16%):', 135, yPosition);
  doc.text(`$${iva.toFixed(2)}`, 170, yPosition);
  
  yPosition += 8;
  doc.setFontSize(12);
  doc.text('TOTAL:', 135, yPosition);
  doc.text(`$${totalConIva.toFixed(2)}`, 170, yPosition);
  
  yPosition += 15;
  
  // Pie de página
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('Gracias por su compra', 105, yPosition, { align: 'center' });
  
  yPosition += 5;
  doc.text('Este documento es una representación impresa de una factura electrónica', 105, yPosition, { align: 'center' });
  
  // Guardar PDF
  doc.save(`Factura-${sale.id}.pdf`);
};

/**
 * Crea elemento HTML para la factura
 */
const createInvoiceHTML = (sale, clientInfo, companyInfo) => {
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.left = '-9999px';
  div.style.width = '210mm'; // A4 width
  div.style.padding = '20mm';
  div.style.backgroundColor = 'white';
  div.style.fontFamily = 'Arial, sans-serif';
  
  const company = companyInfo || {
    name: 'MaterialPro',
    subtitle: 'Materiales de Construcción',
    address: 'Calle Principal #123, Ciudad',
    phone: '(123) 456-7890',
    email: 'contacto@materialpro.com'
  };
  
  div.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="margin: 0; color: #4F46E5; font-size: 28px;">${company.name}</h1>
      <p style="margin: 5px 0; color: #666; font-size: 14px;">${company.subtitle}</p>
      <p style="margin: 5px 0; font-size: 12px; color: #888;">${company.address}</p>
      <p style="margin: 5px 0; font-size: 12px; color: #888;">Tel: ${company.phone} | Email: ${company.email}</p>
    </div>
    
    <div style="border-top: 2px solid #4F46E5; border-bottom: 2px solid #4F46E5; padding: 15px 0; margin-bottom: 20px;">
      <h2 style="text-align: center; margin: 0; font-size: 24px;">FACTURA</h2>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
      <div>
        <p style="margin: 5px 0;"><strong>Factura #:</strong> ${sale.id}</p>
        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date(sale.date).toLocaleDateString('es-ES')}</p>
        <p style="margin: 5px 0;"><strong>Hora:</strong> ${new Date(sale.date).toLocaleTimeString('es-ES')}</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 5px 0;"><strong>Cliente:</strong></p>
        <p style="margin: 5px 0;">${clientInfo.fullName || sale.clientName}</p>
        ${clientInfo.email ? `<p style="margin: 5px 0;">${clientInfo.email}</p>` : ''}
        ${clientInfo.phone ? `<p style="margin: 5px 0;">${clientInfo.phone}</p>` : ''}
      </div>
    </div>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #4F46E5; color: white;">
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Producto</th>
          <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Cantidad</th>
          <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Precio Unit.</th>
          <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${sale.items.map((item, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? '#f9fafb' : 'white'};">
            <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div style="text-align: right; margin-top: 30px;">
      <p style="margin: 5px 0; font-size: 16px;"><strong>Subtotal:</strong> $${sale.total.toFixed(2)}</p>
      <p style="margin: 5px 0; font-size: 16px;"><strong>IVA (16%):</strong> $${(sale.total * 0.16).toFixed(2)}</p>
      <p style="margin: 15px 0 0 0; font-size: 20px; color: #4F46E5;"><strong>TOTAL:</strong> $${(sale.total * 1.16).toFixed(2)}</p>
    </div>
    
    <div style="margin-top: 50px; text-align: center; color: #888; font-size: 12px;">
      <p>Gracias por su compra</p>
      <p>Este documento es una representación impresa de una factura electrónica</p>
    </div>
  `;
  
  return div;
};