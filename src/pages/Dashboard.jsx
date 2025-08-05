import { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const doctorId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    if (role !== "DOCTOR") return;

    if (!doctorId) {
      setError("Doctor ID not found. Please log in again.");
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
        console.error(err);
        setLoading(false);
      });
  }, [doctorId, role]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Doctor Dashboard</h1>

      {role === "DOCTOR" && (
        <button onClick={() => navigate('/add-record')}>
          ➕ Add Medical Record
        </button>
      )}

      <br /><br />

      {loading && <p>Loading records...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          {records.length === 0 ? (
            <p>No records found for you.</p>
          ) : (
            <ul>
              {records.map((record) => (
                <li key={record.id}>
                  <strong>Diagnosis:</strong> {record.diagnosis} <br />
                  <strong>Note:</strong> {record.note} <br />
                  <strong>Date:</strong> {record.date}
                  <hr />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
