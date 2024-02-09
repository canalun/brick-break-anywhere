import { barId, barSetting, barZIndex, initialBottom } from "./settings"
import type { Vector } from "./utils"

export type Bar = HTMLDivElement & { _bar: never }

export function initializeBar(): Bar {
  const bar = document.createElement("div")
  bar.id = barId
  Object.assign(bar.style, {
    position: "fixed",
    transform:
      `translate(` +
      `${window.innerWidth / 2 - barSetting.width / 2}px,` +
      `${-1 * initialBottom}px` +
      `)`,
    left: "0px",
    bottom: "0px",
    width: `${barSetting.width}px`,
    height: `${barSetting.height}px`,
    backgroundColor: barSetting.color,
    zIndex: barZIndex
  })
  return bar as Bar
}

export function getBarCenterPosition(bar: Bar): Vector {
  const rect = bar.getBoundingClientRect()
  return {
    x: rect.left + barSetting.width / 2,
    y: window.innerHeight - rect.bottom + barSetting.height / 2
  }
}
