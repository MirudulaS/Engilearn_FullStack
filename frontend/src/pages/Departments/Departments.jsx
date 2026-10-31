import { useEffect, useState } from 'react';
import { listDepartments } from '../../services/departmentService';
import DepartmentCard from '../../components/learning/DepartmentCard';
import { LoadingState, ErrorState } from '../../components/common/States';
import './Departments.css';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  function load() {
    setStatus('loading');
    listDepartments()
      .then((data) => {
        // The backend stores counts per category, not a department-level
        // total, so derive it here rather than changing DepartmentCard.
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
    <div className="page-container">
      <header className="page-header">
        <h1>Departments</h1>
        <p className="text-muted">
          Pick a department to see its learning paths, modules, and practice problems.
        </p>
      </header>

      {status === 'loading' && <LoadingState message="Loading departments…" />}
      {status === 'error' && <ErrorState onAction={load} />}
      {status === 'ready' && (
        <div className="dept-grid dept-grid--wide">
          {departments.map((dept) => (
            <DepartmentCard department={dept} skillLimit={5} key={dept.id} />
          ))}
        </div>
      )}
    </div>
  );
}
