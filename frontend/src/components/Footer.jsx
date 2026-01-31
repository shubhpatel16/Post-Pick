import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row className="py-4">
          {/* Brand */}
          <Col md={4} sm={12} className="mb-3">
            <h5 className="footer-title">Post&Pick</h5>
            <p className="footer-text">
              Your one-stop fashion destination.  
              Discover the latest trends in clothing and lifestyle.
            </p>
          </Col>

          {/* Shop */}
          <Col md={2} sm={6} className="mb-3">
            <h6 className="footer-title">Shop</h6>
            <ul className="footer-links">
              <li><Link to="/">Men</Link></li>
              <li><Link to="/">Women</Link></li>
              <li><Link to="/">Kids</Link></li>
              <li><Link to="/">New Arrivals</Link></li>
            </ul>
          </Col>

          {/* Support */}
          <Col md={3} sm={6} className="mb-3">
            <h6 className="footer-title">Customer Support</h6>
            <ul className="footer-links">
              <li><Link to="/">Contact Us</Link></li>
              <li><Link to="/">FAQs</Link></li>
              <li><Link to="/">Returns</Link></li>
              <li><Link to="/">Track Order</Link></li>
            </ul>
          </Col>

          {/* Legal */}
          <Col md={3} sm={12}>
            <h6 className="footer-title">Legal</h6>
            <ul className="footer-links">
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms & Conditions</Link></li>
            </ul>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <Row>
          <Col className="text-center py-3 footer-bottom">
            © {currentYear} Post&Pick. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
