import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
// Components
import Board from './Board'

export const Game = (props) => (
  <div>
    <h1>Battleship</h1>
    <Board
      player="1"
      grid={props.grid}
    />
    <Board
      player="2"
      grid={props.grid}
    />
  </div>
)

Game.propTypes = {
  grid: PropTypes.number.isRequired,
}

ReactDOM.render(
  <Game grid={8} />,
  document.getElementById('game')
)
