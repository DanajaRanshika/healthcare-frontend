import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const user = {
      name,
      email,
      password,
      role: "PATIENT"
    };

    try {
      await API.post('/users/create-with-encryption', user);
      alert('Patient registered successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Try again.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>Patient Registration</h1>
      <form onSubmit={handleRegister}>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td><label>Full Name:</label></td>
              <td>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr><td colSpan="2" style={{ height: '10px' }}></td></tr>

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
            <tr><td colSpan="2" style={{ height: '10px' }}></td></tr>

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
            <tr><td colSpan="2" style={{ height: '10px' }}></td></tr>

            <tr>
              <td><label>Confirm Password:</label></td>
              <td>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr><td colSpan="2" style={{ height: '10px' }}></td></tr>

            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>
                <button type="submit">Register</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
