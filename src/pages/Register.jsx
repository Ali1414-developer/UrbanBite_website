import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

export const Register = () => {
  return (
    <AuthLayout
      title="Join The UrbanBite Club"
      subtitle="Register now to unlock exclusive discounts, express 1-click checkout, and free delivery perks across major cities."
    >
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-black text-slate-900">Create New Account</h1>
        <p className="text-xs text-slate-500">Fill in your details below to set up your profile</p>
      </div>

      <RegisterForm />

      <p className="text-center text-xs text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-rose-600 hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
