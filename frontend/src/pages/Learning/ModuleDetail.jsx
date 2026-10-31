import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Circle, Dumbbell, Home } from 'lucide-react';
import { getDepartment, listModulesByCategory } from '../../services/departmentService';
import { getModule } from '../../services/moduleService';
import { getCompletedModuleIds, toggleModuleComplete } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import { EmptyState, LoadingState, ErrorState } from '../../components/common/States';
import LogicGateSimulator from '../../components/learning/simulations/LogicGateSimulator';
import FlipFlopWaveform from '../../components/learning/simulations/FlipFlopWaveform';
import '../Departments/DepartmentDetail.css';
import './ModuleDetail.css';

const SIMULATIONS = {
  'logic-gate': { title: 'Try it: logic gate simulator', Component: LogicGateSimulator },
  'flip-flop-waveform': { title: 'Try it: flip-flop waveform', Component: FlipFlopWaveform },
};

export default function ModuleDetail() {
  const { departmentId, categoryId, moduleId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [department, setDepartment] = useState(null);
  const [category, setCategory] = useState(null);
  const [module, setModule] = useState(null);
  const [siblingModules, setSiblingModules] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState('loading'); // loading | ready | error | not-found

  function load() {
    setStatus('loading');
    Promise.all([
      getDepartment(departmentId),
      listModulesByCategory(departmentId, categoryId),
      getModule(moduleId),
      isAuthenticated ? getCompletedModuleIds().catch(() => []) : Promise.resolve([]),
    ])
      .then(([dept, { category: cat, modules }, mod, completedIds]) => {
        setDepartment(dept);
        setCategory(cat);
        setSiblingModules(modules);
        setModule(mod);
        setCompleted(completedIds.includes(mod.id));
        setStatus('ready');
      })
      .catch((err) => setStatus(err.message?.includes('No ') ? 'not-found' : 'error'));
  }

  useEffect(load, [departmentId, categoryId, moduleId, isAuthenticated]);

  async function handleToggleComplete() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: window.location.pathname } } });
      return;
    }
    const previous = completed;
    setCompleted(!previous); // optimistic
    try {
      const nowCompleted = await toggleModuleComplete(moduleId);
      setCompleted(nowCompleted);
    } catch {
      setCompleted(previous); // revert on failure
    }
  }

  if (status === 'loading') {
    return (
      <div className="page-container">
        <LoadingState message="Loading module…" />
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

  if (status === 'not-found' || !department || !category || !module) {
    return (
      <div className="page-container">
        <EmptyState title="Module not found" description="That module doesn't exist." />
      </div>
    );
  }

  const index = siblingModules.findIndex((m) => m.id === module.id);
  const prevModule = siblingModules[index - 1];
  const nextModule = siblingModules[index + 1];

  return (
    <div className="page-container">
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-home"><Home size={13} /> Home</Link>
        <ChevronRight size={14} />
        <Link to="/departments">Departments</Link>
        <ChevronRight size={14} />
        <Link to={`/departments/${departmentId}`}>{department.shortName}</Link>
        <ChevronRight size={14} />
        <Link to={`/departments/${departmentId}/${categoryId}`}>{category.name}</Link>
        <ChevronRight size={14} />
        <span>{module.title}</span>
      </nav>

      <header className="module-detail-header">
        <div>
          <span className="text-muted">{module.subject}</span>
          <h1>{module.title}</h1>
          <div className="module-detail-badges">
            <Badge difficulty={module.difficulty}>{module.difficulty}</Badge>
          </div>
        </div>
        <button
          className={`btn ${completed ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleToggleComplete}
        >
          {completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          {completed ? 'Completed' : 'Mark as complete'}
        </button>
      </header>

      <p className="module-detail-desc">{module.description}</p>

      <div className="module-detail-body">
        {module.theory.map((section) => (
          <section className="module-section" key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}

        {module.examples.map((example) => (
          <section className="module-section" key={example.title}>
            <h2>{example.title}</h2>
            <pre className="module-code-block">
              <code>{example.code}</code>
            </pre>
          </section>
        ))}
      </div>

      <div className="module-detail-actions">
        <Link
          to={`/practice?department=${departmentId}&category=${categoryId}&module=${module.id}`}
          className="btn btn-primary"
        >
          <Dumbbell size={16} />
          Practice this topic
        </Link>
      </div>

      {module.simulation && SIMULATIONS[module.simulation] && (
        <section className="module-simulation">
          <h2>{SIMULATIONS[module.simulation].title}</h2>
          {(() => {
            const { Component } = SIMULATIONS[module.simulation];
            return <Component />;
          })()}
        </section>
      )}

      <div className="module-nav">
        {prevModule ? (
          <Link to={`/departments/${departmentId}/${categoryId}/${prevModule.id}`} className="module-nav-link">
            ← {prevModule.title}
          </Link>
        ) : (
          <span />
        )}
        {nextModule ? (
          <Link to={`/departments/${departmentId}/${categoryId}/${nextModule.id}`} className="module-nav-link module-nav-link--next">
            {nextModule.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
