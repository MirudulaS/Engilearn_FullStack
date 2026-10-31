import { Flame, Pencil } from 'lucide-react';

export default function ProfileHeader({ user, department, onEdit }) {
  return (
    <div className="card profile-header">
      <div className="profile-avatar">{user.initials}</div>
      <div className="profile-header-info">
        <h1>{user.name}</h1>
        <p className="text-muted">{department?.name}</p>
        <p className="profile-header-bio">{user.bio}</p>
      </div>
      <div className="profile-header-side">
        <span className="dash-streak">
          <Flame size={16} color="var(--color-warning)" />
          {user.streakDays}-day streak
        </span>
        <button className="btn btn-secondary btn-sm" onClick={onEdit}>
          <Pencil size={14} />
          Edit profile
        </button>
      </div>
    </div>
  );
}
