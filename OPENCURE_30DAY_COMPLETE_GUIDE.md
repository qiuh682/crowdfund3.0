# 🔓 OpenCure - 30天精简学习计划
# OpenCure 30-Day Accelerated Learning Plan

**完整版 · 每日详解 · 建房子比喻**

---

## 📋 总览 - 我们在建造什么？

想象你要**建一栋房子**：
- **Week 1-2 (Day 1-14)**: 打地基、建框架（智能合约 = 房子的结构）
- **Week 3 (Day 15-21)**: 装修外观（前端界面 = 房子的外观和内部装修）
- **Week 4 (Day 22-30)**: 连接水电、测试入住（连接合约、测试、部署）

---

# 📘 Week 1: 智能合约地基 (Day 1-7)
## Building the Foundation / 打地基

---

## 📅 Day 1: 开发环境搭建 (2小时)
### 🏗️ 建房比喻：购买工具和材料

**今天在做什么？**
准备所有需要的工具，就像盖房子前要准备锤子、电钻、水泥一样。

### 为什么需要这些工具？

| 工具 | 作用 | 建房比喻 |
|------|------|----------|
| **Node.js** | JavaScript运行环境 | 电力系统（让所有工具能运转） |
| **npm** | 包管理器 | 五金店（获取其他工具） |
| **VS Code** | 代码编辑器 | 工作台（你工作的地方） |
| **MetaMask** | 钱包插件 | 银行账户（存钱和付款） |

### 📝 详细操作步骤

#### Step 1: 安装 Node.js
```bash
# 访问 https://nodejs.org
# 下载 LTS 版本（长期支持版）
# 安装后验证：
node -v    # 应该显示 v18.x.x 或更高
npm -v     # 应该显示 9.x.x 或更高
```

**为什么？** Node.js让你的电脑能运行JavaScript，npm让你能下载别人写好的代码包。

#### Step 2: 安装 VS Code
```bash
# 访问 https://code.visualstudio.com
# 下载并安装
# 安装扩展：
# - Solidity (智能合约语法高亮)
# - ES7+ React/Redux snippets (React代码片段)
```

**为什么？** VS Code是最好用的代码编辑器，有自动提示、错误检查等功能。

#### Step 3: 安装 MetaMask
```bash
# 1. 打开Chrome浏览器
# 2. 访问 https://metamask.io
# 3. 点击 "Download" → 安装浏览器扩展
# 4. 创建钱包 → 保存助记词（12个单词）
```

**为什么？** MetaMask是你的数字钱包，用来存加密货币和与区块链交互。

#### Step 4: 获取测试币
```bash
# 1. 在MetaMask切换到Sepolia测试网
# 2. 复制你的钱包地址
# 3. 访问 https://sepoliafaucet.com
# 4. 粘贴地址，获取测试ETH
```

**为什么？** 测试网的币是假钱，用来测试你的程序，不花真钱。

### ✅ Day 1 检查清单
- [ ] Node.js 安装成功 (node -v 有输出)
- [ ] VS Code 安装成功
- [ ] MetaMask 已创建钱包
- [ ] 获得了 Sepolia 测试 ETH

---

## 📅 Day 2: 创建第一个代币 (3小时)
### 🏗️ 建房比喻：制作第一块砖

**今天在做什么？**
创建一个简单的ERC20代币（类似"发行自己的货币"）

### 为什么要做代币？

**ERC20代币** = 标准化的数字货币
- 就像USD是美元标准，ERC20是以太坊上的代币标准
- 你的项目会用它来接受捐赠（USDC是一种ERC20）

### 📝 详细操作步骤

#### Step 1: 创建项目文件夹
```bash
# 打开终端
mkdir my-hardhat-project    # 创建文件夹
cd my-hardhat-project        # 进入文件夹
```

**为什么？** 需要一个专门的文件夹来组织所有代码。

#### Step 2: 初始化项目
```bash
npm init -y    # 创建 package.json（项目说明书）
```

**package.json 是什么？**
就像产品说明书，记录了：
- 项目名称
- 需要哪些依赖包
- 运行命令

#### Step 3: 安装 Hardhat
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

**Hardhat 是什么？**
| 功能 | 建房比喻 |
|------|----------|
| 编译合约 | 把设计图变成实际材料 |
| 测试合约 | 检查质量 |
| 部署合约 | 把房子建在地上 |

**为什么选Hardhat？** 它是最流行的智能合约开发工具。

#### Step 4: 初始化 Hardhat
```bash
npx hardhat init
# 选择 "Create a JavaScript project"
# 按回车接受所有默认选项
```

**会创建什么？**
```
my-hardhat-project/
├── contracts/        ← 智能合约代码（设计图）
├── scripts/          ← 部署脚本（施工指令）
├── test/             ← 测试文件（质量检查）
├── hardhat.config.js ← 配置文件（项目设置）
└── package.json
```

#### Step 5: 安装 OpenZeppelin
```bash
npm install @openzeppelin/contracts
```

**OpenZeppelin 是什么？**
预制的、经过安全审计的智能合约模板。

**建房比喻：** 
- 不用自己烧砖，直接买标准砖
- OpenZeppelin = 建材超市，提供标准组件

**为什么用它？**
- ✅ 安全（被全球数百万项目使用）
- ✅ 省时（不用从零写代码）
- ✅ 标准（符合ERC20等标准）

#### Step 6: 创建代币合约
```bash
# 创建文件 contracts/MyToken.sol
```

**复制这个代码：**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * MyToken - 你的第一个代币
 * 
 * 这个合约做什么？
 * 1. 创建一个名为 MyToken (MTK) 的代币
 * 2. 初始发行 100万 个代币
 * 3. 只有owner可以发行更多代币
 */
