 import { useState } from 'react'
 import reactLogo from './assets/react.svg'
 import viteLogo from '/vite.svg'
import './App.css'
// import Calendar from './components/Calendar';
// import CalendarLayout from './components/CalendarLayout';

// function App() {
//   return (
//     <CalendarLayout>
//       <Calendar />
//     </CalendarLayout>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarLayout from './components/CalendarLayout';
import Calendar from './components/Calendar';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
