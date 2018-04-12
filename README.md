# Battleshipt
This is a contrived, simulated version of the game Battleship. Watch while two computers play against each other in your browser's console window.

Fire le missiles! :boom:

### Rules
- 2 Players
- Each player has a grid on which to place ships
- The game begins once both players have placed their ships
- The players take turns choosing a position on the opponent’s grid to attack
- Each player has three ships that can be placed vertically or horizontally on the board
- Each ship is unique in size (i.e. ship1 = 2, ship2 = 3...)
- Ships cannot overlap another ship
- A ship must stay within bounds of the board

The result of an attack must be one of:
- "Hit" if the opponent has a ship covering the position
- "Miss" if there is no ship covering the position
- "Sunk" if all the positions a ship covers have been hit
- "Win" if all the ships on the opponent's grid have been sunk
