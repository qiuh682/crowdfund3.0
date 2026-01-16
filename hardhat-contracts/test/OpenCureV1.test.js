const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("OpenCureV1", function () {
  
  // ============ Fixture ============
  
  async function deployFixture() {
    const [owner, scientist, donor1, donor2, donor3] = await ethers.getSigners();
    
    // 部署 MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    
    // 部署 OpenCureV1
    const goalAmount = ethers.parseUnits("100000", 6); // 100,000 USDC
    const fundingDuration = 30 * 24 * 60 * 60; // 30 天
    
    const OpenCureV1 = await ethers.getContractFactory("OpenCureV1");
    const escrow = await OpenCureV1.deploy(
      await usdc.getAddress(),
      scientist.address,
      goalAmount,
      fundingDuration
    );
    
    // 给捐赠者转 USDC
    await usdc.transfer(donor1.address, ethers.parseUnits("50000", 6));
    await usdc.transfer(donor2.address, ethers.parseUnits("50000", 6));
    await usdc.transfer(donor3.address, ethers.parseUnits("30000", 6));
    
    return { 
      escrow, 
      usdc, 
      owner, 
      scientist, 
      donor1, 
      donor2, 
      donor3,
      goalAmount,
      fundingDuration 
    };
  }
  
  // ============ 部署测试 ============
  
  describe("Deployment", function () {
    it("Should set correct initial values", async function () {
      const { escrow, owner, scientist, goalAmount } = await loadFixture(deployFixture);
      
      expect(await escrow.owner()).to.equal(owner.address);
      expect(await escrow.scientist()).to.equal(scientist.address);
      expect(await escrow.goalAmount()).to.equal(goalAmount);
      expect(await escrow.status()).to.equal(0); // Active
      expect(await escrow.paused()).to.be.false;
    });
    
    it("Should set funding deadline correctly", async function () {
      const { escrow, fundingDuration } = await loadFixture(deployFixture);
      
      const deadline = await escrow.fundingDeadline();
      const now = await time.latest();
      
      expect(deadline).to.be.closeTo(now + fundingDuration, 5);
    });
  });
  
  // ============ 捐赠测试 ============
  
  describe("Donations", function () {
    it("Should accept valid donations", async function () {
      const { escrow, usdc, donor1 } = await loadFixture(deployFixture);
      
      const amount = ethers.parseUnits("10000", 6);
      await usdc.connect(donor1).approve(await escrow.getAddress(), amount);
      
      await expect(
        escrow.connect(donor1).donate(amount)
      ).to.emit(escrow, "DonationReceived")
        .withArgs(donor1.address, amount, await time.latest() + 1);
      
      expect(await escrow.totalRaised()).to.equal(amount);
      expect(await escrow.donations(donor1.address)).to.equal(amount);
      expect(await escrow.votingPower(donor1.address)).to.equal(amount);
    });
    
    it("Should reject donations below minimum", async function () {
      const { escrow, usdc, donor1 } = await loadFixture(deployFixture);
      
      const tooSmall = ethers.parseUnits("0.5", 6); // 0.5 USDC
      await usdc.connect(donor1).approve(await escrow.getAddress(), tooSmall);
      
      await expect(
        escrow.connect(donor1).donate(tooSmall)
      ).to.be.revertedWith("Amount too small");
    });
    
    it("Should reject donations after deadline", async function () {
      const { escrow, usdc, donor1, fundingDuration } = await loadFixture(deployFixture);
      
      // 快进到截止日期后
      await time.increase(fundingDuration + 1);
      
      const amount = ethers.parseUnits("10000", 6);
      await usdc.connect(donor1).approve(await escrow.getAddress(), amount);
      
      await expect(
        escrow.connect(donor1).donate(amount)
      ).to.be.revertedWith("Funding ended");
    });
    
    it("Should track multiple donations correctly", async function () {
      const { escrow, usdc, donor1, donor2 } = await loadFixture(deployFixture);
      
      const amount1 = ethers.parseUnits("20000", 6);
      const amount2 = ethers.parseUnits("30000", 6);
      
      // Donor1 捐赠
      await usdc.connect(donor1).approve(await escrow.getAddress(), amount1);
      await escrow.connect(donor1).donate(amount1);
      
      // Donor2 捐赠
      await usdc.connect(donor2).approve(await escrow.getAddress(), amount2);
      await escrow.connect(donor2).donate(amount2);
      
      expect(await escrow.totalRaised()).to.equal(amount1 + amount2);
      expect(await escrow.getDonorCount()).to.equal(2);
      expect(await escrow.totalVotingPower()).to.equal(amount1 + amount2);
    });
  });
  
  // ============ 里程碑测试 ============
  
  describe("Milestones", function () {
    it("Should allow owner to add milestones", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);
      
      const amount = ethers.parseUnits("25000", 6);
      const duration = 60 * 24 * 60 * 60; // 60 天
      
      await expect(
        escrow.connect(owner).addMilestone(
          "Phase 1: Research",
          amount,
          duration
        )
      ).to.emit(escrow, "MilestoneAdded");
      
      const milestone = await escrow.getMilestone(0);
      expect(milestone.description).to.equal("Phase 1: Research");
      expect(milestone.amount).to.equal(amount);
      expect(milestone.completed).to.be.false;
    });
    
    it("Should reject non-owner adding milestones", async function () {
      const { escrow, donor1 } = await loadFixture(deployFixture);
      
      await expect(
        escrow.connect(donor1).addMilestone(
          "Fake milestone",
          ethers.parseUnits("1000", 6),
          30 * 24 * 60 * 60
        )
      ).to.be.revertedWith("Only owner");
    });
    
    it("Should allow owner to complete milestones", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);
      
      // 添加里程碑
      await escrow.connect(owner).addMilestone(
        "Phase 1",
        ethers.parseUnits("25000", 6),
        60 * 24 * 60 * 60
      );
      
      // 完成里程碑
      await expect(
        escrow.connect(owner).completeMilestone(0)
      ).to.emit(escrow, "MilestoneCompleted");
      
      const milestone = await escrow.getMilestone(0);
      expect(milestone.completed).to.be.true;
    });
  });
  
  // ============ 投票测试 ============
  
  describe("Voting", function () {
    async function setupVotingFixture() {
      const fixture = await loadFixture(deployFixture);
      const { escrow, usdc, owner, donor1, donor2 } = fixture;
      
      // 捐赠
      const amount1 = ethers.parseUnits("30000", 6);
      const amount2 = ethers.parseUnits("20000", 6);
      
      await usdc.connect(donor1).approve(await escrow.getAddress(), amount1);
      await escrow.connect(donor1).donate(amount1);
      
      await usdc.connect(donor2).approve(await escrow.getAddress(), amount2);
      await escrow.connect(donor2).donate(amount2);
      
      // 添加并完成里程碑
      await escrow.connect(owner).addMilestone(
        "Phase 1",
        ethers.parseUnits("20000", 6),
        60 * 24 * 60 * 60
      );
      await escrow.connect(owner).completeMilestone(0);
      
      return fixture;
    }
    
    it("Should allow donors to vote", async function () {
      const { escrow, donor1 } = await setupVotingFixture();
      
      await expect(
        escrow.connect(donor1).voteOnMilestone(0, true)
      ).to.emit(escrow, "VoteCast");
      
      const milestone = await escrow.getMilestone(0);
      expect(milestone.votesFor).to.equal(ethers.parseUnits("30000", 6));
    });
    
    it("Should prevent double voting", async function () {
      const { escrow, donor1 } = await setupVotingFixture();
      
      await escrow.connect(donor1).voteOnMilestone(0, true);
      
      await expect(
        escrow.connect(donor1).voteOnMilestone(0, true)
      ).to.be.revertedWith("Already voted");
    });
    
    it("Should calculate vote correctly", async function () {
      const { escrow, donor1, donor2 } = await setupVotingFixture();
      
      // Donor1 (60% 投票权) 赞成
      await escrow.connect(donor1).voteOnMilestone(0, true);
      
      expect(await escrow.isVotePassed(0)).to.be.true;
      
      // Donor2 (40% 投票权) 反对
      await escrow.connect(donor2).voteOnMilestone(0, false);
      
      // 仍然通过，因为 60% > 阈值
      expect(await escrow.isVotePassed(0)).to.be.true;
    });
    
    it("Should reject vote without voting power", async function () {
      const { escrow, donor3 } = await setupVotingFixture();
      
      // donor3 没有捐赠
      await expect(
        escrow.connect(donor3).voteOnMilestone(0, true)
      ).to.be.revertedWith("No voting power");
    });
  });
  
  // ============ 资金释放测试 ============
  
  describe("Fund Release", function () {
    async function setupReleaseFixture() {
      const fixture = await setupVotingFixture();
      const { escrow, donor1 } = fixture;
      
      // 投票通过
      await escrow.connect(donor1).voteOnMilestone(0, true);
      
      return fixture;
    }
    
    it("Should release funds after vote passes", async function () {
      const { escrow, usdc, owner, scientist } = await setupReleaseFixture();
      
      const balanceBefore = await usdc.balanceOf(scientist.address);
      
      await expect(
        escrow.connect(owner).releaseFunds(0)
      ).to.emit(escrow, "FundsReleased");
      
      const balanceAfter = await usdc.balanceOf(scientist.address);
      expect(balanceAfter - balanceBefore).to.equal(
        ethers.parseUnits("20000", 6)
      );
    });
    
    it("Should reject release without vote passed", async function () {
      const { escrow, owner } = await setupVotingFixture();
      
      // 没有投票
      await expect(
        escrow.connect(owner).releaseFunds(0)
      ).to.be.revertedWith("Vote not passed");
    });
    
    it("Should prevent double release", async function () {
      const { escrow, owner } = await setupReleaseFixture();
      
      await escrow.connect(owner).releaseFunds(0);
      
      await expect(
        escrow.connect(owner).releaseFunds(0)
      ).to.be.revertedWith("Already released");
    });
  });
  
  // ============ 退款测试 ============
  
  describe("Refunds", function () {
    it("Should allow refund when funding fails", async function () {
      const { escrow, usdc, donor1, fundingDuration } = await loadFixture(deployFixture);
      
      // 捐赠但未达到目标
      const amount = ethers.parseUnits("10000", 6);
      await usdc.connect(donor1).approve(await escrow.getAddress(), amount);
      await escrow.connect(donor1).donate(amount);
      
      // 快进到截止日期后
      await time.increase(fundingDuration + 1);
      
      // 申请退款
      const balanceBefore = await usdc.balanceOf(donor1.address);
      await escrow.connect(donor1).claimRefund();
      const balanceAfter = await usdc.balanceOf(donor1.address);
      
      expect(balanceAfter - balanceBefore).to.equal(amount);
    });
    
    it("Should reject refund when funding succeeds", async function () {
      const { escrow, usdc, donor1, donor2, goalAmount } = await loadFixture(deployFixture);
      
      // 达到目标
      await usdc.connect(donor1).approve(await escrow.getAddress(), goalAmount / 2n);
      await escrow.connect(donor1).donate(goalAmount / 2n);
      
      await usdc.connect(donor2).approve(await escrow.getAddress(), goalAmount / 2n);
      await escrow.connect(donor2).donate(goalAmount / 2n);
      
      await expect(
        escrow.connect(donor1).claimRefund()
      ).to.be.revertedWith("Cannot refund");
    });
    
    it("Should allow refund when project marked as failed", async function () {
      const { escrow, usdc, owner, donor1 } = await loadFixture(deployFixture);
      
      // 捐赠
      const amount = ethers.parseUnits("10000", 6);
      await usdc.connect(donor1).approve(await escrow.getAddress(), amount);
      await escrow.connect(donor1).donate(amount);
      
      // 标记为失败
      await escrow.connect(owner).markAsFailed();
      
      // 申请退款
      await expect(
        escrow.connect(donor1).claimRefund()
      ).to.emit(escrow, "RefundIssued");
    });
  });
  
  // ============ 紧急控制测试 ============
  
  describe("Emergency Controls", function () {
    it("Should allow owner to pause", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);
      
      await expect(
        escrow.connect(owner).emergencyPause()
      ).to.emit(escrow, "EmergencyPause");
      
      expect(await escrow.paused()).to.be.true;
    });
    
    it("Should reject donations when paused", async function () {
      const { escrow, usdc, owner, donor1 } = await loadFixture(deployFixture);
      
      await escrow.connect(owner).emergencyPause();
      
      const amount = ethers.parseUnits("10000", 6);
      await usdc.connect(donor1).approve(await escrow.getAddress(), amount);
      
      await expect(
        escrow.connect(donor1).donate(amount)
      ).to.be.revertedWith("Contract is paused");
    });
    
    it("Should allow owner to unpause", async function () {
      const { escrow, owner } = await loadFixture(deployFixture);
      
      await escrow.connect(owner).emergencyPause();
      await escrow.connect(owner).emergencyUnpause();
      
      expect(await escrow.paused()).to.be.false;
    });
  });
  
  // ============ 查询功能测试 ============
  
  describe("Query Functions", function () {
    it("Should return funding progress correctly", async function () {
      const { escrow, usdc, donor1, goalAmount } = await loadFixture(deployFixture);
      
      // 捐赠 50%
      const halfGoal = goalAmount / 2n;
      await usdc.connect(donor1).approve(await escrow.getAddress(), halfGoal);
      await escrow.connect(donor1).donate(halfGoal);
      
      expect(await escrow.getFundingProgress()).to.equal(5000); // 50%
    });
    
    it("Should check funding success correctly", async function () {
      const { escrow, usdc, donor1, donor2, goalAmount } = await loadFixture(deployFixture);
      
      // 达到目标
      await usdc.connect(donor1).approve(await escrow.getAddress(), goalAmount / 2n);
      await escrow.connect(donor1).donate(goalAmount / 2n);
      
      await usdc.connect(donor2).approve(await escrow.getAddress(), goalAmount / 2n);
      await escrow.connect(donor2).donate(goalAmount / 2n);
      
      expect(await escrow.isFundingSuccessful()).to.be.true;
    });
    
    it("Should check funding failure correctly", async function () {
      const { escrow, fundingDuration } = await loadFixture(deployFixture);
      
      // 快进到截止日期后
      await time.increase(fundingDuration + 1);
      
      expect(await escrow.isFundingFailed()).to.be.true;
    });
  });
});

