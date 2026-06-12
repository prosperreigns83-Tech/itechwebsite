const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Generate a modern, professional invoice PDF
 * @param {Object} order - Order data from database
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generateInvoicePDF(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header Section
      doc.fillColor('#1e3a8a') // Deep blue
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('INVOICE', 40, 40);

      doc.fillColor('#64748b')
        .fontSize(10)
        .font('Helvetica')
        .text(`Invoice #${order.referenceId}`, 40, 75)
        .text(`Order ID: ${order.id}`, 40, 88)
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 40, 101);

      // Status Badge
      doc.fillColor('#ffffff')
        .rect(40, 115, 80, 25)
        .fill('#10b981');
      
      doc.fillColor('#ffffff')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('PAID', 45, 122, { width: 70, align: 'center' });

      // Divider Line
      doc.strokeColor('#e2e8f0')
        .lineWidth(1)
        .moveTo(40, 155)
        .lineTo(555, 155)
        .stroke();

      // Bill From / Bill To Section
      doc.fillColor('#1e3a8a')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Bill To', 40, 170);

      doc.fillColor('#374151')
        .fontSize(11)
        .font('Helvetica')
        .text(order.customerName || 'Customer', 40, 192)
        .text(order.email || '', 40, 207)
        .text(order.address || '', 40, 222, { width: 250 });

      // Right side - Company Info
      doc.fillColor('#1e3a8a')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Bill From', 350, 170);

      doc.fillColor('#374151')
        .fontSize(10)
        .font('Helvetica')
        .text('Itech Website', 350, 192)
        .text('Your Address Here', 350, 207)
        .text('contact@itech.com', 350, 222)
        .text('+1 (555) 123-4567', 350, 237);

      // Products Table Header
      const tableTop = 280;
      const tableBottom = 500;
      const col1 = 40;
      const col2 = 280;
      const col3 = 430;
      const col4 = 510;

      doc.fillColor('#f3f4f6')
        .rect(40, tableTop, 515, 25)
        .fill();

      doc.fillColor('#1e3a8a')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('Product', col1, tableTop + 6, { width: 240 })
        .text('Qty', col2, tableTop + 6)
        .text('Price', col3, tableTop + 6)
        .text('Amount', col4, tableTop + 6, { width: 50, align: 'right' });

      // Products List
      let yPosition = tableTop + 35;
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item, index) => {
          const qty = item.quantity || 1;
          const price = parseFloat(item.price) || 0;
          const amount = qty * price;

          doc.fillColor('#374151')
            .fontSize(10)
            .font('Helvetica')
            .text(item.name || 'Product', col1, yPosition, { width: 240 })
            .text(qty.toString(), col2, yPosition)
            .text(`₦${price.toLocaleString()}`, col3, yPosition)
            .text(`₦${amount.toLocaleString()}`, col4, yPosition, { width: 50, align: 'right' });

          yPosition += 25;

          if (yPosition > tableBottom) {
            doc.addPage();
            yPosition = 40;
          }
        });
      }

      // Summary Section
      const summaryTop = Math.max(yPosition + 20, 420);
      
      doc.strokeColor('#e2e8f0')
        .lineWidth(1)
        .moveTo(280, summaryTop)
        .lineTo(555, summaryTop)
        .stroke();

      // Calculate totals
      const subtotal = order.items?.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0) || 0;
      const tax = Math.round(subtotal * 0.075 * 100) / 100; // 7.5% tax
      const total = subtotal + tax;

      doc.fillColor('#64748b')
        .fontSize(11)
        .font('Helvetica')
        .text('Subtotal:', 350, summaryTop + 15)
        .text('Tax (7.5%):', 350, summaryTop + 35)
        .text('Shipping:', 350, summaryTop + 55);

      doc.font('Helvetica')
        .text(`₦${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 470, summaryTop + 15, { width: 80, align: 'right' })
        .text(`₦${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 470, summaryTop + 35, { width: 80, align: 'right' })
        .text('₦0.00', 470, summaryTop + 55, { width: 80, align: 'right' });

      // Total Box
      doc.fillColor('#1e3a8a')
        .rect(350, summaryTop + 80, 205, 40)
        .fill();

      doc.fillColor('#ffffff')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Total:', 360, summaryTop + 90)
        .text(`₦${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 470, summaryTop + 90, { width: 75, align: 'right' });

      // Footer
      const footerTop = 740;
      doc.fillColor('#9ca3af')
        .fontSize(9)
        .font('Helvetica')
        .text('Thank you for your business! For support, contact us at contact@itech.com', 40, footerTop, { align: 'center', width: 515 })
        .text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 40, footerTop + 15, { align: 'center', width: 515 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateInvoicePDF };
