import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const progressPercentage = (project.raised / project.goal) * 100;

  return (
    <div 
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 16px rgba(0,0,0,0.15)' 
          : '0 2px 8px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.header}>
        <h3 style={styles.title}>{project.name}</h3>
        <span style={styles.badge}>Active</span>
      </div>
      
      <p style={styles.description}>{project.description}</p>
      
      <div style={styles.progress}>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${progressPercentage}%`
            }}
          />
        </div>
        <div style={styles.stats}>
          <span style={styles.raised}>
            ${project.raised.toLocaleString()}
          </span>
          <span style={styles.goal}>
            of ${project.goal.toLocaleString()}
          </span>
        </div>
        <div style={styles.percentage}>
          {progressPercentage.toFixed(0)}% funded
        </div>
      </div>
      
      <button 
        onClick={() => navigate(`/projects/${project.id}`)}
        style={{
          ...styles.viewButton,
          background: isHovered ? '#1976D2' : '#2196F3',
        }}
      >
        View Details →
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    color: '#0f2027',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    background: '#4CAF50',
    color: 'white',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  description: {
    color: '#757575',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: '0.5rem 0 1.5rem 0',
  },
  progress: {
    marginTop: '1.5rem',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#E0E0E0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #FF9800, #F57C00)',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.75rem',
  },
  raised: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#FF9800',
  },
  goal: {
    fontSize: '0.9rem',
    color: '#9E9E9E',
  },
  percentage: {
    marginTop: '0.5rem',
    fontSize: '0.85rem',
    color: '#4CAF50',
    fontWeight: '500',
  },
  viewButton: {
    width: '100%',
    marginTop: '1.5rem',
    padding: '0.875rem',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background 0.2s ease',
  },
};