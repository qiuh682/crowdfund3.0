import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * FundingChart - 资金筹集进度图表
 *
 * 显示项目筹款进度的饼图
 */
export default function FundingChart({ raised, goal }) {
  const remaining = Math.max(goal - raised, 0);
  const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100).toFixed(1) : 0;

  const data = [
    { name: 'Raised', value: raised, color: '#4CAF50' },
    { name: 'Remaining', value: remaining, color: '#E0E0E0' },
  ];

  // 如果没有数据，显示空状态
  if (goal === 0) {
    return (
      <div style={styles.empty}>
        <p>No funding goal set</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* 中心百分比 */}
        <div style={styles.centerText}>
          <span style={styles.percentage}>{percentage}%</span>
          <span style={styles.label}>Funded</span>
        </div>
      </div>

      {/* 图例 */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <span style={{ ...styles.dot, background: '#4CAF50' }}></span>
          <span>Raised: ${Number(raised).toLocaleString()}</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.dot, background: '#E0E0E0' }}></span>
          <span>Remaining: ${Number(remaining).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1rem 0',
  },
  chartWrapper: {
    position: 'relative',
    height: '200px',
  },
  centerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  percentage: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0f2027',
  },
  label: {
    fontSize: '0.85rem',
    color: '#757575',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '1rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#424242',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#757575',
  },
};
