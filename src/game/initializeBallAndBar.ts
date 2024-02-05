import { initializeBall } from "./ball"
import { initializeBar } from "./bar"

export function initializeBallAndBar() {
  const ball = initializeBall()
  const table = initializeBar()

  const container = document.createElement("div")
  document.documentElement.insertAdjacentElement("beforeend", container)
  container.insertAdjacentElement("beforeend", ball)
  container.insertAdjacentElement("beforeend", table)

  return { ball, table }
}
