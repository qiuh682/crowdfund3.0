import { ethers } from 'ethers';
import { useMemo } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACTS, ESCROW_ABI, USDC_ABI } from '../utils/contracts';

export function useContract() {
  const { signer, provider } = useWeb3();

  // Memoize read-only contract to avoid recreating on every render
  const escrowContractReadOnly = useMemo(() => {
    if (!provider) return null;
    try {
      return new ethers.Contract(
        CONTRACTS.ESCROW,
        ESCROW_ABI,
        provider
      );
    } catch (error) {
      console.error('Failed to create read-only escrow contract:', error);
      return null;
    }
  }, [provider]);

  // 获取Escrow合约实例（可写）
  const getEscrowContract = () => {
    if (!signer) return null;
    try {
      return new ethers.Contract(
        CONTRACTS.ESCROW,
        ESCROW_ABI,
        signer
      );
    } catch (error) {
      console.error('Failed to create escrow contract:', error);
      return null;
    }
  };

  // 获取只读Escrow合约实例
  const getEscrowContractReadOnly = () => {
    return escrowContractReadOnly;
  };

  // 获取USDC合约实例
  const getUSDCContract = () => {
    if (!signer) return null;
    try {
      return new ethers.Contract(
        CONTRACTS.USDC,
        USDC_ABI,
        signer
      );
    } catch (error) {
      console.error('Failed to create USDC contract:', error);
      return null;
    }
  };

  // 获取只读USDC合约实例
  const getUSDCContractReadOnly = () => {
    if (!provider) return null;
    try {
      return new ethers.Contract(
        CONTRACTS.USDC,
        USDC_ABI,
        provider
      );
    } catch (error) {
      console.error('Failed to create read-only USDC contract:', error);
      return null;
    }
  };

  return {
    getEscrowContract,
    getEscrowContractReadOnly,
    getUSDCContract,
    getUSDCContractReadOnly
  };
}