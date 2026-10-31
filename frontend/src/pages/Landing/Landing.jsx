import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Terminal,
  Waves,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';
import { listDepartments } from '../../services/departmentService';
import DepartmentCard from '../../components/learning/DepartmentCard';
import { LoadingState, ErrorState } from '../../components/common/States';
import './Landing.css';

// Each feature gets an icon color from a small rotating palette so the grid
// has some visual variety instead of one repeated blue note.
const featureColors = [
  'var(--color-accent)',
  'var(--color-dept-ece)',
  'var(--color-highlight)',
  'var(--color-success)',
];

const features = [
  {
    icon: Boxes,
    title: 'Interactive learning',
    description: 'Work through modules built around real engineering syllabi, not generic tutorials.',
  },
  {
    icon: Target,
    title: 'Practice tasks',
    description: 'Apply every concept immediately with graded exercises across every difficulty level.',
  },
  {
    icon: Terminal,
    title: 'Online compiler',
    description: 'Write, run, and submit code for JavaScript, Python, C, C++, Java, and Verilog.',
  },
  {
    icon: Waves,
    title: 'Engineering simulations',
    description: 'Logic gates, circuits, and signal problems you can manipulate, not just read about.',
  },
  {
    icon: TrendingUp,
    title: 'Progress tracking',
    description: 'See exactly which topics you have mastered and which need more repetition.',
  },
  {
    icon: Sparkles,
    title: 'Skill development',
    description: 'Build a skill matrix across departments as you complete modules and problems.',
  },
];

export default function Landing() {
  const [departments, setDepartments] = useState([]);
  const [status, setStatus] = useState('loading');

  function load() {
    setStatus('loading');
    listDepartments()
      .then((data) => {
        const withTotals = data.map((dept) => ({
          ...dept,
          moduleCount: dept.categories.reduce((sum, c) => sum + c.moduleCount, 0),
          problemCount: dept.categories.reduce((sum, c) => sum + c.problemCount, 0),
        }));
        setDepartments(withTotals);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">For IT, ECE &amp; EEE students</p>
          <h1 className="hero-title">
            Learn engineering by building, debugging, and solving — not just reading.
          </h1>
          <p className="hero-subtitle">
            EngiLearn pairs structured coursework with a real code editor and interactive
            circuit exercises, so what you study is what you practice.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start learning
            </Link>
            <Link to="/departments" className="btn btn-secondary btn-lg">
              Explore departments
            </Link>
          </div>
        </div>

        <div className="hero-panel" aria-hidden="true">
          <div className="hero-panel-row">
            <span className="hero-panel-dot" />
            <span className="hero-panel-dot" />
            <span className="hero-panel-dot" />
            <span className="hero-panel-file">problem_07_flipflop.v</span>
          </div>
          <pre className="hero-panel-code">{`module d_flip_flop (
  input  wire clk,
  input  wire d,
  output reg  q
);
  always @(posedge clk)
    q <= d;
endmodule`}</pre>
          <div className="hero-panel-status">
            <span className="badge badge-success">3 / 3 tests passed</span>
          </div>
        </div>
      </section>

      <section className="page-container">
        <h2 className="section-title">Everything you need to actually learn</h2>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, description }, i) => {
            const color = featureColors[i % featureColors.length];
            return (
              <div key={title} className="feature-item" style={{ borderTopColor: color }}>
                <div className="feature-item-icon" style={{ background: `${color}1a`, color }}>
                  <Icon size={20} />
                </div>
                <h3>{title}</h3>
                <p className="text-muted">{description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="page-container">
        <h2 className="section-title">Choose your department</h2>
        <div className="dept-grid">
          {status === 'loading' && <LoadingState message="Loading departments…" />}
          {status === 'error' && <ErrorState onAction={load} />}
          {status === 'ready' &&
            departments.map((dept) => (
            <DepartmentCard department={dept} key={dept.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
