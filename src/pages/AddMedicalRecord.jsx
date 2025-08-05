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

    // Load all patients
    API.get("/users/patients")
      .then((res) => {
        setPatients(res.data);
      })
      .catch((err) => {
        console.error("Failed to load patients:", err);
      });
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId || !diagnosis || !note || !date) {
      alert("All fields are required!");
      return;
    }

    try {
      const record = {
        doctorId: parseInt(doctorId),
        patientId: parseInt(patientId),
        diagnosis,
        note,
        date,
      };

      await API.post("/records/create", record);
      alert("Medical record added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to add record.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h2>Add Medical Record</h2>
      <form onSubmit={handleSubmit}>
        <label>Patient:</label>
        <select value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
          <option value="">-- Select Patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.email})
            </option>
          ))}
        </select>
        <br /><br />

        <label>Diagnosis:</label>
        <input
          type="text"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          required
        />
        <br /><br />

        <label>Note:</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />
        <br /><br />

        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Add Record</button>
      </form>
    </div>
  );
}
