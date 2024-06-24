import { visualizeBlocks } from "~game/debug"
import { displayMessageInConsole } from "./configuration/easterEggs"
import type { StartOptions } from "./configuration/settings"
import { freezePage } from "./start/freezePage"
import { initializeObjects } from "./start/initializeObjects"
import { standby } from "./start/standby"

export function main(options: StartOptions) {
  displayMessageInConsole()

  try {
    freezePage()
    const { ball, bar, blocks, scoreboard } = initializeObjects(options)

    if (options.visualizeBlocks) {
      visualizeBlocks(blocks)
    }

    standby(ball, bar, blocks, scoreboard, options)
  } catch (e) {
    console.log(e)
  }
}
