// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyToken {
    
    // ========== 代币信息 ==========
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    // ========== 余额和授权 ==========
    
    // 余额: 地址 => 余额
    mapping(address => uint256) public balanceOf;
    
    // 授权: 所有者 => (被授权者 => 额度)
    mapping(address => mapping(address => uint256)) public allowance;
    
    // ========== 事件 ==========
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    // ========== 构造函数 ==========
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = 18;  // 标准18位小数
        
        // 计算总供应量 (加上小数位)
        totalSupply = _initialSupply * 10**decimals;
        
        // 把所有代币给创建者
        balanceOf[msg.sender] = totalSupply;
        
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    // ========== 核心功能 ==========
    
    // 1. 转账
    function transfer(address _to, uint256 _value) 
        public 
        returns (bool) 
    {
        require(_to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    // 2. 授权
    function approve(address _spender, uint256 _value) 
        public 
        returns (bool) 
    {
        require(_spender != address(0), "Invalid address");
        
        allowance[msg.sender][_spender] = _value;
        
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    // 3. 从其他地址转账 (需要先授权)
    function transferFrom(address _from, address _to, uint256 _value)
        public
        returns (bool)
    {
        require(_from != address(0), "Invalid from");
        require(_to != address(0), "Invalid to");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value; 
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
}