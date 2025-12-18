// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

/**
 * @title CeloSwap
 * @notice Simple token swap contract for Celo ecosystem
 * @dev Supports direct swaps between whitelisted tokens
 */
contract CeloSwap {
    address public owner;
    uint256 public swapFee = 25; // 0.25% fee (25 basis points)
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    mapping(address => bool) public supportedTokens;
    mapping(address => mapping(address => uint256)) public exchangeRates; // token1 => token2 => rate (scaled by 1e18)
    
    uint256 public totalSwaps;
    uint256 public totalVolume;
    
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event RateUpdated(address indexed tokenIn, address indexed tokenOut, uint256 rate);
    event Swap(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 fee
    );
    event FeeUpdated(uint256 newFee);
    event FeesWithdrawn(address indexed token, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    /**
     * @notice Add a token to supported list
     * @param token Address of the token to add
     */
    function addToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token");
        require(!supportedTokens[token], "Already supported");
        supportedTokens[token] = true;
        emit TokenAdded(token);
    }
    
    /**
     * @notice Remove a token from supported list
     * @param token Address of the token to remove
     */
    function removeToken(address token) external onlyOwner {
        require(supportedTokens[token], "Not supported");
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }
    
    /**
     * @notice Set exchange rate between two tokens
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param rate Exchange rate scaled by 1e18 (e.g., 1.5e18 means 1 tokenIn = 1.5 tokenOut)
     */
    function setExchangeRate(address tokenIn, address tokenOut, uint256 rate) external onlyOwner {
        require(supportedTokens[tokenIn], "TokenIn not supported");
        require(supportedTokens[tokenOut], "TokenOut not supported");
        require(rate > 0, "Invalid rate");
        exchangeRates[tokenIn][tokenOut] = rate;
        emit RateUpdated(tokenIn, tokenOut, rate);
    }
    
    /**
     * @notice Update swap fee
     * @param newFee New fee in basis points (max 500 = 5%)
     */
    function setSwapFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee too high");
        swapFee = newFee;
        emit FeeUpdated(newFee);
    }
    
    /**
     * @notice Swap tokens
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Amount of input tokens
     * @param minAmountOut Minimum acceptable output amount (slippage protection)
     */
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external returns (uint256 amountOut) {
        require(supportedTokens[tokenIn], "TokenIn not supported");
        require(supportedTokens[tokenOut], "TokenOut not supported");
        require(amountIn > 0, "Invalid amount");
        
        uint256 rate = exchangeRates[tokenIn][tokenOut];
        require(rate > 0, "No exchange rate set");
        
        // Calculate output amount
        uint256 grossAmountOut = (amountIn * rate) / 1e18;
        
        // Calculate fee
        uint256 fee = (grossAmountOut * swapFee) / FEE_DENOMINATOR;
        amountOut = grossAmountOut - fee;
        
        require(amountOut >= minAmountOut, "Slippage too high");
        require(IERC20(tokenOut).balanceOf(address(this)) >= amountOut, "Insufficient liquidity");
        
        // Transfer tokens
        require(
            IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn),
            "Transfer in failed"
        );
        require(
            IERC20(tokenOut).transfer(msg.sender, amountOut),
            "Transfer out failed"
        );
        
        // Update stats
        totalSwaps++;
        totalVolume += amountIn;
        
        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut, fee);
    }
    
    /**
     * @notice Get quote for a swap
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Amount of input tokens
     * @return amountOut Expected output amount after fees
     */
    function getQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        require(supportedTokens[tokenIn], "TokenIn not supported");
        require(supportedTokens[tokenOut], "TokenOut not supported");
        
        uint256 rate = exchangeRates[tokenIn][tokenOut];
        require(rate > 0, "No exchange rate set");
        
        uint256 grossAmountOut = (amountIn * rate) / 1e18;
        uint256 fee = (grossAmountOut * swapFee) / FEE_DENOMINATOR;
        amountOut = grossAmountOut - fee;
    }
    
    /**
     * @notice Withdraw accumulated fees
     * @param token Token address to withdraw
     */
    function withdrawFees(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance");
        require(IERC20(token).transfer(owner, balance), "Transfer failed");
        emit FeesWithdrawn(token, balance);
    }
    
    /**
     * @notice Deposit liquidity for a token
     * @param token Token address
     * @param amount Amount to deposit
     */
    function depositLiquidity(address token, uint256 amount) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
    }
    
    /**
     * @notice Emergency withdraw
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner, amount), "Transfer failed");
    }
    
    /**
     * @notice Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
