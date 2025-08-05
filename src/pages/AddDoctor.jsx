import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddDoctor() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // 🔐 Only admin allowed
  if (localStorage.getItem("role") !== "ADMIN") {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const doctor = {
      name,
      email,
      password,
      role: 'DOCTOR',
    };
    try {
      await API.post('/users/create-with-encryption', doctor);
      alert('Doctor registered successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to register doctor');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Register New Doctor</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Register Doctor</button>
      </form>
    </div>
  );
}