contract MyToken is ERC20, Ownable {
    // 构造函数 - 创建合约时运行
    constructor(uint256 initialSupply) 
        ERC20("MyToken", "MTK")          // 名称和符号
        Ownable(msg.sender)               // 设置创建者为owner
    {
        // 发行初始代币给创建者
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
    
    // 发行新代币 - 只有owner可以调用
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    // 销毁代币 - 任何人都可以销毁自己的代币
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
```

**代码详解：**

| 代码部分 | 作用 | 建房比喻 |
|----------|------|----------|
| `import` | 导入OpenZeppelin | 从建材店买砖 |
| `is ERC20, Ownable` | 继承功能 | 使用标准模板 |
| `constructor` | 初始化 | 打地基 |
| `_mint` | 创建代币 | 制造砖块 |
| `onlyOwner` | 权限控制 | 只有房主能开门 |

#### Step 7: 编译合约
```bash
npx hardhat compile
```

**会发生什么？**
```
编译中... 
✅ Compiled 1 Solidity file successfully
```

**建房比喻：** 把设计图变成可以施工的材料清单。

**编译产生什么？**
- ABI (Application Binary Interface) = 使用说明书
- Bytecode = 机器能读懂的代码

#### Step 8: 创建测试文件
```bash
# 创建 test/MyToken.test.js
```

**复制这个测试代码：**
```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let token;
  let owner;
  let addr1;

  // 每个测试前运行
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy(1000000); // 发行100万
    await token.waitForDeployment();
  });

  it("应该有正确的名称和符号", async function () {
    expect(await token.name()).to.equal("MyToken");
    expect(await token.symbol()).to.equal("MTK");
  });

  it("应该给owner铸造初始供应", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    const totalSupply = await token.totalSupply();
    expect(ownerBalance).to.equal(totalSupply);
  });

  it("应该能转账代币", async function () {
    // 转100个代币给addr1
    await token.transfer(addr1.address, 100);
    expect(await token.balanceOf(addr1.address)).to.equal(100);
  });
});
```

**测试是什么？**
就像建房子要检查质量：
- ✅ 墙是不是直的？
- ✅ 门能不能开？
- ✅ 水管会不会漏？

#### Step 9: 运行测试
```bash
npx hardhat test
```

**期望输出：**
```
MyToken
  ✔ 应该有正确的名称和符号
  ✔ 应该给owner铸造初始供应
  ✔ 应该能转账代币

3 passing (2s)
```

### 🎓 Day 2 学到了什么？

**核心概念：**
1. **ERC20** = 代币标准（就像USB接口标准）
2. **Solidity** = 智能合约编程语言（建筑设计语言）
3. **继承 (is)** = 复用代码（使用标准模板）
4. **构造函数** = 初始化（打地基）
5. **修饰符 (onlyOwner)** = 权限控制（门锁）

### ✅ Day 2 检查清单
- [ ] Hardhat 项目创建成功
- [ ] MyToken.sol 编译通过
- [ ] 所有测试都通过
- [ ] 理解了 ERC20 的作用

---

## 📅 Day 3-4: 托管合约基础 (6小时)
### 🏗️ 建房比喻：建造主体结构（客厅、卧室）

**今天在做什么？**
创建托管合约 = 建一个"银行保险箱"，安全地管理捐款。

### 为什么需要托管合约？

**问题场景：**
```
❌ 传统方式：
患者 → 直接给钱 → 科学家
       ↑
       问题：没有监督，钱可能被乱用
```

**区块链方式：**
```
✅ 智能合约托管：
患者 → 钱存入合约 → 达成里程碑 → 自动释放给科学家
            ↓
         透明、可追踪
```

### 托管合约要实现什么？

| 功能 | 建房比喻 | 为什么需要 |
|------|----------|------------|
| 创建项目 | 建一个房间 | 每个研究项目独立管理 |
| 接受捐赠 | 收钱箱 | 让人能捐款 |
| 记录捐赠 | 账本 | 透明可查 |
| 提取资金 | ATM | 科学家能用钱 |

### 📝 详细操作步骤

#### Step 1: 理解数据结构

**创建 contracts/OpenCureEscrow.sol**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * OpenCureEscrow - 罕见病研究众筹托管合约
 * 
 * 核心功能：
 * 1. 创建研究项目
 * 2. 接受USDC捐赠
 * 3. 管理项目资金
 */
contract OpenCureEscrow is Ownable, ReentrancyGuard {
    
    // ========== 数据结构 ==========
    
    // 项目状态枚举
    enum ProjectStatus {
        Active,      // 活跃 - 正在筹款
        Paused,      // 暂停 - 临时停止
        Completed,   // 完成
        Cancelled    // 取消
    }
    
    // 项目结构体 - 就像一张表格
    struct Project {
        uint256 id;              // ID（唯一编号）
        string name;             // 名称
        string description;      // 描述
        string diseaseType;      // 疾病类型
        address creator;         // 创建者地址
        address[] teamMembers;   // 团队成员
        uint256 goalAmount;      // 目标金额
        uint256 raisedAmount;    // 已筹金额
        ProjectStatus status;    // 状态
        uint256 createdAt;       // 创建时间
    }
    
    // 捐赠记录
    struct Donation {
        address donor;           // 捐赠者
        uint256 amount;          // 金额
        uint256 timestamp;       // 时间戳
    }
    
    // ========== 状态变量 ==========
    
    IERC20 public usdcToken;                    // USDC代币合约
    uint256 public projectCounter;               // 项目计数器
    
    // 映射：ID → 项目
    mapping(uint256 => Project) public projects;
    
    // 映射：项目ID → 捐赠数组
    mapping(uint256 => Donation[]) public projectDonations;
    
    // 映射：项目ID → 余额
    mapping(uint256 => uint256) public projectBalances;
    
    // ========== 事件 ==========
    
    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        address creator,
        uint256 goalAmount
    );
    
    event DonationReceived(
        uint256 indexed projectId,
        address indexed donor,
        uint256 amount
    );
    
    // ========== 构造函数 ==========
    
    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
    }
}
```

