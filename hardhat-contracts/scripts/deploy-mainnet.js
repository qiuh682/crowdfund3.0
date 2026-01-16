/**
 * OpenCure Mainnet Deployment Script
 *
 * IMPORTANT: This script deploys to MAINNET - real money is involved!
 *
 * Pre-deployment checklist:
 * 1. All tests passing
 * 2. Contract audited
 * 3. Sufficient ETH for gas
 * 4. Correct USDC address (mainnet)
 * 5. Correct scientist address
 * 6. Environment variables set
 *
 * Usage:
 *   npx hardhat run scripts/deploy-mainnet.js --network mainnet
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Mainnet USDC address
const MAINNET_USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// Configuration - UPDATE THESE BEFORE DEPLOYMENT
const CONFIG = {
  scientistAddress: process.env.SCIENTIST_ADDRESS || "",
  goalAmount: process.env.GOAL_AMOUNT || "100000", // In USDC (no decimals)
  projectName: process.env.PROJECT_NAME || "OpenCure Research Project",
};

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("        OPENCURE MAINNET DEPLOYMENT");
  console.log("=".repeat(60) + "\n");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("Deployer:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("Network:", hre.network.name);
  console.log("");

  // Validation checks
  console.log("Running pre-deployment checks...\n");

  // Check 1: Network
  if (hre.network.name !== "mainnet") {
    console.log("WARNING: Not deploying to mainnet!");
    console.log("Current network:", hre.network.name);
    console.log("");
  }

  // Check 2: Scientist address
  if (!CONFIG.scientistAddress || CONFIG.scientistAddress === "") {
    console.error("ERROR: SCIENTIST_ADDRESS not set!");
    console.error("Set it in .env file or as environment variable.");
    process.exit(1);
  }

  if (!hre.ethers.isAddress(CONFIG.scientistAddress)) {
    console.error("ERROR: Invalid scientist address!");
    process.exit(1);
  }

  // Check 3: Balance
  const estimatedGas = hre.ethers.parseEther("0.05"); // ~0.05 ETH for deployment
  if (balance < estimatedGas) {
    console.error("ERROR: Insufficient ETH for deployment!");
    console.error("Need at least 0.05 ETH, have:", hre.ethers.formatEther(balance));
    process.exit(1);
  }

  // Check 4: Goal amount
  const goalAmountWei = hre.ethers.parseUnits(CONFIG.goalAmount, 6);
  if (goalAmountWei <= 0) {
    console.error("ERROR: Invalid goal amount!");
    process.exit(1);
  }

  // Display configuration
  console.log("Deployment Configuration:");
  console.log("-".repeat(40));
  console.log("Project Name:", CONFIG.projectName);
  console.log("Scientist Address:", CONFIG.scientistAddress);
  console.log("Goal Amount:", CONFIG.goalAmount, "USDC");
  console.log("USDC Contract:", MAINNET_USDC);
  console.log("-".repeat(40));
  console.log("");

  // Confirmation prompt (only in interactive mode)
  if (process.env.CONFIRM_DEPLOY !== "true") {
    console.log("To proceed with deployment, run:");
    console.log("CONFIRM_DEPLOY=true npx hardhat run scripts/deploy-mainnet.js --network mainnet\n");
    process.exit(0);
  }

  console.log("Deploying contracts...\n");

  // Deploy OpenCureEscrow
  const OpenCureEscrow = await hre.ethers.getContractFactory("OpenCureEscrow");

  console.log("Deploying OpenCureEscrow...");
  const escrow = await OpenCureEscrow.deploy(
    MAINNET_USDC,
    CONFIG.scientistAddress,
    goalAmountWei
  );

  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();

  console.log("OpenCureEscrow deployed to:", escrowAddress);

  // Verify contract on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\nWaiting for block confirmations...");
    await escrow.deploymentTransaction().wait(5);

    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: escrowAddress,
        constructorArguments: [
          MAINNET_USDC,
          CONFIG.scientistAddress,
          goalAmountWei,
        ],
      });
      console.log("Contract verified on Etherscan!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      OpenCureEscrow: escrowAddress,
      USDC: MAINNET_USDC,
    },
    config: {
      projectName: CONFIG.projectName,
      scientistAddress: CONFIG.scientistAddress,
      goalAmount: CONFIG.goalAmount,
    },
    transactionHash: escrow.deploymentTransaction().hash,
  };

  const deploymentPath = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath);
  }

  const filename = `mainnet-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentPath, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("        DEPLOYMENT SUCCESSFUL!");
  console.log("=".repeat(60));
  console.log("\nContract Addresses:");
  console.log("  OpenCureEscrow:", escrowAddress);
  console.log("  USDC:", MAINNET_USDC);
  console.log("\nDeployment info saved to:");
  console.log("  deployments/" + filename);
  console.log("\nNext steps:");
  console.log("  1. Update frontend with new contract address");
  console.log("  2. Add milestones via Dashboard");
  console.log("  3. Announce deployment to community");
  console.log("=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
