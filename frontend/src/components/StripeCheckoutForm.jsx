import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';

const cardOptions = {
  style: {
    base: {
      color: 'var(--bs-body-color)',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#888',
      },
    },
    invalid: {
      color: '#ff4d4f',
    },
  },
};

const StripeCheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/payments/create-payment-intent', {
        amount: order.totalPrice,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        await axios.put(`/api/orders/${order._id}/pay`, {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: 'stripe-payment',
        });

        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setError('Payment failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid rgba(0,0,0,0.1)',
        background: 'var(--bs-body-bg)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <h5 style={{ marginBottom: '15px' }}>💳 Secure Card Payment</h5>

      <div
        style={{
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          background: 'var(--bs-body-bg)',
        }}
      >
        <CardElement options={cardOptions} />
      </div>

      {error && (
        <Alert variant='danger' className='mt-3'>
          ❌ {error}
        </Alert>
      )}

      {success && (
        <Alert variant='success' className='mt-3'>
          ✅ Payment Successful!
        </Alert>
      )}

      <Button
        type='submit'
        className='mt-3 w-100'
        disabled={!stripe || loading}
        style={{
          background: '#635bff',
          border: 'none',
          fontWeight: '600',
        }}
      >
        {loading ? (
          <>
            <Spinner animation='border' size='sm' /> Processing...
          </>
        ) : (
          `Pay ₹${order.totalPrice}`
        )}
      </Button>

      <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.7 }}>
        Visa • Mastercard • American Express supported
      </div>
    </form>
  );
};

export default StripeCheckoutForm;
