// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IERC20.sol";

/**
 * @title OpenCureV1
 * @dev 完整版 OpenCure 托管合约
 * 
 * 新增功能：
 * - 投票机制
 * - 退款功能
 * - 紧急暂停
 * - 时间锁
 * - 项目状态管理
 */
contract OpenCureV1 {
    
    // ============ 类型定义 ============
    
    /// @dev 项目状态
    enum ProjectStatus {
        Active,      // 进行中
        Completed,   // 已完成
        Failed,      // 失败
        Paused       // 暂停
    }
    
    /// @dev 里程碑结构
    struct Milestone {
        string description;       // 描述
        uint256 amount;          // 金额
        uint256 deadline;        // 截止时间
        bool completed;          // 是否完成
        bool fundsReleased;      // 资金是否释放
        uint256 votesFor;        // 赞成票数
        uint256 votesAgainst;    // 反对票数
        mapping(address => bool) hasVoted;  // 投票记录
    }
    
    // ============ 状态变量 ============
    
    /// @dev USDC 代币
    IERC20 public immutable usdcToken;
    
    /// @dev 合约所有者
    address public owner;
    
    /// @dev 科学家地址
    address public scientist;
    
    /// @dev 募资目标
    uint256 public goalAmount;
    
    /// @dev 募资截止时间
    uint256 public fundingDeadline;
    
    /// @dev 已筹集金额
    uint256 public totalRaised;
    
    /// @dev 已释放金额
    uint256 public totalReleased;
    
    /// @dev 项目状态
    ProjectStatus public status;
    
    /// @dev 是否暂停
    bool public paused;
    
    /// @dev 捐赠记录
    mapping(address => uint256) public donations;
    
    /// @dev 捐赠者列表
    address[] public donors;
    
    /// @dev 里程碑数量
    uint256 public milestoneCount;
    
    /// @dev 里程碑映射
    mapping(uint256 => Milestone) public milestones;
    
    /// @dev 投票权重（捐赠额度）
    mapping(address => uint256) public votingPower;
    
    /// @dev 总投票权
    uint256 public totalVotingPower;
    
    /// @dev 退款记录
    mapping(address => bool) public hasRefunded;
    
    // ============ 常量 ============
    
    /// @dev 投票通过阈值（60%）
    uint256 public constant VOTE_THRESHOLD = 60;
    
    /// @dev 最小捐赠额（1 USDC）
    uint256 public constant MIN_DONATION = 1e6;
    
    // ============ 事件 ============
    
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );
    
    event MilestoneAdded(
        uint256 indexed milestoneId,
        string description,
        uint256 amount,
        uint256 deadline
    );
    
    event MilestoneCompleted(
        uint256 indexed milestoneId,
        uint256 timestamp
    );
    
    event VoteCast(
        uint256 indexed milestoneId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    
    event FundsReleased(
        uint256 indexed milestoneId,
        address indexed recipient,
        uint256 amount
    );
    
    event RefundIssued(
        address indexed donor,
        uint256 amount
    );
    
    event ProjectStatusChanged(
        ProjectStatus oldStatus,
        ProjectStatus newStatus
    );
    
    event EmergencyPause(address indexed by);
    event EmergencyUnpause(address indexed by);
    
    // ============ 修饰器 ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    modifier whenPaused() {
        require(paused, "Contract is not paused");
        _;
    }
    
    modifier onlyActive() {
        require(status == ProjectStatus.Active, "Project not active");
        _;
    }
    
    // ============ 构造函数 ============
    
    constructor(
        address _usdcToken,
        address _scientist,
        uint256 _goalAmount,
        uint256 _fundingDuration
    ) {
        require(_usdcToken != address(0), "Invalid token");
        require(_scientist != address(0), "Invalid scientist");
        require(_goalAmount > 0, "Invalid goal");
        require(_fundingDuration > 0, "Invalid duration");
        
        usdcToken = IERC20(_usdcToken);
        owner = msg.sender;
        scientist = _scientist;
        goalAmount = _goalAmount;
        fundingDeadline = block.timestamp + _fundingDuration;
        status = ProjectStatus.Active;
    }
    
    // ============ 捐赠功能 ============
    
    /**
     * @dev 捐赠 USDC
     */
    function donate(uint256 _amount) external whenNotPaused onlyActive {
        require(_amount >= MIN_DONATION, "Amount too small");
        require(block.timestamp < fundingDeadline, "Funding ended");
        
        // 转账
        require(
            usdcToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        // 更新记录
        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        
        donations[msg.sender] += _amount;
        totalRaised += _amount;
        
        // 更新投票权
        votingPower[msg.sender] += _amount;
        totalVotingPower += _amount;
        
        emit DonationReceived(msg.sender, _amount, block.timestamp);
        
        // 检查是否达到目标
        if (totalRaised >= goalAmount) {
            _changeStatus(ProjectStatus.Active);
        }
    }
    
    // ============ 里程碑管理 ============
    
    /**
     * @dev 添加里程碑
     */
    function addMilestone(
        string calldata _description,
        uint256 _amount,
        uint256 _duration
    ) external onlyOwner {
        require(_amount > 0, "Invalid amount");
        require(_duration > 0, "Invalid duration");
        require(bytes(_description).length > 0, "Empty description");
        
        Milestone storage m = milestones[milestoneCount];
        m.description = _description;
        m.amount = _amount;
        m.deadline = block.timestamp + _duration;
        
        emit MilestoneAdded(
            milestoneCount,
            _description,
            _amount,
            block.timestamp + _duration
        );
        
        milestoneCount++;
    }
    
    /**
     * @dev 完成里程碑（提交给捐赠者投票）
     */
    function completeMilestone(uint256 _milestoneId) external onlyOwner {
        require(_milestoneId < milestoneCount, "Invalid milestone");
        Milestone storage m = milestones[_milestoneId];
        require(!m.completed, "Already completed");
        
        m.completed = true;
        
        emit MilestoneCompleted(_milestoneId, block.timestamp);
    }
    
    // ============ 投票功能 ============
    
    /**
     * @dev 对里程碑投票
     * @param _milestoneId 里程碑 ID
     * @param _support true 赞成，false 反对
     */
    function voteOnMilestone(
        uint256 _milestoneId,
        bool _support
    ) external whenNotPaused {
        require(_milestoneId < milestoneCount, "Invalid milestone");
        require(votingPower[msg.sender] > 0, "No voting power");
        
        Milestone storage m = milestones[_milestoneId];
        require(m.completed, "Milestone not completed");
        require(!m.fundsReleased, "Funds already released");
        require(!m.hasVoted[msg.sender], "Already voted");
        
        // 记录投票
        m.hasVoted[msg.sender] = true;
        uint256 weight = votingPower[msg.sender];
        
        if (_support) {
            m.votesFor += weight;
        } else {
            m.votesAgainst += weight;
        }
        
        emit VoteCast(_milestoneId, msg.sender, _support, weight);
    }
    
    /**
     * @dev 检查投票是否通过
     */
    function isVotePassed(uint256 _milestoneId) public view returns (bool) {
        require(_milestoneId < milestoneCount, "Invalid milestone");
        Milestone storage m = milestones[_milestoneId];
        
        if (totalVotingPower == 0) return false;
        
        uint256 totalVotes = m.votesFor + m.votesAgainst;
        if (totalVotes == 0) return false;
        
        // 需要 60% 赞成
        return (m.votesFor * 100) / totalVotingPower >= VOTE_THRESHOLD;
    }
    
    // ============ 资金释放 ============
    
    /**
     * @dev 释放里程碑资金（需要投票通过）
     */
    function releaseFunds(uint256 _milestoneId) external onlyOwner whenNotPaused {
        require(_milestoneId < milestoneCount, "Invalid milestone");
        Milestone storage m = milestones[_milestoneId];
        
        require(m.completed, "Not completed");
        require(!m.fundsReleased, "Already released");
        require(isVotePassed(_milestoneId), "Vote not passed");
        require(
            usdcToken.balanceOf(address(this)) >= m.amount,
            "Insufficient balance"
        );
        
        m.fundsReleased = true;
        totalReleased += m.amount;
        
        require(
            usdcToken.transfer(scientist, m.amount),
            "Transfer failed"
        );
        
        emit FundsReleased(_milestoneId, scientist, m.amount);
    }
    
    // ============ 退款功能 ============
    
    /**
     * @dev 申请退款（项目失败或超时）
     */
    function claimRefund() external {
        require(
            status == ProjectStatus.Failed ||
            (block.timestamp > fundingDeadline && totalRaised < goalAmount),
            "Cannot refund"
        );
        
        uint256 donated = donations[msg.sender];
        require(donated > 0, "No donation");
        require(!hasRefunded[msg.sender], "Already refunded");
        
        // 计算退款金额（按比例）
        uint256 contractBalance = usdcToken.balanceOf(address(this));
        uint256 refundAmount = (donated * contractBalance) / totalRaised;
        
        hasRefunded[msg.sender] = true;
        
        require(
            usdcToken.transfer(msg.sender, refundAmount),
            "Refund failed"
        );
        
        emit RefundIssued(msg.sender, refundAmount);
    }
    
    // ============ 项目管理 ============
    
    /**
     * @dev 标记项目为失败
     */
    function markAsFailed() external onlyOwner {
        require(status == ProjectStatus.Active, "Not active");
        _changeStatus(ProjectStatus.Failed);
    }
    
    /**
     * @dev 标记项目为完成
     */
    function markAsCompleted() external onlyOwner {
        require(status == ProjectStatus.Active, "Not active");
        _changeStatus(ProjectStatus.Completed);
    }
    
    /**
     * @dev 内部：改变项目状态
     */
    function _changeStatus(ProjectStatus _newStatus) internal {
        ProjectStatus oldStatus = status;
        status = _newStatus;
        emit ProjectStatusChanged(oldStatus, _newStatus);
    }
    
    // ============ 紧急控制 ============
    
    /**
     * @dev 紧急暂停
     */
    function emergencyPause() external onlyOwner whenNotPaused {
        paused = true;
        emit EmergencyPause(msg.sender);
    }
    
    /**
     * @dev 恢复运行
     */
    function emergencyUnpause() external onlyOwner whenPaused {
        paused = false;
        emit EmergencyUnpause(msg.sender);
    }
    
    // ============ 查询功能 ============
    
    /**
     * @dev 获取合约余额
     */
    function getBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }
    
    /**
     * @dev 获取捐赠者数量
     */
    function getDonorCount() external view returns (uint256) {
        return donors.length;
    }
    
    /**
     * @dev 获取里程碑详情
     */
    function getMilestone(uint256 _milestoneId) external view returns (
        string memory description,
        uint256 amount,
        uint256 deadline,
        bool completed,
        bool fundsReleased,
        uint256 votesFor,
        uint256 votesAgainst
    ) {
        require(_milestoneId < milestoneCount, "Invalid milestone");
        Milestone storage m = milestones[_milestoneId];
        return (
            m.description,
            m.amount,
            m.deadline,
            m.completed,
            m.fundsReleased,
            m.votesFor,
            m.votesAgainst
        );
    }
    
    /**
     * @dev 检查是否已投票
     */
    function hasVotedOnMilestone(
        uint256 _milestoneId,
        address _voter
    ) external view returns (bool) {
        require(_milestoneId < milestoneCount, "Invalid milestone");
        return milestones[_milestoneId].hasVoted[_voter];
    }
    
    /**
     * @dev 获取募资进度（基点，0.01%）
     */
    function getFundingProgress() external view returns (uint256) {
        if (goalAmount == 0) return 0;
        return (totalRaised * 10000) / goalAmount;
    }
    
    /**
     * @dev 检查募资是否成功
     */
    function isFundingSuccessful() public view returns (bool) {
        return totalRaised >= goalAmount && block.timestamp < fundingDeadline;
    }
    
    /**
     * @dev 检查募资是否失败
     */
    function isFundingFailed() public view returns (bool) {
        return block.timestamp >= fundingDeadline && totalRaised < goalAmount;
    }
}