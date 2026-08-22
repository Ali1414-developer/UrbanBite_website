import React from 'react';
import useAuth from '../../hooks/useAuth';

export const ProfileHeader = () => {
  const { currentUser } = useAuth();

  return (
    <div className="rounded-3xl bg-slate-900 p-8 text-white flex flex-col sm:flex-row items-center gap-6 shadow-xl">
      <img
        src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
        alt="Avatar"
        className="h-20 w-20 rounded-2xl object-cover border-2 border-rose-500 shadow-md shrink-0"
      />
      <div className="text-center sm:text-left space-y-1">
        <h2 className="text-2xl font-black text-white">{currentUser?.fullName || 'UrbanBite Customer'}</h2>
        <p className="text-xs text-slate-400">{currentUser?.email} • {currentUser?.phone}</p>
        <span className="inline-block rounded-full bg-rose-500/20 px-3 py-0.5 text-[11px] font-bold text-rose-400 border border-rose-500/30">
          Gold Foodie Member
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
