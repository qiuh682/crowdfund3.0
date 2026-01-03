import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function WalletConnect() {
  // State variables
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);

  // Function to connect wallet
  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Get the first account
      const userAccount = accounts[0];
      setAccount(userAccount);

      // Create provider to read blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get balance
      const balanceInWei = await provider.getBalance(userAccount);
      const balanceInEth = ethers.formatEther(balanceInWei);
      setBalance(balanceInEth);

      // Get network info
      const network = await provider.getNetwork();
      setNetwork(network.name);

      console.log('Connected!', {
        account: userAccount,
        balance: balanceInEth,
        network: network.name
      });

    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect: ' + error.message);
    }
  };

  // Function to disconnect
  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setNetwork(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Refresh balance when account changes
          refreshBalance(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        // Reload page when network changes
        window.location.reload();
      });
    }

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // Helper function to refresh balance
  const refreshBalance = async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balanceInWei = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balanceInWei);
    setBalance(balanceInEth);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🦊 MetaMask Connection</h2>

      {!account ? (
        // Not connected - show connect button
        <div>
          <p>Connect your wallet to use OpenCure</p>
          <button
            onClick={connectWallet}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        // Connected - show account info
        <div>
         <div style={{
  backgroundColor: 'white',           // 改成纯白色
  padding: '20px',
  borderRadius: '12px',
  marginBottom: '20px',
  border: '2px solid #e0e0e0',       // 添加边框
  color: '#2D3436'                    // 添加深色文字
}}>
  <h3 style={{ color: '#2D3436' }}>✅ Connected</h3>
  
  <div style={{ marginBottom: '10px' }}>
    <strong style={{ color: '#2D3436' }}>Address:</strong>
    <div style={{
      fontFamily: 'monospace',
      backgroundColor: '#f5f5f5',      // 浅灰背景
      color: '#2D3436',                // 深色文字
      padding: '8px',
      borderRadius: '4px',
      marginTop: '4px',
      wordBreak: 'break-all'
    }}>
      {account}
    </div>
  </div>

  <div style={{ marginBottom: '10px' }}>
    <strong style={{ color: '#2D3436' }}>Balance:</strong>
    <div style={{ 
      fontSize: '20px', 
      marginTop: '4px',
      color: '#2D3436'                 // 深色文字
    }}>
      {balance ? `${parseFloat(balance).toFixed(2)} ETH` : 'Loading...'}
    </div>
  </div>

  <div>
    <strong style={{ color: '#2D3436' }}>Network:</strong>
    <div style={{ 
      marginTop: '4px',
      color: '#2D3436'                 // 深色文字
    }}>
      {network || 'Loading...'}
    </div>
  </div>
</div>
         

          <button
  onClick={() => refreshBalance(account)}
  style={{
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '10px'
  }}
>
  🔄 Refresh Balance
</button>

<button
  onClick={disconnectWallet}
  style={{
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#757575',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }}
>
  Disconnect
</button>
        </div>
      )}
    </div>
  );
}

export default WalletConnect;