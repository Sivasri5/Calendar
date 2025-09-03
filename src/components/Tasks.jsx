import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../api';

const Tasks = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchTasks(token)
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load tasks');
        setLoading(false);
      });
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && tasks.length === 0 && <p>No tasks found.</p>}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task._id || task.id} className="p-4 bg-white rounded shadow border">
            <div className="font-semibold text-lg">{task.title}</div>
            <div className="text-sm text-gray-600">{task.date ? new Date(task.date).toLocaleDateString() : ''} {task.time}</div>
            <div className="text-sm text-gray-700">{task.description}</div>
            <div className="text-xs text-gray-500">Category: {task.category} | Priority: {task.priority}</div>
            {task.location && <div className="text-xs text-gray-500">Location: {task.location}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
