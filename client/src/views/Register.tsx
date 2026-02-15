import { useState } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';



const apiClient = new ApiClient();

export default function Register() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Debug: Test toast on mount
    // useEffect(() => {
    //     toast('Toast system is active', { icon: '🔔' });
    // }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting registration form...", formData);

        if (formData.password !== formData.password_confirmation) {
            console.log("Password mismatch");
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Creating your account...');

        try {
            console.log("Calling API...");
            const res = await apiClient.register(
                formData.name,
                formData.email,
                formData.phone,
                formData.password,
                formData.password_confirmation
            );
            console.log("API Response:", res);

            toast.dismiss(loadingToast);

            if (res.success) {
                console.log("Registration success!");
                toast.success('Account created successfully! Please login.');
                navigate('/login');
            } else {
                console.error("Registration failed:", res.message);
                toast.error(`Error ${res.status || '?'}: ${res.message || 'Registration failed'}`);
            }
        } catch (error) {
            console.error("Catch block error:", error);
            toast.dismiss(loadingToast);
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center py-5">
            <Card className="p-5 text-white border-0 shadow-lg animate-fade-in-up" style={{
                maxWidth: '600px',
                width: '100%',
                background: 'rgba(20, 20, 20, 0.98)',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <Card.Body>
                    <div className="text-center mb-5">
                        <h1 className="fw-bold mb-2" style={{ color: '#D90429', letterSpacing: '3px', fontSize: '2.5rem', textShadow: '0 0 15px rgba(217, 4, 41, 0.2)' }}>JOIN AURA++</h1>
                        <p className="text-white fw-bold opacity-75" style={{ fontSize: '1.1rem' }}>Welcome to our website! Create your account to start booking.</p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold px-2 py-1 mb-2" style={{ background: 'rgba(217, 4, 41, 0.1)', borderLeft: '4px solid #D90429', borderRadius: '4px', fontSize: '1.1rem' }}>
                                Full Name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="bg-black text-white border-secondary py-2"
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold px-2 py-1 mb-2" style={{ background: 'rgba(0, 212, 255, 0.1)', borderLeft: '4px solid #00d4ff', borderRadius: '4px', fontSize: '1.1rem' }}>
                                Email Address
                            </Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="bg-black text-white border-secondary py-2"
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold px-2 py-1 mb-2" style={{ background: 'rgba(255, 193, 7, 0.1)', borderLeft: '4px solid #FFC107', borderRadius: '4px', fontSize: '1.1rem' }}>
                                Phone Number
                            </Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="bg-black text-white border-secondary py-2"
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold px-2 py-1 mb-2" style={{ background: 'rgba(255, 255, 255, 0.1)', borderLeft: '4px solid #fff', borderRadius: '4px', fontSize: '1.1rem' }}>
                                Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Create a password (min 8 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                className="bg-black text-white border-secondary py-2"
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold px-2 py-1 mb-2" style={{ background: 'rgba(255, 255, 255, 0.1)', borderLeft: '4px solid #fff', borderRadius: '4px', fontSize: '1.1rem' }}>
                                Confirm Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="password_confirmation"
                                placeholder="Confirm your password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                                className="bg-black text-white border-secondary py-2"
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-5">
                            <Form.Check
                                type="checkbox"
                                id="terms-check"
                                required
                                label={
                                    <span className="text-white fw-bold" style={{ fontSize: '1rem' }}>
                                        I agree to the <Link to="/terms" className="text-danger text-decoration-underline mx-1">Terms & Conditions</Link> and <Link to="/privacy" className="text-danger text-decoration-underline mx-1">Privacy Policy</Link>
                                    </span>
                                }
                            />
                        </Form.Group>

                        <Button type="submit" className="w-100 py-3 fw-bold mb-4" style={{ backgroundColor: '#D90429', border: 'none', borderRadius: '12px', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(217, 4, 41, 0.3)' }} disabled={loading}>
                            {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
                        </Button>

                        <div className="text-center mt-5 pt-4 border-top border-secondary">
                            <h5 className="text-white mb-0 fw-bold">
                                Already have an account?
                                <Link to="/login" className="ms-2 px-3 py-1 bg-danger text-white rounded text-decoration-none shadow-sm" style={{ fontSize: '1.1rem' }}>
                                    Login here
                                </Link>
                            </h5>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
