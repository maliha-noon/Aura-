import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Container, Badge } from 'react-bootstrap';
import { FiMapPin, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';
import ApiClient from '../api';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    price: number;
    capacity: number;
    category: string;
}

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const api = React.useMemo(() => new ApiClient(), []);

    const fetchEvents = React.useCallback(async () => {
        try {
            const response = await api.getEvents();
            if (response.success) {
                setEvents(response.events);
            } else {
                toast.error(response.message || 'Failed to fetch events');
            }
        } catch (_error) {
            toast.error('An error occurred while fetching events');
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleBookNow = (event: Event) => {
        setSelectedEvent(event);
        setShowBookingModal(true);
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    return (
        <div className="events-page py-5">
            <Container>
                <div className="section-header text-center mb-5">
                    <h6 className="text-danger fw-bold text-uppercase">Events</h6>
                    <h2 className="fw-bold display-5">Upcoming Events</h2>
                    <p className="text-muted">Your Gateway to Unforgettable Experiences</p>
                    {isAdmin && (
                        <Button
                            variant="danger"
                            className="btn-premium mt-3 px-4 py-2"
                            onClick={() => navigate('/add-event')}
                        >
                            + ADD NEW TICKET
                        </Button>
                    )}
                </div>

                <Row className="g-4">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <Col key={event.id} lg={4} md={6}>
                                <Card className="h-100 border-0 shadow-sm event-card overflow-hidden">
                                    <div className="event-image-wrapper position-relative" style={{ height: '220px' }}>
                                        <Card.Img
                                            variant="top"
                                            src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000'}
                                            className="h-100 w-100 object-fit-cover"
                                        />
                                        <Badge bg="danger" className="position-absolute top-0 end-0 m-3 px-3 py-2">
                                            {event.category || 'General'}
                                        </Badge>
                                    </div>
                                    <Card.Body className="d-flex flex-column p-4">
                                        <Card.Title className="fw-bold mb-3 h4">{event.title}</Card.Title>
                                        <div className="event-info text-muted mb-4 small flex-grow-1">
                                            <div className="d-flex align-items-center mb-2">
                                                <FiMapPin className="text-danger me-2" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <FiCalendar className="text-danger me-2" />
                                                <span>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <FiClock className="text-danger me-2" />
                                                <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column pt-3 border-top mt-auto gap-2">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <div className="price-tag d-flex align-items-center">
                                                    <FiDollarSign className="text-danger" />
                                                    <span className="fw-bold h5 mb-0 ms-1">BDT {event.price}</span>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-danger"
                                                    className="w-100 rounded-pill fw-bold small py-2"
                                                    onClick={() => navigate('/gallery')}
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="w-100 rounded-pill fw-bold small py-2"
                                                    onClick={() => handleBookNow(event)}
                                                >
                                                    Buy Ticket
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center py-5">
                            <h3 className="text-muted">No events found</h3>
                        </Col>
                    )}
                </Row>
            </Container>

            {selectedEvent && (
                <PaymentModal
                    show={showBookingModal}
                    onHide={() => setShowBookingModal(false)}
                    event={selectedEvent}
                />
            )}
        </div>
    );
};

export default Events;
