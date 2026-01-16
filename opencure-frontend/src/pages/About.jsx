export default function About() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About OpenCure</h1>
      
      <section style={styles.section}>
        <h2>Our Mission</h2>
        <p style={styles.text}>
          OpenCure is a decentralized platform connecting patients, scientists, 
          and funders to accelerate research for rare diseases.
        </p>
      </section>

      <section style={styles.section}>
        <h2>How It Works</h2>
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h3>Create Project</h3>
            <p>Scientists propose research projects</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h3>Fund Research</h3>
            <p>Patients and donors contribute</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h3>Track Progress</h3>
            <p>Milestone-based fund release</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    padding: '4rem 2rem',
    maxWidth: '900px',
    margin: '0 auto',
    minHeight: 'calc(100vh - 200px)',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  section: {
    marginBottom: '3rem',
  },
  text: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#4a5568',
  },
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  step: {
    textAlign: 'center',
    padding: '2rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  stepNumber: {
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 auto 1rem auto',
  },
};