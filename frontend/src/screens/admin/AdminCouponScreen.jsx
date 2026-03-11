import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const AdminCouponScreen = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const [editingId, setEditingId] = useState(null);

  const fetchCoupons = async () => {
    const { data } = await axios.get('/api/coupons');
    setCoupons(data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const editCoupon = (coupon) => {
    setCode(coupon.code);
    setDiscount(coupon.discount);
    setMinOrderAmount(coupon.minOrderAmount);
    setEditingId(coupon._id);
  };

  const saveCoupon = async () => {
    try {
      if (editingId) {
        await axios.put(
          `/api/coupons/${editingId}`,
          { code, discount, minOrderAmount, expiryDate },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
      } else {
        await axios.post(
          '/api/coupons',
          { code, discount, minOrderAmount, expiryDate },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
      }

      setEditingId(null);
      setCode('');
      setDiscount('');
      setMinOrderAmount('');
      setExpiryDate('');

      fetchCoupons();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    await axios.delete(`/api/coupons/${id}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    fetchCoupons();
  };

  const toggleCouponStatus = async (coupon) => {
    if (
      !window.confirm('Are you sure you want to change this coupon status?')
    ) {
      return;
    }

    try {
      await axios.put(
        `/api/coupons/${coupon._id}`,
        {
          code: coupon.code,
          discount: coupon.discount,
          minOrderAmount: coupon.minOrderAmount,
          expiryDate: coupon.expiryDate,
          isActive: !coupon.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      fetchCoupons();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Coupon Management</h2>

      <Form>
        <Form.Group>
          <Form.Label>Code</Form.Label>
          <Form.Control
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Discount %</Form.Label>
          <Form.Control
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Min Order Amount</Form.Label>
          <Form.Control
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Expiry Date</Form.Label>
          <Form.Control
            type='date'
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </Form.Group>

        <Button onClick={saveCoupon}>
          {editingId ? 'Update Coupon' : 'Create Coupon'}
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th className='text-center'>Code</th>
            <th className='text-center'>Discount</th>
            <th className='text-center'>Min Order</th>
            <th className='text-center'>Expiry</th>
            <th className='text-center'>Status</th>
            <th className='text-center'>Action</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id}>
              <td className='text-center'>{coupon.code}</td>

              <td className='text-center'>{coupon.discount}%</td>

              <td className='text-center'>₹{coupon.minOrderAmount}</td>

              <td className='text-center'>
                {coupon.expiryDate
                  ? new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'No Expiry'}
              </td>

              <td className='text-center'>
                {coupon.isActive ? (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>
                    Active
                  </span>
                ) : (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>
                    Inactive
                  </span>
                )}
              </td>

              <td className='text-center'>
                <Button
                  variant={coupon.isActive ? 'secondary' : 'success'}
                  size='sm'
                  style={{ marginRight: '10px' }}
                  onClick={() => toggleCouponStatus(coupon)}
                >
                  {coupon.isActive ? 'Inactive' : 'Active'}
                </Button>

                <Button
                  variant='warning'
                  size='sm'
                  style={{ marginRight: '10px' }}
                  onClick={() => editCoupon(coupon)}
                >
                  Edit
                </Button>

                <Button
                  variant='danger'
                  size='sm'
                  onClick={() => deleteCoupon(coupon._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminCouponScreen;