**代码详解：**

**1. 为什么用 struct（结构体）？**
```
想象一张表格：
┌────┬──────┬────────┬──────┐
│ ID │ 名称  │ 创建者  │ 金额  │
├────┼──────┼────────┼──────┤
│ 1  │ DMD  │ 0x123  │ 10万 │
│ 2  │ ALS  │ 0x456  │ 20万 │
└────┴──────┴────────┴──────┘

struct Project = 表格的一行
```

**2. 为什么用 mapping？**
```
mapping 就像一个字典：

projectBalances[1] = 50000
projectBalances[2] = 30000
         ↑              ↑
       项目ID         余额

查询：给我项目1的余额？
答：50000
```

**3. 为什么用 event（事件）？**
```
事件 = 留下记录

就像银行交易记录：
2026-01-09 10:30 - 张三转账100元
2026-01-09 11:00 - 李四转账200元

区块链上：
emit DonationReceived(1, 0x123, 100);
     ↑            ↑    ↑      ↑
   什么事件     项目  捐赠者   金额
```

#### Step 2: 实现创建项目功能

**添加到合约：**
```solidity
    // ========== 核心功能 ==========
    
    /**
     * 创建项目
     * 
     * 参数：
     * - _name: 项目名称
     * - _description: 项目描述  
     * - _diseaseType: 疾病类型
     * - _teamMembers: 团队成员地址数组
     * - _goalAmount: 目标金额（USDC，6位小数）
     */
    function createProject(
        string memory _name,
        string memory _description,
        string memory _diseaseType,
        address[] memory _teamMembers,
        uint256 _goalAmount
    ) external returns (uint256) {
        // 验证输入
        require(bytes(_name).length > 0, "Name required");
        require(_goalAmount > 0, "Goal must be > 0");
        
        // 项目计数器+1
        projectCounter++;
        
        // 创建新项目
        Project storage newProject = projects[projectCounter];
        newProject.id = projectCounter;
        newProject.name = _name;
        newProject.description = _description;
        newProject.diseaseType = _diseaseType;
        newProject.creator = msg.sender;
        newProject.teamMembers = _teamMembers;
        newProject.goalAmount = _goalAmount;
        newProject.raisedAmount = 0;
        newProject.status = ProjectStatus.Active;
        newProject.createdAt = block.timestamp;
        
        // 发出事件
        emit ProjectCreated(projectCounter, _name, msg.sender, _goalAmount);
        
        return projectCounter;
    }
```

**这段代码做了什么？**

```
1. 检查输入 (require)
   └─ 就像检查材料质量
   
2. projectCounter++
   └─ 给新项目分配编号
   
3. 创建项目 (Project storage)
   └─ 在区块链上存储数据
   
4. 发出事件 (emit)
   └─ 留下记录
```

**为什么用 storage？**
```
memory vs storage

memory = 临时变量（草稿纸）
  - 函数结束后消失
  - 便宜

storage = 永久存储（刻在石头上）
  - 永久保存在区块链
  - 贵！但必须用
```

#### Step 3: 实现捐赠功能

```solidity
    /**
     * 捐赠
     * 
     * 流程：
     * 1. 用户先approve USDC给合约
     * 2. 合约从用户转走USDC
     * 3. 记录捐赠
     * 4. 更新项目余额
     */
    function donate(uint256 _projectId, uint256 _amount)
        external
        nonReentrant  // 防重入攻击
    {
        // 验证
        require(_projectId > 0 && _projectId <= projectCounter, "Invalid project");
        require(_amount > 0, "Amount must be > 0");
        require(projects[_projectId].status == ProjectStatus.Active, "Project not active");
        
        // 从捐赠者转账USDC到合约
        require(
            usdcToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        // 更新项目余额和筹款总额
        projectBalances[_projectId] += _amount;
        projects[_projectId].raisedAmount += _amount;
        
        // 记录捐赠
        projectDonations[_projectId].push(Donation({
            donor: msg.sender,
            amount: _amount,
            timestamp: block.timestamp
        }));
        
        // 发出事件
        emit DonationReceived(_projectId, msg.sender, _amount);
    }
```

**ERC20转账的两步流程：**

```
步骤1: Approve (批准)
用户 → USDC合约: "我允许OpenCure合约转走100 USDC"

步骤2: TransferFrom (转账)
OpenCure合约 → USDC合约: "把用户的100 USDC转给我"
```

**为什么要两步？**
- 安全！用户明确授权
- 就像银行：你要先授权，银行才能扣款

**nonReentrant 是什么？**
```
重入攻击：
黑客 → 捐赠 → 合约
         ↓
      正在处理...
         ↓
黑客 → 再次捐赠！(在第一次还没完成时)
         ↓
      钱被重复计算！

nonReentrant = 门锁
第一个人进来时锁门，出去后才解锁
```

#### Step 4: 实现提取功能

