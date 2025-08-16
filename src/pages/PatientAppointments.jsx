import { useEffect, useState } from 'react';
import API from '../services/api';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const patientId = localStorage.getItem("userId");

  useEffect(() => {
    if (!patientId) {
      setError("Patient ID not found.");
      setLoading(false);
      return;
    }

    API.get(`/appointments/patient/${patientId}`)
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load appointments.");
        setLoading(false);
        console.error(err);
      });
  }, [patientId]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Appointments</h1>
      {loading && <p>Loading appointments...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && appointments.length === 0 && (
        <p>No appointments found.</p>
      )}
      {!loading && !error && appointments.length > 0 && (
        <ul>
          {appointments.map((appt) => (
            <li key={appt.id}>
              <strong>Date:</strong> {appt.date} <br />
              <strong>Time:</strong> {appt.time} <br />
              <strong>Status:</strong> {appt.status} <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
