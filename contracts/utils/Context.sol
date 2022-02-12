// SPDX-License-Identifier: MIT
//abstract contract no need to deployed, just need to import to the contract to deployed
pragma solidity >=0.4.22 <0.9.0;

abstract contract Context {
    function _msgsender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgdata() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}
