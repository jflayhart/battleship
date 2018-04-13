# Battleshipt
This is a contrived, simulated version of the game [Battleship](https://en.wikipedia.org/wiki/Battleship_game). Watch your browser's console window, while two computers play against each other.

Fire le missiles! :boom:

### Gameplay
- Open index.html in your browser with the javascript console window
- The game begins on page load once both players have placed their ships
- The players take turns choosing a position on the opponent’s grid to attack
- The first one to sink all opponent ships wins!

### Rules
- 2 Players
- Each player has a 10x10 grid on which to place 4 ships: destroyer (2), submarine (3), battleship (4), carrier (5)
- Ships cannot overlap other ships
- A ship must stay within bounds of the grid

The result of an attack must be one of:
- "Hit" if the opponent has a ship covering the position
- "Miss" if there is no ship covering the position
- "Sunk" if all the positions a ship covers have been hit
- "Win" if all the ships on the opponent's grid have been sunk
