import { Award, Lock } from 'lucide-react';

export default function AchievementCard({ achievement }) {
  return (
    <div className={`card achievement-card ${achievement.earned ? '' : 'achievement-card--locked'}`}>
      <div className="achievement-card-icon">
        {achievement.earned ? <Award size={20} /> : <Lock size={16} />}
      </div>
      <h3>{achievement.title}</h3>
      <p className="text-muted achievement-card-desc">{achievement.description}</p>
      {achievement.earned && achievement.earnedAt && (
        <span className="text-faint achievement-card-date">
          Earned {new Date(achievement.earnedAt).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}
