import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* This renders once and stays at the top */}
      <Navbar />
      
      {/* This changes based on your current route */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}