// 辅助函数：在 describe 外定义 setupVotingFixture
async function setupVotingFixture() {
  const [owner, scientist, donor1, donor2, donor3] = await ethers.getSigners();
  
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  
  const goalAmount = ethers.parseUnits("100000", 6);
  const fundingDuration = 30 * 24 * 60 * 60;
  
  const OpenCureV1 = await ethers.getContractFactory("OpenCureV1");
  const escrow = await OpenCureV1.deploy(
    await usdc.getAddress(),
    scientist.address,
    goalAmount,
    fundingDuration
  );
  
  await usdc.transfer(donor1.address, ethers.parseUnits("50000", 6));
  await usdc.transfer(donor2.address, ethers.parseUnits("50000", 6));
  await usdc.transfer(donor3.address, ethers.parseUnits("30000", 6));
  
  // 捐赠
  const amount1 = ethers.parseUnits("30000", 6);
  const amount2 = ethers.parseUnits("20000", 6);
  
  await usdc.connect(donor1).approve(await escrow.getAddress(), amount1);
  await escrow.connect(donor1).donate(amount1);
  
  await usdc.connect(donor2).approve(await escrow.getAddress(), amount2);
  await escrow.connect(donor2).donate(amount2);
  
  // 添加并完成里程碑
  await escrow.connect(owner).addMilestone(
    "Phase 1",
    ethers.parseUnits("20000", 6),
    60 * 24 * 60 * 60
  );
  await escrow.connect(owner).completeMilestone(0);
  
  return { escrow, usdc, owner, scientist, donor1, donor2, donor3, goalAmount, fundingDuration };
}