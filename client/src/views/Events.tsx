import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const apiClient = new ApiClient();

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    city_country: string;
    image: string;
    price: number;
    capacity: number;
    is_booked?: boolean;
    is_live?: boolean;
}

export default function Events() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash'>('card');
    const [processingPayment, setProcessingPayment] = useState(false);
    const [ticketQuantity, setTicketQuantity] = useState(1);

    useEffect(() => {
        fetchEvents();
        // Set up an interval to refresh "live" status every minute
        const interval = setInterval(fetchEvents, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        const res = await apiClient.getEvents();
        if (res.success) {
            setEvents(res.data);
        } else {
            toast.error(res.message || 'Failed to load events');
        }
        setLoading(false);
    };

    const handleBookClick = (event: Event) => {
        if (!isAuthenticated) {
            toast.error('Please login to book an event');
            navigate('/login');
            return;
        }
        setSelectedEvent(event);
        setTicketQuantity(1); // Reset to 1 when opening modal
        setShowPayment(true);
    };

    const handlePaymentSubmit = async () => {
        if (!selectedEvent) return;

        setProcessingPayment(true);
        const loadingToast = toast.loading(`Processing ${paymentMethod === 'bkash' ? 'bKash' : 'Card'} payment...`);

        try {
            const res = await apiClient.bookEvent(selectedEvent.id, paymentMethod, ticketQuantity);
            toast.dismiss(loadingToast);

            if (res.success) {
                toast.success('Payment successful! Your tickets are confirmed.', {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
                setShowPayment(false);
                fetchEvents(); // Refresh to show "BOOKED" status
            } else {
                toast.error(res.message || 'Booking failed');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('An error occurred during payment');
        } finally {
            setProcessingPayment(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="events-page bg-black text-white min-vh-100 py-5">
            <Container>
                <div className="d-flex justify-content-between align-items-end mb-5 animate-fade-in">
                    <div>
                        <h1 className="display-4 fw-bold">Upcoming <span className="text-red">Events</span></h1>
                        <p className="lead opacity-75">Discover and book tickets for amazing events live</p>
                    </div>
                    <div className="text-end">
                        <Badge bg="danger" className="p-2 pulse-animation" style={{ fontSize: '1rem' }}>
                            LIVE CAST ACTIVE
                        </Badge>
                        <div className="mt-1 small opacity-50">Local Time: {new Date().toLocaleTimeString()}</div>
                    </div>
                </div>

                {loading && events.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <Row className="g-4">
                        {events.map((event) => (
                            <Col key={event.id} lg={4} md={6}>
                                <Card className={`h-100 text-white border-0 overflow-hidden shadow-lg animate-fade-in-up ${event.is_live ? 'border-live' : ''}`}
                                    style={{
                                        backgroundColor: '#0a0a0a',
                                        borderRadius: '20px',
                                        transition: 'transform 0.3s ease',
                                        border: event.is_live ? '2px solid #D90429' : '1px solid rgba(255, 255, 255, 0.05)',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {event.is_booked && (
                                        <div className="booked-overlay d-flex align-items-center justify-content-center" style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(0,0,0,0.6)',
                                            zIndex: 10,
                                            borderRadius: '20px',
                                            backdropFilter: 'blur(2px)'
                                        }}>
                                            <div className="text-center">
                                                <Badge bg="success" className="p-3 fs-4" style={{ borderRadius: '15px', boxShadow: '0 0 20px rgba(40, 167, 69, 0.5)' }}>
                                                    ✓ BOOKED
                                                </Badge>
                                            </div>
                                        </div>
                                    )}

                                    <div className="position-relative">
                                        <Card.Img
                                            variant="top"
                                            src={event.image || 'https://via.placeholder.com/400x300'}
                                            style={{ height: '240px', objectFit: 'cover' }}
                                        />
                                        <Badge
                                            bg="danger"
                                            className="position-absolute top-0 end-0 m-3 px-3 py-2"
                                            style={{ borderRadius: '20px', fontSize: '0.9rem', backgroundColor: '#D90429' }}
                                        >
                                            BDT {Math.round(event.price)}
                                        </Badge>
                                        {event.is_live && (
                                            <Badge
                                                bg="danger"
                                                className="position-absolute top-0 start-0 m-3 px-3 py-2 animate-pulse"
                                                style={{ borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}
                                            >
                                                ● LIVE NOW
                                            </Badge>
                                        )}
                                    </div>
                                    <Card.Body className="p-4">
                                        <Card.Title className="h3 fw-bold mb-3">{event.title}</Card.Title>

                                        <div className="d-flex align-items-start mb-3 opacity-75">
                                            <span className="me-2 mt-1">📍</span>
                                            <div>
                                                <div style={{ fontSize: '0.95rem' }}>{event.location}</div>
                                                <div style={{ fontSize: '0.85rem' }} className="fw-bold">{event.city_country}</div>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center mb-4 opacity-75">
                                            <span className="me-2">📅</span>
                                            <span style={{ fontSize: '0.95rem' }}>{formatDate(event.date)}</span>
                                        </div>

                                        <Button
                                            variant="danger"
                                            className="w-100 py-3 fw-bold"
                                            style={{
                                                backgroundColor: event.is_booked ? '#333' : '#D90429',
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontSize: '1.1rem'
                                            }}
                                            onClick={() => handleBookClick(event)}
                                            disabled={event.is_booked}
                                        >
                                            {event.is_booked ? 'Already Booked' : 'Book Now'}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {!loading && events.length === 0 && (
                    <div className="text-center py-5">
                        <h3>No events found.</h3>
                    </div>
                )}
            </Container>

            {/* Payment Modal */}
            <Modal show={showPayment} onHide={() => !processingPayment && setShowPayment(false)} centered contentClassName="bg-dark text-white border-secondary">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="fw-bold">Confirm Booking & Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedEvent && (
                        <div className="mb-4 p-3 bg-black rounded border border-secondary">
                            <h5 className="text-red">{selectedEvent.title}</h5>
                            <div className="small opacity-75 mb-3">{formatDate(selectedEvent.date)}</div>

                            <Row className="align-items-center mb-3">
                                <Col xs={6}>
                                    <Form.Label className="mb-0 fw-bold">Number of Tickets</Form.Label>
                                </Col>
                                <Col xs={6}>
                                    <div className="d-flex align-items-center bg-dark rounded border border-secondary">
                                        <Button
                                            variant="link"
                                            className="text-white text-decoration-none px-3 py-1 fs-4"
                                            onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                                            disabled={ticketQuantity <= 1}
                                        >
                                            -
                                        </Button>
                                        <div className="flex-grow-1 text-center fw-bold fs-5">{ticketQuantity}</div>
                                        <Button
                                            variant="link"
                                            className="text-white text-decoration-none px-3 py-1 fs-4"
                                            onClick={() => setTicketQuantity(ticketQuantity + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-between align-items-end mt-2 pt-2 border-top border-secondary">
                                <div className="small opacity-75">Total Price</div>
                                <div className="fw-bold fs-3 text-red">BDT {Math.round(selectedEvent.price * ticketQuantity)}</div>
                            </div>
                        </div>
                    )}

                    <h6 className="mb-3 fw-bold">Select Payment Method</h6>
                    <Row className="g-3 mb-4">
                        <Col xs={6}>
                            <div
                                className={`payment-option p-3 text-center rounded border cursor-pointer ${paymentMethod === 'bkash' ? 'border-danger bg-danger-subtle' : 'border-secondary'}`}
                                onClick={() => setPaymentMethod('bkash')}
                                style={{ transition: 'all 0.2s', cursor: 'pointer', background: paymentMethod === 'bkash' ? 'rgba(217, 4, 41, 0.1)' : 'transparent' }}
                            >
                                <img src="https://raw.githubusercontent.com/tushar-halder/bkash-payment-gateway/master/bkash_logo.png" alt="bKash" height="30" className="mb-2" />
                                <div className="small fw-bold">bKash</div>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div
                                className={`payment-option p-3 text-center rounded border cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary-subtle' : 'border-secondary'}`}
                                onClick={() => setPaymentMethod('card')}
                                style={{ transition: 'all 0.2s', cursor: 'pointer', background: paymentMethod === 'card' ? 'rgba(0, 123, 255, 0.1)' : 'transparent' }}
                            >
                                <div className="h3 mb-2">💳</div>
                                <div className="small fw-bold">Credit Card</div>
                            </div>
                        </Col>
                    </Row>

                    {paymentMethod === 'card' && (
                        <Form className="animate-fade-in">
                            <Form.Group className="mb-3">
                                <Form.Label className="small opacity-75">Card Number</Form.Label>
                                <Form.Control className="bg-black text-white border-secondary" placeholder="xxxx xxxx xxxx xxxx" />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small opacity-75">Expiry</Form.Label>
                                        <Form.Control className="bg-black text-white border-secondary" placeholder="MM/YY" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small opacity-75">CVV</Form.Label>
                                        <Form.Control className="bg-black text-white border-secondary" placeholder="***" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    )}

                    {paymentMethod === 'bkash' && (
                        <div className="text-center p-3 mb-4 rounded bg-black border border-secondary animate-fade-in">
                            <Form.Group className="mb-3">
                                <Form.Label className="small opacity-75">Enter bKash Number</Form.Label>
                                <Form.Control className="bg-black text-white border-secondary text-center fs-5" placeholder="017xxxxxxxx" maxLength={11} />
                            </Form.Group>
                            <div className="small opacity-50">An OTP will be sent to your number</div>
                        </div>
                    )}

                    <Button
                        variant="danger"
                        className="w-100 py-3 fw-bold mt-2"
                        style={{ backgroundColor: '#D90429', border: 'none', borderRadius: '12px' }}
                        onClick={handlePaymentSubmit}
                        disabled={processingPayment}
                    >
                        {processingPayment ? 'Processing...' : `PAY BDT ${selectedEvent ? Math.round(selectedEvent.price) : 0}`}
                    </Button>
                </Modal.Body>
            </Modal>

            <style>{`
                .text-red { color: #D90429; }
                .border-live { animation: border-pulse 2s infinite; }
                @keyframes border-pulse {
                    0% { border-color: #D90429; box-shadow: 0 0 0 0 rgba(217, 4, 41, 0.4); }
                    70% { border-color: #D90429; box-shadow: 0 0 0 10px rgba(217, 4, 41, 0); }
                    100% { border-color: #D90429; box-shadow: 0 0 0 0 rgba(217, 4, 41, 0); }
                }
                .animate-pulse {
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </div>
    );
}
