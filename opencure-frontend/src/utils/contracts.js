// 合约地址配置
// 支持环境变量覆盖，便于不同环境部署
export const CONTRACTS = {
  ESCROW: process.env.REACT_APP_ESCROW_ADDRESS || '0xF0A7b71FB5f28a702A2B8d485390117cE229beA2',
  USDC: process.env.REACT_APP_USDC_ADDRESS || '0x8410f9Cf462C4dCc9Fb97971fe65F8D711Fa3F96'
};

// 当前网络
export const CURRENT_NETWORK = process.env.REACT_APP_NETWORK || 'sepolia';

// 是否为测试网
export const IS_TESTNET = CURRENT_NETWORK !== 'mainnet';

// 网络配置
export const NETWORKS = {
  SEPOLIA: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/YOUR-KEY',
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};

// Escrow合约ABI
export const ESCROW_ABI = [
  // 读取函数
  "function projects(uint256) view returns (uint256 id, string name, string description, string diseaseType, address creator, address[] teamMembers, uint256 goalAmount, uint256 raisedAmount, uint8 status, uint256 createdAt)",
  "function projectCounter() view returns (uint256)",
  "function projectBalances(uint256) view returns (uint256)",

  // 里程碑读取函数
  "function milestoneCount() view returns (uint256)",
  "function milestones(uint256) view returns (string description, uint256 amount, bool completed, bool fundsReleased)",
  "function getMilestone(uint256 milestoneId) view returns (string description, uint256 amount, bool completed, bool fundsReleased)",
  "function totalReleased() view returns (uint256)",
  "function scientist() view returns (address)",
  "function owner() view returns (address)",

  // 写入函数
  "function donate(uint256 projectId, uint256 amount)",
  "function createProject(string name, string description, string diseaseType, address[] teamMembers, uint256 goalAmount) returns (uint256)",

  // 里程碑管理函数（仅owner）
  "function addMilestone(string description, uint256 amount)",
  "function completeMilestone(uint256 milestoneId)",
  "function releaseFunds(uint256 milestoneId)",

  // 事件
  "event ProjectCreated(uint256 indexed projectId, string name, address creator, uint256 goalAmount)",
  "event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount)",
  "event MilestoneCompleted(uint256 indexed milestoneId, string description)",
  "event FundsReleased(uint256 indexed milestoneId, address indexed scientist, uint256 amount)"
];

// USDC合约ABI
export const USDC_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function mint(address to, uint256 amount)",
  "function transfer(address to, uint256 amount) returns (bool)"
];