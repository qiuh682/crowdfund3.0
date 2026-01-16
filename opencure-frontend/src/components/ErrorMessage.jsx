export default function ErrorMessage({ error, onRetry }) {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>⚠️</div>
      <h3 style={styles.title}>Oops! Something went wrong</h3>
      <p style={styles.message}>
        {error?.message || 'An unexpected error occurred'}
      </p>
      {onRetry && (
        <button onClick={onRetry} style={styles.retryButton}>
          Try Again
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: '#FFF3E0',
    border: '2px solid #FFB74D',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '2rem auto',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  title: {
    color: '#E65100',
    marginBottom: '0.5rem',
  },
  message: {
    color: '#616161',
    marginBottom: '1.5rem',
  },
  retryButton: {
    padding: '0.75rem 2rem',
    background: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
  },
};