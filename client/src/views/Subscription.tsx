import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Table, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Subscription: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [amount] = useState(100);
    const [isFlipped, setIsFlipped] = useState(false);
    const navigate = useNavigate();
    const api = React.useMemo(() => new ApiClient(), []);
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [dashboardStats, setDashboardStats] = useState<{
        total_bought: number,
        events_attended: number,
        total_sold: number,
        total_revenue: number,
        membership_status: string,
        event_performance: any[]
    } | null>(null);
    const [myBookings, setMyBookings] = useState<any[]>([]);
    const [bookingPage, setBookingPage] = useState(1);
    const [bookingLastPage, setBookingLastPage] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bookingCount, setBookingCount] = useState(0);
    const [transactionId, setTransactionId] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [subscriberStats, setSubscriberStats] = useState<{ total_subscribers: number, recent_subscribers: any[] } | null>(null);
    
    // Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [allReviews, setAllReviews] = useState<any[]>([]);
    const [reviewPage, setReviewPage] = useState(1);
    const [reviewLastPage, setReviewLastPage] = useState(1);

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

    const fetchMyBookings = React.useCallback(async (page: number = 1) => {
        if (!user) return;
        const response = await api.getMyBookings(page);
        if (response.success && response.bookings) {
            setMyBookings(response.bookings);
            if (response.pagination) {
                setBookingPage(response.pagination.current_page);
                setBookingLastPage(response.pagination.last_page);
            }
            // For checking membership status, we might need a separate call or use total
            setBookingCount(response.bookings.filter((b: any) => b.status === 'confirmed').length);
        }
    }, [api, user]);

    const fetchAllReviews = React.useCallback(async (page: number = 1) => {
        const response = await api.getReviews(page);
        if (response.success && response.reviews) {
            setAllReviews(response.reviews);
            if (response.pagination) {
                setReviewPage(response.pagination.current_page);
                setReviewLastPage(response.pagination.last_page);
            }
        }
    }, [api]);

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await api.getEvents();
            if (response.success && response.events) {
                setEvents(response.events.slice(0, 10));
            }
        };

        const fetchPublicStats = async () => {
            const response = await api.getRecentSubscribers();
            if (response.success && response.total_subscribers !== undefined) {
                setSubscriberStats(response);
            }
        };

        const fetchDashboardStats = async () => {
            if (user?.is_subscribed || user?.role === 'admin') {
                const response = await api.getDashboardStats();
                if (response.success && response.stats) {
                    setDashboardStats(response.stats);
                    setBookingCount(response.stats.total_bought || 0); 
                }
            }
        };

        fetchEvents();
        fetchPublicStats();
        fetchDashboardStats();
    }, [api, user]);

    useEffect(() => {
        fetchMyBookings(bookingPage);
    }, [fetchMyBookings, bookingPage]);

    useEffect(() => {
        fetchAllReviews(reviewPage);
    }, [fetchAllReviews, reviewPage]);

    useEffect(() => {
        if (events.length <= 1 || isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [events, isPaused]);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login first to subscribe!');
            navigate('/login');
            return;
        }

        setLoading(true);
        const response = await api.subscribe({ 
            payment_method: 'bkash', 
            amount, 
            email,
            transaction_id: transactionId
        });
        setLoading(false);

        if (response.success) {
            toast.success(response.message || 'Subscription Successful! Welcome to Aura++ Premium.', { duration: 5000 });
            setTransactionId('');
            setIsFlipped(false);
            // Refresh the page to show the dashboard immediately
            setTimeout(() => {
                window.location.reload();
            }, 1500);
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
            fetchAllReviews(1);
        }
    };

    return (
        <Container fluid className="py-5 my-4" style={{ overflowX: 'hidden' }}>
            
            {/* HEROS SECTION: ONLY VISIBLE IF NOT SUBSCRIBED */}
            {!user?.is_subscribed && (
            <Row className="justify-content-center align-items-center min-vh-75 mx-auto animate-fade-in" style={{ maxWidth: '1400px' }}>
                {/* Left: 3D Animated Event Showcase */}
                <Col lg={7} md={6} className="d-none d-md-flex flex-column align-items-center justify-content-center px-5 mb-5 mb-md-0">
                    <div className="text-center mb-5 animate-fade-in-up">
                        <h2 className="fw-bolder text-white display-5 mb-2 text-glow" style={{ letterSpacing: '1px' }}>
                            Unleash the <span className="text-danger">Aura</span>
                        </h2>
                        <p className="text-muted fs-5 opacity-75">Elevate your experience with Aura++ Premium.</p>
                    </div>

                    <div 
                        className="carousel-container position-relative w-100 d-flex justify-content-center align-items-center" 
                        style={{ height: '500px', perspective: '1200px' }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {events.length > 0 ? events.map((event, index) => {
                            const offset = index - currentIndex;
                            
                            // Adjust offset for circular loop
                            let adjustedOffset = offset;
                            if (offset > events.length / 2) adjustedOffset -= events.length;
                            if (offset < -events.length / 2) adjustedOffset += events.length;

                            const absOffset = Math.abs(adjustedOffset);
                            const isActive = adjustedOffset === 0;
                            
                            let transform = `translateX(${adjustedOffset * 110}%) translateZ(-${absOffset * 250}px) rotateY(${adjustedOffset * -25}deg)`;
                            let opacity = Math.max(0, 1 - absOffset * 0.4);
                            let zIndex = 10 - absOffset;

                            if (absOffset > 2) opacity = 0; // Hide far away cards

                            return (
                                <Card
                                    key={event.id}
                                    className={`position-absolute bg-dark text-white border-0 shadow-lg overflow-hidden glass-card ${isActive ? 'active-card' : ''}`}
                                    style={{
                                        width: '100%',
                                        maxWidth: adjustedOffset === 0 ? '360px' : '300px',
                                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform,
                                        opacity,
                                        zIndex,
                                        borderRadius: '24px',
                                        cursor: 'pointer',
                                        boxShadow: isActive ? '0 20px 40px rgba(230, 57, 70, 0.3)' : 'none'
                                    }}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <div style={{ height: '220px' }} className="overflow-hidden position-relative">
                                        <Card.Img
                                            src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000'}
                                            className="w-100 h-100 object-fit-cover hover-scale-img"
                                            style={{ borderBottom: isActive ? '4px solid #dc3545' : 'none' }}
                                        />
                                        <div className="card-overlay"></div>
                                    </div>
                                    <Card.Body className="text-center p-4 d-flex flex-column justify-content-center">
                                        <Badge bg="danger" className="mb-3 mx-auto px-3 py-2 shadow-sm rounded-pill pulse-red" style={{ width: 'fit-content', letterSpacing: '1px' }}>
                                            {event.category || 'Premium'}
                                        </Badge>
                                        <h4 className={`fw-bolder text-white mb-2 ${isActive ? '' : 'text-truncate'}`} style={{ fontSize: isActive ? '1.5rem' : '1.1rem' }}>
                                            {event.title}
                                        </h4>
                                        <p className="text-danger fst-italic mb-0 small opacity-75">
                                            "{getMotivationalTheme(event.id)}"
                                        </p>
                                    </Card.Body>
                                    {isActive && <div className="reflection"></div>}
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

                                        <div className="payment-instructions-container p-4 rounded-4 position-relative overflow-hidden mb-4" style={{ backgroundColor: '#111', border: '1px solid #dc354533' }}>
                                            <div className="text-center mb-4">
                                                <h6 className="text-white fw-bold mb-2 small opacity-75">Enter Transaction ID</h6>
                                                <Form.Control
                                                    type="text"
                                                    className="input-glass text-center py-2 fs-6"
                                                    placeholder="Enter Transaction ID"
                                                    value={transactionId}
                                                    onChange={(e) => setTransactionId(e.target.value)}
                                                    required
                                                    style={{ border: '1px solid #dc354566' }}
                                                />
                                            </div>

                                            <div className="p-2 mb-3 rounded bg-black bg-opacity-50 border border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                                                <div className="small">
                                                    <span className="text-red me-1">•</span>
                                                    Recipient Number: <strong className="text-red">01903247467</strong>
                                                </div>
                                                <Button size="sm" variant="outline-danger" className="py-0 px-2 text-xs" onClick={() => { navigator.clipboard.writeText('01903247467'); toast.success('Number Copied!'); }}>
                                                    Copy
                                                </Button>
                                            </div>

                                            <ul className="list-unstyled text-light x-small opacity-75 mb-0" style={{ fontSize: '0.75rem' }}>
                                                <li className="mb-2"><span className="text-red">•</span> Dial <strong className="text-warning">*247#</strong> or go to your <strong className="text-warning">bKash App</strong></li>
                                                <li className="mb-2"><span className="text-red">•</span> Select the <strong className="text-warning">"Send Money"</strong> option</li>
                                                <li className="mb-2"><span className="text-red">•</span> Amount to send: <strong className="text-red">{amount} BDT</strong></li>
                                                <li className="mb-2"><span className="text-red">•</span> Enter your <strong className="text-warning">PIN</strong> to confirm</li>
                                                <li className="mb-0"><span className="text-red">•</span> Enter the <strong className="text-warning">Transaction ID</strong> above and click <strong className="text-warning">VERIFY</strong></li>
                                            </ul>
                                        </div>

                                        <Button 
                                            variant="danger" 
                                            type="submit" 
                                            className="w-100 py-3 fw-bold text-uppercase btn-premium animate-pulse"
                                            disabled={loading}
                                            style={{ backgroundColor: '#b00' }}
                                        >
                                            {loading ? <Spinner size="sm" className="me-2" /> : 'VERIFY'}
                                        </Button>
                                    </Form>
                                </Card>
                            </div>
                        </div>
                    </div>
                    </Col>
            </Row>
            )}

            {/* DASHBOARD SECTION: ONLY VISIBLE IF SUBSCRIBED */}
            {user?.is_subscribed && (
            <div className="animate-fade-in-up">
                {/* Dashboard Header Header */}
                <Row className="justify-content-center mb-5 mt-4">
                    <Col lg={10} className="text-center">
                        <div className="glass-card p-5 border-glow-red bg-premium-dark shadow-lg">
                            <h1 className="fw-bolder text-white display-3 mb-3 text-glow">
                                Welcome, <span className="text-danger">{user?.name}</span>
                            </h1>
                            <p className="text-muted fs-5 mb-4">Your Aura++ Premium Dashboard — Manage your events and bookings with ease.</p>
                            <div className="d-inline-flex gap-3 mt-2">
                                <Badge bg="danger" className="px-4 py-2 rounded-pill pulse-red shadow-sm">PREMIUM MEMBER</Badge>
                                <Badge bg="dark" className="px-4 py-2 rounded-pill border border-danger border-opacity-25">ID: #USER-{user?.id}</Badge>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-5 pt-5 animate-fade-in-up">
                    <Col lg={10}>
                        <div className="text-center mb-5">
                            <h2 className="fw-bolder text-white text-glow">Subscription Dashboard</h2>
                            <p className="text-muted">Direct insights into your Aura++ participation and hosting</p>
                            <div className="mt-3 p-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-pill d-inline-block px-5 animate-float shadow-sm">
                                <span className="text-white fw-bold" style={{ letterSpacing: '0.5px' }}>
                                    ✨ {bookingCount >= 2 ? 'Elite Membership Active: enjoy 10% discount on all tickets!' : 'Buy 2+ tickets to unlock Elite Membership & 10% discount!'} ✨
                                </span>
                            </div>
                        </div>
                        
                        <Row className="g-4 mb-5">
                            <Col md={3}>
                                <div className="stats-card p-4 text-center">
                                    <h5 className="text-muted mb-2 text-uppercase ls-1" style={{ fontSize: '0.8rem' }}>Tickets Bought</h5>
                                    <h1 className="fw-bolder text-danger display-5">
                                        {dashboardStats?.total_bought || 0}
                                    </h1>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="stats-card p-4 text-center">
                                    <h5 className="text-muted mb-2 text-uppercase ls-1" style={{ fontSize: '0.8rem' }}>Events Attended</h5>
                                    <h1 className="fw-bolder text-white display-5">
                                        {dashboardStats?.events_attended || 0}
                                    </h1>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="stats-card p-4 text-center">
                                    <h5 className="text-muted mb-2 text-uppercase ls-1" style={{ fontSize: '0.8rem' }}>Tickets Sold</h5>
                                    <h1 className="fw-bolder text-warning display-5">
                                        {dashboardStats?.total_sold || 0}
                                    </h1>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="stats-card p-4 text-center">
                                    <h5 className="text-muted mb-2 text-uppercase ls-1" style={{ fontSize: '0.8rem' }}>Membership</h5>
                                    <Badge 
                                        bg={dashboardStats?.total_bought || 0 >= 2 ? 'warning' : 'success'} 
                                        text={dashboardStats?.total_bought || 0 >= 2 ? 'dark' : ''}
                                        className="px-3 py-2 mt-2 fw-bold pulse-red" 
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        {dashboardStats?.membership_status || 'ACTIVE'}
                                    </Badge>
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

                        <div className="stats-card p-4 overflow-hidden shadow-lg border-opacity-10 mb-5">
                            <h4 className="fw-bold mb-4 px-3 d-flex align-items-center">
                                <span className="text-danger me-2">🎟️</span> Recent Event Bookings
                            </h4>
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
                            
                            {/* Bookings Pagination */}
                            {bookingLastPage > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination className="premium-pagination px-3 py-1 rounded-pill glassmorphism border border-white border-opacity-10">
                                        <Pagination.Prev 
                                            disabled={bookingPage === 1}
                                            onClick={() => setBookingPage(prev => Math.max(prev - 1, 1))}
                                        >
                                            <FiChevronLeft size={16} />
                                        </Pagination.Prev>
                                        {[...Array(bookingLastPage)].map((_, idx) => (
                                            <Pagination.Item
                                                key={idx + 1}
                                                active={bookingPage === idx + 1}
                                                onClick={() => setBookingPage(idx + 1)}
                                            >
                                                {idx + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next 
                                            disabled={bookingPage === bookingLastPage}
                                            onClick={() => setBookingPage(prev => Math.min(prev + 1, bookingLastPage))}
                                        >
                                            <FiChevronRight size={16} />
                                        </Pagination.Next>
                                    </Pagination>
                                </div>
                            )}
                        </div>

                        <div className="stats-card p-4 overflow-hidden shadow-lg border-opacity-10">
                            <h4 className="fw-bold mb-4 px-3 d-flex align-items-center">
                                <span className="text-warning me-2">📊</span> My Hosted Events & Sales
                            </h4>
                            <div className="table-responsive">
                                <Table variant="dark" className="bg-transparent mb-0 align-middle">
                                    <thead>
                                        <tr className="text-muted small text-uppercase" style={{ letterSpacing: '1px' }}>
                                            <th className="ps-4">Event Title</th>
                                            <th>Location</th>
                                            <th>Category</th>
                                            <th>Tickets Sold</th>
                                            <th>Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardStats?.event_performance && dashboardStats.event_performance.length > 0 ? (
                                            dashboardStats.event_performance.map((event: any) => (
                                                <tr key={event.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td className="ps-4 py-3 fw-bold text-white">{event.title}</td>
                                                    <td className="small text-muted">{new Date(event.date).toLocaleDateString()}</td>
                                                    <td><Badge bg="danger" className="bg-opacity-25 text-danger border border-danger border-opacity-25">{event.price} TK</Badge></td>
                                                    <td className="text-warning fw-bold">{event.tickets_sold || 0} Sold</td>
                                                    <td className="text-success fw-bold">{event.revenue || 0} TK</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-5 text-muted opacity-50">You haven't hosted any events yet or no sales recorded.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            )}

            {/* Global Public Stats Footer - Only for non-subscribers */}
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

            {/* 3D Review Section - Visible to All */}
            <Row className="justify-content-center mt-5 pt-5 mb-5 mx-auto" style={{ maxWidth: '1400px' }}>
                <Col lg={10}>
                    <Card className="bg-dark text-white p-5 rounded-4 border-glow-red shadow-lg bg-premium-dark text-center">
                        <h2 className="fw-bolder mb-4 text-glow">Share Your Aura++ Experience</h2>
                        <p className="text-muted mb-5">Your feedback helps us create better events for everyone.</p>

                        <Form onSubmit={handleSubmitReview} className="text-start mx-auto" style={{ maxWidth: '600px' }}>
                            <div className="d-flex justify-content-center gap-3 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <span 
                                        key={s} 
                                        className={`star-3d ${rating >= s ? 'active' : ''}`}
                                        onClick={() => (user ? setRating(s) : toast.error('Please login to rate'))}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <Form.Group className="mb-4">
                                <Form.Control 
                                    as="textarea" rows={3} required placeholder="Tell us what you think..." 
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
                            <h4 className="fw-bold mb-4">Community Feedback</h4>
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

                            {/* Reviews Pagination */}
                            {reviewLastPage > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination className="premium-pagination px-3 py-1 rounded-pill glassmorphism border border-white border-opacity-10">
                                        <Pagination.Prev 
                                            disabled={reviewPage === 1}
                                            onClick={() => setReviewPage(prev => Math.max(prev - 1, 1))}
                                        >
                                            <FiChevronLeft size={16} />
                                        </Pagination.Prev>
                                        {[...Array(reviewLastPage)].map((_, idx) => (
                                            <Pagination.Item
                                                key={idx + 1}
                                                active={reviewPage === idx + 1}
                                                onClick={() => setReviewPage(idx + 1)}
                                            >
                                                {idx + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next 
                                            disabled={reviewPage === reviewLastPage}
                                            onClick={() => setReviewPage(prev => Math.min(prev + 1, reviewLastPage))}
                                        >
                                            <FiChevronRight size={16} />
                                        </Pagination.Next>
                                    </Pagination>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Subscription;
