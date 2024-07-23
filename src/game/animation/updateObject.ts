export function updateObjectPositionTo(obj: HTMLDivElement, position: { x: number, y: number }): void {
  Object.assign(obj.style, {
    transform:
    `translate(` +
      `${position.x}px, ` +
      `${position.y}px` +
      `)`
  })
}
