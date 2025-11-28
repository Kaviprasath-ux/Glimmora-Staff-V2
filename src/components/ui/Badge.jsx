const Badge = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  dot = false,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-neutral-dark text-text',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
    green: 'bg-green/10 text-green',
    teal: 'bg-teal/10 text-teal',
    gold: 'bg-gold/10 text-gold',
    beige: 'bg-beige/20 text-text',
    outline: 'bg-transparent border border-border text-text',
    ghost: 'bg-transparent text-text-light'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-success' :
          variant === 'warning' ? 'bg-warning' :
          variant === 'danger' ? 'bg-danger' :
          variant === 'info' ? 'bg-info' :
          variant === 'primary' ? 'bg-primary' :
          variant === 'green' ? 'bg-green' :
          variant === 'teal' ? 'bg-teal' :
          variant === 'gold' ? 'bg-gold' :
          'bg-text-muted'
        }`} />
      )}
      {children}
    </span>
  );
};

export function StatusBadge({ status, className = '' }) {
  const statusConfig = {
    // Room statuses
    dirty: { label: 'Dirty', variant: 'danger' },
    in_progress: { label: 'In Progress', variant: 'warning' },
    clean: { label: 'Clean', variant: 'success' },
    inspected: { label: 'Inspected', variant: 'teal' },

    // Task statuses
    todo: { label: 'To Do', variant: 'default' },
    completed: { label: 'Completed', variant: 'success' },

    // Work order statuses
    pending: { label: 'Pending', variant: 'warning' },

    // Delivery statuses
    in_transit: { label: 'In Transit', variant: 'info' },
    delivered: { label: 'Delivered', variant: 'success' },

    // Priority
    urgent: { label: 'Urgent', variant: 'danger' },
    high: { label: 'High', variant: 'warning' },
    normal: { label: 'Normal', variant: 'default' },
    low: { label: 'Low', variant: 'info' }
  };

  const config = statusConfig[status] || { label: status, variant: 'default' };

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  );
}

export function PriorityBadge({ priority, className = '' }) {
  const priorityConfig = {
    urgent: { label: 'Urgent', variant: 'danger' },
    high: { label: 'High', variant: 'warning' },
    normal: { label: 'Normal', variant: 'default' },
    low: { label: 'Low', variant: 'info' },
    critical: { label: 'Critical', variant: 'danger' },
    medium: { label: 'Medium', variant: 'gold' }
  };

  const config = priorityConfig[priority] || { label: priority, variant: 'default' };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

export function SeverityBadge({ severity, className = '' }) {
  const severityConfig = {
    critical: { label: 'Critical', variant: 'danger' },
    high: { label: 'High', variant: 'warning' },
    medium: { label: 'Medium', variant: 'gold' },
    low: { label: 'Low', variant: 'info' }
  };

  const config = severityConfig[severity] || { label: severity, variant: 'default' };

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  );
}

export default Badge;
