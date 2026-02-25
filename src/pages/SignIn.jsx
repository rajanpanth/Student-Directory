import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const { signIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        const { error: signInError } = await signIn(email, password);
        setLoading(false);

        if (signInError) {
            setError(signInError.message);
        } else {
            navigate('/', { replace: true });
        }
    };

    return (
        <div className="auth-page">
            {/* Left branded panel */}
            <div className="auth-brand-panel">
                <div className="auth-brand-content">
                    <div className="auth-brand-logo">
                        <img src="/logo.jpg" alt="Logo" width="52" height="52" style={{ borderRadius: '10px' }} />
                    </div>
                    <h2 className="auth-brand-title">Student Directory</h2>
                    <p className="auth-brand-tagline">
                        Your all-in-one platform to manage students, track attendance, and monitor academic performance.
                    </p>
                    <div className="auth-features">
                        <div className="auth-feature">
                            <div className="auth-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div>
                                <h4>Student Management</h4>
                                <p>Add, edit, and organize student records effortlessly</p>
                            </div>
                        </div>
                        <div className="auth-feature">
                            <div className="auth-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <div>
                                <h4>Attendance Tracking</h4>
                                <p>Monitor presence and absence with one click</p>
                            </div>
                        </div>
                        <div className="auth-feature">
                            <div className="auth-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </div>
                            <div>
                                <h4>GPA Analytics</h4>
                                <p>Track grades and identify top performers instantly</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auth-brand-decoration">
                    <div className="auth-orb auth-orb-1" />
                    <div className="auth-orb auth-orb-2" />
                    <div className="auth-orb auth-orb-3" />
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-panel">
                <button
                    className="theme-toggle auth-theme-toggle"
                    onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    type="button"
                >
                    {theme === 'light' ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                    )}
                </button>
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div className="auth-logo-mobile">
                                <img src="/logo.jpg" alt="Logo" width="44" height="44" style={{ borderRadius: '8px' }} />
                            </div>
                            <h1>Welcome back</h1>
                            <p>Enter your credentials to access your account</p>
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="auth-field">
                                <label htmlFor="email">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="auth-btn-loading">
                                        <span className="auth-spinner" />
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/signup">Create one</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
