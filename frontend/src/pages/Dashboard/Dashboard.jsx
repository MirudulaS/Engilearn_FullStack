import { useEffect, useState } from 'react';
import { Flame, BookCheck, Target, Percent } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyProgress } from '../../services/progressService';
import { getMyActivity } from '../../services/activityService';
import { getMyRecommendations } from '../../services/recommendationService';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import StatsCard from '../../components/dashboard/StatsCard';
import ContinueLearningCard from '../../components/dashboard/ContinueLearningCard';
import ActivityCard from '../../components/dashboard/ActivityCard';
import RecommendedCard from '../../components/dashboard/RecommendedCard';
import DepartmentProgressList from '../../components/dashboard/DepartmentProgressList';
import ProgressBar from '../../components/common/ProgressBar';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import './Dashboard.css';

// Everything on this page is now real, derived from actual progress,
// submissions, and module completion — no mock data left.
export default function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [activity, setActivity] = useState([]);
  const [continueLearning, setContinueLearning] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [status, setStatus] = useState('loading');

  function load() {
    setStatus('loading');
    Promise.all([getMyProgress(), getMyActivity(), getMyRecommendations()])
      .then(([progressData, activityData, recData]) => {
        setProgress(progressData);
        setActivity(activityData.map((item) => ({ ...item, timestamp: formatRelativeTime(item.timestamp) })));
        setContinueLearning(recData.continueLearning);
        setRecommended(recData.recommended);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="page-container">
      <header className="dash-welcome">
        <div>
          <h1>Welcome back, {firstName}</h1>
          <p className="text-muted">Here's where you left off.</p>
        </div>
        <div className="dash-streak">
          <Flame size={18} color="var(--color-warning)" />
          <span>{user?.streakDays ?? 0}-day streak</span>
        </div>
      </header>

      {status === 'loading' && <LoadingState message="Loading your progress…" />}
      {status === 'error' && <ErrorState onAction={load} />}

      {status === 'ready' && progress && (
        <>
          <div className="dash-overall">
            <ProgressBar value={progress.overallProgressPercent} label="Overall progress" />
          </div>

          <div className="dash-stats-grid">
            <StatsCard icon={BookCheck} label="Modules completed" value={progress.modulesCompleted} suffix={`/${progress.totalModules}`} />
            <StatsCard icon={Target} label="Problems solved" value={progress.problemsSolved} />
            <StatsCard icon={Percent} label="Practice accuracy" value={progress.accuracyPercent} suffix="%" />
            <StatsCard icon={Flame} label="Current streak" value={user?.streakDays ?? 0} suffix=" days" />
          </div>

          <section className="dash-section">
            {continueLearning ? (
              <ContinueLearningCard continueLearning={continueLearning} />
            ) : (
              <EmptyState
                title="You're all caught up"
                description="You've completed every available module — check back as new content is added."
              />
            )}
          </section>

          <div className="dash-grid">
            <section className="dash-section">
              <h2 className="section-title-sm">Recent activity</h2>
              <div className="card">
                <ActivityCard activity={activity} />
              </div>
            </section>

            <section className="dash-section">
              <h2 className="section-title-sm">Recommended for you</h2>
              <div className="card">
                <RecommendedCard items={recommended} />
              </div>
            </section>
          </div>

          <section className="dash-section">
            <h2 className="section-title-sm">Department progress</h2>
            <DepartmentProgressList items={progress.departmentProgress} />
          </section>
        </>
      )}
    </div>
  );
}
