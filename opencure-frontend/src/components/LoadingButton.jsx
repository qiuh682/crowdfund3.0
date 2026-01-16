export default function LoadingButton({ 
  onClick, 
  loading, 
  disabled, 
  children,
  variant = 'primary' 
}) {
  const variants = {
    primary: {
      background: '#FF9800',
      color: 'white',
    },
    secondary: {
      background: '#2196F3',
      color: 'white',
    },
    outline: {
      background: 'transparent',
      color: '#FF9800',
      border: '2px solid #FF9800',
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...styles.button,
        ...variants[variant],
        opacity: (disabled || loading) ? 0.6 : 1,
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? (
        <span style={styles.loadingContainer}>
          <span style={styles.spinner} />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

const styles = {
  button: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};