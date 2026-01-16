export default function Home() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          🔓 Welcome to OpenCure
        </h1>
        <p style={styles.subtitle}>
          Accelerating Rare Disease Research Through Transparency
        </p>
        <p style={styles.description}>
          Connect patients, scientists, and funders worldwide to cure rare diseases faster
        </p>
        <button style={styles.ctaButton}>
          Explore Projects
        </button>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>0</h2>
          <p style={styles.statLabel}>Active Projects</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>$0</h2>
          <p style={styles.statLabel}>Total Raised</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>0</h2>
          <p style={styles.statLabel}>Contributors</p>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why OpenCure?</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.icon}>🔒</div>
            <h3>Secure Escrow</h3>
            <p>Funds held safely in smart contracts</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.icon}>👁️</div>
            <h3>Transparent</h3>
            <p>Every transaction on blockchain</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.icon}>🎯</div>
            <h3>Milestone-Based</h3>
            <p>Funds released as goals are met</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 200px)',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  title: {
    fontSize: '3rem',
    margin: '0 0 1rem 0',
  },
  subtitle: {
    fontSize: '1.5rem',
    margin: '0 0 1rem 0',
    opacity: 0.9,
  },
  description: {
    fontSize: '1.2rem',
    margin: '0 0 2rem 0',
    opacity: 0.8,
  },
  ctaButton: {
    background: 'white',
    color: '#667eea',
    border: 'none',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    padding: '4rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  statCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '3rem',
    margin: '0 0 0.5rem 0',
    color: '#667eea',
  },
  statLabel: {
    fontSize: '1.1rem',
    color: '#718096',
    margin: 0,
  },
  features: {
    padding: '4rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: '3rem',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
};