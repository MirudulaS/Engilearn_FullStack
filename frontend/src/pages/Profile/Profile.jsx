import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateMe } from '../../services/authService';
import { getDepartment } from '../../services/departmentService';
import { getMyProgress } from '../../services/progressService';
import { listMySubmissions } from '../../services/submissionService';
import { getProblem } from '../../services/problemService';
import { getMyAchievements } from '../../services/achievementService';
import ProfileHeader from '../../components/profile/ProfileHeader';
import EditProfileModal from '../../components/profile/EditProfileModal';
import Badge from '../../components/common/Badge';
import AchievementCard from '../../components/achievements/AchievementCard';
import { LoadingState, ErrorState } from '../../components/common/States';
import './Profile.css';

// NOTE: recent submissions and achievements are both real now — this page
// has no remaining mock data.
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [department, setDepartment] = useState(null);
  const [progress, setProgress] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('loading');

  function load() {
    if (!user) return;
    setStatus('loading');
    Promise.all([
      getDepartment(user.department),
      getMyProgress(),
      listMySubmissions().then(async (submissions) => {
        const solved = submissions.filter((s) => s.verdict === 'Accepted').slice(0, 4);
        const withTitles = await Promise.all(
          solved.map(async (s) => {
            const problem = await getProblem(s.problem).catch(() => null);
            return problem ? { id: problem.id, title: problem.title, difficulty: problem.difficulty } : null;
          })
        );
        return withTitles.filter(Boolean);
      }),
      getMyAchievements(),
    ])
      .then(([dept, progressData, submissions, achievementsData]) => {
        setDepartment(dept);
        setProgress(progressData);
        setRecentSubmissions(submissions);
        setAchievements(achievementsData);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(load, [user]);

  const earnedAchievements = achievements.filter((a) => a.earned).slice(0, 4);

  if (status === 'loading' || !user) {
    return (
      <div className="page-container">
        <LoadingState message="Loading your profile…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="page-container">
        <ErrorState onAction={load} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <ProfileHeader user={user} department={department} onEdit={() => setEditing(true)} />

      <div className="profile-grid">
        <section className="dash-section">
          <h2 className="section-title-sm">Skills</h2>
          <div className="card profile-skills">
            {(user.skills ?? []).map((skill) => (
              <Badge variant="accent" key={skill}>
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        <section className="dash-section">
          <h2 className="section-title-sm">Learning statistics</h2>
          <div className="card profile-stats">
            <div>
              <span className="text-muted">Problems solved</span>
              <span>{progress?.problemsSolved ?? 0}</span>
            </div>
            <div>
              <span className="text-muted">Accuracy</span>
              <span>{progress?.accuracyPercent ?? 0}%</span>
            </div>
            <div>
              <span className="text-muted">Modules completed</span>
              <span>{progress?.modulesCompleted ?? 0}</span>
            </div>
            <div>
              <span className="text-muted">Current streak</span>
              <span>{user.streakDays ?? 0} days</span>
            </div>
          </div>
        </section>
      </div>

      <section className="dash-section">
        <div className="section-title-row">
          <h2 className="section-title-sm">Recent submissions</h2>
        </div>
        {recentSubmissions.length === 0 ? (
          <p className="text-muted">No accepted submissions yet — solve a problem to see it here.</p>
        ) : (
          <div className="profile-submission-list">
            {recentSubmissions.map((p) => (
              <Link to={`/problem/${p.id}`} className="card card-interactive profile-submission" key={p.id}>
                <span>{p.title}</span>
                <Badge difficulty={p.difficulty}>{p.difficulty}</Badge>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="dash-section">
        <div className="section-title-row">
          <h2 className="section-title-sm">Achievements</h2>
          <Link to="/achievements" className="text-accent profile-achievements-link">
            View all
          </Link>
        </div>
        <div className="achievement-grid">
          {earnedAchievements.map((a) => (
            <AchievementCard achievement={a} key={a.id} />
          ))}
        </div>
      </section>

      {editing && (
        <EditProfileModal
          user={user}
          onClose={() => setEditing(false)}
          onSave={async (next) => {
            const result = await updateMe({ name: next.name, bio: next.bio });
            if (!result.success) {
              throw new Error(result.error);
            }
            updateUser(result.user);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}
