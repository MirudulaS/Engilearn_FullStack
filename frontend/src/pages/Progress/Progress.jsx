import { useEffect, useState } from 'react';
import { BookCheck, Target, Percent, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyProgress, getSubjectProgress } from '../../services/progressService';
import ProgressBar from '../../components/common/ProgressBar';
import StatsCard from '../../components/dashboard/StatsCard';
import DepartmentProgressList from '../../components/dashboard/DepartmentProgressList';
import SubjectProgressList from '../../components/dashboard/SubjectProgressList';
import SkillMatrix from '../../components/dashboard/SkillMatrix';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import './Progress.css';

// Purely cosmetic grouping for display — which category header a subject
// appears under has no effect on the underlying data, which is real and
// comes entirely from src/services/progressService.js.
const SUBJECT_CATEGORIES = [
  { category: 'Frontend Development', subjects: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { category: 'Backend Development', subjects: ['Node.js'] },
  { category: 'Programming Fundamentals', subjects: ['Fundamentals'] },
  { category: 'Digital Electronics', subjects: ['VLSI'] },
  { category: 'Electrical Engineering', subjects: ['Circuit Analysis'] },
];

function buildSkillMatrix(subjects) {
  const bySubject = new Map(subjects.map((s) => [s.subject, s.level]));
  return SUBJECT_CATEGORIES.map(({ category, subjects: names }) => ({
    category,
    skills: names.filter((name) => bySubject.has(name)).map((name) => ({ name, level: bySubject.get(name) })),
  })).filter((group) => group.skills.length > 0);
}

// Everything on this page is real now — no mock data remains.
export default function Progress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState('loading');

  function load() {
    setStatus('loading');
    Promise.all([getMyProgress(), getSubjectProgress()])
      .then(([progressData, subjectData]) => {
        setProgress(progressData);
        setSubjects(subjectData);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  const skillMatrix = buildSkillMatrix(subjects);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Progress</h1>
        <p className="text-muted">A detailed look at what you've learned and practiced so far.</p>
      </header>

      {status === 'loading' && <LoadingState message="Loading your progress…" />}
      {status === 'error' && <ErrorState onAction={load} />}

      {status === 'ready' && progress && (
        <>
          <div className="dash-overall">
            <ProgressBar value={progress.overallProgressPercent} label="Overall progress" />
          </div>

          <div className="dash-stats-grid">
            <StatsCard icon={Target} label="Problems solved" value={progress.problemsSolved} />
            <StatsCard icon={BookCheck} label="Problems attempted" value={progress.problemsAttempted} />
            <StatsCard icon={Percent} label="Accuracy" value={progress.accuracyPercent} suffix="%" />
            <StatsCard icon={Flame} label="Current streak" value={user?.streakDays ?? 0} suffix=" days" />
          </div>

          <section className="dash-section">
            <h2 className="section-title-sm">Department progress</h2>
            <DepartmentProgressList items={progress.departmentProgress} />
          </section>

          <div className="progress-grid">
            <section className="dash-section">
              <h2 className="section-title-sm">Subject progress</h2>
              <div className="card">
                {subjects.length === 0 ? (
                  <EmptyState title="Nothing here yet" description="Complete a module to see subject progress." />
                ) : (
                  <SubjectProgressList items={subjects} />
                )}
              </div>
            </section>

            <section className="dash-section">
              <h2 className="section-title-sm">Skill matrix</h2>
              <div className="card">
                {skillMatrix.length === 0 ? (
                  <EmptyState title="Nothing here yet" description="Complete a module to start building your skill matrix." />
                ) : (
                  <SkillMatrix groups={skillMatrix} />
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
