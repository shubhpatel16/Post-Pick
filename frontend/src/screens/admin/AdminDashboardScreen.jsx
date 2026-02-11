import { Row, Col, Card, Table } from 'react-bootstrap';
import { useGetDashboardStatsQuery } from '../../slices/adminApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboardScreen = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  return (
    <>
      <h1 className='mb-4'>Admin Dashboard</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {/* Stats Cards */}
          <Row className='mb-4'>
            <Col md={3}>
              <Card className='p-3 text-center'>
                <h6>Total Orders</h6>
                <h3>{data.totalOrders}</h3>
              </Card>
            </Col>

            <Col md={3}>
              <Card className='p-3 text-center'>
                <h6>Total Revenue</h6>
                <h3>${data.totalRevenue.toFixed(2)}</h3>
              </Card>
            </Col>

            <Col md={3}>
              <Card className='p-3 text-center'>
                <h6>Total Users</h6>
                <h3>{data.totalUsers}</h3>
              </Card>
            </Col>

            <Col md={3}>
              <Card className='p-3 text-center'>
                <h6>Total Products</h6>
                <h3>{data.totalProducts}</h3>
              </Card>
            </Col>
          </Row>

          {/* 📊 Monthly Revenue Chart */}
          <Card className='p-3 mb-4'>
            <h4 className='mb-3'>Monthly Revenue</h4>

            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='_id' />
                <YAxis />
                <Tooltip />
                <Line type='monotone' dataKey='total' stroke='#8884d8' />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* 📦 Low Stock Alert */}
          <Card className='p-3 mb-4'>
            <h4>Low Stock Products</h4>

            {data.lowStockProducts.length === 0 ? (
              <p>All products sufficiently stocked</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lowStockProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.countInStock}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>


          {/* Recent Orders */}
          <Card className='p-3'>
            <h4 className='mb-3'>Recent Orders</h4>

            {data.recentOrders.length === 0 ? (
              <Message>No recent orders</Message>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.slice(-6)}</td>
                      <td>{order.user?.name}</td>
                      <td>${order.totalPrice}</td>
                      <td>{order.isPaid ? 'Yes' : 'No'}</td>
                      <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      )}
    </>
  );
};

export default AdminDashboardScreen;
