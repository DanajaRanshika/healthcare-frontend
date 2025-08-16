import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('name') || '');
    setRole(localStorage.getItem('role') || '');
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <button onClick={goBack} style={styles.backBtn}>← Back</button>
        <span style={styles.logo}>Healthcare System</span>
      </div>

      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>

        {role === 'PATIENT' && (
          <Link to="/book-appointment" style={styles.link}>Book Appointment</Link>
        )}

        {role === 'ADMIN' && (
          <Link to="/add-doctor" style={styles.link}>Add Doctor</Link>
        )}

        <span style={styles.user}>
          {name && `${name} (${role})`}
        </span>

        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#1976d2',
    padding: '0.8rem 1.5rem',
    color: 'white',
    fontFamily: 'sans-serif',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  left: {
    display: 'flex',
    alignItems: 'center'
  },
  backBtn: {
    marginRight: '1rem',
    padding: '0.3rem 0.6rem',
    background: '#1565c0',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  logo: {
    fontSize: '1.3rem',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500'
  },
  user: {
    marginLeft: '1rem',
    fontSize: '0.9rem'
  },
  logoutBtn: {
    marginLeft: '1rem',
    background: 'white',
    color: '#1976d2',
    border: 'none',
    borderRadius: '4px',
    padding: '0.4rem 0.8rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
