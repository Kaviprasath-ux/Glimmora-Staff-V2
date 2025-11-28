import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'default',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark/90 disabled:bg-primary/50',
    secondary: 'bg-beige text-text hover:bg-beige-light active:bg-beige disabled:bg-beige/50',
    outline: 'bg-transparent border border-border text-text hover:bg-neutral-dark active:bg-neutral disabled:opacity-50',
    ghost: 'bg-transparent text-text hover:bg-neutral-dark active:bg-neutral disabled:opacity-50',
    danger: 'bg-danger text-white hover:bg-danger/90 active:bg-danger/80 disabled:bg-danger/50',
    success: 'bg-success text-white hover:bg-success/90 active:bg-success/80 disabled:bg-success/50',
    warning: 'bg-warning text-white hover:bg-warning/90 active:bg-warning/80 disabled:bg-warning/50',
    green: 'bg-green text-white hover:bg-green-light active:bg-green/90 disabled:bg-green/50',
    teal: 'bg-teal text-white hover:bg-teal-light active:bg-teal/90 disabled:bg-teal/50',
    gold: 'bg-gold text-white hover:bg-gold-light active:bg-gold/90 disabled:bg-gold/50',
    link: 'bg-transparent text-primary hover:text-primary-dark underline-offset-4 hover:underline disabled:opacity-50'
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    default: 'text-sm px-4 py-2.5 rounded-[10px] gap-2',
    lg: 'text-base px-6 py-3 rounded-[12px] gap-2.5',
    icon: 'p-2.5 rounded-[10px]'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1
        disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {size !== 'icon' && <span>Loading...</span>}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export function IconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'default',
  className = '',
  label,
  ...props
}) {
  const sizeStyles = {
    sm: 'p-1.5',
    default: 'p-2',
    lg: 'p-2.5'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-beige text-text hover:bg-beige-light',
    outline: 'bg-transparent border border-border text-text hover:bg-neutral-dark',
    ghost: 'bg-transparent text-text-light hover:bg-neutral-dark hover:text-text',
    danger: 'bg-transparent text-danger hover:bg-danger-light'
  };

  return (
    <button
      type="button"
      className={`
        rounded-[10px] transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      aria-label={label}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
}

export function ButtonGroup({ children, className = '' }) {
  return (
    <div className={`inline-flex rounded-[10px] overflow-hidden border border-border ${className}`}>
      {children}
    </div>
  );
}

export function ButtonGroupItem({
  children,
  isActive = false,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={`
        px-4 py-2 text-sm font-medium transition-colors
        border-r border-border last:border-r-0
        ${isActive
          ? 'bg-primary text-white'
          : 'bg-white text-text hover:bg-neutral-dark'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
