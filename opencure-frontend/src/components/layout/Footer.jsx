export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          © 2026 OpenCure - Accelerating Rare Disease Research
        </p>
        <div style={styles.links}>
          <a href="https://github.com" style={styles.link}>GitHub</a>
          <a href="https://twitter.com" style={styles.link}>Twitter</a>
          <a href="https://discord.com" style={styles.link}>Discord</a>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#2d3748',
    color: 'white',
    padding: '2rem 0',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    margin: 0,
  },
  links: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: '#a0aec0',
    textDecoration: 'none',
  },
};