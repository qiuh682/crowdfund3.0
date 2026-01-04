// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 这是我们的第一个合约
contract HelloWorld {
    
    // ========== 状态变量 ==========
    // 存储在区块链上，永久保存
    
    string public message;      // 公开的字符串
    address public owner;       // 合约所有者
    uint256 public counter;     // 计数器
    bool public isActive;       // 是否激活
    
    // ========== 事件 ==========
    // 记录重要操作
    
    event MessageChanged(
        string newMessage,
        address indexed changedBy,
        uint256 timestamp
    );
    
    // ========== 构造函数 ==========
    // 部署时执行一次
    
    constructor(string memory _initialMessage) {
        message = _initialMessage;
        owner = msg.sender;  // 部署者地址
        counter = 0;
        isActive = true;
    }
    
    // ========== 函数 ==========
    
    // 修改消息
    function setMessage(string memory _newMessage) public {
        require(isActive, "Contract is paused");
        
        message = _newMessage;
        counter = counter + 1;
        
        emit MessageChanged(_newMessage, msg.sender, block.timestamp);
    }
    
    // 查询消息 (view = 只读，免费)
    function getMessage() public view returns (string memory) {
        return message;
    }
    
    // ========== 访问控制 ==========
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;  // 继续执行函数
    }
    
    // 切换激活状态 (只有owner能调用)
    function toggleActive() public onlyOwner {
        isActive = !isActive;
    }
}