export function generateToken(length = 32) {
  const CHARSETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let token = ''

  for (let i = 0; i < length; i++) {
    token += CHARSETS.charAt(Math.floor(Math.random() * CHARSETS.length))
  }

  return token
}

export function checkWin(board) {
  const WINNING_COMBINATIONS = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // First column
    [1, 4, 7], // Second column
    [2, 5, 8], // Third column
    [0, 4, 8], // Diagonal from top left
    [2, 4, 6] // Diagonal from top right
  ]

  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i]

    if (board[a].player && board[a].player === board[b].player && board[a].player === board[c].player) {
      return board[a].player
    }
  }

  return null
}

export function emptyPositions(size = 9) {
  const positions = []

  for (let i = 0; i < size; i++) {
    positions.push({
      position: i,
      player: null
    })
  }
  return positions
}
