import React, { ReactNode } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
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
              <Nav.Link as={Link} to="/">EVENT</Nav.Link>
              <Nav.Link as={Link} to="/">ABOUT</Nav.Link>
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

      <footer className="bg-black text-white py-4 mt-auto border-top border-dark">
        <Container>
          <p className="mb-0">&copy; {new Date().getFullYear()} AURA++. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;
