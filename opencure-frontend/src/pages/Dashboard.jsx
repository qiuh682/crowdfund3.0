import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { useContract } from '../hooks/useContract';
import { CONTRACTS } from '../utils/contracts';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Dashboard - 用户仪表盘
 *
 * 显示用户的捐赠记录和项目管理功能
 */
export default function Dashboard() {
  const { account, isConnected } = useWeb3();
  const { getEscrowContractReadOnly, getUSDCContractReadOnly, getEscrowContract } = useContract();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // 添加里程碑表单状态
  const [newMilestone, setNewMilestone] = useState({ description: '', amount: '' });
  const [addingMilestone, setAddingMilestone] = useState(false);

  const loadDashboardData = useCallback(async () => {
    if (!isConnected || !account) {
      setLoading(false);
      return;
    }

    const escrow = getEscrowContractReadOnly();
    const usdc = getUSDCContractReadOnly();

    if (!escrow || !usdc) {
      setLoading(false);
      setError('Unable to connect to blockchain');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 获取项目基本信息
      const [
        owner,
        scientist,
        goalAmount,
        totalRaised,
        totalReleased,
        milestoneCount,
        contractBalance,
        userUsdcBalance,
        userDonation
      ] = await Promise.all([
        escrow.owner(),
        escrow.scientist(),
        escrow.goalAmount(),
        escrow.totalRaised(),
        escrow.totalReleased(),
        escrow.milestoneCount(),
        escrow.getBalance(),
        usdc.balanceOf(account),
        escrow.donations(account)
      ]);

      // 获取所有里程碑
      const milestones = [];
      for (let i = 0; i < Number(milestoneCount); i++) {
        const m = await escrow.getMilestone(i);
        milestones.push({
          id: i,
          description: m.description,
          amount: Number(ethers.formatUnits(m.amount, 6)),
          completed: m.completed,
          fundsReleased: m.fundsReleased,
        });
      }

      setData({
        owner,
        scientist,
        goalAmount: Number(ethers.formatUnits(goalAmount, 6)),
        totalRaised: Number(ethers.formatUnits(totalRaised, 6)),
        totalReleased: Number(ethers.formatUnits(totalReleased, 6)),
        contractBalance: Number(ethers.formatUnits(contractBalance, 6)),
        milestoneCount: Number(milestoneCount),
        milestones,
        userUsdcBalance: Number(ethers.formatUnits(userUsdcBalance, 6)),
        userDonation: Number(ethers.formatUnits(userDonation, 6)),
      });

      setIsOwner(account.toLowerCase() === owner.toLowerCase());
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load data. The contract may not be deployed on this network.');
    } finally {
      setLoading(false);
    }
  }, [isConnected, account, getEscrowContractReadOnly, getUSDCContractReadOnly]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // 添加里程碑
  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestone.description || !newMilestone.amount) return;

    const escrow = getEscrowContract();
    if (!escrow) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setAddingMilestone(true);
      const amount = ethers.parseUnits(newMilestone.amount, 6);

      const tx = await escrow.addMilestone(newMilestone.description, amount);
      await tx.wait();

      setNewMilestone({ description: '', amount: '' });
      await loadDashboardData();
      alert('Milestone added successfully!');
    } catch (err) {
      console.error('Failed to add milestone:', err);
      alert('Failed to add milestone: ' + (err.reason || err.message));
    } finally {
      setAddingMilestone(false);
    }
  };

  // 未连接钱包
  if (!isConnected) {
    return (
      <div style={styles.container}>
        <div style={styles.notConnected}>
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to view your dashboard.</p>
        </div>
      </div>
    );
  }

  // 加载中
  if (loading) {
    return (
      <div style={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  // 没有数据或有错误
  if (!data || error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>Error Loading Data</h2>
          <p>{error || 'Could not load dashboard data. Please try again.'}</p>
          <button onClick={loadDashboardData} style={styles.retryBtn}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Dashboard</h1>

      {/* 用户信息 */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>My Wallet</h3>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Address</span>
            <span style={styles.statValue}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>USDC Balance</span>
            <span style={styles.statValue}>
              ${data.userUsdcBalance.toLocaleString()}
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>My Donation</span>
            <span style={styles.statValue}>
              ${data.userDonation.toLocaleString()}
            </span>
          </div>
          {isOwner && (
            <div style={styles.ownerBadge}>Project Owner</div>
          )}
        </div>

        {/* 项目统计 */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Project Status</h3>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Goal</span>
            <span style={styles.statValue}>
              ${data.goalAmount.toLocaleString()}
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Raised</span>
            <span style={styles.statValue}>
              ${data.totalRaised.toLocaleString()}
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Progress</span>
            <span style={styles.statValue}>
              {data.goalAmount > 0
                ? ((data.totalRaised / data.goalAmount) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>

        {/* 资金信息 */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Funds</h3>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Contract Balance</span>
            <span style={styles.statValue}>
              ${data.contractBalance.toLocaleString()}
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Released</span>
            <span style={styles.statValue}>
              ${data.totalReleased.toLocaleString()}
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Milestones</span>
            <span style={styles.statValue}>
              {data.milestones.filter(m => m.fundsReleased).length} / {data.milestoneCount}
            </span>
          </div>
        </div>
      </div>

      {/* Owner管理面板 */}
      {isOwner && (
        <div style={styles.ownerSection}>
          <h2 style={styles.sectionTitle}>Project Management (Owner Only)</h2>

          {/* 添加里程碑表单 */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Add New Milestone</h3>
            <form onSubmit={handleAddMilestone} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <input
                  type="text"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({
                    ...newMilestone,
                    description: e.target.value
                  })}
                  placeholder="e.g., Complete Phase 1 animal testing"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Amount (USDC)</label>
                <input
                  type="number"
                  value={newMilestone.amount}
                  onChange={(e) => setNewMilestone({
                    ...newMilestone,
                    amount: e.target.value
                  })}
                  placeholder="10000"
                  style={styles.input}
                  required
                  min="1"
                />
              </div>
              <button
                type="submit"
                disabled={addingMilestone}
                style={styles.submitBtn}
              >
                {addingMilestone ? 'Adding...' : 'Add Milestone'}
              </button>
            </form>
          </div>

          {/* 里程碑列表 */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Manage Milestones</h3>
            {data.milestones.length === 0 ? (
              <p style={styles.emptyText}>No milestones yet. Add one above.</p>
            ) : (
              <div style={styles.milestoneList}>
                {data.milestones.map((m) => (
                  <MilestoneManageItem
                    key={m.id}
                    milestone={m}
                    onUpdate={loadDashboardData}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 关键地址 */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Contract Addresses</h3>
            <div style={styles.addressInfo}>
              <div>
                <strong>Owner:</strong>{' '}
                <code>{data.owner}</code>
              </div>
              <div>
                <strong>Scientist:</strong>{' '}
                <code>{data.scientist}</code>
              </div>
              <div>
                <strong>Escrow:</strong>{' '}
                <code>{CONTRACTS.ESCROW}</code>
              </div>
              <div>
                <strong>USDC:</strong>{' '}
                <code>{CONTRACTS.USDC}</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 里程碑管理项组件
 */
function MilestoneManageItem({ milestone, onUpdate }) {
  const { getEscrowContract } = useContract();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    const escrow = getEscrowContract();
    if (!escrow) {
      alert('Please connect your wallet first');
      return;
    }
    try {
      setLoading(true);
      const tx = await escrow.completeMilestone(milestone.id);
      await tx.wait();
      onUpdate();
    } catch (err) {
      alert('Failed: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async () => {
    const escrow = getEscrowContract();
    if (!escrow) {
      alert('Please connect your wallet first');
      return;
    }
    try {
      setLoading(true);
      const tx = await escrow.releaseFunds(milestone.id);
      await tx.wait();
      onUpdate();
    } catch (err) {
      alert('Failed: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = () => {
    if (milestone.fundsReleased) return { background: '#4CAF50', color: 'white' };
    if (milestone.completed) return { background: '#2196F3', color: 'white' };
    return { background: '#FF9800', color: 'white' };
  };

  const getStatusText = () => {
    if (milestone.fundsReleased) return 'Released';
    if (milestone.completed) return 'Completed';
    return 'Pending';
  };

  return (
    <div style={milestoneStyles.item}>
      <div style={milestoneStyles.header}>
        <span style={milestoneStyles.title}>
          #{milestone.id + 1}: {milestone.description}
        </span>
        <span style={{ ...milestoneStyles.status, ...getStatusStyle() }}>
          {getStatusText()}
        </span>
      </div>
      <div style={milestoneStyles.footer}>
        <span style={milestoneStyles.amount}>
          ${milestone.amount.toLocaleString()} USDC
        </span>
        <div style={milestoneStyles.actions}>
          {!milestone.completed && (
            <button
              onClick={handleComplete}
              disabled={loading}
              style={milestoneStyles.completeBtn}
            >
              {loading ? '...' : 'Mark Complete'}
            </button>
          )}
          {milestone.completed && !milestone.fundsReleased && (
            <button
              onClick={handleRelease}
              disabled={loading}
              style={milestoneStyles.releaseBtn}
            >
              {loading ? '...' : 'Release Funds'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const milestoneStyles = {
  item: {
    padding: '1rem',
    background: '#F5F5F5',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  title: {
    fontWeight: '500',
  },
  status: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    color: '#616161',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  completeBtn: {
    padding: '0.4rem 0.8rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  releaseBtn: {
    padding: '0.4rem 0.8rem',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#0f2027',
  },
  notConnected: {
    textAlign: 'center',
    padding: '4rem',
    background: '#F5F5F5',
    borderRadius: '12px',
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    background: '#FFEBEE',
    borderRadius: '12px',
  },
  retryBtn: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    background: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    color: '#0f2027',
    borderBottom: '1px solid #E0E0E0',
    paddingBottom: '0.5rem',
  },
  stat: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  statLabel: {
    color: '#757575',
  },
  statValue: {
    fontWeight: '600',
    color: '#0f2027',
  },
  ownerBadge: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    background: '#FF9800',
    color: 'white',
    borderRadius: '20px',
    textAlign: 'center',
    fontWeight: '500',
  },
  ownerSection: {
    marginTop: '2rem',
    padding: '2rem',
    background: '#FFF3E0',
    borderRadius: '12px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#E65100',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: '500',
    color: '#424242',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  submitBtn: {
    padding: '0.75rem 1.5rem',
    background: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  milestoneList: {},
  emptyText: {
    color: '#757575',
    textAlign: 'center',
    padding: '1rem',
  },
  addressInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '0.9rem',
  },
};
