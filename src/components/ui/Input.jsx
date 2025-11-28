import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  wrapperClassName = '',
  type = 'text',
  ...props
}, ref) => {
  const hasIcon = !!Icon;

  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-3 py-2.5 rounded-[10px] border transition-all duration-200
            text-text placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:bg-neutral-dark disabled:cursor-not-allowed
            ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border'}
            ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
            ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-danger mt-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-muted mt-1">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({
  label,
  error,
  hint,
  className = '',
  wrapperClassName = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-3 py-2.5 rounded-[10px] border transition-all duration-200
          text-text placeholder:text-text-muted resize-none
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          disabled:bg-neutral-dark disabled:cursor-not-allowed
          ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger mt-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-muted mt-1">{hint}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export const Select = forwardRef(({
  label,
  error,
  hint,
  options = [],
  placeholder = 'Select an option',
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-3 py-2.5 rounded-[10px] border transition-all duration-200
          text-text bg-white
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          disabled:bg-neutral-dark disabled:cursor-not-allowed
          ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border'}
          ${className}
        `}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-danger mt-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-muted mt-1">{hint}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export const Checkbox = forwardRef(({
  label,
  description,
  error,
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`flex items-start gap-3 ${wrapperClassName}`}>
      <input
        ref={ref}
        type="checkbox"
        className={`
          w-4 h-4 mt-0.5 rounded border-border text-primary
          focus:ring-2 focus:ring-primary/20 focus:ring-offset-0
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      <div className="flex-1">
        {label && (
          <label className="text-sm font-medium text-text cursor-pointer">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        )}
        {error && (
          <p className="text-xs text-danger mt-1">{error}</p>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export const SearchInput = forwardRef(({
  placeholder = 'Search...',
  className = '',
  onClear,
  value,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        className={`
          w-full pl-10 pr-10 py-2.5 rounded-[10px] border border-border
          text-text placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          ${className}
        `}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default Input;
