import { useState, useEffect } from 'react';
import { useContract } from './useContract';
import { ethers } from 'ethers';

export function useProject(projectId) {
  const [project, setProject] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { getEscrowContractReadOnly } = useContract();

  // 加载项目数据
  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const contract = getEscrowContractReadOnly();
      if (!contract) {
        throw new Error('Contract not available');
      }

      // 读取项目信息
      const projectData = await contract.projects(projectId);
      
      // 转换数据格式
      const formattedProject = {
        id: Number(projectData.id),
        name: projectData.name,
        description: projectData.description,
        diseaseType: projectData.diseaseType,
        creator: projectData.creator,
        teamMembers: projectData.teamMembers,
        goalAmount: ethers.formatUnits(projectData.goalAmount, 6), // USDC有6位小数
        raisedAmount: ethers.formatUnits(projectData.raisedAmount, 6),
        status: Number(projectData.status),
        createdAt: Number(projectData.createdAt),
        // 计算进度百分比
        progressPercentage: (Number(ethers.formatUnits(projectData.raisedAmount, 6)) / 
                            Number(ethers.formatUnits(projectData.goalAmount, 6)) * 100).toFixed(2)
      };

      setProject(formattedProject);

      // 加载捐赠历史
      await loadDonations(contract, projectId);
      
    } catch (err) {
      console.error('Failed to load project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 加载捐赠历史
  const loadDonations = async (contract, projectId) => {
    try {
      // 获取DonationReceived事件
      const filter = contract.filters.DonationReceived(projectId);
      const events = await contract.queryFilter(filter);
      
      // 转换事件为捐赠记录
      const donationList = events.map(event => ({
        donor: event.args.donor,
        amount: ethers.formatUnits(event.args.amount, 6),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      }));

      // 按区块号降序排序（最新的在前）
      donationList.sort((a, b) => b.blockNumber - a.blockNumber);
      
      setDonations(donationList);
    } catch (err) {
      console.error('Failed to load donations:', err);
      // 即使加载捐赠失败，也不影响项目显示
    }
  };

  return {
    project,
    donations,
    loading,
    error,
    reload: loadProject
  };
}