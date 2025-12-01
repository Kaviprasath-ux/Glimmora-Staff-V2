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
          w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px]
          text-text-muted hover:bg-primary-100 hover:text-text
          transition-all duration-200 text-left group
          ${className}
        `}
      >
        {Icon && (
          <div className="w-8 h-8 rounded-[8px] bg-neutral flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Icon className="w-[18px] h-[18px]" />
          </div>
        )}
        <span className="text-sm font-medium flex-1">{label}</span>
        {badge && (
          <span className="bg-primary text-white text-[11px] font-semibold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
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
        flex items-center gap-3 px-3 py-2.5 rounded-[10px]
        transition-all duration-200 group
        ${(isActiveProp ?? isActive)
          ? 'bg-primary text-white'
          : 'text-text-muted hover:bg-primary-100 hover:text-text'
        }
        ${className}
      `}
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
              (isActiveProp ?? isActive)
                ? 'bg-white/15'
                : 'bg-neutral group-hover:bg-primary/10'
            }`}>
              <Icon className={`w-[18px] h-[18px] ${(isActiveProp ?? isActive) ? 'text-white' : ''}`} />
            </div>
          )}
          <span className={`text-sm font-medium flex-1 ${(isActiveProp ?? isActive) ? 'text-white' : ''}`}>{label}</span>
          {badge && (
            <span className={`text-[11px] font-semibold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center ${
              (isActiveProp ?? isActive) ? 'bg-white/20 text-white' : 'bg-primary text-white'
            }`}>
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export function MenuSection({ title, children, className = '' }) {
  return (
    <div className={`mb-5 ${className}`}>
      {title && (
        <h3 className="px-3 mb-3 text-[11px] font-semibold text-text-muted/70 uppercase tracking-wider">
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
  return <div className="h-px bg-border my-3 mx-3" />;
}

export default MenuItem;
