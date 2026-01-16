import { useParams } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import DonationForm from '../components/DonationForm';
import DonationHistory from '../components/DonationHistory';
import USDCFaucet from '../components/USDCFaucet';
import MilestoneTimeline from '../components/MilestoneTimeline';
import FundingChart from '../components/FundingChart';

export default function ProjectDetail() {
  const { id } = useParams();
  const { project, donations, loading, error, reload } = useProject(id);

  // 加载状态
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>⚠️ Error Loading Project</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 项目不存在
  if (!project) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>Project Not Found</h2>
          <p>Project #{id} does not exist.</p>
        </div>
      </div>
    );
  }

  // 状态标签
  const getStatusLabel = (status) => {
    const labels = ['Active', 'Paused', 'Completed', 'Cancelled'];
    return labels[status] || 'Unknown';
  };

  const getStatusColor = (status) => {
    const colors = ['#4CAF50', '#FF9800', '#2196F3', '#F44336'];
    return colors[status] || '#757575';
  };

  return (
    <div style={styles.container}>
      {/* 项目头部 */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.breadcrumb}>
            <a href="/projects" style={styles.breadcrumbLink}>Projects</a>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span>{project.name}</span>
          </div>
          
          <h1 style={styles.title}>{project.name}</h1>
          
          <div style={styles.meta}>
            <span style={{
              ...styles.statusBadge,
              background: getStatusColor(project.status)
            }}>
              {getStatusLabel(project.status)}
            </span>
            <span style={styles.diseaseType}>
              🏥 {project.diseaseType}
            </span>
            <span style={styles.date}>
              📅 Created: {new Date(project.createdAt * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={styles.mainContent}>
        {/* 左侧：项目信息 */}
        <div style={styles.leftColumn}>
          {/* 描述 */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Project Description</h2>
            <p style={styles.description}>{project.description}</p>
          </div>

          {/* 团队信息 */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Research Team</h2>
            <div style={styles.team}>
              <div style={styles.teamMember}>
                <div style={styles.avatar}>PI</div>
                <div>
                  <div style={styles.memberRole}>Principal Investigator</div>
                  <div style={styles.memberAddress}>
                    {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
                  </div>
                </div>
              </div>

              {project.teamMembers.length > 0 && (
                <div style={styles.teamList}>
                  <div style={styles.memberRole}>Team Members:</div>
                  {project.teamMembers.map((member, index) => (
                    <div key={index} style={styles.memberAddress}>
                      {member.slice(0, 6)}...{member.slice(-4)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 里程碑时间线 */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Project Milestones</h2>
            <MilestoneTimeline />
          </div>

          {/* 捐赠历史 */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Donation History</h2>
            <DonationHistory donations={donations} loading={loading} />
          </div>
        </div>

        {/* 右侧：捐赠面板 */}
        <div style={styles.rightColumn}>
          {/* USDC水龙头 */}
          <USDCFaucet />
          
          <div style={styles.donationPanel}>
            {/* 资金图表 */}
            <FundingChart
              raised={Number(project.raisedAmount)}
              goal={Number(project.goalAmount)}
            />

            {/* 筹款进度 */}
            <div style={styles.progress}>
              <div style={styles.amounts}>
                <div>
                  <div style={styles.amountLabel}>Raised</div>
                  <div style={styles.amountValue}>
                    ${Number(project.raisedAmount).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={styles.amountLabel}>Goal</div>
                  <div style={styles.amountValue}>
                    ${Number(project.goalAmount).toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* 进度条 */}
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${Math.min(project.progressPercentage, 100)}%`
                }}>
                  <span style={styles.progressText}>
                    {project.progressPercentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* 捐赠表单 */}
            <div style={styles.donateForm}>
              <DonationForm 
                projectId={id} 
                onSuccess={reload}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
  },
  
  // 加载和错误状态
  loading: {
    textAlign: 'center',
    padding: '4rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto 1rem',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #FF9800',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    background: '#FFEBEE',
    borderRadius: '12px',
    color: '#C62828',
  },
  
  // 头部
  header: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  headerContent: {},
  breadcrumb: {
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#757575',
  },
  breadcrumbLink: {
    color: '#FF9800',
    textDecoration: 'none',
  },
  breadcrumbSeparator: {
    margin: '0 0.5rem',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0 0 1rem 0',
    color: '#0f2027',
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  statusBadge: {
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  diseaseType: {
    fontSize: '0.95rem',
    color: '#616161',
  },
  date: {
    fontSize: '0.95rem',
    color: '#616161',
  },
  
  // 主要内容
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
  },
  leftColumn: {},
  rightColumn: {},
  
  // 区块
  section: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#0f2027',
  },
  description: {
    lineHeight: '1.8',
    color: '#424242',
    fontSize: '1.05rem',
  },
  
  // 团队
  team: {},
  teamMember: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#FF9800',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  memberRole: {
    fontWeight: '500',
    color: '#424242',
    marginBottom: '0.25rem',
  },
  memberAddress: {
    fontSize: '0.9rem',
    color: '#757575',
    fontFamily: 'monospace',
  },
  teamList: {
    marginTop: '1rem',
    padding: '1rem',
    background: '#F5F5F5',
    borderRadius: '8px',
  },
  
  // 捐赠面板
  donationPanel: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: '2rem',
  },
  
  // 进度
  progress: {
    marginBottom: '2rem',
  },
  amounts: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  amountLabel: {
    fontSize: '0.85rem',
    color: '#757575',
    marginBottom: '0.25rem',
  },
  amountValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0f2027',
  },
  progressBar: {
    height: '30px',
    background: '#E0E0E0',
    borderRadius: '15px',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '1rem',
    transition: 'width 0.5s ease',
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  
  // 捐赠表单
  donateForm: {
    borderTop: '1px solid #E0E0E0',
    paddingTop: '2rem',
  },
};