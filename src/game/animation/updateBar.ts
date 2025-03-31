import type { Bar } from "~game/object/bar";
import { barSetting, initialBottom } from "~game/configuration/settings";
import { updateObjectPositionTo } from "./updateObject"

export function moveBarTo(bar: Bar, x: number) {
  updateObjectPositionTo(bar, {
    x: x - barSetting.width / 2,
    y: -initialBottom
  })
}
