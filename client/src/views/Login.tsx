import { useState } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

const apiClient = new ApiClient();

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await apiClient.login(email, password);
            if (res.success) {
                toast.success('Logged in successfully!');
                login(res.user, res.access_token);
                navigate('/');
            } else {
                toast.error(`Error ${res.status || '?'}: ${res.message || 'Login failed'}`);
            }
        } catch (error) {
            toast.error('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="p-5 text-white border-0 shadow-lg animate-fade-in-up" style={{
                maxWidth: '500px',
                width: '100%',
                background: 'rgba(20, 20, 20, 0.98)',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <Card.Body>
                    <div className="text-center mb-5">
                        <h1 className="fw-bold mb-2" style={{ color: '#D90429', letterSpacing: '3px', fontSize: '2.5rem', textShadow: '0 0 15px rgba(217, 4, 41, 0.2)' }}>WELCOME BACK</h1>
                        <p className="text-white fw-bold opacity-75" style={{ fontSize: '1.1rem' }}>Welcome to our website! Login to access your account.</p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="formBasicEmail">
                            <Form.Label className="fw-bold px-2 py-1 mb-2" style={{ background: 'rgba(0, 212, 255, 0.1)', borderLeft: '4px solid #00d4ff', borderRadius: '4px', fontSize: '1.1rem' }}>
                                Email Address
                            </Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-black text-white border-secondary py-2"
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <Form.Label className="fw-bold px-2 py-1 mb-2" style={{ background: 'rgba(255, 255, 255, 0.1)', borderLeft: '4px solid #fff', borderRadius: '4px', fontSize: '1.1rem' }}>
                                Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-black text-white border-secondary py-2"
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <Form.Check
                                type="checkbox"
                                label={<span className="text-white fw-bold">Remember me</span>}
                                id="custom-switch"
                            />
                            <Link to="/forgot-password" style={{ color: '#D90429', textDecoration: 'underline', fontWeight: 'bold' }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-100 py-3 fw-bold mb-4" style={{ backgroundColor: '#D90429', border: 'none', borderRadius: '12px', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(217, 4, 41, 0.3)' }} disabled={loading}>
                            {loading ? 'LOGGING IN...' : 'LOGIN NOW'}
                        </Button>

                        <div className="text-center mt-5 pt-4 border-top border-secondary">
                            <h5 className="text-white mb-0 fw-bold">
                                Don't have an account?
                                <Link to="/register" className="ms-2 px-3 py-1 bg-danger text-white rounded text-decoration-none shadow-sm" style={{ fontSize: '1.1rem' }}>
                                    Register here
                                </Link>
                            </h5>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container >
    );
}
