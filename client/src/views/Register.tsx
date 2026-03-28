import { useState } from 'react';
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
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            toast.error('Passwords do not match');
            return;
        }

        if (!agreedToTerms) {
            toast.error('Please agree to the Terms & Conditions');
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Creating your account...');

        try {
            const res = await apiClient.register(
                formData.name,
                formData.email,
                formData.phone,
                formData.password,
                formData.password_confirmation
            );

            toast.dismiss(loadingToast);

            if (res.success) {
                toast.success('Account created successfully! Please login.');
                navigate('/login');
            } else {
                toast.error(`Error ${res.status || '?'}: ${res.message || 'Registration failed'}`);
            }
        } catch {
            toast.dismiss(loadingToast);
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    const pageStyle: React.CSSProperties = {
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#111111',
        border: '1px solid #8B0000',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '460px',
        color: '#ffffff',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontWeight: '600',
        fontSize: '0.95rem',
        marginBottom: '0.4rem',
        color: '#ffffff',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        backgroundColor: '#1c1c1c',
        border: '1px solid #333',
        borderRadius: '10px',
        padding: '12px 14px',
        color: '#ffffff',
        fontSize: '0.95rem',
        outline: 'none',
        boxSizing: 'border-box',
    };

    const redBtnStyle: React.CSSProperties = {
        width: '100%',
        backgroundColor: '#cc0000',
        color: '#ffffff',
        border: 'none',
        borderRadius: '10px',
        padding: '13px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'background 0.2s',
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                    <h2 style={{ fontWeight: '800', fontSize: '1.9rem', marginBottom: '0.4rem', color: '#fff' }}>
                        Join AURA++
                    </h2>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>
                        Create your account and start booking amazing events
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Phone */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            style={inputStyle}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder="Confirm your password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Terms Checkbox */}
                    <div style={{ marginBottom: '1.4rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#ccc', fontSize: '0.88rem' }}>
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                style={{ width: '15px', height: '15px', accentColor: '#cc0000', flexShrink: 0 }}
                            />
                            <span>
                                I agree to the{' '}
                                <Link to="/terms" style={{ color: '#cc0000', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
                                {' '}and{' '}
                                <Link to="/privacy" style={{ color: '#cc0000', textDecoration: 'none' }}>Privacy Policy</Link>
                            </span>
                        </label>
                    </div>

                    {/* Create Account Button */}
                    <button type="submit" style={redBtnStyle} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {/* Login Link */}
                    <p style={{ textAlign: 'center', marginTop: '1.3rem', color: '#aaa', fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#cc0000', textDecoration: 'none', fontWeight: '700' }}>
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
