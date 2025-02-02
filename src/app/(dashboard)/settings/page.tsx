'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  updateProfile, 
  updatePassword, 
  deleteUser, 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  getAuth,
} from 'firebase/auth';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/login');
      return;
    }

    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, router, isLoading]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-gray-400">
        Loading...
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) {
      toast.error('No user is currently logged in');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Updating profile for user:', auth.currentUser.uid);
      
      await updateProfile(auth.currentUser, {
        displayName: name
      });

      // Update the user document in Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name: name,
        updatedAt: new Date()
      });

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!auth.currentUser || !auth.currentUser.email) {
      toast.error('No user is currently logged in');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password should be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Changing password for user:', auth.currentUser.uid);

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password changed successfully');
    } catch (error: any) {
      console.error('Password change error:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else {
        toast.error(error.message || 'Failed to change password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      // Force a small delay to ensure signOut completes
      setTimeout(() => {
        router.push('/');
        // Force a page refresh to clear any cached states
        window.location.href = '/';
      }, 100);
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold text-white mb-8">Settings</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Settings */}
        <div className="space-y-4 bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-medium text-white">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Email</label>
              <Input
                value={email}
                disabled
                className="opacity-50"
              />
            </div>
            <Button
              onClick={handleUpdateProfile}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </div>

        {/* Change Password */}
        <div className="space-y-4 bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-medium text-white">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Section - Replacing Danger Zone */}
      <div className="mt-12 border border-gray-800 rounded-lg p-6 bg-gray-800/50">
        <h2 className="text-xl font-medium text-white">Logout</h2>
        <p className="text-gray-400 mt-2 mb-4">
          Click below to securely logout from your account
        </p>
        <Button
          variant="secondary"
          onClick={handleLogout}
          disabled={isLoading}
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </div>
  );
}
