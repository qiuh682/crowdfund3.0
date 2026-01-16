export default function EmptyState({ 
  icon = '📋', 
  title, 
  message, 
  action 
}) {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>{icon}</div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.message}>{message}</p>
      {action && (
        <button onClick={action.onClick} style={styles.button}>
          {action.label}
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '4rem 2rem',
    textAlign: 'center',
    margin: '2rem 0',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  title: {
    color: '#0f2027',
    marginBottom: '0.5rem',
  },
  message: {
    color: '#757575',
    marginBottom: '2rem',
    maxWidth: '400px',
    margin: '0 auto 2rem auto',
  },
  button: {
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