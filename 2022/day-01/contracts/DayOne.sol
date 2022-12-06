// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @author flamuri.eth
/// @title Day 1 @ Advent of Code
contract DayOne {
    uint256[] public calories;

    constructor(uint256[] memory _calories) {
        calories = _calories;
    }

    /// Add new calories.
    /// @dev adds calories to the state array `calories`
    function addCalories(uint256[] calldata _calories) public {
        uint256 sum = 0;
        for (uint256 i = 0; i < _calories.length; i++) {
            sum += _calories[i];
        }
        calories.push(sum);
    }

    /// Return the amount of stored calories.
    /// @dev retrieves the length of the state array `calories`
    /// @return the amount of stored calories
    function caloriesLength() public view returns (uint256) {
        return calories.length;
    }
}
