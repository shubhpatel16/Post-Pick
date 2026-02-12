import { Row, Col, Card, Table } from 'react-bootstrap';
import { useGetDashboardStatsQuery } from '../../slices/adminApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Button } from 'react-bootstrap';

const AdminDashboardScreen = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();
  const stats = data || {};

  const exportCSV = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    window.open(
      `http://localhost:5001/api/admin/export-csv?token=${userInfo.token}`,
      '_blank'
    );
  };

  return (
    <>
      <h1 className='mb-4'>Admin Dashboard</h1>

      <Button variant='success' className='mb-3' onClick={exportCSV}>
        Export Sales CSV
      </Button>

      <Button
        className='mb-3 ms-3'
        onClick={() =>
          window.open('http://localhost:5001/api/admin/export-pdf', '_blank')
        }
      >
        Download PDF Report
      </Button>

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

          {/* Top Selling Products Chart */}
          <div className='card p-6 mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Top Selling Products</h2>

            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={stats.topSellingProducts}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='totalSold' fill='#6366f1' />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Distribution */}
          <div className='card p-6 mb-8'>
            <h2 className='text-2xl font-bold mb-4'>
              Order Status Distribution
            </h2>

            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Delivered', value: stats.deliveredOrders },
                    { name: 'Paid', value: stats.paidOrders },
                    { name: 'Unpaid', value: stats.unpaidOrders },
                  ]}
                  dataKey='value'
                  outerRadius={100}
                  label
                >
                  <Cell fill='#22c55e' />
                  <Cell fill='#3b82f6' />
                  <Cell fill='#f59e0b' />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Growth */}
          <div className='card p-6 mb-8'>
            <h2 className='text-2xl font-bold mb-4'>Customer Growth</h2>

            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={stats.customerGrowth}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='_id' />
                <YAxis />
                <Tooltip />
                <Line type='monotone' dataKey='total' stroke='#10b981' />
              </LineChart>
            </ResponsiveContainer>
          </div>

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
