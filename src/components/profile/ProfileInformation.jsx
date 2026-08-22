import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import userService from '../../services/userService';
import Input from '../common/Input';
import Button from '../common/Button';

export const ProfileInformation = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    city: currentUser?.city || 'Lahore',
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await userService.updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Personal Information</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        <Input
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Button type="submit" size="sm" variant="secondary">
          {isSaved ? 'Changes Saved!' : 'Save Profile Changes'}
        </Button>
      </form>
    </div>
  );
};

export default ProfileInformation;
