//TO-DO: sending ETH from account to contract (including approve), from contract to account - done
//TO-DO: implement win lose transaction function

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./MTCToken.sol";
import "./IMTCToken.sol";

contract Ethmtc {
    address public admin;
    uint256 public minPurchase;
    uint256 public maxPurchase;
    uint256 public price;
    MTCToken public token;

    event Bought(
        address indexed from,
        address indexed reciever,
        uint256 amount
    );

    event Withdraw(address indexed from, address indexed to, uint256 amount);

    constructor(address tokenAddress) {
        admin = msg.sender;
        minPurchase = 1 ether;
        maxPurchase = 100 ether;
        price = 100;
        token = MTCToken(tokenAddress);
    }

    //User buy token using ETH
    function buy() external payable {
        //incoming value is represent in Wei
        uint256 EthAmount = msg.value;
        //convert ETH to tokenAmount
        uint256 tokenAmount = EthAmount * price;
        require(EthAmount > 0, "Ethmtc: Ether must not be 0");
        require(
            tokenAmount >= minPurchase && tokenAmount <= maxPurchase,
            "Ethmtc: token buy must between minPurchase and maxPurchase"
        );

        //converting tokenamount from wei to decimal place
        token.mint(address(this), tokenAmount / 1 ether);
        token.transfer(msg.sender, tokenAmount / 1 ether);
        token.increaseAllowancefor(msg.sender, tokenAmount / 1 ether);

        emit Bought(msg.sender, address(this), EthAmount);
    }

    //User sell token using ETH
    function withdrawToken(uint256 amount) external {
        //incoming value is the decimal token value
        //To convert to ETH, need to make the decimal to 18 decimal
        //then divided by price of 1 token on ETH
        uint256 amountEth = (amount * 1 ether) / price;
        require(amount > 0, "Ethmtc: Token must not 0");
        require(
            amountEth <= address(this).balance,
            "Ethmtc: Contract no enough ETH"
        );
        address payable reciever = payable(msg.sender);

        token.transferFrom(reciever, address(this), amount);
        reciever.transfer(amountEth);

        emit Withdraw(address(this), reciever, amountEth);
    }

    function winlosetransfer(uint256 amount, string memory winlose) external {
        require(amount > 0, "Ethmtc: Token must not 0");
        require(
            keccak256(abi.encodePacked(winlose)) ==
                keccak256(abi.encodePacked("win")) ||
                keccak256(abi.encodePacked(winlose)) ==
                keccak256(abi.encodePacked("lose")),
            "Ethmtc: no win lose"
        );

        if (
            keccak256(abi.encodePacked(winlose)) ==
            keccak256(abi.encodePacked("win"))
        ) {
            token.transfer(msg.sender, amount);
            token.increaseAllowancefor(msg.sender, amount);
        } else {
            token.transferFrom(msg.sender, address(this), amount);
        }
    }

    //Admin get all ETH from Contract
    function withdrawToAdmin() external {
        require(admin == msg.sender, "Ethmtc: Not admin");
        address payable reciever = payable(msg.sender);
        uint256 totalBalance = address(this).balance;
        reciever.transfer(address(this).balance);

        emit Withdraw(address(this), reciever, totalBalance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    //fallback() external payable {}
}
