import ProgressBar from '../common/ProgressBar';

export default function SubjectProgressList({ items = [] }) {
  return (
    <div className="subject-progress-list">
      {items.map((item) => (
        <ProgressBar key={item.subject} value={item.percent} label={item.subject} />
      ))}
    </div>
  );
}
