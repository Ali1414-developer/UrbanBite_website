import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Home } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 mb-6 shadow-md">
        <Flame size={48} />
      </div>
      <h1 className="text-6xl font-black text-slate-900">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mt-2">Oops! Page Not Found</h2>
      <p className="mt-2 max-w-sm text-xs text-slate-500">
        The page you are looking for might have been moved, renamed, or doesn't exist in the UrbanBite universe.
      </p>
      <Button onClick={() => navigate('/')} className="mt-6 gap-2" size="md">
        <Home size={16} /> Return to Homepage
      </Button>
    </main>
  );
};

export default NotFound;
