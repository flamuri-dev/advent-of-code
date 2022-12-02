// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DayTwo {
    enum Options {
        ROCK, // 1 point
        PAPER, // 2 points
        SCISSORS // 3 points
    }

    mapping(Options => mapping(Options => uint8)) public points;

    constructor() {
        points[Options.PAPER][Options.ROCK] =
            pointsByResult(Options.PAPER, Options.ROCK) +
            pointsByMove(Options.ROCK); // 1 = 0 (loss) + 1 (rock)
        points[Options.PAPER][Options.SCISSORS] =
            pointsByResult(Options.PAPER, Options.SCISSORS) +
            pointsByMove(Options.SCISSORS); // 9 = 6 (win) + 3 (scissors)
        points[Options.PAPER][Options.PAPER] =
            pointsByResult(Options.PAPER, Options.PAPER) +
            pointsByMove(Options.PAPER); // 5 = 3 (draw) + 2 (paper)
        points[Options.ROCK][Options.PAPER] =
            pointsByResult(Options.ROCK, Options.PAPER) +
            pointsByMove(Options.PAPER); // 8 = 6 (win) + 2 (paper)
        points[Options.ROCK][Options.SCISSORS] =
            pointsByResult(Options.ROCK, Options.SCISSORS) +
            pointsByMove(Options.SCISSORS); // 3 = 0 (loss) + 3 (scissors)
        points[Options.ROCK][Options.ROCK] =
            pointsByResult(Options.ROCK, Options.ROCK) +
            pointsByMove(Options.ROCK); // 4 = 3 (draw) + 1 (rock)
        points[Options.SCISSORS][Options.PAPER] =
            pointsByResult(Options.SCISSORS, Options.PAPER) +
            pointsByMove(Options.PAPER); // 2 = 0 (loss) + 2 (paper)
        points[Options.SCISSORS][Options.ROCK] =
            pointsByResult(Options.SCISSORS, Options.ROCK) +
            pointsByMove(Options.ROCK); // 7 = 6 (win) + 1 (rock)
        points[Options.SCISSORS][Options.SCISSORS] =
            pointsByResult(Options.SCISSORS, Options.SCISSORS) +
            pointsByMove(Options.SCISSORS); // 6 = 3 (draw) + 3 (scissors)
    }

    function play(uint8 _opponentOption, uint8 _myOption) public view returns (uint8) {
        return points[Options(_opponentOption)][Options(_myOption)];
    }

    function pointsByResult(Options _opponentOption, Options _myOption) internal pure returns (uint8) {
        if (_opponentOption == _myOption) return 3;
        else if (
            (_opponentOption == Options.ROCK && _myOption == Options.SCISSORS) ||
            (_opponentOption == Options.PAPER && _myOption == Options.ROCK) ||
            (_opponentOption == Options.SCISSORS && _myOption == Options.PAPER)
        ) return 0;
        else return 6;
    }

    function pointsByMove(Options _option) internal pure returns (uint8) {
        return _option == Options.ROCK ? 1 : _option == Options.PAPER ? 2 : 3;
    }
}
