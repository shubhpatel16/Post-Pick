import { useDispatch, useSelector } from 'react-redux';
import { useToggleWishlistMutation } from '../slices/wishlistApiSlice';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-toastify';
import { setWishlist } from '../slices/wishlistSlice';

const Product = ({ product }) => {
  const dispatch = useDispatch(); // ✅ MOVE HERE

  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const [toggleWishlistApi] = useToggleWishlistMutation();

  const isInWishlist = wishlistItems.includes(product._id); // ✅ correct

  const toggleWishlist = async (productId) => {
    try {
      const response = await toggleWishlistApi(productId).unwrap();

      dispatch(setWishlist(response));

      const isNowInWishlist = response.some(
        (id) => id.toString() === productId.toString()
      );

      if (isNowInWishlist) {
        toast.success('Product added to wishlist');
      } else {
        toast.info('Product removed from wishlist');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Card className='my-3 p-3 rounded position-relative'>
      {userInfo && (
        <Button
          variant='light'
          className='position-absolute top-0 end-0 m-2'
          onClick={() => toggleWishlist(product._id)}
        >
          {/* ✅ FIXED HERE */}
          {isInWishlist ? <FaHeart color='red' /> : <FaRegHeart />}
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

        <Card.Text as='h3'>{formatCurrency(product.price)}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;