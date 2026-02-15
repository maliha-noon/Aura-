import { Container, Card } from 'react-bootstrap';

export default function Terms() {
    return (
        <Container className="py-5" style={{ maxWidth: '900px' }}>
            <Card className="p-5 bg-dark text-white border-0 shadow-lg" style={{ borderRadius: '20px', background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)' }}>
                <Card.Body>
                    <h1 className="text-center mb-2 fw-bold" style={{ letterSpacing: '2px', color: '#ff4d4d' }}>Terms & Conditions</h1>
                    <p className="text-muted text-center mb-5 small">Last Updated: February 16, 2026</p>

                    <section className="mb-5">
                        <h2 className="h4 mb-4 text-center" style={{ color: '#00d4ff', borderBottom: '1px solid #333', paddingBottom: '15px' }}>📌 Booking & Ticket Rules</h2>

                        <div className="rules-list">
                            <ul className="list-unstyled">
                                <li className="mb-4 p-3 border-start border-danger border-4 bg-secondary-dark rounded">
                                    <h5 className="text-danger fw-bold mb-1">💳 Payment Required</h5>
                                    <p className="mb-0 text-light opacity-75">All tickets must be paid for in full at the time of booking. Customers can only purchase and receive tickets after successful payment confirmation.</p>
                                </li>

                                <li className="mb-4 p-3 border-start border-warning border-4 bg-secondary-dark rounded">
                                    <h5 className="text-warning fw-bold mb-1">🚫 No Refund for Non-Attendance</h5>
                                    <p className="mb-0 text-light opacity-75">Tickets are non-refundable. If you fail to attend the event after booking for any reason, no refund will be issued.</p>
                                </li>

                                <li className="mb-4 p-3 border-start border-info border-4 bg-secondary-dark rounded">
                                    <h5 className="text-info fw-bold mb-1">🆔 Identification</h5>
                                    <p className="mb-0 text-light opacity-75">A valid original ID proof must be presented at the venue for entry. Digital or photocopies may not be accepted.</p>
                                </li>

                                <li className="mb-4 p-3 border-start border-info border-4 bg-secondary-dark rounded">
                                    <h5 className="text-info fw-bold mb-1">🕒 Entry Policy</h5>
                                    <p className="mb-0 text-light opacity-75">Entry is strictly prohibited once the event has started. Late arrivals will not be entitled to a refund or entry.</p>
                                </li>

                                <li className="mb-4 p-3 border-start border-info border-4 bg-secondary-dark rounded">
                                    <h5 className="text-info fw-bold mb-1">🔄 Transfers & Resale</h5>
                                    <p className="mb-0 text-light opacity-75">Reselling tickets on third-party platforms is strictly forbidden. Unauthorized reselling will result in ticket cancellation without refund.</p>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-5 text-center p-4 rounded" style={{ backgroundColor: 'rgba(0, 212, 255, 0.05)', border: '1px solid #333' }}>
                        <h2 className="h5 text-info mb-3">User Conduct</h2>
                        <p className="small text-light opacity-75 mb-0">
                            Users must behave appropriately. Any form of harassment, illegal activity, or violation of venue rules will result in immediate removal without refund and a potential permanent ban from AURA++.
                        </p>
                    </section>

                    <div className="text-center mt-5 pt-4 border-top border-secondary">
                        <p className="small text-muted mb-0">By using AURA++, you agree to abide by these terms. We connect you with events but are not responsible for event quality or injuries.</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
