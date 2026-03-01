import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { FiUser, FiPhone, FiCreditCard, FiX } from 'react-icons/fi';
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
        fullName: user?.name || '',
        phone: user?.phone || '',
        transactionId: '',
        quantity: 1,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name,
                phone: user.phone || '',
            }));
        }
    }, [user]);

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

        if (!formData.phone || !formData.transactionId) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                event_id: event.id,
                quantity: formData.quantity,
                phone: formData.phone,
                transaction_id: formData.transactionId,
            };

            const response = await api.bookTicket(bookingData);
            if (response.success) {
                toast.success(response.message || 'Booking successful!');
                onHide();
                // Reset form
                setFormData({
                    ...formData,
                    transactionId: '',
                    quantity: 1
                });
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
                    <Col md={7} className="p-4 p-lg-5 position-relative">
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

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted text-uppercase">Transaction ID (BKash/Rocket/Nagad)</Form.Label>
                                <InputGroup className="border-bottom pb-1">
                                    <InputGroup.Text className="bg-transparent border-0 ps-0 pe-2">
                                        <FiCreditCard className="text-danger" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter TRN ID"
                                        className="border-0 shadow-none ps-0"
                                        value={formData.transactionId}
                                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
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
            </Modal.Body>
        </Modal>
    );
};

export default BookingModal;
