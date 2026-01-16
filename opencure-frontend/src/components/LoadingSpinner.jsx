export default function LoadingSpinner({ size = 'medium', color = '#FF9800' }) {
  const sizes = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div style={styles.container}>
      <div 
        style={{
          ...styles.spinner,
          width: sizes[size],
          height: sizes[size],
          borderColor: `${color}33`,
          borderTopColor: color,
        }}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  spinner: {
    border: '4px solid',
    borderRadius: '50%',
    borderTop: '4px solid',
    animation: 'spin 1s linear infinite',
  },
};

// 添加CSS动画（在public/index.html的<style>标签里）
/*
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/