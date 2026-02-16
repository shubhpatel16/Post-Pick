import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header>
      <Navbar
        expand='lg'
        fixed='top'
        className='premium-navbar'
        collapseOnSelect
        variant='dark'
      >
        <Container>
          {/* Brand */}
          <Navbar.Brand as={Link} to='/' className='brand-logo'>
            <img
              src={logo}
              alt='Post&Pick'
              style={{ height: '35px', marginRight: '8px' }}
            />
            POST & PICK
          </Navbar.Brand>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />

          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto align-items-center'>
              {/* Categories */}
              <NavDropdown
                title='Categories'
                id='categories'
                className='nav-dropdown-custom'
              >
                <NavDropdown.Item as={Link} to='/category/men'>
                  Men
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/category/women'>
                  Women
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/category/kids'>
                  Kids
                </NavDropdown.Item>
              </NavDropdown>

              {/* Search */}
              <div className='mx-3'>
                <SearchBox />
              </div>

              <Nav.Link onClick={toggleTheme} className='nav-link-custom'>
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
              </Nav.Link>

              {/* Wishlist */}
              <Nav.Link as={Link} to='/wishlist' className='nav-link-custom'>
                <FaHeart /> Wishlist
              </Nav.Link>

              {/* Cart */}
              <Nav.Link
                as={Link}
                to='/cart'
                className='nav-link-custom position-relative'
              >
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <Badge pill bg='light' text='dark' className='cart-badge'>
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>

              {/* User */}
              {userInfo ? (
                <NavDropdown
                  title={userInfo.name}
                  id='username'
                  className='nav-dropdown-custom'
                >
                  <NavDropdown.Item as={Link} to='/profile'>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to='/login' className='nav-link-custom'>
                  <FaUser /> Sign In
                </Nav.Link>
              )}

              {/* Admin */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title='Admin'
                  id='adminmenu'
                  className='nav-dropdown-custom'
                >
                  <NavDropdown.Item as={Link} to='/admin/productlist'>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/orderlist'>
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/userlist'>
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/dashboard'>
                    Dashboard
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
