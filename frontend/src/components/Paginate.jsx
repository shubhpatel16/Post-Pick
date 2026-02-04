import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Paginate = ({
  pages,
  page,
  keyword = '',
  category = '',
  minPrice = '',
  maxPrice = '',
  isAdmin = false,
}) => {
  if (pages <= 1) return null;

  return (
    <Pagination>
      {[...Array(pages).keys()].map((x) => (
        <Pagination.Item
          key={x + 1}
          active={x + 1 === page}
          as={Link}
          to={
            !isAdmin
              ? `/${category ? `category/${category}` : ''}?pageNumber=${x + 1}${
                  keyword ? `&keyword=${keyword}` : ''
                }${minPrice ? `&minPrice=${minPrice}` : ''}${
                  maxPrice ? `&maxPrice=${maxPrice}` : ''
                }`
              : `/admin/productlist/${x + 1}`
          }
        >
          {x + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default Paginate;
