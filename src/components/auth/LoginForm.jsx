import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../common/Input';
import PasswordInput from './PasswordInput';
import Button from '../common/Button';

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fromPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-600 font-semibold">{error}</div>}

      <Input
        label="Email Address"
        type="email"
        icon={Mail}
        placeholder="user@urbanbite.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
          <span className="text-slate-600">Remember Me</span>
        </label>
        <a href="#" className="font-semibold text-rose-600 hover:underline">
          Forgot password?
        </a>
      </div>

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading} size="lg" className="gap-2">
        Sign In <ArrowRight size={18} />
      </Button>
    </form>
  );
};

export default LoginForm;