```solidity
    /**
     * 提取资金
     * 只有项目创建者可以提取
     */
    function withdrawFunds(uint256 _projectId, uint256 _amount)
        external
        nonReentrant
    {
        require(msg.sender == projects[_projectId].creator, "Not creator");
        require(_amount > 0, "Amount must be > 0");
        require(projectBalances[_projectId] >= _amount, "Insufficient balance");
        
        // 更新余额
        projectBalances[_projectId] -= _amount;
        
        // 转账
        require(
            usdcToken.transfer(msg.sender, _amount),
            "Transfer failed"
        );
    }
```

### 🎓 Day 3-4 学到了什么？

**核心概念：**

1. **Struct（结构体）**
   - 组织复杂数据
   - 就像数据库表的一行

2. **Mapping（映射）**
   - 键值对存储
   - 快速查询

3. **Event（事件）**
   - 留下不可篡改的记录
   - 前端可以监听

4. **Modifier（修饰符）**
   - 函数的"门卫"
   - 控制权限

5. **ReentrancyGuard**
   - 防止重入攻击
   - 安全必备

### ✅ Day 3-4 检查清单
- [ ] OpenCureEscrow.sol 创建完成
- [ ] 理解了 struct 和 mapping
- [ ] 理解了 approve/transferFrom 流程
- [ ] 合约编译通过

---

## 📅 Day 5-6: 合约测试 (4小时)
### 🏗️ 建房比喻：质量检测

**今天在做什么？**
测试所有功能，确保合约安全可靠。

### 为什么测试很重要？

```
智能合约一旦部署：
✅ 代码永久上链
❌ 不能修改
❌ 不能撤回

所以必须：
🧪 测试 → 测试 → 再测试！
```

### 📝 测试代码

**创建 test/OpenCureEscrow.test.js**

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OpenCureEscrow 完整测试", function () {
  let escrow, usdc;
  let owner, creator, donor1, donor2;

  beforeEach(async function () {
    // 获取账户
    [owner, creator, donor1, donor2] = await ethers.getSigners();

    // 部署测试USDC
    const Token = await ethers.getContractFactory("MyToken");
    usdc = await Token.deploy(1000000);
    await usdc.waitForDeployment();

    // 分发USDC给捐赠者
    await usdc.transfer(donor1.address, ethers.parseUnits("100000", 18));
    await usdc.transfer(donor2.address, ethers.parseUnits("100000", 18));

    // 部署托管合约
    const Escrow = await ethers.getContractFactory("OpenCureEscrow");
    escrow = await Escrow.deploy(await usdc.getAddress());
    await escrow.waitForDeployment();
  });

  describe("项目创建", function () {
    it("应该能创建项目", async function () {
      await escrow.connect(creator).createProject(
        "DMD Research",
        "Researching Duchenne Muscular Dystrophy",
        "Neuromuscular",
        [creator.address],
        ethers.parseUnits("100000", 6)
      );

      const project = await escrow.projects(1);
      expect(project.name).to.equal("DMD Research");
      expect(project.creator).to.equal(creator.address);
    });

    it("应该拒绝空名称", async function () {
      await expect(
        escrow.createProject("", "Desc", "Type", [], 10000)
      ).to.be.revertedWith("Name required");
    });
  });

  describe("捐赠功能", function () {
    beforeEach(async function () {
      await escrow.connect(creator).createProject(
        "Test Project", "Desc", "Type", [], ethers.parseUnits("10000", 6)
      );
    });

    it("应该能接受捐赠", async function () {
      const amount = ethers.parseUnits("1000", 18);
      
      await usdc.connect(donor1).approve(await escrow.getAddress(), amount);
      await escrow.connect(donor1).donate(1, amount);

      const balance = await escrow.projectBalances(1);
      expect(balance).to.equal(amount);
    });

    it("应该拒绝未approve的捐赠", async function () {
      const amount = ethers.parseUnits("1000", 18);
      
      await expect(
        escrow.connect(donor1).donate(1, amount)
      ).to.be.reverted;
    });
  });
});
```

**测试的黄金法则：**

```
1. 测试正常情况
   ✅ 能创建项目吗？
   ✅ 能捐赠吗？

2. 测试边界情况
   ❌ 空名称能创建吗？（应该拒绝）
   ❌ 负数金额能捐吗？（应该拒绝）

3. 测试权限
   ❌ 非创建者能提现吗？（应该拒绝）
```

### 运行测试

```bash
npx hardhat test
```

**期望看到：**
```
OpenCureEscrow 完整测试
  项目创建
    ✔ 应该能创建项目
    ✔ 应该拒绝空名称
  捐赠功能
    ✔ 应该能接受捐赠
    ✔ 应该拒绝未approve的捐赠

4 passing (3s)
```

### ✅ Day 5-6 检查清单
- [ ] 所有测试通过
- [ ] 理解了测试的重要性
- [ ] 知道如何写测试

---

## 📅 Day 7: 部署到测试网 (2小时)
### 🏗️ 建房比喻：在真实土地上建房

**今天在做什么？**
把合约部署到Sepolia测试网（模拟真实环境）

### 为什么要部署到测试网？

```
本地测试网 vs Sepolia测试网

本地（Hardhat）：
✅ 快速
✅ 免费
❌ 只有你能访问
❌ 和真实环境有差异

Sepolia：
✅ 接近真实以太坊
✅ 其他人可以访问
✅ 可以用MetaMask连接
⚠️ 需要测试币（免费获取）
```

### 📝 详细操作

#### Step 1: 配置 Hardhat

**编辑 hardhat.config.js**
```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

#### Step 2: 创建 .env 文件

```bash
# 安装 dotenv
npm install dotenv

# 创建 .env 文件
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-KEY
PRIVATE_KEY=你的MetaMask私钥
```

