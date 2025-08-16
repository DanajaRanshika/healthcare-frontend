import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "DOCTOR") {
      navigate('/doctor-dashboard');
    } else if (role === "PATIENT") {
      navigate('/patient-dashboard');
    } else if (role === "ADMIN") {
      navigate('/admin-dashboard');
    } else {
      navigate('/'); // default to home/login
    }
  }, [role, navigate]);

  return <p>Redirecting to your dashboard...</p>;
}
