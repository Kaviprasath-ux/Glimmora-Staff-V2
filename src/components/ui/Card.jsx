import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  className = '',
  padding = 'default',
  hover = false,
  onClick,
  ...props
}, ref) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    default: 'p-5',
    lg: 'p-6'
  };

  return (
    <div
      ref={ref}
      className={`
        bg-white rounded-[14px] shadow-[var(--shadow-soft)] border border-border
        ${paddingStyles[padding]}
        ${hover ? 'transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-lg font-semibold text-text ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-sm text-text-light mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`mt-4 pt-4 border-t border-border ${className}`} {...props}>
      {children}
    </div>
  );
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  className = ''
}) {
  const colorStyles = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-green/10 text-green',
    teal: 'bg-teal/10 text-teal',
    gold: 'bg-gold/10 text-gold',
    danger: 'bg-danger-light text-danger',
    warning: 'bg-warning-light text-warning'
  };

  const trendColors = {
    up: 'text-green',
    down: 'text-danger',
    neutral: 'text-text-muted'
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-light">{title}</p>
          <p className="text-2xl font-bold text-text mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-text-muted mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColors[trend]}`}>
              {trend === 'up' && <span>↑</span>}
              {trend === 'down' && <span>↓</span>}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-[12px] ${colorStyles[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}

export default Card;
