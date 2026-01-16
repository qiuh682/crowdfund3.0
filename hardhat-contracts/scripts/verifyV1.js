const { run, ethers } = require("hardhat");

async function main() {
  console.log("🔍 开始验证合约...\n");
  
  // 获取部署者地址
  const [deployer] = await ethers.getSigners();
  console.log("部署者地址:", deployer.address);
  
  // 合约地址
  const USDC_ADDRESS = "0x8410f9Cf462C4dCc9Fb97971fe65F8D711Fa3F96";
  const ESCROW_ADDRESS = "0xF0A7b71FB5f28a702A2B8d485390117cE229beA2";
  
  // 验证 MockUSDC
  console.log("\n1️⃣ 验证 MockUSDC...");
  try {
    await run("verify:verify", {
      address: USDC_ADDRESS,
      constructorArguments: [],
    });
    console.log("✅ MockUSDC 验证成功！");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ MockUSDC 已经验证过了");
    } else {
      console.log("❌ MockUSDC 验证失败:", error.message);
    }
  }
  
  // 验证 OpenCureV1
  console.log("\n2️⃣ 验证 OpenCure V1...");
  try {
    await run("verify:verify", {
      address: ESCROW_ADDRESS,
      constructorArguments: [
        USDC_ADDRESS,
        deployer.address,
        "100000000000", // 100,000 USDC
        "2592000", // 30 days
      ],
    });
    console.log("✅ OpenCure V1 验证成功！");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ OpenCure V1 已经验证过了");
    } else {
      console.log("❌ OpenCure V1 验证失败:", error.message);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("🎉 验证完成！");
  console.log("=".repeat(60));
  console.log("\n📋 查看合约:");
  console.log("MockUSDC:");
  console.log(`https://sepolia.etherscan.io/address/${USDC_ADDRESS}#code`);
  console.log("\nOpenCure V1:");
  console.log(`https://sepolia.etherscan.io/address/${ESCROW_ADDRESS}#code`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });