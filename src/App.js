import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AddMedicalRecord from './pages/AddMedicalRecord';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AddDoctor from './pages/AddDoctor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-record" element={<AddMedicalRecord />} />

        {/* ✅ Route: Role-based dashboard */}
        <Route path="/dashboard" element={<RoleBasedDashboard />} />

        {/* ✅ Route: Only ADMIN can access Add Doctor */}
        <Route
              path="/add-doctor"
              element={
              localStorage.getItem("role") === "ADMIN" ? <AddDoctor /> : <Navigate to="/" />
         }
        />
      </Routes>
    </Router>
  );
}

function RoleBasedDashboard() {
  const role = localStorage.getItem("role");

  if (role === "ADMIN") {
    return <AdminDashboard />;
  } else if (role === "DOCTOR") {
    return <DoctorDashboard />;
  } else if (role === "PATIENT") {
    return <PatientDashboard />;
  } else {
    return <Navigate to="/" />;
  }
}

export default App;