**⚠️ 如何获取私钥？**
```
1. 打开MetaMask
2. 点击账户详情
3. 导出私钥
4. ⚠️ 永远不要分享给别人！
```

#### Step 3: 创建部署脚本

**创建 scripts/deploy.js**
```javascript
const hre = require("hardhat");

async function main() {
  console.log("部署中...");

  // 1. 部署测试USDC
  const Token = await hre.ethers.getContractFactory("MyToken");
  const usdc = await Token.deploy(1000000);
  await usdc.waitForDeployment();
  console.log("USDC:", await usdc.getAddress());

  // 2. 部署OpenCureEscrow
  const Escrow = await hre.ethers.getContractFactory("OpenCureEscrow");
  const escrow = await Escrow.deploy(await usdc.getAddress());
  await escrow.waitForDeployment();
  console.log("Escrow:", await escrow.getAddress());

  // 保存地址
  const fs = require('fs');
  fs.writeFileSync('deployed-addresses.json', JSON.stringify({
    usdc: await usdc.getAddress(),
    escrow: await escrow.getAddress()
  }, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

#### Step 4: 部署！

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**会输出：**
```
部署中...
USDC: 0x1234...
Escrow: 0x5678...
```

**🎉 恭喜！你的合约已经在测试网上了！**

### ✅ Day 7 检查清单
- [ ] 合约部署到Sepolia
- [ ] 保存了合约地址
- [ ] 可以在Etherscan查看

---

# 📘 Week 2: 前端开发 (Day 8-14)
## Building the User Interface / 建造用户界面

---

## 📅 Day 8-9: React项目搭建 (4小时)
### 🏗️ 建房比喻：装修外观

**今天在做什么？**
创建网页界面，让用户能看到和使用你的DApp

### 为什么用React？

| 工具 | 作用 | 建房比喻 |
|------|------|----------|
| **HTML** | 结构 | 墙和房间 |
| **CSS** | 样式 | 油漆和装饰 |
| **JavaScript** | 交互 | 电灯开关 |
| **React** | 组件化 | 预制墙板（模块化） |

### React的核心优势

```
传统方式：
每个页面都要重新写HTML
❌ 重复代码多
❌ 难以维护

React方式：
写一次 Header组件
✅ 到处复用
✅ 修改一次，全部更新
```

### 📝 详细操作

#### Step 1: 创建React项目

```bash
# 使用Create React App（最稳定）
npx create-react-app opencure-frontend

cd opencure-frontend
```

**为什么用Create React App？**
- ✅ 官方推荐
- ✅ 配置好了所有工具
- ✅ 不容易出错

#### Step 2: 安装依赖

```bash
# React Router - 页面路由
npm install react-router-dom

# Ethers.js - 连接区块链
npm install ethers

# 其他工具
npm install react-hot-toast
```

**每个包的作用：**

| 包 | 作用 | 建房比喻 |
|----|------|----------|
| react-router-dom | 页面跳转 | 房间之间的门 |
| ethers | 连接区块链 | 连接水电 |
| react-hot-toast | 提示消息 | 通知系统 |

#### Step 3: 理解项目结构

```
opencure-frontend/
├── public/              ← 静态文件（图片等）
├── src/
│   ├── components/      ← 可复用组件
│   │   ├── Header.jsx   ← 顶部导航
│   │   └── Footer.jsx   ← 底部
│   ├── pages/           ← 页面组件
│   │   ├── Home.jsx     ← 主页
│   │   └── Projects.jsx ← 项目列表
│   ├── App.jsx          ← 主应用
│   └── index.js         ← 入口文件
└── package.json         ← 配置文件
```

**建房比喻：**
```
components/ = 预制组件（门、窗、柜子）
pages/ = 房间（客厅、卧室、厨房）
App.jsx = 总设计图
```

#### Step 4: 创建基础组件

**创建 src/components/Header.jsx**
```jsx
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{
      background: '#0f2027',
      padding: '1rem 2rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        <h1>🔓 OpenCure</h1>
      </Link>
      
      <nav style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/projects" style={{ color: 'white' }}>
          Projects
        </Link>
        <Link to="/create" style={{ color: 'white' }}>
          Create
        </Link>
      </nav>
      
      <button style={{
        background: '#FF9800',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Connect Wallet
      </button>
    </header>
  );
}
```

**这段代码做了什么？**

```
1. 显示Logo
   └─ 🔓 OpenCure

2. 导航链接
   └─ Projects, Create

3. 连接钱包按钮
   └─ 后面会连接MetaMask
```

#### Step 5: 创建主页

**创建 src/pages/Home.jsx**
```jsx
export default function Home() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem' }}>
        🔓 Welcome to OpenCure
      </h1>
      <h2 style={{ color: '#666' }}>
        Accelerating Rare Disease Research Through Transparency
      </h2>
      <p style={{ fontSize: '1.2rem', marginTop: '2rem' }}>
        连接全球患者、科学家和资助者
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        marginTop: '3rem'
      }}>
        <div style={cardStyle}>
          <h3>0</h3>
          <p>Active Projects</p>
        </div>
        <div style={cardStyle}>
          <h3>$0</h3>
          <p>Total Raised</p>
        </div>
        <div style={cardStyle}>
          <h3>0</h3>
          <p>Donors</p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: 'white',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};
```

#### Step 6: 配置路由

**编辑 src/App.jsx**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Projects from './pages/Projects';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

**路由是什么？**
```
URL                    显示的页面
/                  →   Home.jsx (主页)
/projects          →   Projects.jsx (项目列表)
/projects/1        →   ProjectDetail.jsx (项目详情)

