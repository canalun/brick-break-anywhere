import { getBlocks } from "./blocks"
import { freezePage } from "./freezePage"
import { initializeBallAndBar } from "./initializeBallAndBar"
import { standby } from "./standby"

export function main() {
  console.log("👶brick-break-anywhere starts👶")

  freezePage()

  const { ball, table } = initializeBallAndBar()
  const blocks = getBlocks()

  try {
    standby(ball, table, blocks)
  } catch (e) {
    console.log(e)
  }
}
