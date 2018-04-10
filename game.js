// constants
const SHIPS = {
    'destroyer': 1,
    'submarine': 2,
    'cruiser': 3,
}
const ATTACK_TYPE = {
    HIT: 'Hit',
    MISS: 'Miss',
    ALREADY_TAKEN: 'Already Taken',
    SUNK: 'Sunk',
    WIN: 'Win',
}
// speed of play (per turn) in ms
const PLAYER_SPEED = 2000
// board is a square for all intents and purposes, therefore grid is X, Y where X = Y
const BOARD_SIZE = 6

class Board {
    constructor (size) {
        this.size = size
        this.grid = []
    }

    setup () {
        // O(N2) best I can do in setting up 2D array for grid
        for(let i=0; i<this.size; i++) {
            this.grid[i] = []
            for(let j=0; j<this.size; j++) {
                this.grid[i][j] = 0
            }
        }
    }

    setShipPosition () {
        // TODO
    }
}

class Player {
    constructor (name) {
        this.name = name
        // player has to be aware of the board
        this.board = new Board(BOARD_SIZE)
        this.shipPositions = []
    }

    setup () {
        console.log(`${this.name} is setting up ships on their board...`)
        // player sets up board to place their ships
        this.board.setup()
        for (let ship in SHIPS) {
            this.placeShip(ship, SHIPS[ship])
        }
    }

    placeShip (shipClass, size) {
        // TODO place ship on board grid based on class and size
        //this.shipPositions.push({shipClass: size})
        console.log(this.board.grid)
    }
}

class Game {
    constructor () {
        this.player1 = new Player('player1')
        this.player2 = new Player('player2')
        this.hasEnded = false
    }

    setup () {
        // alert(`
        //     This is a contrived, simulated version of the game Battleship.\n
        //     Simply observe two computers playing against eachother in your browser's console window.\n
        //     Fire those missiles!
        // `)

        // simulate player delay during setup phase
        setTimeout(() => this.player1.setup(), PLAYER_SPEED)
        setTimeout(() => this.player2.setup(), PLAYER_SPEED*2)
    }

    end () {
        this.hasEnded = true
    }
}

$(() => {
    const game = new Game()
    game.setup()
})