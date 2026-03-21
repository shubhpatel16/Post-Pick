import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { formatCurrency } from '../utils/formatCurrency';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const [isVIP, setIsVIP] = React.useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }

    const fetchCoupons = async () => {
      try {
        const res = await fetch('/api/coupons');
        const data = await res.json();
        setCoupons(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchVIPStatus = async () => {
      try {
        const res = await fetch('/api/vip', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        const data = await res.json();

        setIsVIP(data.isVIP);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCoupons();
    fetchVIPStatus();
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate, userInfo]);

  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [couponError, setCouponError] = React.useState('');
  const [coupons, setCoupons] = React.useState([]);

  const calculatedTotal =
    Number(cart.itemsPrice || 0) +
    Number(cart.taxPrice || 0) +
    Number(cart.shippingPrice || 0);

  const finalTotal = calculatedTotal - Number(discount || 0);

  const placeOrderHandler = async () => {
    // Minimum order validation
    if (cart.totalPrice < 100) {
      alert('Minimum order amount is ₹100');
      return;
    }

    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: finalTotal > 0 ? finalTotal : 0,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const applyCouponHandler = async (selectedCode = couponCode) => {
    try {
      const orderTotal =
        Number(cart.itemsPrice) +
        Number(cart.taxPrice) +
        Number(cart.shippingPrice);

      const response = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          code: selectedCode,
          orderTotal: orderTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid coupon');
      }

      setCouponCode(selectedCode);
      setDiscount(Number(data.discount));
      setCouponError('');
      toast.success('Coupon applied successfully');
    } catch (error) {
      setCouponError(error.message);
      toast.error(error.message || 'Invalid coupon');
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {formatCurrency(item.price)} ={' '}
                          {formatCurrency(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>{formatCurrency(cart.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{formatCurrency(cart.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>{formatCurrency(cart.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <h6>
                  {isVIP ? (
                    <span style={{ color: '#FFD700' }}>
                      ⭐ VIP Coupons Available
                    </span>
                  ) : (
                    <span style={{ color: 'gray' }}>
                      🔒 VIP Coupons (Become VIP to unlock)
                    </span>
                  )}
                </h6>

                {coupons
                  .filter(
                    (coupon) => coupon.isActive && (!coupon.vipOnly || isVIP)
                  )
                  .map((coupon) => (
                    <Button
                      key={coupon._id}
                      className='w-100 mb-2'
                      variant='outline-dark'
                      onClick={() => applyCouponHandler(coupon.code)}
                    >
                      {coupon.code} - {coupon.discount}% OFF (Min ₹
                      {coupon.minOrderAmount})
                    </Button>
                  ))}

                {couponError && (
                  <div style={{ color: 'red', marginTop: '5px' }}>
                    {couponError}
                  </div>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <input
                  type='text'
                  placeholder='Select a coupon above'
                  value={couponCode}
                  readOnly
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '8px',
                  }}
                />

                <Button
                  className='w-100'
                  onClick={() => applyCouponHandler()}
                  disabled={!couponCode}
                >
                  Apply Coupon
                </Button>

                {couponError && (
                  <div style={{ color: 'red', marginTop: '5px' }}>
                    {couponError}
                  </div>
                )}
              </ListGroup.Item>
              {discount > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Discount</Col>
                    <Col>- {formatCurrency(discount)}</Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{formatCurrency(finalTotal)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant='danger'>{error.data.message}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
