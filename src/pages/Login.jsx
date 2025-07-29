import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });

      // ✅ Save token, userId and role to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('role', res.data.role);

      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed! Check email or password.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>Login</h1>

      <form onSubmit={handleLogin}>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td><label>Email:</label></td>
              <td>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr style={{ height: '1rem' }}></tr>
            <tr>
              <td><label>Password:</label></td>
              <td>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr style={{ height: '1rem' }}></tr>
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>
                <button type="submit">Login</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
