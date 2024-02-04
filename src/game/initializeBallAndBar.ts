import { initializeBall } from "./ball"
import { initializeBar } from "./bar"
import { ballSetting, barSetting, initialBottom } from "./settings"

export function initializeBallAndBar() {
  const bottomRoom = document.createElement("div")
  document.documentElement.appendChild(bottomRoom)
  Object.assign(bottomRoom.style, {
    position: "absolute",
    width: "100%",
    height: `${
      initialBottom +
      barSetting.height +
      ballSetting.height +
      initialBottom * 1.5
    }px`
  })

  const ball = initializeBall()
  const table = initializeBar()

  document.body.insertAdjacentElement("beforeend", ball)
  document.body.insertAdjacentElement("beforeend", table)

  return { ball, table }
}
