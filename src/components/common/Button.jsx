export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors';
  const variants = {
    primary: 'bg-[#A57865] text-white hover:bg-[#8f6656]',
    secondary: 'bg-white border border-[#C8B29D] text-[#4E5840] hover:bg-[#F2EBE3]',
    ghost: 'text-[#4E5840] hover:bg-[#F2EBE3]',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} px-4 py-2 ${className}`} {...props}>
      {children}
    </button>
  );
}

