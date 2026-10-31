const levelVariant = {
  Beginner: 'neutral',
  Intermediate: 'info',
  Advanced: 'success',
};

export default function SkillMatrix({ groups = [] }) {
  return (
    <div className="skill-matrix">
      {groups.map((group) => (
        <div className="skill-matrix-group" key={group.category}>
          <h3>{group.category}</h3>
          <ul className="skill-matrix-list">
            {group.skills.map((skill) => (
              <li key={skill.name} className="skill-matrix-item">
                <span>{skill.name}</span>
                <span className={`badge badge-${levelVariant[skill.level] ?? 'neutral'}`}>{skill.level}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
