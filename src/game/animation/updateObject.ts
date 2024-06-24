export function updateObjectPositionTo(ball: HTMLDivElement, position: { x: number, y: number }): void {
  Object.assign(ball.style, {
    transform:
    `translate(` +
      `${position.x}px, ` +
      `${position.y}px` +
      `)`
  })
}
