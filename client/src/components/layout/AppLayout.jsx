import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto max-w-[1200px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
