import { Link } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context'; // 导入Hook

export default function Header() {
  // 使用Web3 Context
  const { 
    account, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnectWallet,
    chainId 
  } = useWeb3();

  // 格式化地址显示
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 获取网络名称
  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum',
      5: 'Goerli',
      11155111: 'Sepolia',
      137: 'Polygon',
    };
    return networks[chainId] || `Chain ${chainId}`;
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🔓 OpenCure
        </Link>
        
        <nav style={styles.nav}>
          <Link to="/projects" style={styles.navLink}>
            Projects
          </Link>
          <Link to="/create" style={styles.navLink}>
            Create
          </Link>
          <Link to="/dashboard" style={styles.navLink}>
            Dashboard
          </Link>
        </nav>
        
        {/* 钱包连接区域 */}
        <div style={styles.walletSection}>
          {isConnected ? (
            // 已连接状态
            <div style={styles.connectedContainer}>
              <div style={styles.networkBadge}>
                {getNetworkName(chainId)}
              </div>
              <div style={styles.addressDisplay}>
                {formatAddress(account)}
              </div>
              <button 
                onClick={disconnectWallet}
                style={styles.disconnectButton}
              >
                Disconnect
              </button>
            </div>
          ) : (
            // 未连接状态
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              style={{
                ...styles.connectButton,
                opacity: isConnecting ? 0.6 : 1,
                cursor: isConnecting ? 'not-allowed' : 'pointer'
              }}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  walletSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  connectButton: {
    padding: '0.6rem 1.5rem',
    background: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  connectedContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  networkBadge: {
    padding: '0.4rem 0.8rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: 'white',
  },
  addressDisplay: {
    padding: '0.4rem 1rem',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '6px',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
  },
  disconnectButton: {
    padding: '0.4rem 1rem',
    background: 'rgba(255, 152, 0, 0.3)',
    color: 'white',
    border: '1px solid #FF9800',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};