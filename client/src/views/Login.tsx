import { useState } from 'react';
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
    const [rememberMe, setRememberMe] = useState(false);
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
        } catch {
            toast.error('An error occurred during login');
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
        maxWidth: '420px',
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

    const googleBtnStyle: React.CSSProperties = {
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#111111',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '12px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'background 0.2s',
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                    <h2 style={{ fontWeight: '800', fontSize: '1.9rem', marginBottom: '0.4rem', color: '#fff' }}>
                        Welcome Back
                    </h2>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>
                        Login to access your{' '}
                        <span style={{ color: '#cc0000', fontWeight: '700' }}>AURA++</span>{' '}
                        account
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Remember me + Forgot Password */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ width: '15px', height: '15px', accentColor: '#cc0000' }}
                            />
                            Remember me
                        </label>
                        <Link to="/forgot-password" style={{ color: '#cc0000', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button type="submit" style={redBtnStyle} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    {/* OR Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.2rem 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }} />
                        <span style={{ color: '#888', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }} />
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        style={googleBtnStyle}
                        onClick={() => toast('Google login coming soon!')}
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Login with Google
                    </button>

                    {/* Register link */}
                    <p style={{ textAlign: 'center', marginTop: '1.4rem', color: '#aaa', fontSize: '0.9rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#cc0000', textDecoration: 'none', fontWeight: '700' }}>
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
