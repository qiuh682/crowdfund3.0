import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function WalletConnect() {
  // State variables
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  // Helper function to refresh balance
  const refreshBalance = async (address) => {
    try {
      setRefreshing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceInWei = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balanceInWei);
      setBalance(balanceInEth);
      console.log('Balance refreshed:', balanceInEth);
      alert(`Balance refreshed! New balance: ${parseFloat(balanceInEth).toFixed(2)} ETH`);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      alert('Failed to refresh balance');
    } finally {
      setRefreshing(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          refreshBalance(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🦊 MetaMask Connection</h2>

      {!account ? (
        <div>
          <p style={{ color: 'white' }}>Connect your wallet to use OpenCure</p>
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
        <div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '2px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#2D3436', marginTop: 0 }}>✅ Connected</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#636e72', fontSize: '14px' }}>Address:</strong>
              <div style={{
                fontFamily: 'monospace',
                backgroundColor: '#f8f9fa',
                color: '#2D3436',
                padding: '10px',
                borderRadius: '6px',
                marginTop: '6px',
                wordBreak: 'break-all',
                fontSize: '14px',
                border: '1px solid #e1e4e8'
              }}>
                {account}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#636e72', fontSize: '14px' }}>Balance:</strong>
              <div style={{ 
                fontSize: '24px', 
                marginTop: '6px',
                color: '#2D3436',
                fontWeight: '600'
              }}>
                {balance ? `${parseFloat(balance).toFixed(2)} ETH` : 'Loading...'}
              </div>
            </div>

            <div>
              <strong style={{ color: '#636e72', fontSize: '14px' }}>Network:</strong>
              <div style={{ 
                marginTop: '6px',
                color: '#2D3436',
                fontSize: '16px',
                backgroundColor: '#e3f2fd',
                padding: '6px 12px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                {network || 'Loading...'}
              </div>
            </div>
          </div>

          <button
            onClick={() => refreshBalance(account)}
            disabled={refreshing}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: refreshing ? '#cccccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              marginRight: '10px',
              fontWeight: '500'
            }}
          >
            {refreshing ? '⏳ Refreshing...' : '🔄 Refresh Balance'}
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
              cursor: 'pointer',
              fontWeight: '500'
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