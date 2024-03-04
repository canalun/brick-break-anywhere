import type { StartOptions } from "~game/configuration/settings"

import { initializeBall } from "../object/ball"
import { initializeBar } from "../object/bar"
import { getBlocks } from "../object/blocks"
import { initializeScoreboard } from "../object/scoreboard"

export function initializeObjects(options: StartOptions) {
  const { ball, bar } = initializeBallAndBar()
  const scoreboard = options.withScoreboard ? initializeScoreboard() : null
  const blocks = getBlocks()
  return { ball, bar, blocks, scoreboard }
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
