'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Boxes, Workflow, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Header */}
      <header className="fixed w-full bg-white/10 backdrop-blur-md z-50 border-b border-white/20">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Enterprise</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-16">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/30 mb-8">
              <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
              <span className="text-sm text-gray-700">Introducing AI-Powered Task Management</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8">
              Task Management
              <br />
              Infrastructure for
              <br />
              Modern Teams
            </h1>
            
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              With TaskFlow's versatility, teams deliver better results faster while staying in-line with their company standards.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 text-lg rounded-full hover:opacity-90">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#learn-more" className="text-lg font-semibold text-gray-600 hover:text-gray-900">
                Learn more →
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-32 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Boxes,
                title: 'Smart Organization',
                description: 'AI-powered task categorization and priority management'
              },
              {
                icon: Workflow,
                title: 'Automated Workflows',
                description: 'Custom automation to streamline your team processes'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-grade security with advanced access controls'
              }
            ].map((feature) => (
              <div key={feature.title} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative p-8 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
                  <feature.icon className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-32 grid md:grid-cols-4 gap-6">
            {[
              { label: 'Active Users', value: '100K+' },
              { label: 'Tasks Completed', value: '5M+' },
              { label: 'Time Saved', value: '2M hrs' },
              { label: 'Team Efficiency', value: '97%' }
            ].map((stat) => (
              <div key={stat.label} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative p-8 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
