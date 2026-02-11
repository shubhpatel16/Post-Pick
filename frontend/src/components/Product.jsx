import { useDispatch } from 'react-redux';
import { toggleWishlistLocal } from '../slices/authSlice';
import { useToggleWishlistMutation } from '../slices/wishlistApiSlice';
import { useSelector } from 'react-redux';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Product = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const [toggleWishlistApi] = useToggleWishlistMutation();

  const isWishlisted = userInfo?.wishlist?.includes(product._id);

  const toggleWishlist = async (productId) => {
    try {
      await toggleWishlistApi(productId);
      dispatch(toggleWishlistLocal(productId));
    } catch (error) {
      console.error(error);
    }
  };
  const dispatch = useDispatch();

  return (
    <Card className='my-3 p-3 rounded position-relative'>
      {userInfo && (
        <Button
          variant='light'
          className='position-absolute top-0 end-0 m-2'
          onClick={() => toggleWishlist(product._id)}
        >
          {isWishlisted ? <FaHeart color='red' /> : <FaRegHeart />}
        </Button>
      )}

      <Link to={`/product/${product._id}`}>
        <div className='product-image-wrapper'>
          <Card.Img
            src={product.image}
            variant='top'
            className='product-image'
          />
        </div>
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
