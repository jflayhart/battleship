/**
 * CONFIG - Set config and logging for the game here (see README for rules)
 */

// board is a square, for all intents and purposes
const BOARD_SIZE = 6

const SHIPS = {
    'destroyer': 2,
    'submarine': 3,
    'battleship': 4,
}

const SHIP_ORIENTATIONS = [
    'horizontal',
    'vertical',
]

const ATTACK_RESULT = {
    HIT: 'Hit',
    MISS: 'Miss',
    SUNK: 'Sunk',
    WIN: 'Win',
}

const logger = {
    info: (msg) => console.log(`%c${msg}`, 'color: blue'),
    success: (msg) => console.log(`%c${msg}`, 'color: green'),
    danger: (msg) => console.log(`%c${msg}`, 'color: red'),
}


/**
 * Class object representation of a ship
 * @class Ship
 * @param {string} classType - Class of the ship (see SHIPS config)
 * @param {number} size - The size of the ship, also used for tracking health of ship if it's attacked.
 */
class Ship {
    constructor (classType, size) {
        this.classType = classType
        this.health = size
        this.size = size
    }

    getClassType () {
        return this.classType
    }

    getHealth () {
        return this.health
    }

    getSize () {
        return this.size
    }

    isSunk () {
        return this.health === 0
    }

    hit () {
        if (this.health > 0) {
            this.health -= 1
        }
    }
}

/**
 * Class object representation of a player's board
 * @class Board
 */
class Board {
    constructor () {
        /* Example grid
            ['','','','destroyer','',''],
            ['','','','destroyer','',''],
            ['battleship','','','submarine','submarine','submarine'],
            ['battleship','','','','',''],
            ['battleship','','','','',''],
            ['battleship','','','','',''],
        */
        this.grid = []
        this.ships = []
        this.sunkenShips = []
        this.size = BOARD_SIZE
    }

    setup () {
        // O(N2) set up 2D array for grid
        for(let row=0; row<this.size; row++) {
            this.grid[row] = []
            for(let col=0; col<this.size; col++) {
                this.grid[row][col] = ''
            }
        }
    }

    getShips () {
        return this.ships
    }

    getShip (shipName) {
        let ship
        this.getShips().map(s => {
            if (s.getClassType() === shipName) {
                ship = s
            }
        })
        return ship
    }

    setShip (shipClass, shipSize, orientation, rowCoord, colCoord) {
        for (let i = 0; i < shipSize; i++) {
            if (orientation === 'vertical') {
                // avoid going out of bounds vertically
                rowCoord = rowCoord > this.size - shipSize ? rowCoord - i : rowCoord + i
            } else {
                // avoid going out of bounds horizontally
                colCoord = colCoord > this.size - shipSize ? colCoord - i : colCoord + i
            }
            this.grid[rowCoord][colCoord] = shipClass
            console.log(`${shipClass} set ${orientation} at [${rowCoord}, ${colCoord}]`)
        }

        const ship = new Ship(shipClass, shipSize)
        this.ships.push(ship)
    }

    getSunkenShips () {
        return this.sunkenShips
    }

    setSunkenShip (ship) {
        this.sunkenShips.push(ship)
    }
}

/**
 * Class object representation of a player
 * @class Player
 * @param {string} name - name of player
 */
class Player {
    constructor (name) {
        this.name = name
        this.board = new Board()
        this.isWinner = false
        this.shouldTakeTurn = false
    }

    setup () {
        console.log(`${this.name} is setting up their board...`)
        // player has to be aware of the board to place ships
        this.board.setup()

        for (let ship in SHIPS) {
            this.placeShip(ship, SHIPS[ship])
        }
        console.log(this.board.grid)
    }

    placeShip (shipClass, shipSize) {
        // randomize ship placement
        const initRow = Math.floor(Math.random() * this.board.size) // [0][1]
        const initCol = Math.floor(Math.random() * this.board.size) // [3]
        const orientation = this.pickOrientation();

        this.board.setShip(shipClass, shipSize, orientation, initRow, initCol)
    }

    attack (opponent) {
        // randomize attempts
        const rowCoord = Math.floor(Math.random() * this.board.size)
        const colCoord = Math.floor(Math.random() * this.board.size)
        // if hit, target = class of the ship
        const target = opponent.board.grid[rowCoord][colCoord]

        console.log(`Shots fired by ${this.name}: [${rowCoord}, ${colCoord}]`)

        if (target === null) {
            this.attack()
        } else if (target.length > 0) {
            // AHA! I've found your ship...
            const ship = opponent.board.getShip(target)

            if (ship.getHealth() > 0) {
                ship.hit()

                // notify player that ship was hit and sunk when applicable
                if (ship.isSunk()) {
                    logger.danger(`${opponent.name}'s ${target} ${ATTACK_RESULT.HIT} and ${ATTACK_RESULT.SUNK}!`)
                    opponent.board.setSunkenShip(ship)
                } else {
                    logger.danger(ATTACK_RESULT.HIT)
                }
            }
        } else {
            // swing'n a miss!
            logger.info(ATTACK_RESULT.MISS)
        }

        // space was attacked, null it out
        opponent.board.grid[rowCoord][colCoord] = null
        this.endTurn()
        // always check to see if player just won
        if (opponent.board.getSunkenShips().length === opponent.board.getShips().length) {
            logger.success(ATTACK_RESULT.WIN)
            this.isWinner = true
        }
        // TODO REMOVE AFTER TESTING
        this.isWinner = true
    }

    endTurn () {
        this.shouldTakeTurn = false
    }

    beginTurn () {
        this.shouldTakeTurn = true
    }

    pickOrientation () {
        const arrPosition = Math.floor(Math.random() * SHIP_ORIENTATIONS.length)
        return SHIP_ORIENTATIONS[arrPosition]
    }
}

/**
 * The game play
 * @class Game
 */
class Game {
    constructor () {
        this.player1 = new Player('player1')
        this.player2 = new Player('player2')
    }

    setup () {
        this.player1.setup()
        this.player2.setup()

        // ready player one
        this.player1.beginTurn()
    }

    play () {
        const p1 = this.player1
        const p2 = this.player2

        if (p1.shouldTakeTurn) {
            p1.attack(p2)
            p2.beginTurn()
        } else if (p2.shouldTakeTurn) {
            p2.attack(p1)
            p1.beginTurn()
        }

        // play recursively (alternating turns) until someone wins
        /* eslint-disable no-undef */
        if (p1.isWinner) {
            logger.success(`${p1.name} wins!`)
        } else if (p2.isWinner) {
            logger.success(`${p2.name} wins!`)
        } else {
            this.play()
        }
    }
}

// init
$(() => {
    const game = new Game()

    // alert(`
    //     This is a contrived, simulated version of the game Battleship.\n
    //     Watch while two computers play against eachother in your browser's console window.\n
    //     Fire le missiles!
    // `)

    game.setup()
    game.play()
})
