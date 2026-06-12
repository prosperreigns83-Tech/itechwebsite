import React, { useEffect, useState } from 'react';
import '../css/PaymentPage.css';
import { API_BASE } from '../utils/api';

/**
 * Payment Page - Redirects user to Paystack for payment
 * Handles both online payment and offline payment methods
 */
export default function PaymentPage({ orderData, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');

  useEffect(() => {
    console.log('PaymentPage received orderData:', orderData);
    console.log('PaymentPage received onNavigate:', onNavigate);
    
    if (!orderData) {
      console.log('No orderData, showing error');
      setError('No order data found. Redirecting to cart...');
      setTimeout(() => {
        if (onNavigate) onNavigate('cart');
      }, 2000);
      return;
    }

    console.log('Starting payment initialization with order:', orderData);
    setPaymentMethod('online');
    initializePayment();
  }, [orderData, onNavigate]);

  const initializePayment = async () => {
    try {
      const order = orderData;
      
      if (order.paymentMethod && order.paymentMethod !== 'Online Payment') {
        console.log('Processing offline payment:', order.paymentMethod);
        // Handle offline payment (Cash on Delivery, Bank Transfer)
        const response = await fetch(`${API_BASE}/api/payments/offline`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.orderId,
            customerEmail: order.email,
            customerName: order.customerName,
            amount: order.total,
            paymentMethod: order.paymentMethod,
            items: order.items,
            address: order.address,
            phone: order.phone
          })
        });

        const data = await response.json();
        console.log('Offline payment response:', data);
        
        if (data.success) {
          // Clear cart and redirect to success page
          localStorage.removeItem('cart');
          if (onNavigate) {
            onNavigate('payment-success', { orderId: order.orderId, offline: true, ...order });
          }
        } else {
          setError(data.message || 'Failed to process payment');
        }
      } else {
        // Handle online payment with Paystack
        console.log('Processing online Paystack payment');
        console.log('Sending to /api/payments/initialize:', {
          email: order.email,
          amount: order.total,
          orderId: order.orderId,
          customerName: order.customerName
        });
        
        const response = await fetch(`${API_BASE}/api/payments/initialize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: order.email,
            amount: order.total,
            orderId: order.orderId,
            customerName: order.customerName,
            items: order.items,
            address: order.address,
            phone: order.phone
          })
        });

        const data = await response.json();
        console.log('Payment initialization response:', data);

        if (data.success && data.data) {
          console.log('Redirecting to Paystack:', data.data.authorizationUrl);
          const lastOrderPayload = {
            ...order,
            paymentStatus: 'Payment Pending',
            orderDate: order.orderDate || new Date().toLocaleDateString(),
            paymentDate: order.paymentDate || new Date().toLocaleDateString(),
            deliveryMethod: order.deliveryMethod || 'Express Delivery (1-2 working days)',
            subtotal: order.subtotal || 0,
            deliveryFee: order.deliveryFee || 0,
            discount: order.discount || 0,
            tax: order.tax || 0,
            total: order.total || 0,
            savings: order.savings || 0,
            items: order.items || []
          };
          localStorage.setItem('lastOrder', JSON.stringify(lastOrderPayload));
          window.location.href = data.data.authorizationUrl;
        } else {
          console.error('Payment initialization failed:', data);
          setError(data.message || 'Failed to initialize payment');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const testPayment = async () => {
    try {
      setLoading(true);
      setError('');
      const order = orderData;
      
      console.log('🧪 Processing TEST PAYMENT');
      
      const response = await fetch('http://localhost:4000/api/payments/mock-initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: order.email,
          amount: order.total,
          orderId: order.orderId,
          customerName: order.customerName,
          items: order.items,
          address: order.address,
          phone: order.phone
        })
      });

      const data = await response.json();
      console.log('Test payment response:', data);

      if (data.success && data.data) {
        console.log('🧪 Test payment successful, redirecting...');
        window.location.href = data.data.authorizationUrl;
      } else {
        setError(data.message || 'Test payment failed');
      }
    } catch (err) {
      console.error('Test payment error:', err);
      setError(err.message || 'Test payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-loading">
        <div className="spinner"></div>
        <p>Processing your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-error">
        <h2>Payment Error</h2>
        <p>{error}</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <button onClick={() => onNavigate ? onNavigate('cart') : window.location.href = '/cart'} style={{ marginBottom: '10px' }}>Return to Cart</button>
          
          {(error.includes('404') || error.includes('fetch failed') || error.includes('Failed to initialize')) && (
            <button 
              onClick={testPayment}
              style={{ 
                backgroundColor: '#FF9800', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🧪 Use TEST PAYMENT (for testing)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="payment-processing">
      <h2>Payment Processing</h2>
      <p>You will be redirected to {paymentMethod === 'online' ? 'Paystack' : 'complete'} your payment...</p>
    </div>
  );
}
