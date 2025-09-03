import React, { useState } from 'react';
import { login, register } from '../api';

const Auth = ({ setToken, setUsername }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fn = isLogin ? login : register;
    const res = await fn(username, password);
    if (res.token) {
      setToken(res.token);
      setUsername(res.username);
      localStorage.setItem('token', res.token);
      localStorage.setItem('username', res.username);
    } else {
      setError(res.message || 'Error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-900">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">{isLogin ? 'Login' : 'Register'}</h2>
        {error && <div className="text-red-500 mb-4 w-full text-center">{error}</div>}
        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
          placeholder="Username"
          value={username}
          onChange={e => setUser(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPass(e.target.value)}
          required
        />
        <button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 mb-2" type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>
        <div className="mt-2 text-center w-full">
          <button
            type="button"
            className="text-blue-600 underline font-medium"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'No account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;