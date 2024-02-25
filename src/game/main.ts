import { displayMessageInConsole } from "./configuration/easterEggs"
import { freezePage } from "./start/freezePage"
import { initializeObjects } from "./start/initializeObjects"
import { standby } from "./start/standby"

export function main(options: { withScoreboard: boolean }) {
  displayMessageInConsole()

  try {
    freezePage()
    const { ball, bar, blocks, scoreboard } = initializeObjects(options)
    standby(ball, bar, blocks, scoreboard)
  } catch (e) {
    console.log(e)
  }
}
