import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInformation from '../components/profile/ProfileInformation';
import SavedAddress from '../components/profile/SavedAddress';
import FavoriteFoods from '../components/profile/FavoriteFoods';
import RecentOrders from '../components/profile/RecentOrders';

export const Profile = () => {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <PageContainer className="space-y-8">
        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProfileInformation />
          <SavedAddress />
        </div>

        <RecentOrders />
        <FavoriteFoods />
      </PageContainer>
    </main>
  );
};

export default Profile;
