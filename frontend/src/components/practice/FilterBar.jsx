import { departments } from '../../data/departments';

const difficulties = ['easy', 'medium', 'hard'];
const statuses = [
  { value: 'unattempted', label: 'Not started' },
  { value: 'attempted', label: 'Attempted' },
  { value: 'solved', label: 'Solved' },
];

export default function FilterBar({ filters, onChange }) {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="filter-bar">
      <input
        type="search"
        className="input filter-search"
        placeholder="Search problems…"
        value={filters.query}
        onChange={(e) => update({ query: e.target.value })}
        aria-label="Search problems"
      />

      <select
        className="select"
        value={filters.departmentId}
        onChange={(e) => update({ departmentId: e.target.value })}
        aria-label="Filter by department"
      >
        <option value="">All departments</option>
        {departments.map((d) => (
          <option value={d.id} key={d.id}>
            {d.shortName}
          </option>
        ))}
      </select>

      <select
        className="select"
        value={filters.difficulty}
        onChange={(e) => update({ difficulty: e.target.value })}
        aria-label="Filter by difficulty"
      >
        <option value="">All difficulties</option>
        {difficulties.map((d) => (
          <option value={d} key={d}>
            {d[0].toUpperCase() + d.slice(1)}
          </option>
        ))}
      </select>

      <select
        className="select"
        value={filters.status}
        onChange={(e) => update({ status: e.target.value })}
        aria-label="Filter by completion status"
      >
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option value={s.value} key={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
