import { initializeBall } from "./ball"
import { initializeBar } from "./bar"

export function initializeBallAndBar() {
  const ball = initializeBall()
  const bar = initializeBar()

  const container = document.createElement("div")
  document.documentElement.insertAdjacentElement("beforeend", container)
  container.insertAdjacentElement("beforeend", ball)
  container.insertAdjacentElement("beforeend", bar)

  return { ball, bar }
}