就像房间标签：
门上写"客厅" → 进去是客厅
门上写"卧室" → 进去是卧室
```

#### Step 7: 启动项目

```bash
npm start
```

**应该看到：**
```
Compiled successfully!

You can now view opencure-frontend in the browser.

  Local:            http://localhost:3000
```

**在浏览器打开 http://localhost:3000**

### 🎓 Day 8-9 学到了什么？

**核心概念：**

1. **组件化**
   ```
   传统: 每个页面重复写Header
   React: Header组件到处复用
   ```

2. **JSX**
   ```
   HTML + JavaScript = JSX
   
   可以在HTML里写JavaScript：
   <h1>{projectName}</h1>
   ```

3. **Props（属性）**
   ```
   传递数据给组件
   
   <ProjectCard 
     name="DMD Research"
     goal="$100,000"
   />
   ```

4. **路由**
   ```
   不同URL显示不同页面
   无需重新加载页面
   ```

### ✅ Day 8-9 检查清单
- [ ] React项目运行成功
- [ ] 能看到主页
- [ ] Header显示正常
- [ ] 能点击导航链接

---

## 📅 Day 10-11: 连接钱包 (4小时)
### 🏗️ 建房比喻：连接水电系统

**今天在做什么？**
连接MetaMask钱包，让用户能登录和交易

### 为什么需要连接钱包？

```
Web2 (传统网站)：
用户名 + 密码 → 登录

Web3 (区块链应用)：
钱包地址 → 登录
           + 身份验证
           + 支付工具
```

### Ethers.js 是什么？

```
Ethers.js = 区块链的"翻译官"

你的网站 ← ethers.js → 区块链
  (JavaScript)           (Solidity)

就像：
中国人 ← 翻译 → 美国人
```

### 📝 详细操作

#### Step 1: 创建Web3Context

**创建 src/context/Web3Context.jsx**
```jsx
import { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

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
```

**代码详解：**

**1. Context是什么？**
```
Context = 全局状态管理

不用Context:
App → Header → Button
    ↓  需要层层传递account

用Context:
任何组件都能直接访问account
```

**2. Provider, Signer是什么？**
```
Provider = 只读连接
  - 查询余额
  - 读取合约数据

Signer = 可写连接
  - 发送交易
  - 调用合约函数
  - 需要签名
```

#### Step 2: 使用Context

**修改 src/App.jsx**
```jsx
import { Web3Provider } from './context/Web3Context';

function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* ... */}
        </Routes>
      </BrowserRouter>
    </Web3Provider>
  );
}
```

#### Step 3: 修改Header使用钱包

**修改 src/components/Header.jsx**
```jsx
import { useWeb3 } from '../context/Web3Context';

export default function Header() {
  const { account, connectWallet, isConnected } = useWeb3();

  return (
    <header style={headerStyle}>
      {/* ... Logo和导航 ... */}
      
      {!isConnected ? (
        <button onClick={connectWallet} style={buttonStyle}>
          Connect Wallet
        </button>
      ) : (
        <div style={{ color: 'white' }}>
          {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      )}
    </header>
  );
}
```

**这段代码做了什么？**

```
未连接状态:
显示 "Connect Wallet" 按钮

已连接状态:
显示地址: 0x1234...5678
```

#### Step 4: 测试连接

```bash
1. 启动应用: npm start
2. 点击 "Connect Wallet"
3. MetaMask弹出
4. 点击 "连接"
5. 看到地址显示 ✅
```

### 🎓 Day 10-11 学到了什么？

**核心概念：**

1. **window.ethereum**
   ```
   MetaMask注入的对象
   让网页能访问钱包
   ```

2. **Provider vs Signer**
   ```
   Provider = 读
   Signer = 写
   ```

3. **Context API**
   ```
   全局状态管理
   避免prop drilling
   ```

### ✅ Day 10-11 检查清单
- [ ] MetaMask连接成功
- [ ] 能看到钱包地址
- [ ] 切换账户时地址更新

---

## 📅 Day 12-13: 连接智能合约 (4小时)
### 🏗️ 建房比喻：连接门和锁

**今天在做什么？**
让前端能调用智能合约的函数

### 需要什么？

1. **合约地址** - 合约在哪里
2. **ABI** - 合约的"使用说明书"

### ABI 是什么？

```
ABI = Application Binary Interface
    = 合约的说明书

告诉你：
- 有哪些函数？
- 参数是什么类型？
- 返回什么值？

就像：
产品说明书告诉你怎么使用产品
```

### 📝 详细操作

#### Step 1: 准备合约信息

**创建 src/utils/contracts.js**
```javascript
// 合约地址（从部署时获得）
export const CONTRACTS = {
  ESCROW: '0x你的Escrow合约地址',
  USDC: '0x你的USDC合约地址'
};

// ABI - 从编译产物复制
// artifacts/contracts/OpenCureEscrow.sol/OpenCureEscrow.json
export const ESCROW_ABI = [
  "function createProject(string,string,string,address[],uint256) returns(uint256)",
  "function donate(uint256,uint256)",
  "function projects(uint256) view returns(tuple)",
  // ... 更多函数
];
```

**如何获取ABI？**
```bash
# 编译后生成的文件
cat artifacts/contracts/OpenCureEscrow.sol/OpenCureEscrow.json

# 复制 "abi" 部分
```

#### Step 2: 创建useContract Hook

**创建 src/hooks/useContract.js**
```javascript
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACTS, ESCROW_ABI } from '../utils/contracts';

