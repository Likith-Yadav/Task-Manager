import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login - Task Manager',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm />
        <div className="text-center">
          <Link 
            href="/signup" 
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
