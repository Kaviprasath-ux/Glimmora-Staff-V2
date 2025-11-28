import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, getDashboardPath, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { email, password } = formData;

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsSubmitting(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on user role
      const dashboardPath = getDashboardPath(result.user.role);
      navigate(dashboardPath, { replace: true });
    } else {
      setError(result.error || 'Invalid email or password');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-text">Glimmora PMS</h1>
          <p className="text-text-light mt-1">Staff Login</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[20px] shadow-[var(--shadow-lg)] border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-danger-light rounded-[12px] border border-danger/20">
                <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
                <p className="text-sm text-danger font-medium">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-12 pr-4 bg-neutral border border-border rounded-[12px] text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-12 pr-12 bg-neutral border border-border rounded-[12px] text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-[12px] flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-text-muted text-center mb-3">Demo Credentials</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-green/5 rounded-[10px] border border-green/10">
                <div>
                  <span className="text-green font-medium">Housekeeping</span>
                  <p className="text-text-light mt-0.5">maria@glimmora.com</p>
                </div>
                <span className="text-text-muted">123456</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-[10px] border border-primary/10">
                <div>
                  <span className="text-primary font-medium">Maintenance</span>
                  <p className="text-text-light mt-0.5">john@glimmora.com</p>
                </div>
                <span className="text-text-muted">123456</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-teal/5 rounded-[10px] border border-teal/10">
                <div>
                  <span className="text-teal font-medium">Runner</span>
                  <p className="text-text-light mt-0.5">alex@glimmora.com</p>
                </div>
                <span className="text-text-muted">123456</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-6">
          Glimmora Property Management System
        </p>
      </div>
    </div>
  );
};

export default Login;
