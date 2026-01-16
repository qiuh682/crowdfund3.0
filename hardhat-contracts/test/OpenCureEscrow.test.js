const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("OpenCureEscrow - Comprehensive Tests", function () {

  async function deployFixture() {
    const [owner, scientist, donor1, donor2, attacker] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();

    const goalAmount = ethers.parseUnits("100000", 6);
    const OpenCureEscrow = await ethers.getContractFactory("OpenCureEscrow");
    const escrow = await OpenCureEscrow.deploy(
      await usdc.getAddress(),
      scientist.address,
      goalAmount
    );

    await usdc.transfer(donor1.address, ethers.parseUnits("50000", 6));
    await usdc.transfer(donor2.address, ethers.parseUnits("50000", 6));

    return { escrow, usdc, owner, scientist, donor1, donor2, attacker, goalAmount };
  }

  // ============ DEPLOYMENT TESTS ============
  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);
      expect(await escrow.owner()).to.equal(owner.address);
    });

    it("Should set the correct scientist", async function () {
      const { escrow, scientist } = await loadFixture(deployFixture);
      expect(await escrow.scientist()).to.equal(scientist.address);
    });

    it("Should set the correct goal amount", async function () {
      const { escrow, goalAmount } = await loadFixture(deployFixture);
      expect(await escrow.goalAmount()).to.equal(goalAmount);
    });

    it("Should start with zero balance", async function () {
      const { escrow } = await loadFixture(deployFixture);
      expect(await escrow.totalRaised()).to.equal(0);
      expect(await escrow.totalReleased()).to.equal(0);
      expect(await escrow.milestoneCount()).to.equal(0);
    });

    it("Should reject invalid constructor parameters", async function () {
      const [owner, scientist] = await ethers.getSigners();
      const MockUSDC = await ethers.getContractFactory("MockUSDC");
      const usdc = await MockUSDC.deploy();
      const OpenCureEscrow = await ethers.getContractFactory("OpenCureEscrow");

      // Zero address for USDC
      await expect(
        OpenCureEscrow.deploy(ethers.ZeroAddress, scientist.address, 1000)
      ).to.be.revertedWith("Invalid USDC address");

      // Zero address for scientist
      await expect(
        OpenCureEscrow.deploy(await usdc.getAddress(), ethers.ZeroAddress, 1000)
      ).to.be.revertedWith("Invalid scientist address");

      // Zero goal
      await expect(
        OpenCureEscrow.deploy(await usdc.getAddress(), scientist.address, 0)
      ).to.be.revertedWith("Goal must be > 0");
    });
  });

  // ============ DONATION TESTS ============
  describe("Donations", function () {
    it("Should accept donations", async function () {
      const { escrow, usdc, donor1 } = await loadFixture(deployFixture);

      const donateAmount = ethers.parseUnits("1000", 6);
      await usdc.connect(donor1).approve(await escrow.getAddress(), donateAmount);

      await expect(
        escrow.connect(donor1).donate(donateAmount)
      ).to.emit(escrow, "DonationReceived");

      expect(await escrow.totalRaised()).to.equal(donateAmount);
      expect(await escrow.donations(donor1.address)).to.equal(donateAmount);
    });

    it("Should track multiple donations from same donor", async function () {
      const { escrow, usdc, donor1 } = await loadFixture(deployFixture);

      const amount1 = ethers.parseUnits("1000", 6);
      const amount2 = ethers.parseUnits("2000", 6);

      await usdc.connect(donor1).approve(await escrow.getAddress(), amount1 + amount2);
      await escrow.connect(donor1).donate(amount1);
      await escrow.connect(donor1).donate(amount2);

      expect(await escrow.donations(donor1.address)).to.equal(amount1 + amount2);
      expect(await escrow.getDonorCount()).to.equal(1);
    });

    it("Should track multiple donors", async function () {
      const { escrow, usdc, donor1, donor2 } = await loadFixture(deployFixture);

      const amount = ethers.parseUnits("1000", 6);

      await usdc.connect(donor1).approve(await escrow.getAddress(), amount);
      await usdc.connect(donor2).approve(await escrow.getAddress(), amount);

      await escrow.connect(donor1).donate(amount);
      await escrow.connect(donor2).donate(amount);

      expect(await escrow.getDonorCount()).to.equal(2);
      expect(await escrow.totalRaised()).to.equal(amount * 2n);
    });

    it("Should reject zero amount donations", async function () {
      const { escrow, donor1 } = await loadFixture(deployFixture);

      await expect(
        escrow.connect(donor1).donate(0)
      ).to.be.revertedWith("Amount must be > 0");
    });

    it("Should reject donation without approval", async function () {
      const { escrow, donor1 } = await loadFixture(deployFixture);

      await expect(
        escrow.connect(donor1).donate(ethers.parseUnits("1000", 6))
      ).to.be.reverted;
    });

    it("Should update contract balance correctly", async function () {
      const { escrow, usdc, donor1 } = await loadFixture(deployFixture);

      const amount = ethers.parseUnits("5000", 6);
      await usdc.connect(donor1).approve(await escrow.getAddress(), amount);
      await escrow.connect(donor1).donate(amount);

      expect(await escrow.getBalance()).to.equal(amount);
    });
  });

  // ============ MILESTONE TESTS ============
  describe("Milestones", function () {
    it("Should allow owner to add milestones", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);

      await escrow.connect(owner).addMilestone(
        "Complete Phase 1 trials",
        ethers.parseUnits("25000", 6)
      );

      const milestone = await escrow.getMilestone(0);
      expect(milestone.description).to.equal("Complete Phase 1 trials");
      expect(milestone.amount).to.equal(ethers.parseUnits("25000", 6));
      expect(milestone.completed).to.be.false;
      expect(milestone.fundsReleased).to.be.false;
    });

    it("Should add multiple milestones", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);

      await escrow.addMilestone("Phase 1", ethers.parseUnits("10000", 6));
      await escrow.addMilestone("Phase 2", ethers.parseUnits("20000", 6));
      await escrow.addMilestone("Phase 3", ethers.parseUnits("30000", 6));

      expect(await escrow.milestoneCount()).to.equal(3);
    });

    it("Should reject non-owner adding milestones", async function () {
      const { escrow, donor1 } = await loadFixture(deployFixture);

      await expect(
        escrow.connect(donor1).addMilestone(
          "Fake milestone",
          ethers.parseUnits("1000", 6)
        )
      ).to.be.revertedWith("Only owner can call");
    });

    it("Should reject empty description", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);

      await expect(
        escrow.connect(owner).addMilestone("", ethers.parseUnits("1000", 6))
      ).to.be.revertedWith("Description required");
    });

    it("Should reject zero amount milestone", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);

      await expect(
        escrow.connect(owner).addMilestone("Test", 0)
      ).to.be.revertedWith("Amount must be > 0");
    });

    it("Should allow owner to complete milestone", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);

      await escrow.addMilestone("Phase 1", ethers.parseUnits("10000", 6));

      await expect(
        escrow.connect(owner).completeMilestone(0)
      ).to.emit(escrow, "MilestoneCompleted");

      const milestone = await escrow.getMilestone(0);
      expect(milestone.completed).to.be.true;
    });

    it("Should reject completing already completed milestone", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);

      await escrow.addMilestone("Phase 1", ethers.parseUnits("10000", 6));
      await escrow.completeMilestone(0);

      await expect(
        escrow.completeMilestone(0)
      ).to.be.revertedWith("Already completed");
    });

    it("Should reject invalid milestone ID", async function () {
      const { escrow } = await loadFixture(deployFixture);

      await expect(
        escrow.completeMilestone(999)
      ).to.be.revertedWith("Invalid milestone");
    });
  });

  // ============ FUND RELEASE TESTS ============
  describe("Fund Release", function () {
    it("Should release funds for completed milestone", async function () {
      const { escrow, usdc, owner, scientist, donor1 } = await loadFixture(deployFixture);

      const donateAmount = ethers.parseUnits("30000", 6);
      await usdc.connect(donor1).approve(await escrow.getAddress(), donateAmount);
      await escrow.connect(donor1).donate(donateAmount);

      const milestoneAmount = ethers.parseUnits("25000", 6);
      await escrow.connect(owner).addMilestone("Phase 1", milestoneAmount);
      await escrow.connect(owner).completeMilestone(0);

      const scientistBalanceBefore = await usdc.balanceOf(scientist.address);

      await expect(
        escrow.connect(owner).releaseFunds(0)
      ).to.emit(escrow, "FundsReleased");

      const scientistBalanceAfter = await usdc.balanceOf(scientist.address);
      expect(scientistBalanceAfter - scientistBalanceBefore).to.equal(milestoneAmount);
    });

    it("Should update totalReleased after fund release", async function () {
      const { escrow, usdc, owner, donor1 } = await loadFixture(deployFixture);

      const donateAmount = ethers.parseUnits("30000", 6);
      await usdc.connect(donor1).approve(await escrow.getAddress(), donateAmount);
      await escrow.connect(donor1).donate(donateAmount);

      const milestoneAmount = ethers.parseUnits("10000", 6);
      await escrow.addMilestone("Phase 1", milestoneAmount);
      await escrow.completeMilestone(0);
      await escrow.releaseFunds(0);

      expect(await escrow.totalReleased()).to.equal(milestoneAmount);
    });

    it("Should reject releasing funds for incomplete milestone", async function () {
      const { escrow, usdc, donor1 } = await loadFixture(deployFixture);

      await usdc.connect(donor1).approve(await escrow.getAddress(), ethers.parseUnits("10000", 6));
      await escrow.connect(donor1).donate(ethers.parseUnits("10000", 6));

      await escrow.addMilestone("Phase 1", ethers.parseUnits("5000", 6));

      await expect(
        escrow.releaseFunds(0)
      ).to.be.revertedWith("Milestone not completed");
    });

    it("Should reject releasing already released funds", async function () {
      const { escrow, usdc, donor1 } = await loadFixture(deployFixture);

      await usdc.connect(donor1).approve(await escrow.getAddress(), ethers.parseUnits("10000", 6));
      await escrow.connect(donor1).donate(ethers.parseUnits("10000", 6));

      await escrow.addMilestone("Phase 1", ethers.parseUnits("5000", 6));
      await escrow.completeMilestone(0);
      await escrow.releaseFunds(0);

      await expect(
        escrow.releaseFunds(0)
      ).to.be.revertedWith("Funds already released");
    });

    it("Should reject if insufficient balance", async function () {
      const { escrow, usdc, donor1 } = await loadFixture(deployFixture);

      await usdc.connect(donor1).approve(await escrow.getAddress(), ethers.parseUnits("1000", 6));
      await escrow.connect(donor1).donate(ethers.parseUnits("1000", 6));

      await escrow.addMilestone("Phase 1", ethers.parseUnits("5000", 6));
      await escrow.completeMilestone(0);

      await expect(
        escrow.releaseFunds(0)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should reject non-owner releasing funds", async function () {
      const { escrow, usdc, donor1, attacker } = await loadFixture(deployFixture);

      await usdc.connect(donor1).approve(await escrow.getAddress(), ethers.parseUnits("10000", 6));
      await escrow.connect(donor1).donate(ethers.parseUnits("10000", 6));

      await escrow.addMilestone("Phase 1", ethers.parseUnits("5000", 6));
      await escrow.completeMilestone(0);

      await expect(
        escrow.connect(attacker).releaseFunds(0)
      ).to.be.revertedWith("Only owner can call");
    });
  });

  // ============ ADMIN TESTS ============
  describe("Admin Functions", function () {
    it("Should allow owner to update scientist", async function () {
      const { escrow, owner, donor1 } = await loadFixture(deployFixture);

      await expect(
        escrow.connect(owner).updateScientist(donor1.address)
      ).to.emit(escrow, "ScientistUpdated");

      expect(await escrow.scientist()).to.equal(donor1.address);
    });

    it("Should reject non-owner updating scientist", async function () {
      const { escrow, donor1, attacker } = await loadFixture(deployFixture);

      await expect(
        escrow.connect(attacker).updateScientist(donor1.address)
      ).to.be.revertedWith("Only owner can call");
    });

    it("Should reject zero address for scientist update", async function () {
      const { escrow } = await loadFixture(deployFixture);

      await expect(
        escrow.updateScientist(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });
  });

  // ============ VIEW FUNCTIONS TESTS ============
  describe("View Functions", function () {
    it("Should return correct funding progress", async function () {
      const { escrow, usdc, donor1 } = await loadFixture(deployFixture);

      // Donate 50% of goal (50,000 of 100,000)
      const amount = ethers.parseUnits("50000", 6);
      await usdc.connect(donor1).approve(await escrow.getAddress(), amount);
      await escrow.connect(donor1).donate(amount);

      // 50% = 5000 basis points
      expect(await escrow.getFundingProgress()).to.equal(5000);
    });

    it("Should return correct donor count", async function () {
      const { escrow, usdc, donor1, donor2 } = await loadFixture(deployFixture);

      const amount = ethers.parseUnits("1000", 6);

      await usdc.connect(donor1).approve(await escrow.getAddress(), amount);
      await usdc.connect(donor2).approve(await escrow.getAddress(), amount);

      await escrow.connect(donor1).donate(amount);
      expect(await escrow.getDonorCount()).to.equal(1);

      await escrow.connect(donor2).donate(amount);
      expect(await escrow.getDonorCount()).to.equal(2);
    });
  });

  // ============ FULL FLOW TEST ============
  describe("Complete Workflow", function () {
    it("Should handle complete donation and milestone flow", async function () {
      const { escrow, usdc, owner, scientist, donor1, donor2 } = await loadFixture(deployFixture);

      // 1. Add milestones
      await escrow.addMilestone("Research Phase", ethers.parseUnits("20000", 6));
      await escrow.addMilestone("Clinical Trial", ethers.parseUnits("30000", 6));
      await escrow.addMilestone("Publication", ethers.parseUnits("10000", 6));

      // 2. Multiple donors contribute
      const donation1 = ethers.parseUnits("40000", 6);
      const donation2 = ethers.parseUnits("30000", 6);

      await usdc.connect(donor1).approve(await escrow.getAddress(), donation1);
      await usdc.connect(donor2).approve(await escrow.getAddress(), donation2);

      await escrow.connect(donor1).donate(donation1);
      await escrow.connect(donor2).donate(donation2);

      expect(await escrow.totalRaised()).to.equal(donation1 + donation2);

      // 3. Complete and release first milestone
      await escrow.completeMilestone(0);
      await escrow.releaseFunds(0);

      expect(await escrow.totalReleased()).to.equal(ethers.parseUnits("20000", 6));

      // 4. Complete and release second milestone
      await escrow.completeMilestone(1);
      await escrow.releaseFunds(1);

      expect(await escrow.totalReleased()).to.equal(ethers.parseUnits("50000", 6));

      // 5. Verify scientist received funds
      expect(await usdc.balanceOf(scientist.address)).to.equal(ethers.parseUnits("50000", 6));

      // 6. Verify remaining balance
      expect(await escrow.getBalance()).to.equal(ethers.parseUnits("20000", 6));
    });
  });
});