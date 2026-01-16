import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';

export default function Projects() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟10%概率出错（测试用）
      if (Math.random() < 0.1) {
        throw new Error('Failed to fetch projects from blockchain');
      }
      
      setProjects([
        {
          id: 1,
          name: 'DMD Research Project',
          description: 'Duchenne Muscular Dystrophy gene therapy research',
          goal: 100000,
          raised: 45000,
        },
        {
          id: 2,
          name: 'ALS Treatment Study',
          description: 'Novel protein targeting for ALS',
          goal: 150000,
          raised: 78000,
        }
      ]);
      
      toast.success('Projects loaded successfully!');
      
    } catch (err) {
      console.error('Load error:', err);
      setError(err);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // 过滤项目
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch;
  });

  // Loading状态
  if (loading) {
    return (
      <div style={styles.container}>
        <h1>Research Projects</h1>
        <LoadingSpinner size="large" />
        <p style={styles.loadingText}>Loading projects...</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div style={styles.container}>
        <h1>Research Projects</h1>
        <ErrorMessage error={error} onRetry={loadProjects} />
      </div>
    );
  }

  // 空状态
  if (!loading && !error && projects.length === 0) {
    return (
      <div style={styles.container}>
        <h1>Research Projects</h1>
        <EmptyState 
          icon="🔬"
          title="No Projects Yet"
          message="Be the first to create a research project and start making a difference!"
          action={{
            label: "Create Project",
            onClick: () => navigate('/create')
          }}
        />
      </div>
    );
  }

  // 正常显示
  return (
    <div style={styles.container}>
      <h1>Research Projects / 研究项目</h1>
      <p style={styles.subtitle}>
        {filteredProjects.length} active projects
      </p>
      
      {/* 搜索和筛选 */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Projects</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      {/* 项目列表 */}
      <div style={styles.grid}>
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

// ⚠️ 注意：styles 对象要放在函数外面！
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  subtitle: {
    color: '#616161',
    marginTop: '0.5rem',
  },
  loadingText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: '1.1rem',
  },
  controls: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  searchInput: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '2px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    border: '2px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '1rem',
    background: 'white',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
};