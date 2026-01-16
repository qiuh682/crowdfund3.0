import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setAccount(accounts[0]);
      setProvider(provider);
      setSigner(signer);

      console.log('Connected:', accounts[0]);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  // 监听账户切换
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setProvider(null);
          setSigner(null);
        }
      });
    }
  }, []);

  const value = {
    account,
    provider,
    signer,
    connectWallet,
    isConnected: !!account
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}