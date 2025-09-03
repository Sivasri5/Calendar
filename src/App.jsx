//  import { useState } from 'react'
//  import reactLogo from './assets/react.svg'
//  import viteLogo from '/vite.svg'
// import './App.css'



// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import CalendarLayout from './components/CalendarLayout';
// import Calendar from './components/Calendar';
// import Dashboard from './components/Dashboard';
// import Tasks from './components/Tasks';


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<CalendarLayout />}>
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="calendar" element={<Calendar />} />
//           <Route path="tasks" element={<Tasks />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarLayout from './components/CalendarLayout';
import Calendar from './components/Calendar';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Auth from './components/Auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  if (!token) {
    return <Auth setToken={setToken} setUsername={setUsername} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar token={token} />} />
          <Route path="tasks" element={<Tasks token={token} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;