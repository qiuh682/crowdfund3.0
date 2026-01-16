import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { useContract } from '../hooks/useContract';

/**
 * MilestoneTimeline - 里程碑时间线组件
 *
 * 显示项目的所有里程碑及其状态
 * - Pending: 待完成
 * - Completed: 已完成（待释放资金）
 * - Released: 资金已释放
 */
export default function MilestoneTimeline() {
  const { account } = useWeb3();
  const { getEscrowContractReadOnly, getEscrowContract } = useContract();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [totalReleased, setTotalReleased] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);

  // 加载里程碑数据
  const loadMilestones = useCallback(async () => {
    const contract = getEscrowContractReadOnly();

    if (!contract) {
      setLoading(false);
      setError('Unable to connect to blockchain. Please check your connection.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 获取里程碑数量
      const count = await contract.milestoneCount();
      const milestoneCount = Number(count);

      // 获取所有里程碑
      const milestoneList = [];
      for (let i = 0; i < milestoneCount; i++) {
        const m = await contract.getMilestone(i);
        milestoneList.push({
          id: i,
          description: m.description,
          amount: Number(ethers.formatUnits(m.amount, 6)),
          completed: m.completed,
          fundsReleased: m.fundsReleased,
        });
      }

      setMilestones(milestoneList);

      // 检查是否是owner
      try {
        const owner = await contract.owner();
        setIsOwner(account && account.toLowerCase() === owner.toLowerCase());
      } catch {
        setIsOwner(false);
      }

      // 获取已释放总额
      try {
        const released = await contract.totalReleased();
        setTotalReleased(Number(ethers.formatUnits(released, 6)));
      } catch {
        setTotalReleased(0);
      }

    } catch (err) {
      console.error('Failed to load milestones:', err);
      setError('Failed to load milestones. The contract may not be deployed on this network.');
    } finally {
      setLoading(false);
    }
  }, [getEscrowContractReadOnly, account]);

  // 加载里程碑数据
  useEffect(() => {
    loadMilestones();
  }, [loadMilestones]);

  // 标记里程碑完成（仅owner）
  const handleComplete = async (milestoneId) => {
    const contract = getEscrowContract();
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setActionLoading(milestoneId);
      const tx = await contract.completeMilestone(milestoneId);
      await tx.wait();

      // 重新加载数据
      await loadMilestones();
    } catch (err) {
      console.error('Failed to complete milestone:', err);
      alert('Failed to complete milestone: ' + (err.reason || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  // 释放里程碑资金（仅owner）
  const handleRelease = async (milestoneId) => {
    const contract = getEscrowContract();
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setActionLoading(milestoneId);
      const tx = await contract.releaseFunds(milestoneId);
      await tx.wait();

      // 重新加载数据
      await loadMilestones();
    } catch (err) {
      console.error('Failed to release funds:', err);
      alert('Failed to release funds: ' + (err.reason || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  // 获取状态标签
  const getStatus = (milestone) => {
    if (milestone.fundsReleased) return { text: 'Released', color: '#4CAF50' };
    if (milestone.completed) return { text: 'Completed', color: '#2196F3' };
    return { text: 'Pending', color: '#FF9800' };
  };

  // 加载状态
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading milestones...</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div style={styles.error}>
        <p>{error}</p>
        <button onClick={loadMilestones} style={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  // 无里程碑
  if (milestones.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No milestones defined for this project yet.</p>
      </div>
    );
  }

  // 计算进度
  const releasedCount = milestones.filter(m => m.fundsReleased).length;

  return (
    <div style={styles.container}>
      {/* 总览 */}
      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Milestones</span>
          <span style={styles.summaryValue}>{milestones.length}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Completed</span>
          <span style={styles.summaryValue}>{releasedCount} / {milestones.length}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Released</span>
          <span style={styles.summaryValue}>${totalReleased.toLocaleString()}</span>
        </div>
      </div>

      {/* 时间线 */}
      <div style={styles.timeline}>
        {milestones.map((milestone, index) => {
          const status = getStatus(milestone);
          const isLast = index === milestones.length - 1;

          return (
            <div key={milestone.id} style={styles.milestoneItem}>
              {/* 左侧连接线 */}
              <div style={styles.lineContainer}>
                <div style={{
                  ...styles.dot,
                  background: status.color,
                  border: milestone.fundsReleased ? `3px solid ${status.color}` : 'none',
                }}>
                  {milestone.fundsReleased && (
                    <span style={styles.checkmark}>✓</span>
                  )}
                </div>
                {!isLast && <div style={styles.line}></div>}
              </div>

              {/* 右侧内容 */}
              <div style={styles.content}>
                <div style={styles.header}>
                  <h4 style={styles.title}>
                    Milestone {milestone.id + 1}
                  </h4>
                  <span style={{
                    ...styles.statusBadge,
                    background: status.color,
                  }}>
                    {status.text}
                  </span>
                </div>

                <p style={styles.description}>{milestone.description}</p>

                <div style={styles.footer}>
                  <span style={styles.amount}>
                    ${milestone.amount.toLocaleString()} USDC
                  </span>

                  {/* Owner操作按钮 */}
                  {isOwner && !milestone.fundsReleased && (
                    <div style={styles.actions}>
                      {!milestone.completed && (
                        <button
                          onClick={() => handleComplete(milestone.id)}
                          disabled={actionLoading === milestone.id}
                          style={styles.completeBtn}
                        >
                          {actionLoading === milestone.id ? 'Processing...' : 'Mark Complete'}
                        </button>
                      )}
                      {milestone.completed && !milestone.fundsReleased && (
                        <button
                          onClick={() => handleRelease(milestone.id)}
                          disabled={actionLoading === milestone.id}
                          style={styles.releaseBtn}
                        >
                          {actionLoading === milestone.id ? 'Processing...' : 'Release Funds'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1rem 0',
  },

  // 加载和错误状态
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#757575',
  },
  spinner: {
    width: '30px',
    height: '30px',
    margin: '0 auto 1rem',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #FF9800',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#C62828',
    background: '#FFEBEE',
    borderRadius: '8px',
  },
  retryBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    background: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#757575',
    background: '#F5F5F5',
    borderRadius: '8px',
  },

  // 总览
  summary: {
    display: 'flex',
    gap: '2rem',
    padding: '1rem',
    background: '#F5F5F5',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  summaryLabel: {
    fontSize: '0.85rem',
    color: '#757575',
    marginBottom: '0.25rem',
  },
  summaryValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#0f2027',
  },

  // 时间线
  timeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  milestoneItem: {
    display: 'flex',
    gap: '1rem',
  },
  lineContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '30px',
  },
  dot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  line: {
    width: '2px',
    flex: 1,
    background: '#E0E0E0',
    marginTop: '4px',
  },

  // 内容
  content: {
    flex: 1,
    paddingBottom: '2rem',
    background: 'white',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#0f2027',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  description: {
    color: '#616161',
    margin: '0.5rem 0 1rem 0',
    lineHeight: '1.6',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  amount: {
    fontWeight: 'bold',
    color: '#0f2027',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  completeBtn: {
    padding: '0.5rem 1rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  releaseBtn: {
    padding: '0.5rem 1rem',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};
