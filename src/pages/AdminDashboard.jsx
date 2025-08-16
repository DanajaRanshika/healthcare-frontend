import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>Welcome, Admin</h1>

      {/* Add Doctor Button */}
      <div style={{ margin: '1rem 0' }}>
        <Link to="/add-doctor">
          <button style={styles.addBtn}>+ Register New Doctor</button>
        </Link>
      </div>

      {/* Doctor List */}
      <h2>Registered Doctors</h2>
      {doctors.length > 0 ? (
        <div style={styles.cardGrid}>
          {doctors.map((doc) => (
            <div key={doc.id} style={styles.card}>
              <p><strong>Name:</strong> {doc.name}</p>
              <p><strong>Email:</strong> {doc.email}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No doctors found.</p>
      )}
    </div>
  );
}

const styles = {
  addBtn: {
    padding: '0.6rem 1.2rem',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  card: {
    padding: '1rem',
    background: '#f8f8f8',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};
