import { NavLink } from 'react-router-dom';

const MenuItem = ({
  to,
  icon: Icon,
  label,
  badge,
  onClick,
  isActive: isActiveProp,
  className = ''
}) => {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-[12px]
          text-text-light hover:bg-primary/5 hover:text-primary
          transition-all duration-200 text-left
          ${className}
        `}
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        <span className="font-medium flex-1">{label}</span>
        {badge && (
          <span className="bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-[12px]
        transition-all duration-200
        ${(isActiveProp ?? isActive)
          ? 'bg-primary text-white shadow-sm'
          : 'text-text-light hover:bg-primary/5 hover:text-primary'
        }
        ${className}
      `}
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <span className="font-medium flex-1">{label}</span>
      {badge && (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          'bg-white/20 text-white'
        }`}>
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export function MenuSection({ title, children, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <h3 className="px-4 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
          {title}
        </h3>
      )}
      <nav className="space-y-1">
        {children}
      </nav>
    </div>
  );
}

export function MenuDivider() {
  return <div className="h-px bg-border my-4 mx-4" />;
}

export default MenuItem;
