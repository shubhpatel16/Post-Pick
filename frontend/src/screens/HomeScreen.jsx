import { Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { useGetTrendingQuery } from '../slices/productsApiSlice';
import { useLocation } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const { pageNumber, keyword, category } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
    minPrice,
    maxPrice,
    sort,
  });

  const { data: trending } = useGetTrendingQuery();

  const location = useLocation();
  const smartResults = location.state?.smartResults;

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}

      <Row className='mb-4 align-items-end'>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Min Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Min'
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Max Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Max'
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group>
            <Form.Label>Sort By</Form.Label>
            <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value='newest'>Newest</option>
              <option value='price_asc'>Price: Low to High</option>
              <option value='price_desc'>Price: High to Low</option>
              <option value='rating'>Top Rated</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={2}>
          <Button
            className='w-100'
            onClick={() =>
              navigate(
                category
                  ? `/category/${category}?minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`
                  : `/?minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`
              )
            }
          >
            Apply
          </Button>
        </Col>
      </Row>
      {/* 🔼 PRICE FILTER END */}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Latest Products</h1>

          {/* ========== TRENDING NOW SECTION ========== */}
          {trending && trending.length > 0 && (
            <>
              <h2 className='mt-4 mb-3'>🔥 Trending Now</h2>
              <Row>
                {trending.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <hr />
            </>
          )}

          <Row>
            {(smartResults || data.products).map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <Paginate
            pages={data.pages}
            page={data.page}
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sort={sort}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
