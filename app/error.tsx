'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong!</h2>
      <button
        onClick={reset}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#38bdf8',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}
      >
        Try again
      </button>
    </div>
  );
}

