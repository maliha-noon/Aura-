import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-center d-flex align-items-center position-relative animate-fade-in" style={{
        minHeight: '80vh',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <Container className="position-relative z-1">
          <Row className="justify-content-start text-start">
            <Col lg={8}>
              <h1 className="display-3 fw-bold mb-2 animate-fade-in-up">Experience the</h1>
              <h1 className="display-3 fw-bold text-red mb-3 animate-fade-in-up delay-100">Ultimate</h1>
              <h1 className="display-3 fw-bold mb-4 animate-fade-in-up delay-200">Event Experience</h1>
              <p className="lead mb-5 text-light animate-fade-in-up delay-300" style={{ maxWidth: '600px' }}>
                Book your tickets to the most exclusive events, concerts, and festivals.
                Join thousands of fans experiencing unforgettable moments with AURA++.
              </p>
              <div className="d-flex gap-3 animate-fade-in-up delay-400">
                <Button variant="danger" size="lg" className="btn-primary-custom px-4 py-2 hover-scale">
                  Explore Events
                </Button>
                <Button variant="outline-light" size="lg" className="px-4 py-2 hover-scale">
                  Learn More
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-black">
        <Container className="py-5">
          <div className="text-center mb-5 animate-fade-in-up delay-500">
            <h2 className="display-5 fw-bold mb-3">Why Choose <span className="text-red">AURA++</span></h2>
            <p className="text-red fs-5">The ultimate platform for event enthusiasts</p>
          </div>

          <Row className="g-4">
            <Col md={4} className="animate-fade-in-up delay-100">
              <Card className="card-custom h-100 text-white hover-scale">
                <Card.Body>
                  <div className="display-4 mb-3 hover-rotate" style={{ display: 'inline-block' }}>🎭</div>
                  <Card.Title className="h4 mb-3">Exclusive Events</Card.Title>
                  <Card.Text className="text-red">
                    Access to the hottest concerts, festivals, and exclusive gatherings
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="animate-fade-in-up delay-200">
              <Card className="card-custom h-100 text-white hover-scale">
                <Card.Body>
                  <div className="display-4 text-warning mb-3 hover-rotate" style={{ display: 'inline-block' }}>⚡</div>
                  <Card.Title className="h4 mb-3">Instant Booking</Card.Title>
                  <Card.Text className="text-red">
                    Book your tickets instantly with our seamless checkout process
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="animate-fade-in-up delay-300">
              <Card className="card-custom h-100 text-white hover-scale">
                <Card.Body>
                  <div className="display-4 text-success mb-3 hover-rotate" style={{ display: 'inline-block' }}>🔒</div>
                  <Card.Title className="h4 mb-3">Secure Payment</Card.Title>
                  <Card.Text className="text-red">
                    Safe and secure payment options for your peace of mind
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 text-center" style={{ background: 'linear-gradient(to right, #4a000a, #000000)' }}>
        <Container className="py-5 animate-fade-in-up">
          <h2 className="display-5 fw-bold mb-3">Ready to Experience the Aura?</h2>
          <p className="lead mb-4 text-light">Join thousands of event-goers and create unforgettable memories</p>
          <Button variant="light" size="lg" className="px-5 py-3 fw-bold text-dark hover-scale animate-pulse" onClick={() => navigate('/register')}>
            Get Started Now
          </Button>
        </Container>
      </section>
    </div>
  );
}
