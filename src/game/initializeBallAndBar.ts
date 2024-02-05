import { initializeBall } from "./ball"
import { initializeBar } from "./bar"

export function initializeBallAndBar() {
  const ball = initializeBall()
  const table = initializeBar()

  document.body.insertAdjacentElement("beforeend", ball)
  document.body.insertAdjacentElement("beforeend", table)

  return { ball, table }
}
