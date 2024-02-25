import { initializeBall } from "./ball"
import { initializeBar } from "./bar"
import { getBlocks } from "./blocks"
import { freezePage } from "./freezePage"
import { msg } from "./message"
import { initializeScoreboard } from "./scoreboard"
import { standby } from "./standby"

export function main(options: { withScoreboard: boolean }) {
  console.log(msg)

  freezePage()

  const { ball, bar } = initializeBallAndBar()
  const scoreboard = options.withScoreboard ? initializeScoreboard() : undefined
  const blocks = getBlocks()

  try {
    standby(ball, bar, blocks, scoreboard)
  } catch (e) {
    console.log(e)
  }
}

function initializeBallAndBar() {
  const ball = initializeBall()
  const bar = initializeBar()

  const container = document.createElement("div")
  document.documentElement.insertAdjacentElement("beforeend", container)
  container.insertAdjacentElement("beforeend", ball)
  container.insertAdjacentElement("beforeend", bar)

  return { ball, bar }
}
