import { getBlocks } from "./blocks"
import { freezePage } from "./freezePage"
import { initializeBallAndBar } from "./initializeBallAndBar"
import { standby } from "./standby"

export function main() {
  console.log("👶brick-break-anywhere starts👶")

  freezePage()

  const { ball, bar } = initializeBallAndBar()
  const blocks = getBlocks()

  try {
    standby(ball, bar, blocks)
  } catch (e) {
    console.log(e)
  }
}
