import { useState } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { useWeb3 } from '../context/Web3Context';
import { useContract } from '../hooks/useContract';

export default function DonationForm({ projectId, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: 输入, 1: Approve, 2: Donate
  
  const { account, isConnected } = useWeb3();
  const { getEscrowContract, getUSDCContract } = useContract();

  // 验证输入
  const validateAmount = () => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      toast.error('Please enter a valid amount');
      return false;
    }
    return true;
  };

  // 处理捐赠（完整流程）
  const handleDonate = async () => {
    if (!validateAmount()) return;
    
    try {
      setLoading(true);
      
      // Step 1: Approve USDC
      await approveUSDC();
      
      // Step 2: Donate
      await donate();
      
      // 成功
      toast.success('🎉 Donation successful!');
      setAmount('');
      setStep(0);
      
      // 通知父组件刷新
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Donation failed:', error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Approve USDC
  const approveUSDC = async () => {
    setStep(1);
    toast.loading('Step 1/2: Approving USDC...', { id: 'approve' });
    
    const usdcContract = getUSDCContract();
    const escrowContract = getEscrowContract();
    
    if (!usdcContract || !escrowContract) {
      throw new Error('Contract not available');
    }

    // USDC有6位小数
    const amountInWei = ethers.parseUnits(amount, 6);
    const escrowAddress = await escrowContract.getAddress();
    
    // 发送approve交易
    const approveTx = await usdcContract.approve(escrowAddress, amountInWei);
    
    toast.loading('Waiting for approval confirmation...', { id: 'approve' });
    await approveTx.wait();
    
    toast.success('USDC approved!', { id: 'approve' });
  };

  // Step 2: Donate
  const donate = async () => {
    setStep(2);
    toast.loading('Step 2/2: Sending donation...', { id: 'donate' });
    
    const escrowContract = getEscrowContract();
    const amountInWei = ethers.parseUnits(amount, 6);
    
    // 发送donate交易
    const donateTx = await escrowContract.donate(projectId, amountInWei);
    
    toast.loading('Waiting for transaction confirmation...', { id: 'donate' });
    await donateTx.wait();
    
    toast.success('Donation confirmed!', { id: 'donate' });
  };

  // 错误处理
  const handleError = (error) => {
    if (error.code === 'ACTION_REJECTED') {
      toast.error('Transaction rejected by user');
    } else if (error.message.includes('insufficient funds')) {
      toast.error('Insufficient USDC balance');
    } else if (error.message.includes('exceeds allowance')) {
      toast.error('Approval failed or insufficient');
    } else {
      toast.error('Transaction failed: ' + (error.reason || error.message));
    }
    setStep(0);
  };

  // 未连接钱包
  if (!isConnected) {
    return (
      <div style={styles.notConnected}>
        <p style={styles.promptText}>
          Please connect your wallet to donate
        </p>
      </div>
    );
  }

  return (
    <div style={styles.form}>
      <h3 style={styles.title}>Support This Research</h3>
      
      {/* 输入金额 */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>
          Donation Amount (USDC)
        </label>
        <div style={styles.inputWrapper}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            disabled={loading}
            style={styles.input}
            min="0"
            step="0.01"
          />
          <span style={styles.currency}>USDC</span>
        </div>
      </div>

      {/* 快捷金额按钮 */}
      <div style={styles.quickAmounts}>
        {[10, 50, 100, 500].map(amt => (
          <button
            key={amt}
            onClick={() => setAmount(amt.toString())}
            disabled={loading}
            style={styles.quickButton}
          >
            ${amt}
          </button>
        ))}
      </div>

      {/* 捐赠按钮 */}
      <button
        onClick={handleDonate}
        disabled={loading || !amount}
        style={{
          ...styles.donateButton,
          opacity: (loading || !amount) ? 0.6 : 1,
          cursor: (loading || !amount) ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? (
          <>
            {step === 1 && '⏳ Approving USDC...'}
            {step === 2 && '⏳ Sending Donation...'}
            {step === 0 && '⏳ Processing...'}
          </>
        ) : (
          '💝 Donate Now'
        )}
      </button>

      {/* 帮助文本 */}
      <div style={styles.helpText}>
        <p style={styles.helpItem}>
          ✓ Donations are processed in 2 steps
        </p>
        <p style={styles.helpItem}>
          ✓ Step 1: Approve USDC transfer
        </p>
        <p style={styles.helpItem}>
          ✓ Step 2: Complete donation
        </p>
        <p style={styles.helpNote}>
          💡 You'll need to confirm both transactions in MetaMask
        </p>
      </div>

      {/* 用户信息 */}
      <div style={styles.userInfo}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Your wallet:</span>
          <span style={styles.infoValue}>
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  notConnected: {
    padding: '2rem',
    textAlign: 'center',
    background: '#FFF3E0',
    borderRadius: '8px',
  },
  promptText: {
    color: '#E65100',
    margin: 0,
  },
  
  form: {
    width: '100%',
  },
  title: {
    fontSize: '1.25rem',
    marginBottom: '1.5rem',
    color: '#0f2027',
  },
  
  // 输入组
  inputGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: '#616161',
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '1rem',
    paddingRight: '70px',
    fontSize: '1.1rem',
    border: '2px solid #E0E0E0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  currency: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#757575',
    fontWeight: '500',
  },
  
  // 快捷金额
  quickAmounts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  quickButton: {
    padding: '0.6rem',
    background: '#F5F5F5',
    border: '1px solid #E0E0E0',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  // 捐赠按钮
  donateButton: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #FF6B00, #FF9800)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    marginBottom: '1rem',
  },
  
  // 帮助文本
  helpText: {
    background: '#F5F5F5',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  helpItem: {
    fontSize: '0.85rem',
    color: '#616161',
    margin: '0.25rem 0',
  },
  helpNote: {
    fontSize: '0.85rem',
    color: '#FF9800',
    margin: '0.5rem 0 0 0',
    fontWeight: '500',
  },
  
  // 用户信息
  userInfo: {
    borderTop: '1px solid #E0E0E0',
    paddingTop: '1rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
  },
  infoLabel: {
    color: '#757575',
  },
  infoValue: {
    color: '#424242',
    fontFamily: 'monospace',
  },
};