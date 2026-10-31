import { departments } from '../../data/departments';
import './About.css';

export default function About() {
  const totalModules = departments.reduce((sum, d) => sum + d.moduleCount, 0);
  const totalProblems = departments.reduce((sum, d) => sum + d.problemCount, 0);

  return (
    <div className="page-container about-page">
      <header className="page-header">
        <h1>About EngiLearn</h1>
        <p className="text-muted about-lede">
          EngiLearn exists because reading about engineering and actually doing it are two
          different skills — so we built a place where every concept comes with something
          to build, run, or debug.
        </p>
      </header>

      <div className="about-stats">
        <div>
          <span className="about-stat-value">{departments.length}</span>
          <span className="text-muted">departments</span>
        </div>
        <div>
          <span className="about-stat-value">{totalModules}</span>
          <span className="text-muted">learning modules</span>
        </div>
        <div>
          <span className="about-stat-value">{totalProblems}</span>
          <span className="text-muted">practice problems</span>
        </div>
      </div>

      <section className="about-section">
        <h2>What we're building</h2>
        <p>
          Most course platforms stop at video lectures and slides. EngiLearn pairs structured
          theory with an actual code editor, mock compiler, and interactive circuit exercises,
          so IT, ECE, and EEE students can move from "I understand this" to "I can build this"
          without switching tools.
        </p>
      </section>

      <section className="about-section">
        <h2>Where we are today</h2>
        <p>
          The platform you're using is a frontend-only preview: every module, problem, and
          submission you see is backed by mock data so the experience can be tested end to
          end before a real Node.js, Express, and MongoDB backend — plus a secure code
          execution service — is connected behind it.
        </p>
      </section>
    </div>
  );
}
