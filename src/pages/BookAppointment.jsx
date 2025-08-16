import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  const userIdRaw = localStorage.getItem('userId');
  const patientId = userIdRaw ? parseInt(userIdRaw) : null;
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!patientId || role !== 'PATIENT') {
      alert("Access denied. Please log in as a patient.");
      navigate('/login');
    }
  }, [patientId, role, navigate]);

  useEffect(() => {
    API.get('/users/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => {
        console.error('Error fetching doctors:', err);
        alert('Failed to load doctors.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointment = {
        doctor: { id: parseInt(doctorId) },
        patient: { id: patientId },
        date,
        time,
        status: "PENDING"
      };

      await API.post('/appointments', appointment);
      alert('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to book appointment.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📅 Book Appointment</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Select Doctor:</label>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.name} ({doc.email})
            </option>
          ))}
        </select>

        <label style={styles.label}>Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Select Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          style={styles.input}
        />

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitBtn}>Book Appointment</button>
          <button type="button" onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '500px',
    margin: 'auto',
    fontFamily: 'sans-serif',
    background: '#f7f9fb',
    borderRadius: '10px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  label: {
    fontWeight: 'bold'
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem'
  },
  submitBtn: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  backBtn: {
    backgroundColor: '#555',
    color: 'white',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
