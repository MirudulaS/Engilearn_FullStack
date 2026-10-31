import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthForm.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  function validate() {
    const next = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setFormError('');
    const result = await login({ email, password });
    setSubmitting(false);

    if (result.success) {
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } else {
      setFormError(result.error);
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1>Log in</h1>
        <p className="text-muted auth-subtitle">Welcome back — continue where you left off.</p>

        {formError && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="field-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className={`input ${errors.email ? 'has-error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="field-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className={`input ${errors.password ? 'has-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-muted auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
