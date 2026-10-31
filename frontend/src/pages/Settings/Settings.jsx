import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateMe } from '../../services/authService';
import './Settings.css';

// Notification toggles are still local-only — there's no backend model for
// notification preferences yet, only for the name/bio/skills fields that
// PATCH /api/users/me actually supports.
export default function Settings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = await updateMe({ name });
    setSaving(false);
    if (result.success) {
      updateUser(result.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Settings</h1>
        <p className="text-muted">Manage your account and notification preferences.</p>
      </header>

      {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

      <form className="settings-form" onSubmit={handleSave}>
        <section className="card settings-section">
          <h2>Account</h2>
          <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="field-label" htmlFor="settings-name">Display name</label>
            <input
              id="settings-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="settings-email">Email</label>
            <input id="settings-email" className="input" type="email" defaultValue={user?.email} disabled />
            <span className="field-hint">Email changes will require verification once that's supported.</span>
          </div>
        </section>

        <section className="card settings-section">
          <h2>Notifications</h2>
          <label className="settings-toggle-row">
            <span>Email me about achievements and milestones</span>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
            />
          </label>
          <label className="settings-toggle-row">
            <span>Remind me to keep my learning streak going</span>
            <input
              type="checkbox"
              checked={streakReminders}
              onChange={(e) => setStreakReminders(e.target.checked)}
            />
          </label>
        </section>

        <div className="settings-actions">
          {saved && <span className="badge badge-success">Saved</span>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
