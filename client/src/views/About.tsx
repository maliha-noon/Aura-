import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiClock, FiDollarSign, FiZap, FiTarget, FiEye } from 'react-icons/fi';

const About: React.FC = () => {
    const navigate = useNavigate();
    const features = [
        {
            icon: <FiShield size={42} className="text-danger" />,
            title: "Trusted Platform",
            description: "A secure, blockchain-ready ecosystem for modern ticket management."
        },
        {
            icon: <FiClock size={42} className="text-danger" />,
            title: "24/7 Support",
            description: "Always available, everywhere. Our team is here to help you shine."
        },
        {
            icon: <FiDollarSign size={42} className="text-danger" />,
            title: "Best Prices",
            description: "Exclusive access to premium event pricing and insider deals."
        },
        {
            icon: <FiZap size={42} className="text-danger" />,
            title: "Easy Booking",
            description: "Zero friction. One-click booking for the world's hottest experiences."
        }
    ];

    return (
        <div className="about-page position-relative overflow-hidden min-vh-100" style={{ background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a14 100%)' }}>
            {/* Soft Eye-Soothing 3D Orbs */}
            <div className="aura-orb orb-red" style={{ top: '5%', left: '-10%', opacity: 0.1, filter: 'blur(120px)' }}></div>
            <div className="aura-orb orb-purple" style={{ bottom: '15%', right: '-15%', opacity: 0.08, filter: 'blur(150px)' }}></div>

            <Container className="perspective-1000 py-5 mt-5">
                {/* 3D Hero Section - Adjusted for 'Eye Soothing' Softness */}
                <Row className="text-center mb-5 pb-5 animate-fade-in-up">
                    <Col lg={9} className="mx-auto">
                        <Badge bg="danger" className="mb-4 px-4 py-2 rounded-pill shadow-lg ls-2 text-uppercase fw-bold" style={{ background: 'linear-gradient(90deg, #e63946, #c1121f)' }}>AURA++ ORIGINAL</Badge>
                        <h1 className="display-1 fw-bolder text-white mb-4 text-glow-white" style={{ letterSpacing: '-2px', lineHeight: '0.9' }}>
                            Elevate Every <span className="text-danger">Experience</span>
                        </h1>
                        <p className="lead text-muted fs-4 opacity-75 font-outfit" style={{ fontWeight: 300 }}>
                            AURA++ is where technology meets human connection. Discover, host, and live the most exclusive events with unprecedented 3D depth.
                        </p>
                    </Col>
                </Row>

                {/* 3D Feature Grid - Refined Tilt Cards */}
                <Row className="g-4 mb-5 pb-5">
                    {features.map((feature, index) => (
                        <Col key={index} md={6} lg={3} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                            <div className="tilt-card-3d h-100" style={{ transformStyle: 'preserve-3d' }}>
                                <Card className="h-100 glass-3d text-white text-center p-4 border-0 rounded-4 shadow-2xl transition-all duration-500 hover-scale-up" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="mb-4 d-inline-block p-4 rounded-circle bg-danger bg-opacity-10 shadow-sm mx-auto transition-transform duration-500 hover-z-30">
                                        {feature.icon}
                                    </div>
                                    <h3 className="fw-bold mb-3 font-outfit text-glow-white">{feature.title}</h3>
                                    <p className="text-muted small mb-0 opacity-70 lead" style={{ fontSize: '0.9rem' }}>{feature.description}</p>
                                </Card>
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* Layered Mission & Vision - More Softness and Depth */}
                <Row className="mt-5 pt-5 mb-5 align-items-stretch">
                    <Col lg={6} className="mb-4 mb-lg-0 animate-fade-in-left">
                        <div className="h-100 p-5 glass-3d rounded-5 shadow-lg border-start border-danger border-4 transform-hover-left transition-all">
                            <div className="d-flex align-items-center mb-4">
                                <div className="p-2 bg-danger bg-opacity-20 rounded-3 me-3">
                                    <FiTarget className="text-danger" size={32} />
                                </div>
                                <h2 className="text-white fw-bold mb-0 font-outfit">The Mission</h2>
                            </div>
                            <p className="text-muted fs-5 lh-lg mb-0 font-outfit opacity-80" style={{ fontWeight: 300 }}>
                                We are bridging the gap between imagination and reality by providing a high-performance, secure, and user-centric platform for every unique gathering.
                            </p>
                        </div>
                    </Col>
                    <Col lg={6} className="animate-fade-in-right">
                        <div className="h-100 p-5 glass-3d rounded-5 shadow-lg transform-hover-right transition-all" style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.08) 0%, rgba(10,10,20,0) 100%)' }}>
                            <div className="d-flex align-items-center mb-4">
                                <div className="p-2 bg-primary bg-opacity-10 rounded-3 me-3">
                                    <FiEye className="text-white" size={32} />
                                </div>
                                <h2 className="text-white fw-bold mb-0 font-outfit text-glow-white">The Vision</h2>
                            </div>
                            <p className="text-muted fs-5 lh-lg mb-0 italic font-outfit opacity-80" style={{ fontWeight: 300 }}>
                                "Technology is at its best when it dissolves into the background, bringing people together in the most beautiful, effortless way possible."
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Eye-Soothing Call to Action - Fixed Routing */}
                <Row className="text-center mt-5 pt-5 pb-5">
                    <Col lg={10} className="mx-auto glass-card p-5 rounded-5 shadow-2xl border-glow-red bg-premium-dark position-relative">
                        <div className="aura-orb orb-red" style={{ top: '-40%', left: '30%', width: '150px', height: '150px', opacity: 0.1 }}></div>
                        <h2 className="display-4 text-white fw-bold mb-3 font-outfit">Join the Aura++ Elite</h2>
                        <p className="text-muted mb-5 fs-5">Premium experiences deserve a premium platform. Your journey starts now.</p>
                        <div className="d-flex justify-content-center gap-4 mt-2">
                             <Button 
                                variant="outline-light" 
                                className="px-5 py-3 rounded-pill fw-bold border-opacity-25 transition-all hover-glow"
                                onClick={() => navigate('/events')}
                             >
                                Explore Events
                             </Button>
                             <Button 
                                variant="danger" 
                                className="px-5 py-3 rounded-pill fw-bold shadow-lg transition-all hover-scale-up" 
                                style={{ background: 'linear-gradient(90deg, #e63946, #c1121f)', border: 'none' }}
                                onClick={() => navigate('/subscription')}
                             >
                                Get Premium Access
                             </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default About;
