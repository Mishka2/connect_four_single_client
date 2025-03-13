// filepath: /Users/michelleloven/Desktop/strawberry-practice/src/App.tsx
import { on } from 'events';
import React, { useState } from 'react';

enum BoardCellState {
    EMPTY,
    PLAYER_ONE,
    PLAYER_TWO,
    PLAYER_ONE_POTENTIAL,
    PLAYER_TWO_POTENTIAL
}

enum CurrentPlayer {
    PLAYER_ONE,
    PLAYER_TWO
}

const CurrentPlayerToCellStateMapping = {
    [CurrentPlayer.PLAYER_ONE]: BoardCellState.PLAYER_ONE,
    [CurrentPlayer.PLAYER_TWO]: BoardCellState.PLAYER_TWO
}

const CurrentPlayerPotentialToBoardStateMapping = {
    [CurrentPlayer.PLAYER_ONE]: BoardCellState.PLAYER_ONE_POTENTIAL,
    [CurrentPlayer.PLAYER_TWO]: BoardCellState.PLAYER_TWO_POTENTIAL
}


const MainGame: React.FC = () => {
    const [currentPlayer, setCurrentPlayer] = useState(CurrentPlayer.PLAYER_ONE);
    const rows = 6;
    const cols = 7;
    const [board, setBoard] = useState(Array.from({ length: rows }, () => Array(cols).fill(BoardCellState.EMPTY)));

    const getOtherPlayer = (player: CurrentPlayer) => {
        return player === CurrentPlayer.PLAYER_ONE ? CurrentPlayer.PLAYER_TWO : CurrentPlayer.PLAYER_ONE;
    }

    const checkWinCondition = (board: BoardCellState[][], row: number, col: number) => {
        const directions = [
            { dr: 0, dc: 1 },  // horizontal
            { dr: 1, dc: 0 },  // vertical
            { dr: 1, dc: 1 },  // diagonal down-right
            { dr: 1, dc: -1 }  // diagonal down-left
        ];
        const player = getOtherPlayer(currentPlayer);
        for (const { dr, dc } of directions) {
            let count = 1;
            // Check in the positive direction
            for (let r = row + dr, c = col + dc; r >= 0 && r < rows && c >= 0 && c < cols; r += dr, c += dc) {
                if (board[r][c] === CurrentPlayerToCellStateMapping[player]) {
                    count++;
                } else {
                    break;
                }
            }
            // Check in the negative direction
            for (let r = row - dr, c = col - dc; r >= 0 && r < rows && c >= 0 && c < cols; r -= dr, c -= dc) {
                if (board[r][c] === CurrentPlayerToCellStateMapping[player]) {
                    count++;
                } else {
                    break;
                }
            }
            if (count >= 4) {
                alert(`Player ${currentPlayer === CurrentPlayer.PLAYER_ONE ? 'One' : 'Two'} wins!`);
                setBoard(Array.from({ length: rows }, () => Array(cols).fill(BoardCellState.EMPTY)));
                setCurrentPlayer(CurrentPlayer.PLAYER_ONE);
                return;
            }
        }
        // Check for draw
        if (board.every(row => row.every(cell => cell !== BoardCellState.EMPTY))) {
            alert('It\'s a draw!');
            setBoard(Array.from({ length: rows }, () => Array(cols).fill(BoardCellState.EMPTY)));
            setCurrentPlayer(CurrentPlayer.PLAYER_ONE);
            return;
        }
        // Switch player
        setCurrentPlayer(getOtherPlayer(currentPlayer));
    };

    const handleCellClick = (col: number) => {
        for (let row = rows - 1; row >= 0; row--) {
            if (board[row][col] == BoardCellState.EMPTY ||
                board[row][col] == BoardCellState.PLAYER_ONE_POTENTIAL ||
                board[row][col] == BoardCellState.PLAYER_TWO_POTENTIAL
            ) {
                const newBoard = board.map(row => [...row]);
                if (row > 0) {
                    newBoard[row - 1][col] = CurrentPlayerPotentialToBoardStateMapping[getOtherPlayer(currentPlayer)];
                }
                newBoard[row][col] = CurrentPlayerToCellStateMapping[currentPlayer];
                setBoard(newBoard);
                setCurrentPlayer(currentPlayer === CurrentPlayer.PLAYER_ONE ? CurrentPlayer.PLAYER_TWO : CurrentPlayer.PLAYER_ONE);
                checkWinCondition(newBoard, row, col);
                break;
            }
        }
    };

    const onMouseEnter = (col: number) => {
        const newBoard = board.map(row => [...row]);
        let setPotential = false;
        for (let row = rows - 1; row >= 0; row--) {
            for (let c = 0; c < cols; c++) {
                if (newBoard[row][c] == BoardCellState.PLAYER_ONE_POTENTIAL ||
                    newBoard[row][c] == BoardCellState.PLAYER_TWO_POTENTIAL) {
                    newBoard[row][c] = BoardCellState.EMPTY;
                }
            }
            if (newBoard[row][col] == BoardCellState.EMPTY && !setPotential) {
                newBoard[row][col] = CurrentPlayerPotentialToBoardStateMapping[currentPlayer];
                setPotential = true;
            }
        }
        setBoard(newBoard);
    };

    const getCurrentBoardCellColor = (cell: BoardCellState) => {
        switch (cell) {
            case BoardCellState.PLAYER_ONE:
                return 'bg-pink-500';
            case BoardCellState.PLAYER_TWO:
                return 'bg-yellow-500';
            case BoardCellState.PLAYER_ONE_POTENTIAL:
                return 'bg-pink-200';
            case BoardCellState.PLAYER_TWO_POTENTIAL:
                return 'bg-yellow-200';
            default:
                return 'bg-blue-50';
        }
    }

    return (
        <>
            <div className='bg-gray-900 items-center justify-center h-screen w-screen content-center'>
                <h1 className="text-4xl font-bold text-center mb-8 text-white">Connect Four</h1>
                <div className="grid grid-cols-7 w-120 justify-center mx-auto my-auto">
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-16 h-16 bg-blue-50 rounded-full my-0.5
                                ${getCurrentBoardCellColor(cell)}`}
                                onClick={() => handleCellClick(colIndex)}
                                onMouseEnter={() => {
                                    onMouseEnter(colIndex);
                                }}
                            />
                        ))
                    )}
                </div>
                <div className="text-center mt-4">
                    <p className={`text-lg ${currentPlayer == CurrentPlayer.PLAYER_ONE ? 'text-pink-500' : 'text-yellow-500'}`}>Player <span className="font-bold">{currentPlayer}</span>'s turn</p>
                </div>
            </div>
        </>
    );
};

export default MainGame;
