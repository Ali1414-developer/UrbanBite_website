import React from 'react';
import AuthImagePanel from './AuthImagePanel';

export const AuthLayout = ({ children, title, subtitle, imageUrl }) => {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <AuthImagePanel title={title} subtitle={subtitle} imageUrl={imageUrl} />
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
