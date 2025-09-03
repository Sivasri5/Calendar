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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={e => setUser(e.target.value)}
          required
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPass(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-blue-600 underline"
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