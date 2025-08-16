import { useEffect, useState } from 'react';
import API from '../services/api';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const doctorId = localStorage.getItem("userId");

  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found.");
      setLoading(false);
      return;
    }

    API.get(`/appointments/doctor/${doctorId}`)
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments", err);
        setError("Failed to load appointments.");
        setLoading(false);
      });
  }, [doctorId]);

  const updateStatus = (id, newStatus) => {
    API.put(`/appointments/${id}`, { status: newStatus })
      .then(() => {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: newStatus } : appt
          )
        );
        alert(`Appointment ${newStatus.toLowerCase()} successfully`);
      })
      .catch((err) => {
        console.error(err);
        alert(`Failed to ${newStatus.toLowerCase()} appointment.`);
      });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Doctor Dashboard</h1>
      {loading && <p>Loading appointments...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && appointments.length === 0 && (
        <p>No appointments found.</p>
      )}
      {!loading && !error && appointments.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.patient?.name || "Unknown"}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>{appt.status}</td>
                <td>
                  {appt.status === "PENDING" && (
                    <>
                      <button onClick={() => updateStatus(appt.id, "ACCEPTED")}>
                        Accept
                      </button>{' '}
                      <button onClick={() => updateStatus(appt.id, "CANCELLED")}>
                        Cancel
                      </button>
                    </>
                  )}
                  {appt.status !== "PENDING" && <span>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
