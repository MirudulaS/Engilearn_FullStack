export default function Card({ children, interactive = false, className = '', ...rest }) {
  const interactiveClass = interactive ? 'card-interactive' : '';
  return (
    <div className={`card ${interactiveClass} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
