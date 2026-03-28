import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ApiClient from '../api';

interface Event {
    id: number;
    title: string;
    date: string;
    price: number;
}

interface PaymentModalProps {
    show: boolean;
    onHide: () => void;
    event: Event;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ show, onHide, event }) => {
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvv: ''
    });
    const api = new ApiClient();

    const totalPrice = event.price * quantity;

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        const bookingData = {
            event_id: event.id,
            quantity: quantity,
            payment_method: paymentMethod,
            // In a real app we wouldn't send card details like this, but following user request for demo
            card_number: cardData.number,
            expiry: cardData.expiry,
            cvv: cardData.cvv,
            total_price: totalPrice
        };

        try {
            const response = await api.bookTicket(bookingData);
            if (response.success) {
                toast.success('Booking Successful!');
                onHide();
            } else {
                toast.error(response.message || 'Payment Failed');
            }
        } catch (error) {
            toast.error('An error occurred during payment');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="payment-modal">
            <Modal.Header className="bg-dark border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                <Modal.Title className="text-white fw-bold h4">Confirm Booking & Payment</Modal.Title>
                <FiX className="text-white cursor-pointer fs-4" onClick={onHide} />
            </Modal.Header>
            <Modal.Body className="bg-dark p-4">
                <div className="event-summary-card mb-4 p-4 rounded-4" style={{ backgroundColor: '#0f0f0f', border: '1px solid #222' }}>
                    <h5 className="text-red fw-bold mb-1 font-outfit">{event.title}</h5>
                    <p className="text-muted small mb-4">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-white fw-bold">Number of Tickets</span>
                        <div className="quantity-selector d-flex align-items-center bg-dark rounded-pill p-1 border border-secondary border-opacity-25">
                            <Button variant="link" className="text-white p-2" onClick={() => handleQuantityChange(-1)}><FiMinus /></Button>
                            <span className="px-3 fw-bold text-white">{quantity}</span>
                            <Button variant="link" className="text-white p-2" onClick={() => handleQuantityChange(1)}><FiPlus /></Button>
                        </div>
                    </div>
                    <hr className="border-secondary border-opacity-25 my-4" />
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Total Price</span>
                        <span className="text-red fw-bold h3 mb-0">BDT {totalPrice}</span>
                    </div>
                </div>

                <h6 className="text-white fw-bold mb-3">Select Payment Method</h6>
                <Row className="g-3 mb-4">
                    {['bKash', 'Credit Card', 'Nagad'].map((method) => (
                        <Col key={method} xs={4}>
                            <div
                                className={`payment-method-card text-center p-3 rounded-4 cursor-pointer transition-all ${paymentMethod === method ? 'active border-primary-red bg-opacity-10 bg-danger' : 'border-secondary border-opacity-25'}`}
                                onClick={() => setPaymentMethod(method)}
                                style={{ border: '1px solid', height: '90px' }}
                            >
                                <img src={`/images/payment/${method.toLowerCase().replace(' ', '-')}.png`} alt={method} style={{ height: '30px', filter: paymentMethod === method ? 'none' : 'grayscale(1)' }} className="mb-2" />
                                <div className={`small fw-bold ${paymentMethod === method ? 'text-white' : 'text-muted'}`}>{method}</div>
                            </div>
                        </Col>
                    ))}
                </Row>

                <Form onSubmit={handlePayment}>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted small">Card Number</Form.Label>
                        <Form.Control
                            type="text"
                            className="input-glass"
                            placeholder="XXXX XXXX XXXX XXXX"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Row>
                        <Col xs={6}>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small">Expiry</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="input-glass"
                                    placeholder="MM/YY"
                                    value={cardData.expiry}
                                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={6}>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small">CVV</Form.Label>
                                <Form.Control
                                    type="password"
                                    className="input-glass"
                                    placeholder="..."
                                    value={cardData.cvv}
                                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button type="submit" variant="danger" className="btn-premium w-100 py-3 fw-bold">
                        PAY BDT {totalPrice}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PaymentModal;
