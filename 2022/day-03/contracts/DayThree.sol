// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DayThree {
    
    function getRepeatedCharacters(
        string calldata _string
    ) public pure returns (bytes memory) {
        bytes memory temp;

        uint length = bytes(_string).length;
        bytes memory firstHalf = bytes(_string[0:length / 2]);
        bytes memory secondHalf = bytes(_string[length / 2:length]);

        for (uint256 i = 0; i < length / 2; i++) {
            for (uint256 j = 0; j < length / 2; j++) {
                if (firstHalf[i] == secondHalf[j]) {
                    temp = abi.encodePacked(firstHalf[i]);
                }
            }
        }

        return temp;
    }
}
