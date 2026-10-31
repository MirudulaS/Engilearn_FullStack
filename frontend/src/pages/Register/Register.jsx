import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departments } from '../../data/departments';
import '../Login/AuthForm.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  function validate() {
    const next = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (!department) next.department = 'Select a department.';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setFormError('');
    const result = await register({ name, email, password, department });
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setFormError(result.error);
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1>Create your account</h1>
        <p className="text-muted auth-subtitle">Start learning by building, not just reading.</p>

        {formError && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="field-label" htmlFor="register-name">Name</label>
            <input
              id="register-name"
              className={`input ${errors.name ? 'has-error' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="field-label" htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              className={`input ${errors.email ? 'has-error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="field-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              className={`input ${errors.password ? 'has-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {errors.password ? (
              <span className="field-error">{errors.password}</span>
            ) : (
              <span className="field-hint">At least 8 characters.</span>
            )}
          </div>

          <div className="field" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="field-label" htmlFor="register-department">Department</label>
            <select
              id="register-department"
              className={`select ${errors.department ? 'has-error' : ''}`}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select a department</option>
              {departments.map((d) => (
                <option value={d.id} key={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.department && <span className="field-error">{errors.department}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="text-muted auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
