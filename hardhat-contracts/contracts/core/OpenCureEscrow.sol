// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IERC20.sol";

/**
 * @title OpenCureEscrow
 * @dev OpenCure 托管合约 - 管理基于里程碑的研究资金
 * 
 * 核心功能：
 * 1. 接收 USDC 捐赠
 * 2. 基于里程碑释放资金
 * 3. 透明的资金管理
 */
contract OpenCureEscrow {
    
    // ============ 状态变量 ============
    
    /// @dev USDC 代币合约地址
    IERC20 public immutable usdcToken;
    
    /// @dev 项目所有者（管理员）
    address public owner;
    
    /// @dev 科学家/研究团队地址
    address public scientist;
    
    /// @dev 募资目标金额（USDC，6位小数）
    uint256 public goalAmount;
    
    /// @dev 已筹集总额
    uint256 public totalRaised;
    
    /// @dev 已释放给科学家的总额
    uint256 public totalReleased;
    
    /// @dev 记录每个捐赠者的捐赠金额
    mapping(address => uint256) public donations;
    
    /// @dev 捐赠者列表
    address[] public donors;
    
    /// @dev 里程碑数量
    uint256 public milestoneCount;
    
    /// @dev 里程碑信息
    struct Milestone {
        string description;      // 里程碑描述
        uint256 amount;         // 该里程碑的资金额度
        bool completed;         // 是否已完成
        bool fundsReleased;     // 资金是否已释放
    }
    
    /// @dev 里程碑 ID => 里程碑信息
    mapping(uint256 => Milestone) public milestones;
    
    // ============ 事件 ============
    
    /// @dev 捐赠事件
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );
    
    /// @dev 里程碑完成事件
    event MilestoneCompleted(
        uint256 indexed milestoneId,
        string description
    );
    
    /// @dev 资金释放事件
    event FundsReleased(
        uint256 indexed milestoneId,
        address indexed scientist,
        uint256 amount
    );
    
    /// @dev 科学家地址更新事件
    event ScientistUpdated(
        address indexed oldScientist,
        address indexed newScientist
    );
    
    // ============ 修饰器 ============
    
    /// @dev 只允许所有者调用
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }
    
    // ============ 构造函数 ============
    
    /**
     * @dev 构造函数
     * @param _usdcToken USDC 代币合约地址
     * @param _scientist 科学家地址
     * @param _goalAmount 募资目标（USDC，6位小数）
     */
    constructor(
        address _usdcToken,
        address _scientist,
        uint256 _goalAmount
    ) {
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_scientist != address(0), "Invalid scientist address");
        require(_goalAmount > 0, "Goal must be > 0");
        
        usdcToken = IERC20(_usdcToken);
        owner = msg.sender;
        scientist = _scientist;
        goalAmount = _goalAmount;
    }
    
    // ============ 捐赠功能 ============
    
    /**
     * @dev 捐赠 USDC
     * @param _amount 捐赠金额（需要先 approve）
     */
    function donate(uint256 _amount) external {
        require(_amount > 0, "Amount must be > 0");
        
        // 从捐赠者转入 USDC
        require(
            usdcToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        // 如果是新捐赠者，添加到列表
        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        
        // 更新记录
        donations[msg.sender] += _amount;
        totalRaised += _amount;
        
        emit DonationReceived(msg.sender, _amount, block.timestamp);
    }
    
    // ============ 里程碑管理 ============
    
    /**
     * @dev 添加里程碑（仅所有者）
     * @param _description 里程碑描述
     * @param _amount 该里程碑的资金额度
     */
    function addMilestone(
        string calldata _description,
        uint256 _amount
    ) external onlyOwner {
        require(_amount > 0, "Amount must be > 0");
        require(bytes(_description).length > 0, "Description required");
        
        milestones[milestoneCount] = Milestone({
            description: _description,
            amount: _amount,
            completed: false,
            fundsReleased: false
        });
        
        milestoneCount++;
    }
    
    /**
     * @dev 标记里程碑完成（仅所有者）
     * @param _milestoneId 里程碑 ID
     */
    function completeMilestone(uint256 _milestoneId) external onlyOwner {
        require(_milestoneId < milestoneCount, "Invalid milestone");
        Milestone storage milestone = milestones[_milestoneId];
        require(!milestone.completed, "Already completed");
        
        milestone.completed = true;
        
        emit MilestoneCompleted(_milestoneId, milestone.description);
    }
    
    /**
     * @dev 释放里程碑资金（仅所有者）
     * @param _milestoneId 里程碑 ID
     */
    function releaseFunds(uint256 _milestoneId) external onlyOwner {
        require(_milestoneId < milestoneCount, "Invalid milestone");
        Milestone storage milestone = milestones[_milestoneId];
        
        require(milestone.completed, "Milestone not completed");
        require(!milestone.fundsReleased, "Funds already released");
        require(
            usdcToken.balanceOf(address(this)) >= milestone.amount,
            "Insufficient balance"
        );
        
        milestone.fundsReleased = true;
        totalReleased += milestone.amount;
        
        require(
            usdcToken.transfer(scientist, milestone.amount),
            "Transfer failed"
        );
        
        emit FundsReleased(_milestoneId, scientist, milestone.amount);
    }
    
    // ============ 管理功能 ============
    
    /**
     * @dev 更新科学家地址（仅所有者）
     * @param _newScientist 新的科学家地址
     */
    function updateScientist(address _newScientist) external onlyOwner {
        require(_newScientist != address(0), "Invalid address");
        address oldScientist = scientist;
        scientist = _newScientist;
        
        emit ScientistUpdated(oldScientist, _newScientist);
    }
    
    // ============ 查询功能 ============
    
    /**
     * @dev 查询合约 USDC 余额
     */
    function getBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }
    
    /**
     * @dev 查询捐赠者数量
     */
    function getDonorCount() external view returns (uint256) {
        return donors.length;
    }
    
    /**
     * @dev 查询里程碑详情
     */
    function getMilestone(uint256 _milestoneId) external view returns (
        string memory description,
        uint256 amount,
        bool completed,
        bool fundsReleased
    ) {
        require(_milestoneId < milestoneCount, "Invalid milestone");
        Milestone memory m = milestones[_milestoneId];
        return (m.description, m.amount, m.completed, m.fundsReleased);
    }
    
    /**
     * @dev 查询募资进度（百分比 * 100）
     */
    function getFundingProgress() external view returns (uint256) {
        if (goalAmount == 0) return 0;
        return (totalRaised * 10000) / goalAmount; // 返回基点（0.01%）
    }
}