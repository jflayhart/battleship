import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Board extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  createBoardGrid () {
    const { grid } = this.props
    let boardGrid = []

    for (let i; i < grid; i++) {
      boardGrid.push(<tr>test</tr>)
    }
    return boardGrid
  }

  render () {
    return (
      <div>
        <h1>Board</h1>
        <table>
          {this.createBoardGrid()}
        </table>
      </div>
    )
  }
}

Board.propTypes = {
  grid: PropTypes.number.isRequired,
}

export default Board
