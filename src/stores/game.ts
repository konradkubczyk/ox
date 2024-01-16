import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FieldInterface } from '@/types/FieldInterface'

function getEmptyBoard() {
  return Array(9).fill(null).map((_, index) => ({ position: index, player: null })) as FieldInterface[]
}

export const useGameStore = defineStore('game', () => {
  const turn = ref<string | null>(null)
  const positions = ref<FieldInterface[]>(getEmptyBoard())
  const player1Wins = ref<number | null>(null)
  const player2Wins = ref<number | null>(null)
  const gameNumber = ref<number | null>(null)

  function setTurn(player: string) {
    turn.value = player
  }

  function setPositions(board: FieldInterface[]) {
    positions.value = board
  }

  function setPlayer1Wins(wins: number) {
    player1Wins.value = wins
  }

  function setPlayer2Wins(wins: number) {
    player2Wins.value = wins
  }

  function setGameNumber(number: number) {
    gameNumber.value = number
  }

  function clear() {
    turn.value = null
    positions.value = getEmptyBoard()
    player1Wins.value = null
    player2Wins.value = null
    gameNumber.value = null
  }

  return {
    turn,
    positions,
    player1Wins,
    player2Wins,
    gameNumber,
    setTurn,
    setPositions,
    setPlayer1Wins,
    setPlayer2Wins,
    setGameNumber,
    clear
  }
})
