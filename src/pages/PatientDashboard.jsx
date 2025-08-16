import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function PatientDashboard() {
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState('');

  const patientId = parseInt(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!patientId) {
      setError("Patient ID not found.");
      setLoadingRecords(false);
      setLoadingAppointments(false);
      return;
    }

    API.get(`/records/patient/${patientId}`)
      .then((res) => {
        setRecords(res.data);
        setLoadingRecords(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load medical records.");
        setLoadingRecords(false);
      });

    API.get(`/appointments/patient/${patientId}`)
      .then((res) => {
        setAppointments(res.data);
        setLoadingAppointments(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load appointments.");
        setLoadingAppointments(false);
      });
  }, [patientId]);

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '1000px', margin: 'auto' }}>
        <h1>Patient Dashboard</h1>

        {role === "PATIENT" && (
          <div style={{ marginBottom: '1.5rem' }}>
            <Link to="/book-appointment">
              <button style={styles.bookBtn}>+ Book Appointment</button>
            </Link>
          </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Medical Records */}
        <section style={{ marginTop: '2rem' }}>
          <h2>Your Medical Records</h2>
          {loadingRecords ? (
            <p>Loading medical records...</p>
          ) : records.length === 0 ? (
            <p>No medical records found.</p>
          ) : (
            <div style={styles.cardGrid}>
              {records.map(record => (
                <div key={record.id} style={styles.card}>
                  <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                  <p><strong>Note:</strong> {record.note}</p>
                  <p><strong>Date:</strong> {record.date}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Appointments */}
        <section style={{ marginTop: '2rem' }}>
          <h2>Your Appointments</h2>
          {loadingAppointments ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Doctor ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => (
                  <tr key={app.id}>
                    <td>{app.doctor?.id}</td>
                    <td>{app.date}</td>
                    <td>{app.time}</td>
                    <td>{app.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}

const styles = {
  bookBtn: {
    padding: '0.6rem 1.2rem',
    background: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  },
  card: {
    background: '#f1f1f1',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    border: '1px solid #ccc'
  },
  th: {
    background: '#eee',
    padding: '0.5rem'
  },
  td: {
    padding: '0.5rem',
    border: '1px solid #ddd'
  }
};
