import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AddMedicalRecord() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const doctorId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "DOCTOR") {
      alert("Only doctors can add records!");
      navigate("/dashboard");
    }

    API.get("/users/patients")
      .then((res) => {
        setPatients(res.data);
      })
      .catch((err) => {
        console.error("Failed to load patients:", err);
        alert("Failed to load patient list.");
      });
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId || !diagnosis || !note || !date) {
      alert("All fields are required!");
      return;
    }

    const record = {
      doctorId: parseInt(doctorId),
      patientId: parseInt(patientId),
      diagnosis,
      note,
      date,
    };

    try {
      await API.post("/records/create", record);
      alert("Medical record added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to add record.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add Medical Record</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label>Diagnosis</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              style={{ ...styles.input, height: "100px" }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>Add Record</button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={{ ...styles.button, backgroundColor: "#6c757d", marginTop: "1rem" }}
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  inputGroup: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
