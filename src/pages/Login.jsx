import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

export const Login = () => {
  return (
    <AuthLayout
      title="Welcome Back Foodie!"
      subtitle="Sign in to your UrbanBite account to quickly re-order your favorite burgers, track live orders, and claim rewards."
    >
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-black text-slate-900">Sign In to UrbanBite</h1>
        <p className="text-xs text-slate-500">Enter your credentials below to access your account</p>
      </div>

      <LoginForm />

      <p className="text-center text-xs text-slate-600">
        Don't have an UrbanBite account?{' '}
        <Link to="/register" className="font-bold text-rose-600 hover:underline">
          Create an Account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
