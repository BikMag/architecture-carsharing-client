import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username,
                password
            });
            console.log(response);
            
            setMessage('Registration successful! You can now log in.');
        } catch (error) {
            setMessage(error.response?.data || 'An error occurred');
        }
    };

    return (
        <>
        <Header />
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
            <h2 className="text-center mb-4">Регистрация</h2>
            <form onSubmit={handleRegister}>
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
              <button type="submit" className="btn btn-success w-100">Зарегистрироваться</button>
            </form>
            {message && <p className="text-danger text-center mt-3">{message}</p>}
          </div>
        </div>
        </>
      );
};

export default Register;
