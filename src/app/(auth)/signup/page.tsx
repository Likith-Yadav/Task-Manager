import { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up - Task Manager',
  description: 'Create a new account',
};

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create an account</h1>
          <p className="text-sm text-gray-600">
            Enter your details below to get started
          </p>
        </div>
        <SignUpForm />
        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
