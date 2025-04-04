import React from 'react';
import { Link } from 'react-router-dom';
import DemoLinks from '@/components/homepage/DemoLinks';

const Home = () => {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">WAKTI - Your Productivity Hub</h1>
        </div>
      </header>
      
      <div className="container mx-auto p-4 md:p-6 space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Featured Demos</h2>
          <DemoLinks />
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Explore Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/dashboard/ai-assistant" className="block p-4 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-sm text-gray-500">Your personal AI productivity partner.</p>
            </Link>
            <Link to="/dashboard/calendar" className="block p-4 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold">Calendar</h3>
              <p className="text-sm text-gray-500">Manage your schedule and stay organized.</p>
            </Link>
            <Link to="/dashboard/tasks" className="block p-4 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold">Tasks</h3>
              <p className="text-sm text-gray-500">Keep track of your to-do list and get things done.</p>
            </Link>
          </div>
        </section>
      </div>
      
      <footer className="bg-gray-100 py-6 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} WAKTI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
