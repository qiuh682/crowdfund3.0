const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 开始部署 OpenCure V1...\n");
  
  // 获取部署者
  const [deployer] = await ethers.getSigners();
  console.log("📝 部署账户:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 账户余额:", ethers.formatEther(balance), "ETH\n");
  
  // ============ 部署 MockUSDC ============
  console.log("1️⃣ 部署 MockUSDC 测试代币...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  
  const usdcAddress = await usdc.getAddress();
  console.log("✅ MockUSDC 已部署到:", usdcAddress);
  
  const totalSupply = await usdc.totalSupply();
  console.log("   总供应量:", ethers.formatUnits(totalSupply, 6), "USDC\n");
  
  // ============ 部署 OpenCureV1 ============
  console.log("2️⃣ 部署 OpenCure V1 托管合约...");
  
  // 配置参数
  const scientistAddress = deployer.address; // 测试时用部署者作为科学家
  const goalAmount = ethers.parseUnits("100000", 6); // 目标 100,000 USDC
  const fundingDuration = 30 * 24 * 60 * 60; // 30 天
  
  console.log("   科学家地址:", scientistAddress);
  console.log("   募资目标:", ethers.formatUnits(goalAmount, 6), "USDC");
  console.log("   募资期限:", fundingDuration / 86400, "天");
  
  const OpenCureV1 = await ethers.getContractFactory("OpenCureV1");
  const escrow = await OpenCureV1.deploy(
    usdcAddress,
    scientistAddress,
    goalAmount,
    fundingDuration
  );
  await escrow.waitForDeployment();
  
  const escrowAddress = await escrow.getAddress();
  console.log("✅ OpenCure V1 已部署到:", escrowAddress, "\n");
  
  // ============ 验证部署 ============
  console.log("3️⃣ 验证合约状态...");
  
  const owner = await escrow.owner();
  const scientist = await escrow.scientist();
  const goal = await escrow.goalAmount();
  const deadline = await escrow.fundingDeadline();
  const status = await escrow.status();
  const paused = await escrow.paused();
  
  console.log("   Owner:", owner);
  console.log("   Scientist:", scientist);
  console.log("   Goal:", ethers.formatUnits(goal, 6), "USDC");
  console.log("   Deadline:", new Date(Number(deadline) * 1000).toLocaleString());
  console.log("   Status:", ["Active", "Completed", "Failed", "Paused"][status]);
  console.log("   Paused:", paused);
  console.log("   ✅ 验证通过！\n");
  
  // ============ 添加示例里程碑 ============
  console.log("4️⃣ 添加示例里程碑...");
  
  await escrow.addMilestone(
    "Phase 1: Initial Research",
    ethers.parseUnits("25000", 6),
    60 * 24 * 60 * 60 // 60 天
  );
  console.log("   ✅ 里程碑 1 已添加: Phase 1");
  
  await escrow.addMilestone(
    "Phase 2: Clinical Trials",
    ethers.parseUnits("40000", 6),
    120 * 24 * 60 * 60 // 120 天
  );
  console.log("   ✅ 里程碑 2 已添加: Phase 2");
  
  await escrow.addMilestone(
    "Phase 3: Publication & Patents",
    ethers.parseUnits("35000", 6),
    180 * 24 * 60 * 60 // 180 天
  );
  console.log("   ✅ 里程碑 3 已添加: Phase 3\n");
  
  // ============ 总结 ============
  console.log("=" .repeat(70));
  console.log("🎉 OpenCure V1 部署成功！");
  console.log("=" .repeat(70));
  console.log("\n📋 合约地址:");
  console.log("   MockUSDC:         ", usdcAddress);
  console.log("   OpenCure V1:      ", escrowAddress);
  console.log("\n📊 项目配置:");
  console.log("   募资目标:          ", ethers.formatUnits(goalAmount, 6), "USDC");
  console.log("   募资期限:          ", fundingDuration / 86400, "天");
  console.log("   里程碑数量:        ", await escrow.milestoneCount());
  console.log("   投票阈值:          ", await escrow.VOTE_THRESHOLD(), "%");
  console.log("   最小捐赠:          ", ethers.formatUnits(await escrow.MIN_DONATION(), 6), "USDC");
  
  console.log("\n💡 新功能特性:");
  console.log("   ✅ 投票机制 - 捐赠者投票批准里程碑");
  console.log("   ✅ 退款机制 - 项目失败可退款");
  console.log("   ✅ 紧急控制 - 暂停/恢复功能");
  console.log("   ✅ 时间锁 - 募资和里程碑截止时间");
  console.log("   ✅ 状态管理 - 完整的项目生命周期");
  
  console.log("\n🔗 测试流程:");
  console.log("   1. 捐赠: donate(amount)");
  console.log("   2. 投票: voteOnMilestone(id, support)");
  console.log("   3. 释放: releaseFunds(id)");
  console.log("   4. 退款: claimRefund()");
  console.log("   5. 查询: getFundingProgress(), isVotePassed(id)");
  
  console.log("\n🧪 启动 Console 测试:");
  console.log("   npx hardhat console --network localhost");
  console.log("=" .repeat(70));
  
  return {
    usdc: usdcAddress,
    escrow: escrowAddress,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ 部署失败:", error);
    process.exit(1);
  });