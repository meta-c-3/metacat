//TO-DO 12022022 : To create approve, transferfrom and allowance function -done

// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
import "./utils/Context.sol";
import "./IMTCToken.sol";

contract MTCToken is Context, IMTCToken {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowance;

    string private _name;
    string private _symbol;
    uint8 private _decimal;

    uint256 private _totalSupply;

    address admin;

    constructor() {
        _name = "MTCToken";
        _symbol = "MTC";
        _decimal = 18;

        admin = _msgsender();

        _mint(admin, 1000 * 10**18);
    }

    //Modifier
    //External Func
    //External Func with view
    //External Func with pure
    //Public func
    function name() public view virtual override returns (string memory) {
        return (_name);
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimal;
    }

    function balanceOf(address account)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _balances[account];
    }

    function mint(address account, uint256 amount) external {
        require(_msgsender() == admin, "MTCToken: Not Admin");
        _mint(account, amount * 10**_decimal);
    }

    function burn(address account, uint256 amount) external {
        require(_msgsender() == admin, "MTCToken: Not Admin");
        _burn(account, amount * 10**_decimal);
    }

    function transfer(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = _msgsender();
        _transfer(owner, to, amount * 10**_decimal);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgsender();
        amount = amount * 10**18;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = _msgsender();
        _approve(owner, spender, amount * 10**_decimal);
        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _allowance[owner][spender];
    }

    function increaseAllowance(address spender, uint256 incresedAmount)
        public
        virtual
        returns (bool)
    {
        address owner = _msgsender();
        incresedAmount = incresedAmount * 10**18;
        _approve(owner, spender, _allowance[owner][spender] + incresedAmount);
        return true;
    }

    function decreaseAllowance(address spender, uint256 amount)
        public
        virtual
        returns (bool)
    {
        address owner = _msgsender();
        amount = amount * 10**18;
        require(
            _allowance[owner][spender] >= amount,
            "MTCToken: Insufficient allowance to decrease"
        );
        unchecked {
            _approve(owner, spender, _allowance[owner][spender] - amount);
        }
        return true;
    }

    //internal func
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0));

        _totalSupply += amount;
        _balances[account] += amount;

        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0));

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "MTCToken: Insufficient amount");
        //Do not let any value to overflow after done arithetric operation
        //it will cost overflow or underflow which lead more gas fee
        //uncheched only applicable on solidity version 0.8.0 and above
        unchecked {
            _balances[account] = accountBalance - amount;
        }

        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "MTCToken: Transfer from 0 address");
        require(to != address(0), "MTCToken: Transfer to 0 address");

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "MTCToken: Insufficient balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }

        _balances[to] += amount;

        emit Transfer(from, to, amount);
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "MTCToken: approve from zero address");
        require(spender != address(0), "MTCToken: approve to zero address");

        _allowance[owner][spender] = amount;

        emit Approval(owner, spender, amount);
    }

    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = _allowance[owner][spender];
        if (currentAllowance != type(uint256).max) {
            require(
                currentAllowance >= amount,
                "MTCToken: Insufficient Allowance to spend"
            );
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    //Private func
}
