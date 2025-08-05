import { useEffect, useState } from 'react';
import API from '../services/api';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);

 useEffect(() => {
  const role = localStorage.getItem("role");
  console.log("Logged in role:", role);

  API.get('/users/doctors')
    .then((res) => {
      console.log("Doctors fetched:", res.data);
      setDoctors(res.data);
    })
    .catch((err) => {
      console.error("Error fetching doctors:", err);
    });
}, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, Admin</h1>
      <h2>Register New Doctor</h2>
      <a href="/add-doctor">Go to Add Doctor Form</a>

      <h2 style={{ marginTop: '2rem' }}>Registered Doctors</h2>
      {doctors.length > 0 ? (
  <ul>
    {doctors.map((doc) => (
      <li key={doc.id}>
        <strong>{doc.name}</strong> - {doc.email}
      </li>
    ))}
  </ul>
) : (
  <p>No doctors found.</p>
)}

    </div>
  );
}