export function useContract() {
  const { signer } = useWeb3();

  const getEscrowContract = () => {
    if (!signer) return null;
    return new ethers.Contract(
      CONTRACTS.ESCROW,
      ESCROW_ABI,
      signer
    );
  };

  return { getEscrowContract };
}
```

**Hook是什么？**
```
Hook = 可复用的逻辑

use开头的函数
封装常用功能

useContract = 获取合约实例
useWallet = 管理钱包状态
```

#### Step 3: 创建项目列表页面

**创建 src/pages/Projects.jsx**
```jsx
import { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getEscrowContract } = useContract();

  // 加载项目
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const contract = getEscrowContract();
      if (!contract) return;

      // 调用合约函数
      const counter = await contract.projectCounter();
      
      const projectList = [];
      for (let i = 1; i <= counter; i++) {
        const project = await contract.projects(i);
        projectList.push({
          id: i,
          name: project.name,
          description: project.description,
          goal: project.goalAmount,
          raised: project.raisedAmount
        });
      }

      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Research Projects</h1>
      <div style={{ display: 'grid', gap: '2rem' }}>
        {projects.map(project => (
          <div key={project.id} style={cardStyle}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div>
              <strong>${project.raised.toString()}</strong>
              {' '} of ${project.goal.toString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  background: 'white',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};
```

**这段代码做了什么？**

```
1. useEffect(() => {}, [])
   └─ 组件加载时执行
   └─ 就像房子建好后通电

2. contract.projectCounter()
   └─ 调用智能合约函数
   └─ 读取区块链数据

3. setProjects(projectList)
   └─ 更新页面显示
   └─ 触发重新渲染
```

#### Step 4: 创建捐赠功能

**创建 src/components/DonationForm.jsx**
```jsx
import { useState } from 'react';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';
import toast from 'react-hot-toast';

export default function DonationForm({ projectId }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { getEscrowContract } = useContract();

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter valid amount');
      return;
    }

    try {
      setLoading(true);
      
      const contract = getEscrowContract();
      const usdcAmount = ethers.parseUnits(amount, 6);

      // Step 1: Approve USDC
      toast.loading('Step 1/2: Approving USDC...');
      // ... approve logic ...

      // Step 2: Donate
      toast.loading('Step 2/2: Donating...');
      const tx = await contract.donate(projectId, usdcAmount);
      await tx.wait();

      toast.success('Donation successful! 🎉');
      setAmount('');
    } catch (error) {
      console.error(error);
      toast.error('Donation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formStyle}>
      <h3>Make a Donation</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in USDC"
        style={inputStyle}
      />
      <button
        onClick={handleDonate}
        disabled={loading}
        style={buttonStyle}
      >
        {loading ? 'Processing...' : 'Donate Now'}
      </button>
    </div>
  );
}
```

**交易流程：**

```
1. 用户输入金额
   ↓
2. 前端调用合约
   ↓
3. MetaMask弹出确认
   ↓
4. 用户签名确认
   ↓
5. 交易发送到区块链
   ↓
6. 等待确认（挖矿）
   ↓
7. 交易成功 ✅
```

### 🎓 Day 12-13 学到了什么？

**核心概念：**

1. **合约实例化**
   ```javascript
   new ethers.Contract(
     address,  // 合约地址
     abi,      // 接口定义
     signer    // 签名者
   )
   ```

2. **读vs写**
   ```
   读取（view函数）:
   - 免费
   - 立即返回
   const name = await contract.name()

   写入（transaction）:
   - 消耗gas
   - 需要确认
   const tx = await contract.donate()
   await tx.wait()  // 等待确认
   ```

3. **异步处理**
   ```javascript
   async/await = 等待异步操作完成
   
   await contract.donate()
   ↓
   等待交易确认后继续
   ```

### ✅ Day 12-13 检查清单
- [ ] 能读取合约数据
- [ ] 能显示项目列表
- [ ] 能发送捐赠交易
- [ ] MetaMask正常弹出

---

## 📅 Day 14: 完善UI (2小时)
### 🏗️ 建房比喻：精装修

**今天在做什么？**
美化界面，添加加载状态、错误处理

### 用户体验的关键

```
好的UI:
✅ 加载时显示Loading
✅ 成功时显示提示
✅ 失败时显示错误
✅ 按钮有禁用状态

差的UI:
❌ 点击后没反应
❌ 不知道是否成功
❌ 错误信息不清楚
```

### 📝 添加Loading状态

```jsx
import { useState } from 'react';

function MyComponent() {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button disabled={loading}>
      {loading ? 'Loading...' : 'Click Me'}
    </button>
  );
}
```

### 添加错误处理

```jsx
try {
  await contract.donate(projectId, amount);
  toast.success('Success!');
} catch (error) {
  if (error.code === 'ACTION_REJECTED') {
    toast.error('User rejected transaction');
  } else {
    toast.error('Transaction failed');
  }
}
```

### ✅ Day 14 检查清单
- [ ] 所有按钮有loading状态
- [ ] 成功/失败都有提示
- [ ] 界面美观整洁

---

# 📘 Week 3-4: 高级功能 (Day 15-30)
## Advanced Features / 高级功能

---

## 📅 Day 15-17: 里程碑系统 (6小时)
### 🏗️ 建房比喻：分期付款

**为什么需要里程碑？**

```
问题：
科学家拿到全部钱后失踪 ❌

解决：
分阶段释放资金 ✅

例如：
- 完成动物实验 → 释放30%
- 完成临床试验 → 释放30%
- 发表论文 → 释放40%
```

### 里程碑合约实现

**添加到 OpenCureEscrow.sol**
```solidity
struct Milestone {
    uint256 id;
    string title;
    uint256 fundPercentage;  // 基点 (5000 = 50%)
    MilestoneStatus status;
    string evidenceURI;      // IPFS证据链接
}

enum MilestoneStatus {
    Pending,    // 待完成
    Submitted,  // 已提交
    Approved,   // 已批准
    Completed   // 已释放资金
}

function createMilestones(
    uint256 _projectId,
    string[] memory _titles,
    uint256[] memory _percentages
) external {
    // 验证百分比总和 = 100%
    uint256 total = 0;
    for (uint i = 0; i < _percentages.length; i++) {
        total += _percentages[i];
    }
    require(total == 10000, "Must total 100%");
    
    // 创建里程碑...
}

function submitMilestone(
    uint256 _projectId,
    uint256 _milestoneId,
    string memory _evidenceURI
) external {
    // 提交完成证据...
}

function releaseMilestoneFunds(
    uint256 _projectId,
    uint256 _milestoneId
) external {
    // 释放资金...
}
```

### 前端显示里程碑

```jsx
function MilestoneTimeline({ projectId }) {
  const [milestones, setMilestones] = useState([]);

  return (
    <div>
      <h3>Project Milestones</h3>
      {milestones.map((m, i) => (
        <div key={i} style={milestoneStyle}>
          <h4>{m.title}</h4>
          <div>Progress: {m.fundPercentage / 100}%</div>
          <div>Status: {getStatusText(m.status)}</div>
        </div>
      ))}
    </div>
  );
}
```

### ✅ Day 15-17 检查清单
- [ ] 里程碑合约实现
- [ ] 前端能显示里程碑
- [ ] 能提交和批准里程碑

---

## 📅 Day 18-21: 项目详情和数据展示 (8小时)

**实现功能：**
1. 项目详情页
2. 捐赠历史
3. 数据图表
4. 团队信息展示

### 使用图表库

```bash
npm install recharts
```

```jsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

function FundingChart({ data }) {
  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Line type="monotone" dataKey="amount" stroke="#8884d8" />
    </LineChart>
  );
}
```

---

## 📅 Day 22-24: 科学家功能 (6小时)

**实现：**
1. 创建项目表单
2. 管理里程碑
3. 提交进度报告
4. 提取资金

### 多步表单

```jsx
function CreateProjectWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  return (
    <div>
      {step === 1 && <Step1BasicInfo />}
      {step === 2 && <Step2TeamInfo />}
      {step === 3 && <Step3Milestones />}
      {step === 4 && <Step4Review />}
    </div>
  );
}
```

---

## 📅 Day 25-27: 测试和优化 (6小时)

**测试重点：**
1. 完整用户流程
2. 错误处理
3. 边缘情况
4. 性能优化

### E2E测试示例

```javascript
// 测试完整捐赠流程
it('完整捐赠流程', async () => {
  // 1. 连接钱包
  await connectWallet();
  
  // 2. 选择项目
  await clickProject(1);
  
  // 3. 输入金额
  await enterAmount(100);
  
  // 4. 确认捐赠
  await clickDonate();
  
  // 5. 验证成功
  expect(balance).to.increase();
});
```

---

## 📅 Day 28-29: 主网部署准备 (4小时)

**部署清单：**

```
□ 合约审计通过
□ 所有测试通过
□ 前端代码优化
□ 文档完整
□ 备份私钥
□ 准备真实USDC
□ 设置监控
□ 准备回滚方案
```

### 主网部署

```bash
# ⚠️ 这次是真的！要花真钱！
npx hardhat run scripts/deploy.js --network mainnet
```

---

## 📅 Day 30: 上线和庆祝！🎉

**最后检查：**
```
□ 前端能访问主网合约
□ 所有功能正常
□ 链接都有效
□ 域名配置完成
□ SSL证书配置
```

**发布：**
1. 发Twitter公告
2. 更新GitHub
3. 写Medium文章
4. 社区分享

**🎊 恭喜你完成30天学习！🎊**

---

# 📚 附录

## 常用命令速查

```bash
# Hardhat
npx hardhat compile
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network sepolia

