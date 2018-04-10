/**
* CONFIG
*/
// board is a square for all intents and purposes, therefore grid is X, Y where X = Y
const BOARD_SIZE = 6
const SHIPS = {
    's1': 2,
    's2': 3,
    's3': 3,
}
const ATTACK_RESULT = {
    HIT: 'Hit',
    MISS: 'Miss',
    ALREADY_TAKEN: 'Already Taken',
    SUNK: 'Sunk',
    WIN: 'Win',
}

/** Game Board **/
class Board {
    constructor () {
        // TODO generate grid
        this.grid = [
            [0,0,0,2,0,0],
            [0,0,0,2,0,0],
            [0,0,0,3,3,3],
            [0,0,0,0,0,0],
            [2,0,0,0,0,0],
            [2,0,0,0,0,0],
        ]
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
}

class Player {
    constructor (name) {
        this.name = name
        this.board = new Board()
        this.shipCoords = {}
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

    setShipCoords (shipClass, size, coordX, coordY) {
        this.shipCoords[shipClass] = [coordX, coordY, size]
    }

    // TODO AVOID COLLISIONS!
    placeShip (shipClass, size) {
        // randomize ship placement
        // TODO set horizontal or vertical (right now only vertical)
        const coordX = Math.floor(Math.random() * BOARD_SIZE)
        // TODO properly gen ship coords
        const coordY = coordX > BOARD_SIZE / 2 ? coordX - size : coordX + size
        // TODO direction as optional arg
        this.setShipCoords(shipClass, size, coordX, coordY)
    }

    fireMissile (coordX, coordY) {
        console.log(this.board.grid[coordX][coordY])
        // TODO set winnder when sunk all ships!
        this.isWinner = true
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
        // alert(`
        //     This is a contrived, simulated version of the game Battleship.\n
        //     Watch while two computers playing against eachother in your browser's console window.\n
        //     Fire the missiles!
        // `)

        this.player1.setup()
        this.player2.setup()

        // ready player one
        this.player1.beginTurn()
        this.play()
    }

    play () {
        // players alternate turns
        if (this.player1.shouldTakeTurn) {
            this.player1.fireMissile(0,3)
            this.player1.endTurn()
            this.player2.beginTurn()
        } else if (this.player2.shouldTakeTurn) {
            this.player2.fireMissile(0,2)
            this.player2.endTurn()
            this.player1.beginTurn()
        }
        // play recursively until game end
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
    game.setup()
})