import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function DoctorDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const doctorId = parseInt(localStorage.getItem("userId"));
    if (!doctorId) {
      setError("Doctor ID not found.");
      setLoading(false);
      return;
    }

    API.get(`/records/doctor/${doctorId}`)
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
      <h1>Doctor Dashboard</h1>
      <Link to="/add-record">
        <button>Add Medical Record</button>
      </Link>
      <br /><br />
      {loading && <p>Loading records...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && records.length === 0 && (
        <p>No records found.</p>
      )}
      {!loading && !error && records.length > 0 && (
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              <strong>Patient:</strong> {record.patient?.name || 'Unknown'}<br />
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
