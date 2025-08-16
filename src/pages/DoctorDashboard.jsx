import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function DoctorDashboard() {
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errorRecords, setErrorRecords] = useState('');
  const [errorAppointments, setErrorAppointments] = useState('');

  const doctorId = parseInt(localStorage.getItem('userId'));

  useEffect(() => {
    if (!doctorId) {
      setErrorRecords("Doctor ID not found.");
      setErrorAppointments("Doctor ID not found.");
      setLoadingRecords(false);
      setLoadingAppointments(false);
      return;
    }

    API.get(`/records/doctor/${doctorId}`)
      .then(res => {
        setRecords(res.data);
        setLoadingRecords(false);
      })
      .catch(err => {
        setErrorRecords("Failed to load records.");
        setLoadingRecords(false);
        console.error(err);
      });

    API.get(`/appointments/doctor/${doctorId}`)
      .then(res => {
        setAppointments(res.data);
        setLoadingAppointments(false);
      })
      .catch(err => {
        setErrorAppointments("Failed to load appointments.");
        setLoadingAppointments(false);
        console.error(err);
      });

  }, [doctorId]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/appointments/${id}`, { status: newStatus });
      alert(`Appointment ${newStatus.toLowerCase()} successfully!`);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error(err);
      alert(`Failed to ${newStatus.toLowerCase()} appointment.`);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '1000px', margin: 'auto' }}>
        <h1>Doctor Dashboard</h1>

        {/* Add Record */}
        <Link to="/add-record">
          <button style={styles.addBtn}>+ Add Medical Record</button>
        </Link>

        {/* Appointments */}
        <section style={{ marginTop: '2rem' }}>
          <h2>Patient Appointments</h2>
          {loadingAppointments ? (
            <p>Loading appointments...</p>
          ) : errorAppointments ? (
            <p style={{ color: 'red' }}>{errorAppointments}</p>
          ) : appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <div style={styles.cardGrid}>
              {appointments.map((app) => (
                <div key={app.id} style={styles.card}>
                  <p><strong>Patient ID:</strong> {app.patient?.id}</p>
                  <p><strong>Date:</strong> {app.date}</p>
                  <p><strong>Time:</strong> {app.time}</p>
                  <p><strong>Status:</strong> {app.status}</p>
                  {app.status === 'PENDING' ? (
                    <>
                      <button onClick={() => handleStatusChange(app.id, 'ACCEPTED')} style={styles.accept}>
                        Accept
                      </button>{' '}
                      <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} style={styles.cancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <em>{app.status}</em>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Records */}
        <section style={{ marginTop: '2rem' }}>
          <h2>Medical Records</h2>
          {loadingRecords ? (
            <p>Loading records...</p>
          ) : errorRecords ? (
            <p style={{ color: 'red' }}>{errorRecords}</p>
          ) : records.length === 0 ? (
            <p>No records found.</p>
          ) : (
            <div style={styles.cardGrid}>
              {records.map((record) => (
                <div key={record.id} style={styles.card}>
                  <p><strong>Patient:</strong> {record.patient?.name || 'Unknown'}</p>
                  <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                  <p><strong>Note:</strong> {record.note}</p>
                  <p><strong>Date:</strong> {record.date}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

const styles = {
  addBtn: {
    padding: '0.6rem 1.2rem',
    marginTop: '0.5rem',
    background: '#2196f3',
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
    background: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  accept: {
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    padding: '0.3rem 0.7rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cancel: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '0.3rem 0.7rem',
    borderRadius: '4px',
    marginLeft: '0.5rem',
    cursor: 'pointer'
  }
};
