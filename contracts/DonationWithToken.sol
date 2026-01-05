// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ERC20接口 - 完整版
interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) 
        external returns (bool);
    function balanceOf(address account) 
        external view returns (uint256);
    function transfer(address to, uint256 amount) 
        external returns (bool);
}

contract DonationWithToken {
    
    IERC20 public donationToken;
    address public owner;
    address public projectWallet;
    
    uint256 public goalAmount;
    uint256 public totalRaised;
    
    mapping(address => uint256) public donations;
    address[] public donors;
    
    event DonationReceived(address indexed donor, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);
    
    constructor(
        address _tokenAddress,
        address _projectWallet,
        uint256 _goalAmount
    ) {
        require(_tokenAddress != address(0), "Invalid token");
        require(_projectWallet != address(0), "Invalid wallet");
        
        donationToken = IERC20(_tokenAddress);
        owner = msg.sender;
        projectWallet = _projectWallet;
        goalAmount = _goalAmount;
    }
    
    function donate(uint256 _amount) external {
        require(_amount > 0, "Amount must be > 0");
        
        require(
            donationToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        
        donations[msg.sender] += _amount;
        totalRaised += _amount;
        
        emit DonationReceived(msg.sender, _amount);
    }
    
    function withdraw(uint256 _amount) external {
        require(msg.sender == owner, "Only owner");
        require(_amount <= donationToken.balanceOf(address(this)), "Insufficient");
        
        require(
            donationToken.transfer(projectWallet, _amount),
            "Withdrawal failed"
        );
        
        emit FundsWithdrawn(projectWallet, _amount);
    }
    
    function getBalance() external view returns (uint256) {
        return donationToken.balanceOf(address(this));
    }
}