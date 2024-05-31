import type { AnyStartMessage } from "~message"
import { displayMessageInConsole } from "./configuration/easterEggs"
import { freezePage } from "./start/freezePage"
import { initializeObjects } from "./start/initializeObjects"
import { standby } from "./start/standby"

export function main(message: AnyStartMessage) {
  displayMessageInConsole()

  try {
    freezePage()
    const { ball, bar, blocks, scoreboard } = initializeObjects(message.options)
    standby(ball, bar, blocks, scoreboard, message)
  } catch (e) {
    console.log(e)
  }
}
