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

/** Ship **/
class Ship {
    constructor (classType, size, coords) {
        this.classType = classType
        this.health = size
        this.coords = coords
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

/** Game Board per player **/
class Board {
    constructor () {
        // TODO generate grid
        this.grid = [
            ['','','','destroyer','',''],
            ['','','','destroyer','',''],
            ['battleship','','','submarine','submarine','submarine'],
            ['battleship','','','','',''],
            ['battleship','','','','',''],
            ['battleship','','','','',''],
        ]
        this.ships = []
    }

    setup () {
        // O(N2) set up 2D array for grid rows (y) and columns (x)
        // TODO generate grid
        // for(let y=0; y<BOARD_SIZE; y++) {
        //     this.grid[y] = []
        //     for(let x=0; x<BOARD_SIZE; x++) {
        //         this.grid[y][x] = 0
        //     }
        // }
    }

    setShips (ship) {
        this.ships.push(ship)
    }

    getShips () {
        return this.ships
    }
}

class Player {
    constructor (name) {
        this.name = name
        this.board = new Board()
        this.isWinner = false
        this.shouldTakeTurn = false
    }

    setup () {
        console.log(`${this.name} is setting up their board...`)
        // player has to be aware of the board to place their ships
        this.board.setup()
        for (let ship in SHIPS) {
            this.placeShip(ship, SHIPS[ship])
        }
    }

    getBoard () {
        return this.board
    }

    // TODO AVOID COLLISIONS!
    placeShip (shipClass, shipSize) {
        // randomize ship placement
        // TODO set horizontal or vertical (right now only vertical)
        const coordX = Math.floor(Math.random() * BOARD_SIZE)
        // TODO properly gen ship coords
        const coordY = coordX > BOARD_SIZE / 2 ? coordX - shipSize : coordX + shipSize
        this.getBoard().setShips(new Ship(shipClass, shipSize, [coordX, coordY]))
    }

    attack (opponent) {
        // randomize attempts
        const coordX = Math.floor(Math.random() * BOARD_SIZE)
        const coordY = Math.floor(Math.random() * BOARD_SIZE)
        // bear in mind this is a "guess" for a ship
        const target = opponent.getBoard().grid[coordX][coordY]

        console.log(`Shots fired by ${this.name} at ${opponent.name}'s [${coordX}, ${coordY}]`)
        // null check first!
        if (target === null) {
            // already tried this target, stop wasting missiles
            console.warn(ATTACK_RESULT.ALREADY_TAKEN)
        } else if (target.length > 0) {
            // AHA! I've found your ship...
            opponent.getBoard().getShips().forEach((ship) => {
                if (ship.getClassType() === target && ship.getHealth() > 0) {
                    ship.hit()
                    // notify player that ship was hit and sunk when applicable
                    if (ship.isSunk()) {
                        console.log(`${target} ${ATTACK_RESULT.HIT} and ${ATTACK_RESULT.SUNK}!`)
                    } else {
                        console.log(ATTACK_RESULT.HIT)
                    }
                } else if (ship.getClassType() === target && ship.getHealth() === 0) {
                    // enough already, this ship has been killed dead
                    console.warn(ATTACK_RESULT.ALREADY_TAKEN)
                }
            })
        } else {
            // swing'n a miss!
            opponent.getBoard().grid[coordX][coordY] = null
            console.log(ATTACK_RESULT.MISS)
        }

        this.endTurn()
    }

    endTurn () {
        this.shouldTakeTurn = false
    }

    beginTurn () {
        this.shouldTakeTurn = true
    }
}

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
        this.play()
    }

    play () {
        // players alternate turns
        if (this.player1.shouldTakeTurn) {
            this.player1.attack(this.player2)
            this.player2.beginTurn()
        } else if (this.player2.shouldTakeTurn) {
            this.player2.attack(this.player1)
            this.player1.beginTurn()
        }

        // play recursively until a player wins
        if (this.player1.isWinner) {
            console.info(`${this.player1.name} has won!`)
        } else if (this.player2.isWinner) {
            console.info(`${this.player2.name} has won!`)
        } else {
            this.play()
        }
    }
}

$(() => {
    const game = new Game()

    // alert(`
    //     This is a contrived, simulated version of the game Battleship.\n
    //     Watch while two computers play against eachother in your browser's console window.\n
    //     Fire le missiles!
    // `)

    game.setup()
})