# React
npm start
npm run build
npm test

# Git
git add .
git commit -m "message"
git push
```

## 学习资源

- **Solidity**: https://docs.soliditylang.org
- **Hardhat**: https://hardhat.org
- **Ethers.js**: https://docs.ethers.org
- **React**: https://react.dev
- **OpenZeppelin**: https://docs.openzeppelin.com

## 下一步建议

学完30天后，你可以：
1. 添加更多功能（投票系统、NFT奖励）
2. 优化gas消耗
3. 添加更多测试
4. 学习Foundry（更高级的开发工具）
5. 参与开源项目

---

**坚持学习，你一定能成为优秀的Web3开发者！** 🚀

---

# 📖 专业术语中英对照

| 英文 | 中文 | 解释 |
|------|------|------|
| Smart Contract | 智能合约 | 区块链上的代码 |
| DApp | 去中心化应用 | 基于区块链的应用 |
| Gas | 燃料费 | 交易手续费 |
| Wallet | 钱包 | 存储加密货币的工具 |
| ABI | 应用二进制接口 | 合约的使用说明 |
| Escrow | 托管 | 第三方保管资金 |
| Milestone | 里程碑 | 项目阶段目标 |
| Token | 代币 | 数字资产 |
| Testnet | 测试网 | 用于测试的区块链 |
| Mainnet | 主网 | 真实的区块链 |

---

**文档版本：** v1.0  
**最后更新：** 2026-01-10  
**作者：** Claude  
**适用人群：** 有基本编程经验的学习者
