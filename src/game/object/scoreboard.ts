import {
  scoreboardHeight,
  scoreboardId,
  veilZIndex
} from "../configuration/settings"

export type Scoreboard = HTMLDivElement & { _scoreboard: never }

export function initializeScoreboard() {
  const board = document.createElement("div")
  board.id = scoreboardId
  document.documentElement.insertAdjacentElement("afterbegin", board)
  Object.assign(board.style, {
    position: "absolute",
    width: "100%",
    height: `${scoreboardHeight}px`,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    color: "black",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    zIndex: veilZIndex + 1
  })
  return board as Scoreboard
}
