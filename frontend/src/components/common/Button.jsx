import { Loader2 } from 'lucide-react';

/**
 * Shared button. variant: primary | secondary | ghost | danger
 * size: sm | md | lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconOnly = false,
  loading = false,
  as: Component = 'button',
  className = '',
  ...rest
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const iconOnlyClass = iconOnly ? 'btn-icon' : '';

  return (
    <Component
      className={`btn btn-${variant} ${sizeClass} ${iconOnlyClass} ${className}`.trim()}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="btn-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {!iconOnly && children}
    </Component>
  );
}
