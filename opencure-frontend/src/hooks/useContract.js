import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACTS, ESCROW_ABI, USDC_ABI } from '../utils/contracts';

export function useContract() {
  const { signer, provider } = useWeb3();

  // 获取Escrow合约实例（可写）
  const getEscrowContract = () => {
    if (!signer) return null;
    return new ethers.Contract(
      CONTRACTS.ESCROW,
      ESCROW_ABI,
      signer
    );
  };

  // 获取只读Escrow合约实例
  const getEscrowContractReadOnly = () => {
    if (!provider) return null;
    return new ethers.Contract(
      CONTRACTS.ESCROW,
      ESCROW_ABI,
      provider
    );
  };

  // 获取USDC合约实例
  const getUSDCContract = () => {
    if (!signer) return null;
    return new ethers.Contract(
      CONTRACTS.USDC,
      USDC_ABI,
      signer
    );
  };

  return {
    getEscrowContract,
    getEscrowContractReadOnly,
    getUSDCContract
  };
}