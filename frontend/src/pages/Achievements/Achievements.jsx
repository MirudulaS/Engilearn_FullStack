import { useEffect, useState } from 'react';
import { getMyAchievements } from '../../services/achievementService';
import AchievementCard from '../../components/achievements/AchievementCard';
import { LoadingState, ErrorState } from '../../components/common/States';
import './Achievements.css';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [status, setStatus] = useState('loading');

  function load() {
    setStatus('loading');
    getMyAchievements()
      .then((data) => {
        setAchievements(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Achievements</h1>
        <p className="text-muted">
          {status === 'ready' ? `${earnedCount} of ${achievements.length} earned` : 'Track your milestones as you learn.'}
        </p>
      </header>

      {status === 'loading' && <LoadingState message="Loading your achievements…" />}
      {status === 'error' && <ErrorState onAction={load} />}

      {status === 'ready' && (
        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <AchievementCard achievement={achievement} key={achievement.id} />
          ))}
        </div>
      )}
    </div>
  );
}
