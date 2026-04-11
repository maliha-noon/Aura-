import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { FiX } from 'react-icons/fi';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Event {
    id: number;
    title: string;
    location: string;
    date: string;
    price: number;
    image: string;
}

interface BookingModalProps {
    show: boolean;
    onHide: () => void;
    event: Event;
}

const BookingModal: React.FC<BookingModalProps> = ({ show, onHide, event }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const api = new ApiClient();

    const [formData, setFormData] = useState({
        transactionId: '',
        quantity: 1,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!show) {
            setFormData({
                transactionId: '',
                quantity: 1
            });
        }
    }, [show]);

    const handleQuantityChange = (change: number) => {
        const newQuantity = Math.max(1, formData.quantity + change);
        setFormData({ ...formData, quantity: newQuantity });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to book a ticket');
            onHide();
            navigate('/login');
            return;
        }

        if (!user.is_subscribed) {
            toast.error('You must be subscribed to book a ticket!');
            onHide();
            navigate('/subscription');
            return;
        }

        if (!formData.phone || !formData.transactionId) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                event_id: event.id,
                quantity: formData.quantity,
                payment_method: 'bkash',
                transaction_id: formData.transactionId,
            };

            const response = await api.bookTicket(bookingData);
            if (response.success) {
                toast.success(response.message || 'Booking successful!');
                onHide();
            } else {
                toast.error(response.message || 'Booking failed');
            }
        } catch (_error) {
            toast.error('An error occurred during booking');
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = event.price * formData.quantity;

    return (
        <Modal show={show} onHide={onHide} centered size="lg" className="booking-modal">
            <Modal.Body className="p-0 overflow-hidden rounded-4">
                {!user?.is_subscribed ? (
                    <div className="text-center py-5 bg-dark h-100 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                        <div className="mb-4">
                            <span className="display-1">🔒</span>
                        </div>
                        <h3 className="text-white fw-bold mb-4 px-4">YOU need to subscribe our website first</h3>
                        <Button 
                            variant="danger" 
                            className="btn-premium px-5 py-3 fw-bold rounded-pill"
                            onClick={() => { onHide(); navigate('/subscription'); }}
                        >
                            GO TO SUBSCRIPTION
                        </Button>
                    </div>
                ) : (
                    <Row className="g-0">
                        <Col md={5} className="d-none d-md-block">
                            <div
                                className="h-100 bg-dark position-relative"
                                style={{
                                    backgroundImage: `url(${event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '400px'
                                }}
                            >
                                <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                                    <h4 className="fw-bold mb-1">{event.title}</h4>
                                    <p className="small mb-0 opacity-75">{event.location}</p>
                                    <p className="small mb-0 opacity-75">{new Date(event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={7} className="p-4 p-lg-5 position-relative bg-white">
                            <button
                                onClick={onHide}
                                className="btn btn-link position-absolute top-0 end-0 mt-3 me-3 text-muted p-0"
                                style={{ fontSize: '1.5rem' }}
                            >
                                <FiX />
                            </button>

                            <h3 className="fw-bold mb-4">Book Your Ticket</h3>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Full Name</Form.Label>
                                    <InputGroup className="border-bottom pb-1">
                                        <InputGroup.Text className="bg-transparent border-0 ps-0 pe-2">
                                            <FiUser className="text-danger" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your name"
                                            className="border-0 shadow-none ps-0"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            required
                                            readOnly={!!user}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Phone Number</Form.Label>
                                    <InputGroup className="border-bottom pb-1">
                                        <InputGroup.Text className="bg-transparent border-0 ps-0 pe-2">
                                            <FiPhone className="text-danger" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="tel"
                                            placeholder="e.g. 01712345678"
                                            className="border-0 shadow-none ps-0"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Row className="align-items-center mb-4 mt-4">
                                    <Col xs={6}>
                                        <Form.Label className="small fw-bold text-muted text-uppercase mb-0">Total Price</Form.Label>
                                        <div className="h4 fw-bold text-danger mb-0">BDT {totalPrice}</div>
                                    </Col>
                                    <Col xs={6} className="text-end">
                                        <Form.Label className="small fw-bold text-muted text-uppercase d-block mb-2">Quantity</Form.Label>
                                        <div className="d-inline-flex align-items-center bg-light rounded-pill px-3 py-1">
                                            <Button
                                                variant="link"
                                                className="text-dark p-0 shadow-none"
                                                onClick={() => handleQuantityChange(-1)}
                                            >
                                                -
                                            </Button>
                                            <span className="mx-3 fw-bold">{formData.quantity}</span>
                                            <Button
                                                variant="link"
                                                className="text-dark p-0 shadow-none"
                                                onClick={() => handleQuantityChange(1)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>

                                <Button
                                    variant="danger"
                                    type="submit"
                                    className="w-100 py-3 rounded-pill fw-bold"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Book Now'}
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default BookingModal;
