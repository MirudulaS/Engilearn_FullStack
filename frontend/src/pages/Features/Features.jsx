import {
  Boxes,
  Terminal,
  Waves,
  TrendingUp,
  Target,
  Sparkles,
  Search,
  Award,
} from 'lucide-react';
import './Features.css';

const features = [
  { icon: Boxes, title: 'Interactive learning', description: 'Modules built around real engineering syllabi, with theory, examples, and completion tracking baked in.' },
  { icon: Target, title: 'Practice tasks', description: 'Apply every concept immediately with graded exercises across easy, medium, and hard difficulty.' },
  { icon: Terminal, title: 'Online compiler', description: 'Write, run, and submit code for JavaScript, Python, C, C++, Java, SQL, and Verilog in one interface.' },
  { icon: Waves, title: 'Engineering simulations', description: 'Logic gates and flip-flop waveforms you manipulate directly, not just diagrams to read.' },
  { icon: TrendingUp, title: 'Progress tracking', description: 'Department, subject, and topic-level progress bars plus a skill matrix that updates as you learn.' },
  { icon: Sparkles, title: 'Skill development', description: 'Build a visible skill profile across departments as modules and problems get completed.' },
  { icon: Search, title: 'Search & filter', description: 'Find courses, modules, and problems by department, difficulty, topic, or completion status.' },
  { icon: Award, title: 'Achievements', description: 'Milestone badges for streaks, problem counts, and full learning-path completions.' },
];

export default function Features() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Features</h1>
        <p className="text-muted">Everything built so far, in one place.</p>
      </header>

      <div className="features-page-grid">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="feature-item">
            <Icon size={20} color="var(--color-accent)" />
            <h3>{title}</h3>
            <p className="text-muted">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
