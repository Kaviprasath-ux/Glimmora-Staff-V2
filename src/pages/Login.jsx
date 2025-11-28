import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await Promise.resolve(login(staffId, password));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Invalid staff ID or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#E7E1D9] rounded-2xl shadow-sm p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-[#A57865] text-white flex items-center justify-center text-lg font-bold">
              G
            </div>
            <p className="text-sm text-[#6B6F63] mt-2 uppercase tracking-[0.08em]">Glimmora PMS</p>
            <h1 className="text-2xl font-semibold text-[#4E5840] mt-1">Staff Portal Login</h1>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#4E5840] mb-1">Staff ID / Email</label>
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full rounded-lg border border-[#E7E1D9] bg-[#FAF7F4] px-3 py-2 text-sm text-[#4E5840] focus:border-[#A57865] focus:outline-none"
                placeholder="hk001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4E5840] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#E7E1D9] bg-[#FAF7F4] px-3 py-2 text-sm text-[#4E5840] focus:border-[#A57865] focus:outline-none"
                placeholder="••••••"
                required
              />
            </div>
            {error ? <p className="text-sm text-[#A57865] bg-[#A57865]/10 rounded-lg px-3 py-2">{error}</p> : null}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#A57865] text-white px-4 py-2 text-sm font-semibold hover:bg-[#8E6554] disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
