require("dotenv").config();

console.log("🔍 检查配置...\n");

// 检查 RPC URL
if (process.env.SEPOLIA_RPC_URL) {
  console.log("✅ SEPOLIA_RPC_URL:", process.env.SEPOLIA_RPC_URL.substring(0, 50) + "...");
} else {
  console.log("❌ SEPOLIA_RPC_URL 未设置");
}

// 检查私钥
if (process.env.PRIVATE_KEY) {
  const pk = process.env.PRIVATE_KEY;
  console.log("✅ PRIVATE_KEY 已设置");
  console.log("   长度:", pk.length, "字符");
  console.log("   格式:", pk.startsWith("0x") ? "正确 (0x...)" : "❌ 缺少 0x 前缀");
  
  if (pk.length === 66 && pk.startsWith("0x")) {
    console.log("   ✅ 私钥格式正确");
  } else if (pk.length === 64 && !pk.startsWith("0x")) {
    console.log("   ⚠️  私钥缺少 0x 前缀，请添加");
  } else {
    console.log("   ❌ 私钥长度不正确，应该是 64 或 66 个字符");
  }
} else {
  console.log("❌ PRIVATE_KEY 未设置");
}

// 检查 Etherscan API
if (process.env.ETHERSCAN_API_KEY) {
  console.log("✅ ETHERSCAN_API_KEY 已设置");
} else {
  console.log("⚠️  ETHERSCAN_API_KEY 未设置（可选）");
}

console.log("\n完成检查！");