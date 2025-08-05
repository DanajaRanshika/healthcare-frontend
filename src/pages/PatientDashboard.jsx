import { useEffect, useState } from 'react';
import API from '../services/api';

export default function PatientDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const patientId = parseInt(localStorage.getItem("userId"));
    if (!patientId) {
      setError("Patient ID not found.");
      setLoading(false);
      return;
    }

    API.get(`/records/patient/${patientId}`)
      .then((res) => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load records.");
        setLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Patient Dashboard</h1>
      {loading && <p>Loading your records...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && records.length === 0 && (
        <p>No medical records found.</p>
      )}
      {!loading && !error && records.length > 0 && (
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              <strong>Diagnosis:</strong> {record.diagnosis}<br />
              <strong>Note:</strong> {record.note}<br />
              <strong>Date:</strong> {record.date}<hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
