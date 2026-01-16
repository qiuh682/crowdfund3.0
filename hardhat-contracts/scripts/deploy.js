const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 开始部署 OpenCure 合约...\n");
  
  // 获取部署者账户
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
  
  // ============ 部署 OpenCureEscrow ============
  console.log("2️⃣ 部署 OpenCureEscrow 托管合约...");
  
  // 配置参数
  const scientistAddress = deployer.address; // 测试时用部署者作为科学家
  const goalAmount = ethers.parseUnits("100000", 6); // 目标 100,000 USDC
  
  console.log("   科学家地址:", scientistAddress);
  console.log("   募资目标:", ethers.formatUnits(goalAmount, 6), "USDC");
  
  const OpenCureEscrow = await ethers.getContractFactory("OpenCureEscrow");
  const escrow = await OpenCureEscrow.deploy(
    usdcAddress,
    scientistAddress,
    goalAmount
  );
  await escrow.waitForDeployment();
  
  const escrowAddress = await escrow.getAddress();
  console.log("✅ OpenCureEscrow 已部署到:", escrowAddress, "\n");
  
  // ============ 验证部署 ============
  console.log("3️⃣ 验证合约状态...");
  
  const owner = await escrow.owner();
  const scientist = await escrow.scientist();
  const goal = await escrow.goalAmount();
  const raised = await escrow.totalRaised();
  
  console.log("   Owner:", owner);
  console.log("   Scientist:", scientist);
  console.log("   Goal:", ethers.formatUnits(goal, 6), "USDC");
  console.log("   Raised:", ethers.formatUnits(raised, 6), "USDC");
  console.log("   ✅ 验证通过！\n");
  
  // ============ 总结 ============
  console.log("=" .repeat(60));
  console.log("🎉 部署成功！");
  console.log("=" .repeat(60));
  console.log("\n📋 合约地址:");
  console.log("   MockUSDC:        ", usdcAddress);
  console.log("   OpenCureEscrow:  ", escrowAddress);
  console.log("\n💡 下一步:");
  console.log("   1. 测试捐赠: 需要先 approve USDC");
  console.log("   2. 添加里程碑: escrow.addMilestone()");
  console.log("   3. 完成里程碑: escrow.completeMilestone()");
  console.log("   4. 释放资金: escrow.releaseFunds()");
  console.log("\n🔗 在 Hardhat 控制台测试:");
  console.log("   npx hardhat console --network localhost");
  console.log("=" .repeat(60));
  
  // 返回地址供其他脚本使用
  return {
    usdc: usdcAddress,
    escrow: escrowAddress,
  };
}

// 执行部署
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ 部署失败:", error);
    process.exit(1);
  });