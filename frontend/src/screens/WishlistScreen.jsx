import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { Link } from 'react-router-dom';

const WishlistScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const wishlistIds =
    userInfo?.wishlist && userInfo.wishlist.length > 0
      ? userInfo.wishlist.join(',')
      : null;

  // ✅ HOOK IS ALWAYS CALLED
  const { data, isLoading, error } = useGetProductsQuery(
    wishlistIds ? { wishlist: wishlistIds } : {},
    { skip: !wishlistIds }
  );

  if (!userInfo) {
    return <Message>Please login to view wishlist</Message>;
  }

  if (!wishlistIds) {
    return (
      <>
        <Meta title='Wishlist' />
        <Message>
          Your wishlist is empty.
          <Link to='/' className='btn btn-light ms-2'>
            Go Back
          </Link>
        </Message>
      </>
    );
  }

  return (
    <>
      <Meta title='Wishlist' />
      <h1>My Wishlist</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          {data.products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default WishlistScreen;
