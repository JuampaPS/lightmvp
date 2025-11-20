export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#000',
      color: '#fff'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h2>
      <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
      <a
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#38bdf8',
          color: '#000',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}
      >
        Go Home
      </a>
    </div>
  );
}

