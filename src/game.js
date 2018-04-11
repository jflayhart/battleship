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
        this.sunkenShips = []
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

    getSunkenShips () {
        return this.sunkenShips
    }

    setShip (ship) {
        this.ships.push(ship)
    }

    setSunkenShip (ship) {
        this.sunkenShips.push(ship)
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

    // TODO AVOID COLLISIONS!
    placeShip (shipClass, shipSize) {
        // randomize ship placement
        // TODO set horizontal or vertical (right now only vertical)
        const coordX = Math.floor(Math.random() * BOARD_SIZE)
        // TODO properly gen ship coords
        const coordY = coordX > BOARD_SIZE / 2 ? coordX - shipSize : coordX + shipSize
        this.board.setShip(new Ship(shipClass, shipSize, [coordX, coordY]))
    }

    attack (opponent) {
        // randomize attempts
        const coordX = Math.floor(Math.random() * BOARD_SIZE)
        const coordY = Math.floor(Math.random() * BOARD_SIZE)
        // bear in mind the potential target will be the class name of the ship if hit
        const target = opponent.board.grid[coordX][coordY]

        console.log(`Shots fired by ${this.name} at coords: [${coordX}, ${coordY}]`)

        if (target === null) {
            // already tried this target, stop wasting missiles
            logger.warn(ATTACK_RESULT.ALREADY_TAKEN)
        } else if (target.length > 0) {
            // AHA! I've found your ship...
            const ship = opponent.board.getShip(target)

            if (ship.getHealth() > 0) {
                ship.hit()

                // notify player that ship was hit and sunk when applicable
                if (ship.isSunk()) {
                    logger.danger(`${opponent.name} ${target} ${ATTACK_RESULT.HIT} and ${ATTACK_RESULT.SUNK}!`)
                    opponent.board.setSunkenShip(ship)
                } else {
                    logger.danger(ATTACK_RESULT.HIT)
                }
            } else if (ship.getHealth() === 0) {
                // enough already, this ship has been killed dead
                logger.warn(ATTACK_RESULT.ALREADY_TAKEN)
            }
        } else {
            // swing'n a miss!
            logger.info(ATTACK_RESULT.MISS)
        }

        opponent.board.grid[coordX][coordY] = null
        this.endTurn()
        // always check to see if player just won
        if (opponent.board.getSunkenShips().length === opponent.board.getShips().length) {
            logger.success(ATTACK_RESULT.WIN)
            this.isWinner = true
        }
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
        if (p1.isWinner) {
            logger.success(`${p1.name} wins!`)
        } else if (p2.isWinner) {
            logger.success(`${p2.name} wins!`)
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
    game.play()
})