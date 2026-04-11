import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Subscription: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [email, setEmail] = useState('');
    const [amount] = useState(100);
    const [isFlipped, setIsFlipped] = useState(false);
    const navigate = useNavigate();
    const api = React.useMemo(() => new ApiClient(), []);
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [subscriberStats, setSubscriberStats] = useState<{ total_subscribers: number, recent_subscribers: any[] } | null>(null);
    const [myBookings, setMyBookings] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bookingCount, setBookingCount] = useState(0);

    // Payment Extra Fields
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });

    // Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [allReviews, setAllReviews] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const getMotivationalTheme = (id: number) => {
        const uniqueThemes = [
            'Innovate the future and connect with visionaries.',
            'Feel the rhythm and let your soul dance.',
            'Experience colors and emotions that speak louder than words.',
            'Unlock your potential and scale new heights.',
            'Step into a world of unforgettable experiences.',
            'Where ideas converge and greatness begins.',
            'Celebrate the fusion of passion and creativity.',
            'A journey into the extraordinary awaits you.',
            'Embrace the magic of the moment.',
            'Discover moments that will stay with you forever.',
            'Fuel your ambition and chase your dreams.',
            'Immerse yourself in brilliance and inspiration.',
            'Unite with fellow enthusiasts and create memories.',
            'Witness the pinnacle of human expression.',
            'Ignite your curiosity and expand your horizons.'
        ];
        return uniqueThemes[id % uniqueThemes.length];
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await api.getEvents();
            if (response.success && response.events) {
                setEvents(response.events.slice(0, 10));
            }
        };
        const fetchStats = async () => {
            const response = await api.getRecentSubscribers();
            if (response.success && response.total_subscribers !== undefined) {
                setSubscriberStats(response);
            }
        };
        const fetchMyBookings = async () => {
            if (user) {
                const response = await api.getMyBookings();
                if (response.success && response.bookings) {
                    setMyBookings(response.bookings);
                    setBookingCount(response.bookings.filter((b: any) => b.status === 'confirmed').length);
                }
            }
        };
        const fetchAllReviews = async () => {
            const response = await api.getReviews();
            if (response.success && response.reviews) {
                setAllReviews(response.reviews);
            }
        };

        fetchEvents();
        fetchStats();
        fetchMyBookings();
        fetchAllReviews();
    }, [api, user]);

    useEffect(() => {
        if (events.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [events]);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login first to subscribe!');
            navigate('/login');
            return;
        }

        setLoading(true);
        const response = await api.subscribe({ 
            payment_method: paymentMethod, 
            amount, 
            email,
            phone: phoneNumber,
            ...cardData 
        });
        setLoading(false);

        if (response.success) {
            toast.success(response.message || 'Verification submitted! You will receive an email once an admin approves it.', { duration: 5000 });
            setTransactionId('');
            setIsFlipped(false);
        } else {
            toast.error(response.message || 'Failed to subscribe');
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to leave a review');
            return;
        }
        setSubmittingReview(true);
        const response = await api.submitReview({ rating, comment });
        setSubmittingReview(false);
        if (response.success) {
            toast.success('Review submitted!');
            setComment('');
            // Refresh reviews
            const res = await api.getReviews();
            if (res.success) setAllReviews(res.reviews);
        }
    };

    return (
        <Container fluid className="py-5 my-4" style={{ overflowX: 'hidden' }}>
            <Row className="justify-content-center align-items-center min-vh-75 mx-auto" style={{ maxWidth: '1400px' }}>

                {/* Left: 3D Animated Event Showcase */}
                <Col lg={7} md={6} className="d-none d-md-flex flex-column align-items-center justify-content-center px-5 mb-5 mb-md-0">
                    <div className="text-center mb-5 animate-fade-in-up">
                        <h2 className="fw-bolder text-white display-5 mb-2 text-glow" style={{ letterSpacing: '1px' }}>
                            Unleash the <span className="text-danger">Aura</span>
                        </h2>
                        <p className="text-muted fs-5 opacity-75">Elevate your experience with Aura++ Premium.</p>
                    </div>

                    <div className="carousel-container position-relative w-100 d-flex justify-content-center align-items-center" style={{ height: '450px', perspective: '1200px' }}>
                        {events.length > 0 ? events.map((event, index) => {
                            const offset = (index - currentIndex + events.length) % events.length;
                            let transform = 'translateZ(-500px) scale(0.6)';
                            let opacity = 0;
                            let zIndex = 0;

                            if (offset === 0) {
                                transform = 'translateZ(0px) scale(1) translateX(0)';
                                opacity = 1;
                                zIndex = 3;
                            } else if (offset === 1) {
                                transform = 'translateZ(-150px) scale(0.85) translateX(35%) rotateY(-10deg)';
                                opacity = 0.6;
                                zIndex = 2;
                            } else if (offset === events.length - 1) {
                                transform = 'translateZ(-150px) scale(0.85) translateX(-35%) rotateY(10deg)';
                                opacity = 0.6;
                                zIndex = 2;
                            }

                            return (
                                <Card
                                    key={event.id}
                                    className="position-absolute bg-dark text-white border-0 shadow-lg overflow-hidden glass-card"
                                    style={{
                                        width: '100%',
                                        maxWidth: '340px',
                                        transition: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                        transform,
                                        opacity,
                                        zIndex,
                                        borderRadius: '24px',
                                    }}
                                >
                                    <div style={{ height: '220px' }} className="overflow-hidden">
                                        <Card.Img
                                            src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000'}
                                            className="w-100 h-100 object-fit-cover hover-scale-img"
                                            style={{ borderBottom: '4px solid #dc3545' }}
                                        />
                                    </div>
                                    <Card.Body className="text-center p-4 d-flex flex-column justify-content-center">
                                        <Badge bg="danger" className="mb-3 mx-auto px-3 py-2 shadow-sm rounded-pill pulse-red" style={{ width: 'fit-content', letterSpacing: '1px' }}>
                                            {event.category || 'Premium'}
                                        </Badge>
                                        <h4 className="fw-bolder text-white mb-2 text-truncate">{event.title}</h4>
                                        <p className="text-danger fst-italic mb-0 small">
                                            "{getMotivationalTheme(event.id)}"
                                        </p>
                                    </Card.Body>
                                </Card>
                            );
                        }) : (
                            <div className="text-muted"><Spinner animation="border" variant="danger" /></div>
                        )}
                    </div>
                </Col>

                {/* Right: 3D Flip Card Subscription Form */}
                <Col lg={4} md={6}>
                    <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
                        <div className="flip-card-inner">
                            {/* Front Side: Plan Overview */}
                            <div className="flip-card-front">
                                <Card className="bg-dark text-white p-5 rounded-4 h-100 border-glow-red shadow-lg d-flex flex-column justify-content-between bg-premium-dark">
                                    <div className="text-center">
                                        <div className="mb-4 animate-float">
                                            <span className="display-1">✨</span>
                                        </div>
                                        <h1 className="fw-bolder mb-3 text-glow" style={{ fontSize: '3rem', background: 'linear-gradient(45deg, #ff416c, #ff4b2b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                            AURA<span className="text-white">++</span>
                                        </h1>
                                        <p className="text-muted mb-4 fs-5">Premium Access to all events.</p>
                                        
                                        <div className="bg-dark rounded-4 p-4 mb-5 border border-secondary border-opacity-25 shadow-sm">
                                            <span className="text-danger fw-bold small d-block mb-1 text-uppercase ls-2">One-Time Fee</span>
                                            <h1 className="fw-bolder text-white mb-0 display-4">
                                                {amount} <span className="text-danger h3">BDT</span>
                                            </h1>
                                        </div>
                                        
                                        <ul className="list-unstyled text-start mb-5 mx-auto" style={{ maxWidth: '250px' }}>
                                            <li className="mb-2"><span className="text-success me-2">✓</span> Instant Event Bookings</li>
                                            <li className="mb-2"><span className="text-success me-2">✓</span> Exclusive Live Stream</li>
                                            <li className="mb-2"><span className="text-success me-2">✓</span> Priority Support</li>
                                        </ul>
                                    </div>
                                    
                                    <Button 
                                        variant="danger" 
                                        className="w-100 py-3 fw-bold text-uppercase btn-premium"
                                        onClick={() => setIsFlipped(true)}
                                    >
                                        Join Now
                                    </Button>
                                </Card>
                            </div>

                            {/* Back Side: Payment Form */}
                            <div className="flip-card-back">
                                <Card className="bg-dark text-white p-5 rounded-4 h-100 border-glow-red shadow-lg bg-premium-dark">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <Button variant="link" className="text-white p-0 text-decoration-none" onClick={() => setIsFlipped(false)}>
                                            ← Back
                                        </Button>
                                        <h3 className="fw-bold mb-0 text-glow">Secure Checkout</h3>
                                    </div>

                                    <Form onSubmit={handleSubscribe} className="text-start">
                                        <Form.Group className="mb-4">
                                            <Form.Label className="small text-muted text-uppercase fw-bold">Email Address</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                required 
                                                placeholder="Enter your email" 
                                                className="input-glass py-3"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <Form.Text className="text-muted opacity-50">
                                                Account will be linked to this email.
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="small text-muted text-uppercase fw-bold">Payment Method</Form.Label>
                                            <Form.Select 
                                                className="input-glass py-3"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            >
                                                <option value="bkash">bKash (Personal/Merchant)</option>
                                                <option value="nagad">Nagad (Personal/Merchant)</option>
                                                <option value="card">Bank Card (Visa/Mastercard)</option>
                                            </Form.Select>
                                        </Form.Group>

                                        {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                                            <div className="animate-fade-in">
                                                <Form.Group className="mb-4">
                                                    <Form.Label className="small text-muted text-uppercase fw-bold">Phone Number</Form.Label>
                                                    <Form.Control 
                                                        type="text" required placeholder="01XXX-XXXXXX" className="input-glass py-3"
                                                        value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                                                    />
                                                </Form.Group>
                                            </div>
                                        )}

                                        {paymentMethod === 'card' && (
                                            <div className="animate-fade-in">
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="small text-muted text-uppercase fw-bold">Card Number</Form.Label>
                                                    <Form.Control 
                                                        type="text" required placeholder="XXXX XXXX XXXX XXXX" className="input-glass py-3"
                                                        value={cardData.number} onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                                    />
                                                </Form.Group>
                                                <Row>
                                                    <Col xs={6}>
                                                        <Form.Group className="mb-4">
                                                            <Form.Label className="small text-muted text-uppercase fw-bold">Expiry</Form.Label>
                                                            <Form.Control 
                                                                type="text" required placeholder="MM/YY" className="input-glass py-3"
                                                                value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <Form.Group className="mb-4">
                                                            <Form.Label className="small text-muted text-uppercase fw-bold">CVV</Form.Label>
                                                            <Form.Control 
                                                                type="password" required placeholder="***" className="input-glass py-3"
                                                                value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )}

                                        <div className="p-3 mb-4 rounded-3 border border-secondary border-opacity-25 bg-black">
                                            <div className="d-flex justify-content-between small text-muted">
                                                <span>Subtotal</span>
                                                <span>{amount} TK</span>
                                            </div>
                                            <div className="d-flex justify-content-between fw-bold mt-2">
                                                <span>Total to Pay</span>
                                                <span className="text-danger">{amount} TK</span>
                                            </div>
                                        </div>

                                        <Button 
                                            variant="danger" 
                                            type="submit" 
                                            className="w-100 py-3 fw-bold text-uppercase btn-premium mt-3"
                                            disabled={loading}
                                        >
                                            {loading ? <Spinner size="sm" className="me-2" /> : 'Confirm Payment'}
                                        </Button>
                                    </Form>
                                </Card>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Subscriber Details Section (3D Inspired) */}
            {user?.is_subscribed && (
                <Row className="justify-content-center mt-5 pt-5 animate-fade-in-up">
                    <Col lg={10}>
                        <div className="text-center mb-5">
                            <h2 className="fw-bolder text-white text-glow">My Aura++ Journey</h2>
                            <p className="text-muted">Tracking your exclusive event participation</p>
                            <div className="mt-3 p-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-pill d-inline-block px-5 animate-float shadow-sm">
                                <span className="text-white fw-bold" style={{ letterSpacing: '0.5px' }}>
                                    ✨ Buy minimum <span className="text-danger">two tickets</span> and get <span className="text-warning">membership card</span> and enjoy <span className="text-success">10% discount</span> for every event's tickets ✨
                                </span>
                            </div>
                        </div>
                        
                        <Row className="g-4 mb-5">
                            <Col md={4}>
                                <div className="stats-card p-4 text-center">
                                    <h5 className="text-muted mb-2 text-uppercase ls-1">Tickets Bought</h5>
                                    <h1 className="fw-bolder text-danger display-4">
                                        {myBookings.reduce((sum, b) => sum + b.quantity, 0)}
                                    </h1>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="stats-card p-4 text-center">
                                    <h5 className="text-muted mb-2 text-uppercase ls-1">Events Attended</h5>
                                    <h1 className="fw-bolder text-white display-4">
                                        {myBookings.length}
                                    </h1>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="stats-card p-4 text-center">
                                    <h5 className="text-muted mb-2 text-uppercase ls-1">Membership</h5>
                                    {bookingCount >= 2 ? (
                                        <Badge bg="warning" text="dark" className="px-4 py-2 mt-2 fw-bold pulse-red" style={{ fontSize: '1rem' }}>ELITE MEMBER</Badge>
                                    ) : (
                                        <Badge bg="success" className="px-4 py-2 mt-2" style={{ fontSize: '1rem' }}>Active PRO</Badge>
                                    )}
                                </div>
                            </Col>
                        </Row>

                        {bookingCount >= 2 && (
                            <div className="d-flex flex-column align-items-center mb-5 animate-fade-in">
                                <h3 className="text-warning fw-bold mb-4 text-glow">Your Elite Membership Card</h3>
                                <div className="membership-card-3d p-4">
                                    <div className="card-shine"></div>
                                    <div className="d-flex justify-content-between">
                                        <div className="chip-3d"></div>
                                        <h4 className="text-white fw-bold italic">AURA<span className="text-warning">++</span></h4>
                                    </div>
                                    <div className="mt-2">
                                        <h5 className="text-white fw-bold mb-0 text-uppercase" style={{ letterSpacing: '2px' }}>{user?.name}</h5>
                                        <p className="text-muted small mb-3">ID: #ELITE-{user?.id}{new Date().getFullYear()}</p>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-end mt-2">
                                        <div>
                                            <p className="text-warning small mb-0 fw-bold">10% DISCOUNT ACTIVE</p>
                                            <p className="text-white-50 x-small" style={{ fontSize: '0.6rem' }}>EXPIRES: NEVER</p>
                                        </div>
                                        <Badge bg="warning" text="dark" className="fw-bold">ELITE</Badge>
                                    </div>
                                </div>
                                <p className="text-muted mt-3 small">Show this card at event entries for VIP treatment.</p>
                            </div>
                        )}

                        <div className="stats-card p-4 overflow-hidden shadow-lg border-opacity-10">
                            <h4 className="fw-bold mb-4 px-3">Recent Event Bookings</h4>
                            <div className="table-responsive">
                                <Table variant="dark" className="bg-transparent mb-0 align-middle">
                                    <thead>
                                        <tr className="text-muted small text-uppercase" style={{ letterSpacing: '1px' }}>
                                            <th className="ps-4">Event Title</th>
                                            <th>Tickets</th>
                                            <th>Total Paid</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myBookings.length > 0 ? myBookings.map((booking) => (
                                            <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td className="ps-4 py-3 fw-bold">{booking.event?.title || 'Unknown Event'}</td>
                                                <td>{booking.quantity}</td>
                                                <td className="text-danger fw-bold">{booking.total_price} TK</td>
                                                <td><Badge bg="success" className="opacity-75">{booking.status}</Badge></td>
                                                <td className="text-muted small">{new Date(booking.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-5 text-muted">No bookings found yet. Explore events to get started!</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                </Row>
            )}

            {/* Global Public Stats Footer */}
            {subscriberStats && !user?.is_subscribed && (
                <Row className="justify-content-center mt-5 pt-4 border-top border-secondary border-opacity-10">
                    <Col lg={6} className="text-center">
                        <h6 className="text-white fw-bold d-flex align-items-center justify-content-center mb-3">
                            <span className="bg-success rounded-circle me-2 pulse-red" style={{ width: '8px', height: '8px', boxShadow: '0 0 10px #198754' }}></span>
                            {subscriberStats.total_subscribers} Premium Members already enjoying Aura++
                        </h6>
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                            {subscriberStats.recent_subscribers.map((sub, idx) => (
                                <Badge key={idx} bg="dark" className="px-3 py-2 fw-normal opacity-75 d-flex align-items-center stats-card" style={{ borderRadius: '20px' }}>
                                    <span className="text-danger me-2">👤</span> {sub.name.split(' ')[0]}
                                </Badge>
                            ))}
                        </div>
                    </Col>
                </Row>
            )}

            {/* 3D Review Section */}
            <Row className="justify-content-center mt-5 pt-5 mb-5">
                <Col lg={8}>
                    <Card className="bg-dark text-white p-5 rounded-4 border-glow-red shadow-lg bg-premium-dark text-center">
                        <h2 className="fw-bolder mb-4 text-glow">Share Your Aura++ Experience</h2>
                        <p className="text-muted mb-5">Your feedback helps us create better events for everyone.</p>

                        <Form onSubmit={handleSubmitReview} className="text-start mx-auto" style={{ maxWidth: '600px' }}>
                            <div className="d-flex justify-content-center gap-3 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <span 
                                        key={s} 
                                        className={`star-3d ${rating >= s ? 'active' : ''}`}
                                        onClick={() => setRating(s)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <Form.Group className="mb-4">
                                <Form.Control 
                                    as="textarea" rows={4} required placeholder="Tell us what you think..." 
                                    className="review-input-glass"
                                    value={comment} onChange={(e) => setComment(e.target.value)}
                                />
                            </Form.Group>
                            <Button 
                                variant="danger" type="submit" className="w-100 py-3 fw-bold text-uppercase btn-premium"
                                disabled={submittingReview}
                            >
                                {submittingReview ? <Spinner size="sm" /> : 'Submit Review'}
                            </Button>
                        </Form>

                        <div className="mt-5 pt-5 border-top border-secondary border-opacity-10">
                            <h4 className="fw-bold mb-4">Recent Reviews</h4>
                            <Row className="g-3">
                                {allReviews.length > 0 ? allReviews.map((rev, idx) => (
                                    <Col md={6} key={idx}>
                                        <div className="stats-card p-4 text-start">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="fw-bold text-danger">{rev.user?.name}</span>
                                                <span className="text-warning">{'★'.repeat(rev.rating)}</span>
                                            </div>
                                            <p className="text-muted small mb-0 italic">"{rev.comment}"</p>
                                        </div>
                                    </Col>
                                )) : <p className="text-muted small">No reviews yet. Be the first to share!</p>}
                            </Row>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Subscription;
