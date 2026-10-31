import { departments } from '../../data/departments';
import CategoryCard from '../../components/learning/CategoryCard';
import './LearningPaths.css';

export default function LearningPaths() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Learning Paths</h1>
        <p className="text-muted">Every learning path across all three departments, in one view.</p>
      </header>

      {departments.map((dept) => (
        <section className="learning-paths-dept" key={dept.id}>
          <h2 className="learning-paths-dept-title" style={{ color: `var(${dept.accentVar})` }}>
            {dept.name}
          </h2>
          <div className="category-grid">
            {dept.categories.map((category) => (
              <CategoryCard departmentId={dept.id} category={category} key={category.id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
