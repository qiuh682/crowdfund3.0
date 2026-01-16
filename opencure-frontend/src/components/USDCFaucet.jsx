import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { useWeb3 } from '../context/Web3Context';
import { useContract } from '../hooks/useContract';

export default function USDCFaucet() {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const { account, isConnected } = useWeb3();
  const { getUSDCContract } = useContract();

  // 获取USDC余额
  const checkBalance = useCallback(async () => {
    try {
      const usdcContract = getUSDCContract();
      if (!usdcContract || !account) return;

      const bal = await usdcContract.balanceOf(account);
      const formatted = ethers.formatUnits(bal, 6);
      setBalance(formatted);
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  }, [getUSDCContract, account]);

  // 铸造测试USDC
  const mintUSDC = async () => {
    try {
      setLoading(true);
      toast.loading('Minting test USDC...', { id: 'mint' });

      const usdcContract = getUSDCContract();
      if (!usdcContract) {
        throw new Error('Contract not available');
      }

      // 铸造1000 USDC
      const amount = ethers.parseUnits('1000', 6);
      const tx = await usdcContract.mint(account, amount);
      
      toast.loading('Waiting for confirmation...', { id: 'mint' });
      await tx.wait();

      toast.success('✅ Received 1,000 test USDC!', { id: 'mint' });
      
      // 刷新余额
      await checkBalance();
    } catch (error) {
      console.error('Mint failed:', error);
      if (error.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected', { id: 'mint' });
      } else {
        toast.error('Mint failed: ' + error.message, { id: 'mint' });
      }
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时检查余额
  useEffect(() => {
    if (isConnected) {
      checkBalance();
    }
  }, [isConnected, checkBalance]);

  if (!isConnected) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>🚰 USDC Test Faucet</h3>
        
        <div style={styles.balance}>
          <span style={styles.balanceLabel}>Your USDC Balance:</span>
          <span style={styles.balanceValue}>
            {parseFloat(balance).toLocaleString()} USDC
          </span>
        </div>

        <button
          onClick={mintUSDC}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Minting...' : '💰 Get 1,000 Test USDC'}
        </button>

        <p style={styles.note}>
          💡 This is test USDC on Sepolia testnet. It has no real value.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '2rem',
  },
  card: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    borderRadius: '12px',
    color: 'white',
  },
  title: {
    margin: '0 0 1rem 0',
    fontSize: '1.5rem',
  },
  balance: {
    background: 'rgba(255,255,255,0.2)',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: '0.9rem',
  },
  balanceValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    padding: '1rem',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  note: {
    fontSize: '0.85rem',
    margin: 0,
    opacity: 0.9,
  },
};