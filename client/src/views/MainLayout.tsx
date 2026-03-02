import React, { ReactNode } from "react";
import { Button, Container, Nav, Navbar, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface BaseLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <Navbar expand="lg" className="navbar-custom sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand">
            AURA<span className="text-red">++</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-secondary" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/">HOME</Nav.Link>
              <Nav.Link as={Link} to="/events">EVENT</Nav.Link>
              <Nav.Link as={Link} to="/about">ABOUT</Nav.Link>
              <Nav.Link as={Link} to="/gallery">GALLERY</Nav.Link>
              {isAdmin && (
                <Nav.Link as={Link} to="/admin" className="text-warning fw-bold">DASHBOARD</Nav.Link>
              )}
              {isAuthenticated ? (
                <>
                  <span className="text-danger ms-3 me-2 fw-bold">Hi, {user?.name}</span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">LOGIN</Nav.Link>
                  <Button
                    variant="danger"
                    className="btn-primary-custom ms-3"
                    onClick={() => navigate("/register")}
                  >
                    REGISTER
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="p-0">
        {children}
      </main>

      <footer className="footer-premium pt-5 pb-4 mt-auto border-top border-dark">
        <Container>
          <Row>
            <Col lg={4} className="mb-4 mb-lg-0">
              <h4 className="fw-bold mb-4 font-outfit">AURA<span className="text-red">++</span></h4>
              <p className="text-muted small pe-lg-5">
                The ultimate platform for discovering and booking exclusive events. Join us to experience the best concerts, festivals, and more.
              </p>
            </Col>
            <Col lg={2} md={4} className="mb-4 mb-lg-0">
              <h6 className="text-white fw-bold mb-3">Quick Links</h6>
              <ul className="list-unstyled footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
              </ul>
            </Col>
            <Col lg={2} md={4} className="mb-4 mb-lg-0">
              <h6 className="text-white fw-bold mb-3">Accounts</h6>
              <ul className="list-unstyled footer-links">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/terms">Terms</Link></li>
                <li><Link to="/privacy">Privacy</Link></li>
              </ul>
            </Col>
            <Col lg={4} md={4}>
              <h6 className="text-white fw-bold mb-3">Contact Us</h6>
              <ul className="list-unstyled footer-links">
                <li className="text-muted small mb-2">
                  <span className="text-red me-2">📍</span> Radisson Blu, Dhaka, Bangladesh
                </li>
                <li className="text-muted small mb-2">
                  <span className="text-red me-2">✉️</span> eventica@gmail.com
                </li>
                <li className="text-muted small mb-2">
                  <span className="text-red me-2">📞</span> +880 1234 567 890
                </li>
              </ul>
            </Col>
          </Row>
          <hr className="border-secondary opacity-10 my-4" />
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 text-muted small">&copy; {new Date().getFullYear()} AURA++. All rights reserved.</p>
            <div className="social-links d-flex gap-3">
              <span className="text-muted small cursor-pointer hover-text-red">FB</span>
              <span className="text-muted small cursor-pointer hover-text-red">IG</span>
              <span className="text-muted small cursor-pointer hover-text-red">TW</span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;
