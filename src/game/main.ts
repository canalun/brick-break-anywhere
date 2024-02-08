import { getBlocks } from "./blocks"
import { freezePage } from "./freezePage"
import { initializeBallAndBar } from "./initializeBallAndBar"
import { initializeScoreboard } from "./initializeScoreboard"
import { standby } from "./standby"

export function main(options: { withScoreboard: boolean }) {
  console.log("👶brick-break-anywhere starts👶")

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
