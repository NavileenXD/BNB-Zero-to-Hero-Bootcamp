//SPDX-License-Identifier: UNLICENSED .
pragma solidity >=0.8.18;

contract DogCoin {
    
    //variables
    uint256 totalSupply;
    address owner;

    //modifiers
    modifier onlyOwner{ 
    if (msg.sender==owner){
        _;
    }
    }

    //constructors

    constructor() {
    owner = msg.sender;
    totalSupply= 2000000;
    balance[msg.sender] = totalSupply;
}
    
    //structs
    struct Payment {
        address recipientAddress;
        uint256 transferAmount;
    }
    
    //mappings
    mapping (address => uint256) balance; 
    mapping(address => Payment[]) public payments;
    
    //events
    event SupplyChanges(uint256);
    event TransferNotification(uint256, address);



    //functions
    function increaseTotalSupply() public {
        totalSupply += 1000;
        emit SupplyChanges(totalSupply);
    }

    function getTotalSupply() public view returns (uint256){
        return totalSupply;
    }

    function transfer(address destination, uint256 amount) public {
        balance[destination] += amount;
        balance[msg.sender] -= amount;
        payments[msg.sender].push(Payment({recipientAddress: destination, transferAmount: amount}));
        emit TransferNotification(amount, destination);
    }

    function getPayments(address _address) public view returns (Payment[] memory) {
        return payments[_address];
    }

}