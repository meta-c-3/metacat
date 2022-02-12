// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IMTCToken {
    //Standard func for ERC20 API call, when you enter the contract address on metamask
    //metamask will automatic call this function for getting Token name,symbol, decimal and
    //user balance of the token
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function totalSupply() external view returns (uint256);

    function decimals() external view returns (uint8);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}
