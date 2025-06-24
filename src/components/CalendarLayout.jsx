import React from 'react';
import { Calendar as CalendarIcon, Home, List, LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';


const CalendarLayout = () => {
  return (
    // Responsive flex container for sidebar and main content
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800">
      
      {/* sidebar with navigation and logout */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start">
        
        {/*title */}
        <div className="text-xl md:text-2xl font-bold text-indigo-600 mb-4 md:mb-6">📅 MyCalendar</div>

        {/* navigation links*/}
        <nav className="flex flex-row md:flex-col gap-4 w-full md:w-auto justify-around md:justify-start">
          <NavLink to="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-indigo-100">
            <Home className="w-5 h-5" /> <span className="hidden md:inline">Dashboard</span>
          </NavLink>
          <NavLink to="/calendar" className="flex items-center gap-2 p-2 rounded hover:bg-indigo-100">
            <CalendarIcon className="w-5 h-5" /> <span className="hidden md:inline">Calendar</span>
          </NavLink>
          <NavLink to="/tasks" className="flex items-center gap-2 p-2 rounded hover:bg-indigo-100">
            <List className="w-5 h-5" /> <span className="hidden md:inline">Tasks</span>
          </NavLink>
        </nav>

        {/*static logout button */}
        <div className="mt-0 md:mt-auto">
          <button className="flex items-center gap-2 p-2 text-white bg-red-500 hover:bg-red-600 rounded w-full transition">
            <LogOut className="w-5 h-5" /> <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Render main content*/}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};


export default CalendarLayout;
