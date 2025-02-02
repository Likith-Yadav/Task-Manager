'use client';

import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center text-sm font-medium text-white hover:opacity-80"
      >
        <UserCircle className="h-6 w-6" />
      </Link>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="flex items-center gap-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none">
        <UserCircle className="h-6 w-6" />
        <span>{user.name || user.email}</span>
      </MenuButton>

      <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1">
          <MenuItem>
            {({ active }) => (
              <Link
                href="/settings"
                className={`${
                  active ? 'bg-primary text-black hover:bg-primary/80' : 'text-gray-900 hover:bg-gray-100'
                } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
              >
                Settings
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                onClick={handleSignOut}
                className={`${
                  active ? 'bg-primary text-black' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
              >
                Sign out
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
