// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

contract SimpleDonation {
    
    address public owner;
    uint256 public totalDonations;
    mapping(address => uint256) public donations;
    
    event DonationReceived(address indexed donor, uint256 amount);
    event Withdrawal(address indexed owner, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    receive() external payable {
        require(msg.value > 0, "Donation must be > 0");
        
        donations[msg.sender] += msg.value;
        totalDonations += msg.value;
        
        emit DonationReceived(msg.sender, msg.value);
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function withdraw(uint256 _amount) public {
        require(msg.sender == owner, "Only owner");
        require(_amount <= address(this).balance, "Insufficient");
        
        payable(owner).transfer(_amount);
        emit Withdrawal(owner, _amount);
    }
    
    function withdrawAll() public {
        require(msg.sender == owner, "Only owner");
        
        uint256 amount = address(this).balance;
        payable(owner).transfer(amount);
        emit Withdrawal(owner, amount);
    }
}