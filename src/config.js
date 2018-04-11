/**
* CONFIG
*/
// board is a square for all intents and purposes, therefore grid is X, Y where X = Y
const BOARD_SIZE = 6

const SHIPS = {
    'destroyer': 2,
    'submarine': 3,
    'battleship': 4,
}

const ATTACK_RESULT = {
    HIT: 'Hit',
    MISS: 'Miss',
    ALREADY_TAKEN: 'Already Taken',
    SUNK: 'Sunk',
    WIN: 'Win',
}
