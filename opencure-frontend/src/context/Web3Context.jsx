import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

// Default RPC URL for read-only operations (Sepolia testnet)
const DEFAULT_RPC_URL = 'https://rpc.sepolia.org';

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [walletProvider, setWalletProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Create a read-only provider that always works (doesn't require wallet)
  const readOnlyProvider = useMemo(() => {
    try {
      return new ethers.JsonRpcProvider(DEFAULT_RPC_URL);
    } catch (error) {
      console.error('Failed to create read-only provider:', error);
      return null;
    }
  }, []);

  // Use wallet provider if connected, otherwise use read-only provider
  const provider = walletProvider || readOnlyProvider;

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      // 请求连接
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // 创建provider
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const walletSigner = await browserProvider.getSigner();

      setAccount(accounts[0]);
      setWalletProvider(browserProvider);
      setSigner(walletSigner);

      console.log('Connected:', accounts[0]);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  // 监听账户切换
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Re-create provider and signer
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          setWalletProvider(browserProvider);
          browserProvider.getSigner().then(setSigner).catch(console.error);
        } else {
          setAccount(null);
          setWalletProvider(null);
          setSigner(null);
        }
      };

      const handleChainChanged = () => {
        // Reload the page on chain change for safety
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            handleAccountsChanged(accounts);
          }
        })
        .catch(console.error);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const value = {
    account,
    provider,
    signer,
    connectWallet,
    isConnected: !!account,
    hasWallet: !!window.ethereum
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}