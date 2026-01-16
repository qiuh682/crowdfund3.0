// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @dev 模拟 USDC 的测试代币
 * 用于本地开发和测试
 */
contract MockUSDC is ERC20 {
    /**
     * @dev 构造函数
     * 铸造 1,000,000 USDC 给部署者
     */
    constructor() ERC20("Mock USD Coin", "USDC") {
        // 铸造 1,000,000 USDC (6 位小数)
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }
    
    /**
     * @dev 重写 decimals 返回 6
     * USDC 使用 6 位小数，不是 18 位
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    
    /**
     * @dev 铸造函数（仅用于测试）
     * 允许任何人铸造代币用于测试
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}