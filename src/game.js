/**
 * CONFIG - Set config and logging for the game here (see README for rules)
 */

// board is a 10x10 square
const BOARD_SIZE = 10

const SHIPS = {
    'destroyer': 2,
    'submarine': 3,
    'battleship': 4,
    'carrier': 5,
}

const SHIP_ORIENTATIONS = ['horizontal', 'vertical']

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
 * Class object representation of a ship - a ship has a class and size
 * @class Ship
 * @param {string} classType - Class of the ship (see SHIPS config)
 * @param {number} size - The size of the ship, also used for tracking health of ship if it's attacked.
 */
class Ship {
    constructor (classType, size) {
        this.classType = classType
        this.health = size
    }

    getClassType () {
        return this.classType
    }

    getHealth () {
        return this.health
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
 * Class object representation of a player's board - a board has a grid and ships
 * @class Board
 */
class Board {
    constructor () {
        /* Example grid
        [
            ['','','','destroyer','',''],
            ['','','','destroyer','',''],
            ['battleship','','','submarine','submarine','submarine'],
            ['battleship','','','','',''],
            ['battleship','','','','',''],
            ['battleship','','','','',''],
        ]
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

    getShip (classType) {
        let ship
        this.getShips().map(s => {
            if (s.getClassType() === classType) {
                ship = s
            }
        })
        return ship
    }

    setShip (shipClass, shipSize) {
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
 * Class object representation of a player - the player has a board with ships and makes decisions on where and how to place them
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
    }

    placeShip (shipClass, shipSize) {
        // randomize ship placement
        const orientation = this.chooseShipOrientation()
        const chosenCoords = this.chooseShipCoords(shipSize, orientation)

        if (chosenCoords === null) {
            // oops, we needn't have overlapping ships! try again...
            this.placeShip(shipClass, shipSize)
        } else {
            this.board.setShip(shipClass, shipSize)
            chosenCoords.map(coords => {
                const row = coords[0]
                const col = coords[1]

                logger.info(`${shipClass} set ${orientation} at [${row}, ${col}]`)
                this.board.grid[row][col] = shipClass
            })
        }
    }

    attack (opponent) {
        // scan potential coords
        const coords = this.chooseAttackCoords(opponent.board.grid)
        const rowCoord = coords[0]
        const colCoord = coords[1]
        // if hit, target = class of the ship
        const target = opponent.board.grid[rowCoord][colCoord]

        console.log(`Shots fired at ${opponent.name}: [${rowCoord}, ${colCoord}]`)

        if (target.length > 0) {
            // Ahoy! enemy ship spotted...
            const ship = opponent.board.getShip(target)

            if (ship.getHealth() > 0) {
                // aye direct hit, captain!
                ship.hit()

                // skadoosh
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

        // always check to see if player won
        if (opponent.board.getSunkenShips().length === opponent.board.getShips().length) {
            logger.success(ATTACK_RESULT.WIN)
            logger.success(`${this.name} wins!`)
            this.isWinner = true
            console.info(`${this.name}'s (winner) board:`, this.board.grid)
            console.info(`${opponent.name}'s (loser) board:`, opponent.board.grid)
        }
    }

    endTurn () {
        this.shouldTakeTurn = false
    }

    beginTurn () {
        this.shouldTakeTurn = true
    }

    chooseShipOrientation () {
        const arrPosition = this.randomNumGenerator(SHIP_ORIENTATIONS.length)
        return SHIP_ORIENTATIONS[arrPosition]
    }

    chooseShipCoords (shipSize, orientation) {
        const row = this.randomNumGenerator(this.board.size)
        const col = this.randomNumGenerator(this.board.size)
        let coords = []

        for (let i = 0; i < shipSize; i++) {
            let rowCoord = row
            let colCoord = col
            if (orientation === 'vertical') {
                // avoid going out of bounds vertically
                rowCoord = row > this.board.size - shipSize ? row - i : row + i
            } else {
                // avoid going out of bounds horizontally
                colCoord = col > this.board.size - shipSize ? col - i : col + i
            }

            coords.push([rowCoord, colCoord])

            // as we go through picking coords, make sure we don't overlap ships!
            const coordsAvailable = this.board.grid[rowCoord][colCoord].length === 0
            if (!coordsAvailable) {
                return null
            }
        }

        return coords
    }

    chooseAttackCoords (opponentGrid) {
        // TODO optimize accuracy
        // randomize attempts
        let rowCoord = this.randomNumGenerator(this.board.size)
        let colCoord = this.randomNumGenerator(this.board.size)
        let target = opponentGrid[rowCoord][colCoord]

        // if already attacked coords, choose another coord
        while (target === null) {
            rowCoord = this.randomNumGenerator(this.board.size)
            colCoord = this.randomNumGenerator(this.board.size)
            target = opponentGrid[rowCoord][colCoord]
        }

        return [rowCoord, colCoord]
    }

    randomNumGenerator (max) {
        return Math.floor(Math.random() * Math.floor(max))
    }
}

/**
 * The game play - a game has players
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
        if (!p1.isWinner && !p2.isWinner) {
            this.play()
        }
    }
}

// init
window.onload = () => {
    const game = new Game()
    game.setup()
    game.play()
}
