import { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'default',
  closeOnOverlay = true,
  showCloseButton = true,
  className = ''
}) => {
  const modalRef = useRef(null);

  const sizeStyles = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
  };

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={closeOnOverlay ? onClose : undefined}
      />
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-[14px] shadow-[var(--shadow-lg)] w-full mx-4
          animate-scale-in max-h-[90vh] flex flex-col
          ${sizeStyles[size]}
          ${className}
        `}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-5 border-b border-border">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-text">{title}</h2>
              )}
              {subtitle && (
                <p className="text-sm text-text-light mt-1">{subtitle}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-neutral-dark transition-colors text-text-muted hover:text-text"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-5 overflow-y-auto flex-1">
          {children}
        </div>

        {footer && (
          <div className="p-5 border-t border-border bg-neutral/50 rounded-b-[14px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-text-light">{message}</p>
    </Modal>
  );
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  isLoading = false,
  size = 'default'
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size={size}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button type="submit" form="modal-form" isLoading={isLoading}>
            {submitText}
          </Button>
        </div>
      }
    >
      <form id="modal-form" onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
}

export default Modal;
