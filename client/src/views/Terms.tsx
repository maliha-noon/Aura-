import { Container, Card, Row, Col } from 'react-bootstrap';

export default function Terms() {
    return (
        <Container className="py-5">
            <Card className="p-4 bg-dark text-white border-secondary shadow-lg">
                <Card.Body>
                    <h1 className="text-center mb-4 fw-bold">Terms & Conditions</h1>
                    <p className="text-muted text-center mb-5">Last Updated: February 15, 2026</p>

                    <section className="mb-5">
                        <h2 className="h4 text-danger border-bottom border-danger pb-2 mb-3">1. Booking Rules</h2>
                        <Row mt={4}>
                            <Col md={6}>
                                <Card className="h-100 bg-secondary-dark border-danger p-3">
                                    <h3 className="h5 text-danger font-weight-bold">🔴 Strict Rules</h3>
                                    <ul className="text-light">
                                        <li><strong>No Cancellations:</strong> Tickets purchased under 'Non-Refundable' category cannot be cancelled under any circumstances.</li>
                                        <li><strong>ID Requirement:</strong> Original ID proof must be presented at the venue. Digital copies may not be accepted.</li>
                                        <li><strong>Late Entry:</strong> Entry is strictly prohibited after the event starts. No refunds for late arrivals.</li>
                                        <li><strong>Resale Prohibited:</strong> Reselling tickets on third-party platforms is strictly forbidden and will result in ticket nullification.</li>
                                    </ul>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="h-100 bg-secondary-dark border-success p-3">
                                    <h3 className="h5 text-success font-weight-bold">🟢 Flexible Rules</h3>
                                    <ul className="text-light">
                                        <li><strong>24-Hour Cancellation:</strong> Tickets marked as 'Flexible' can be cancelled up to 24 hours before the event for a full refund.</li>
                                        <li><strong>Name Transfer:</strong> You can transfer your ticket to a friend or family member up to 6 hours before the event via the dashboard.</li>
                                        <li><strong>Rescheduling:</strong> Subject to availability, flexible tickets can be rescheduled to a different date for a small processing fee.</li>
                                        <li><strong>Digital Entry:</strong> QR codes on mobile devices are fully accepted for entry.</li>
                                    </ul>
                                </Card>
                            </Col>
                        </Row>
                    </section>

                    <section className="mb-4">
                        <h2 className="h4 text-info">2. User Conduct</h2>
                        <p>Users are expected to behave appropriately at events. Any form of harassment, illegal activity, or violation of venue rules will result in immediate removal without refund and a potential permanent ban from AURA++.</p>
                    </section>

                    <section className="mb-4">
                        <h2 className="h4 text-info">3. Limitation of Liability</h2>
                        <p>AURA++ is a platform connecting users with event organizers. We are not responsible for event cancellations, quality of service at the venue, or any personal injury sustained during the event.</p>
                    </section>

                    <div className="text-center mt-5">
                        <p className="small text-muted">By using our services, you agree to abide by these terms. Violations may result in account suspension.</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
