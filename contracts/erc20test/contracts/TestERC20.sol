pragma solidity >= 0.5.0 <0.9.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TestERC20 is ERC20 {
  
  constructor () ERC20("Token", "TKN") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
  function giveMeTokens(address _account, uint256 _value) public {
    _mint(_account, _value);
  }
}
