import React from 'react';
import { assets } from '../assets/assets';

const styles = {
  container: {
    fontFamily: 'Poppins, Arial, sans-serif',
    width: 455, // A4 height in px for print
    margin: '0 auto',
    border: '1.5px solid #222',
    padding: '12px',
    background: '#fff',
    fontSize: 15,
    boxSizing: 'border-box',
    position: 'relative',
  },
  header: {
    display: 'flex',
    marginBottom: 2,
    gap: 1,
    border: 1,
  },
  logoImg: {
    width: 48,
    height: 48,
    objectFit: 'contain',
    marginRight: 10,
    display: 'block',
  },
  title: {
    fontWeight: 700,
    fontSize: 28,
    letterSpacing: '-1px',
    marginTop: 6,
  },
  section: {
    marginBottom: 14,
  },
  bold: {
    fontWeight: 600,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  th: {
    border: '1px solid #222',
    padding: '7px 4px',
    background: '#f7f7f7',
    fontWeight: 600,
    fontSize: 12,
    textAlign: 'left',
  },
  td: {
    border: '1px solid #222',
    padding: '7px 4px',
    fontSize: 12,
    verticalAlign: 'center',
  },
  totalRow: {
    fontWeight: 700,
    fontSize: 14,
    textAlign: 'right',
  },
  flexRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  amountWords: {
    fontWeight: 500,
    fontSize: 15,
    marginBottom: 6,
  },
  hr: {
    border: 0,
    borderTop: '1.5px solid #222',
    margin: '18px 0 10px 0',
  },
  seller: {
    fontSize: 15,
    marginTop: 0,
    lineHeight: 1.7,
  },
  label: {
    fontWeight: 600,
  },
};

function numberToWords(num) {
  // Simple number to words for up to 9999 (for demo)
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if (num === 0) return 'Zero';
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '');
  if (num < 1000) return a[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 10000) return a[Math.floor(num / 1000)] + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  return num;
}

const OrderSummaryPrint = ({ order, currency }) => {
  if (!order) return null;
  const shipping = order.shippingCharge || 1;
  const shippingDiscount = order.shippingDiscount || 0;
  const total = order.amount;
  const totalInWords = numberToWords(Number(total)).replace(/ +/g, ' ');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className='text-black text-xl font-semibold' style={{ lineHeight: 1.1 }}>Ink Dapper</div>
          <span className='text-black' style={styles.title}>Order Summary</span>
        </div>
      </div>
      <div style={styles.section}>
        <div><span className='text-black' style={styles.bold}>Order ID:</span> {order._id}</div>
        <div><span className='text-black' style={styles.bold}>Order Date:</span> {new Date(order.date).toLocaleDateString()}</div>
      </div>
      <div style={styles.section}>
        <div className='underline text-base text-black' style={styles.bold}>Shipping Address:</div>
        <div className='text-black' style={styles.bold}>{order.address.firstName} {order.address.lastName}</div>
        <div>{order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}.</div>
        <div>{order.address.country}</div>
        <div><span style={styles.bold} className='text-black'>Phone:</span> {order.address.phone}</div>
      </div>
      <table style={styles.table}>
        <thead>
          <tr className='text-black'>
            <th style={styles.th}>Sl. No</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>QTY</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Discount</th>
            <th style={styles.th}>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td style={styles.td}>{idx + 1}</td>
              <td style={styles.td}>{item.name} ({item.size})</td>
              <td style={styles.td}>{item.quantity}</td>
              <td style={styles.td}>{currency} {item.price}</td>
              <td style={styles.td}>{currency} 0.00</td>
              <td style={styles.td}>{currency} {(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td style={styles.td}></td>
            <td style={styles.td}>Shipping Charges</td>
            <td style={styles.td}></td>
            <td style={styles.td}>{currency} {shipping.toFixed(2)}</td>
            <td style={styles.td}>-{currency} {shippingDiscount.toFixed(2)}</td>
            <td style={styles.td}>{currency} {(shipping - shippingDiscount).toFixed(2)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className='text-black'>
            <td style={styles.td} colSpan={0}></td>
            <td className='' style={{ ...styles.td, fontWeight: 700 }} colSpan={4}>TOTAL: (Inclusive of ALL Tax)</td>
            <td style={{ ...styles.td, fontWeight: 700, fontSize: 16, textAlign: 'left' }}>{currency} {total}</td>
          </tr>
        </tfoot>
      </table>
      <div style={styles.amountWords}>
        <span style={styles.bold}>Amount in Words:</span> {totalInWords}
      </div>
      <div style={styles.flexRow}>
        <span><span style={styles.bold}>Payment Method:</span> {order.paymentMethod}</span>
        <span><span style={styles.bold}>Payment Status:</span> {order.payment ? 'Paid' : 'Pending'}</span>
      </div>
      <hr style={styles.hr} />
      <div style={styles.seller}>
        <div className='text-black underline' style={styles.bold}>Sold By:</div>
        <div className='text-black text-base font-semibold'>Ink Dapper</div>
        <div>1/1, Bazaar Street, Vettuvanam,</div>
        <div>Vellore, Tamil Nadu - 635809, India.</div>
        <div><span className='text-black' style={styles.bold}>Email:</span> support@inkdapper.com</div>
        <div><span className='text-black' style={styles.bold}>Phone:</span> 99940 05696</div>
      </div>
    </div>
  );
};

function printSection(sectionId, onClose) {
  const section = document.getElementById(sectionId);
  const printWindow = window.open('', 'Order', 'height=500,width=800');

  // Copy all stylesheets
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(node => node.outerHTML)
    .join('');

  printWindow.document.write('<html><head>' + styles + '</head><body>');
  printWindow.document.write(section.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  printWindow.onload = function () {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      if (typeof onClose === 'function') onClose();
    }, 500);
  };
}

export default OrderSummaryPrint; 