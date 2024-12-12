import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8080/api/auth/check?username=${username}`, {
                auth: { username, password }
            });
            setMessage('Вход прошел успешно!');
            localStorage.setItem('auth', btoa(`${username}:${password}`));
            localStorage.setItem('username', username);
            localStorage.setItem('role', response.data.roles[0]);
            navigate('/');
        } catch (error) {
            setMessage('Неверный логин или пароль');
        }
    };

    return (
        <>
        <Header />
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
            <h2 className="text-center mb-4">Вход</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Логин:</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Пароль:</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Войти</button>
            </form>
            {message && <p className="text-danger text-center mt-3">{message}</p>}
          </div>
        </div>
        </>
      );
};

export default Login;

