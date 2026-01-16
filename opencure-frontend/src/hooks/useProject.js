import { useState, useEffect, useCallback } from 'react';
import { useContract } from './useContract';
import { ethers } from 'ethers';

export function useProject(projectId) {
  const [project, setProject] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getEscrowContractReadOnly } = useContract();

  const loadProject = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const contract = getEscrowContractReadOnly();
      if (!contract) {
        throw new Error('Unable to connect to blockchain. Please check your connection.');
      }

      // 读取项目信息
      const projectData = await contract.projects(projectId);

      // Check if project exists (has a name)
      if (!projectData.name) {
        throw new Error('Project not found');
      }

      // Calculate goal amount safely
      const goalAmount = Number(ethers.formatUnits(projectData.goalAmount, 6));
      const raisedAmount = Number(ethers.formatUnits(projectData.raisedAmount, 6));
      const progressPercentage = goalAmount > 0
        ? ((raisedAmount / goalAmount) * 100).toFixed(2)
        : '0.00';

      // 转换数据格式
      const formattedProject = {
        id: Number(projectData.id),
        name: projectData.name,
        description: projectData.description,
        diseaseType: projectData.diseaseType,
        creator: projectData.creator,
        teamMembers: projectData.teamMembers || [],
        goalAmount: goalAmount,
        raisedAmount: raisedAmount,
        status: Number(projectData.status),
        createdAt: Number(projectData.createdAt),
        progressPercentage: progressPercentage
      };

      setProject(formattedProject);

      // 加载捐赠历史
      await loadDonations(contract, projectId);

    } catch (err) {
      console.error('Failed to load project:', err);
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId, getEscrowContractReadOnly]);

  // 加载项目数据
  useEffect(() => {
    loadProject();
  }, [loadProject]);

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