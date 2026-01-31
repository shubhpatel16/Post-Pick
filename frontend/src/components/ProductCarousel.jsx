// import { Link } from 'react-router-dom';
// import { Carousel, Image } from 'react-bootstrap';
// import Message from './Message';
// import { useGetTopProductsQuery } from '../slices/productsApiSlice';

// const ProductCarousel = () => {
//   const { data: products, isLoading, error } = useGetTopProductsQuery();

//   return isLoading ? null : error ? (
//     <Message variant='danger'>{error?.data?.message || error.error}</Message>
//   ) : (
//     <Carousel pause='hover' className='bg-primary mb-4'>
//       {products.map((product) => (
//         <Carousel.Item key={product._id}>
//           <Link to={`/product/${product._id}`}>
//             <Image src={product.image} alt={product.name} fluid />
//             <Carousel.Caption className='carousel-caption'>
//               <h2 className='text-white text-right'>
//                 {product.name} (${product.price})
//               </h2>
//             </Carousel.Caption>
//           </Link>
//         </Carousel.Item>
//       ))}
//     </Carousel>
//   );
// };

// export default ProductCarousel;


import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';

const ProductCarousel = () => {
  return (
    <Carousel pause='hover' className='bg-primary mb-4'>
      
      <Carousel.Item>
        <Link to='/'>
          <Image
            src='/images/img1.jpg'
            alt='Fashion Banner 1'
            fluid
          />
          <Carousel.Caption>
            <h2 className='text-white'>Latest Fashion Collection</h2>
          </Carousel.Caption>
        </Link>
      </Carousel.Item>

      <Carousel.Item>
        <Link to='/'>
          <Image
            src='/images/img2.jpg'
            alt='Fashion Banner 2'
            fluid
          />
          <Carousel.Caption>
            <h2 className='text-white'>Trending Styles 2026</h2>
          </Carousel.Caption>
        </Link>
      </Carousel.Item>

      <Carousel.Item>
        <Link to='/'>
          <Image
            src='/images/img3.jpg'
            alt='Fashion Banner 3'
            fluid
          />
          <Carousel.Caption>
            <h2 className='text-white'>New Arrivals</h2>
          </Carousel.Caption>
        </Link>
      </Carousel.Item>

    </Carousel>
  );
};

export default ProductCarousel;
