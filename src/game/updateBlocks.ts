import { getRectOfBlock, type Block } from "./blocks"
import { getComputedStyleWithCache } from "./getComputedStyleWithCache"
import { assert, isFrameElement, isPenetrableFrame } from "./utils"

// TODO: Changing the value of `remain` of a block to `false` is done in `detectCollision.ts`.
//       It might be better to move the logic to here.
export function requestBlockRemoveAnimation(blocks: Block[]) {
  requestAnimationFrame(() => {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      if (!block.remain) {
        removeBlockAndUpdateBlocksPosition(block, blocks)
        blocks.splice(i, 1)
      }
    }
    requestAnimationFrame(() => requestBlockRemoveAnimation(blocks))
  })
}

// TODO: separate removal and position update
function removeBlockAndUpdateBlocksPosition(block: Block, blocks: Block[]) {
  // make to-be-removed element red just a moment before removing it
  const originalBorderWidth = getComputedStyleWithCache(
    block.element
  ).borderWidth
  const element = block.element as HTMLElement // TODO: remove type assertion
  element.style.border = "1px solid red"
  element.style.borderWidth = originalBorderWidth

  setTimeout(() => {
    removeBlock(block)
    updatePositionOfRemainingBlocks(blocks)
  }, 100)
}

function removeBlock(block: Block) {
  if (isFrameElement(block.element)) {
    removeBlockOfFrameElement(block)
    return
  }

  Object.assign(block.element.style, {
    visibility: "hidden"
  })
  Array.from(block.element.children).forEach((childEl) => {
    if (getComputedStyleWithCache(childEl).visibility === "hidden") return
    Object.assign(childEl.style, {
      visibility: "visible"
    })
  })
}

function removeBlockOfFrameElement(block: Block) {
  assert(isFrameElement(block.element), "block's element must be frame")

  if (isPenetrableFrame(block.element)) {
    Object.assign(block.element.style, {
      backgroundColor: "transparent",
      borderColor: "transparent",
      boxShadow: "none"
    })
  } else {
    // remove the entire frame when it's not penetrable (e.g. cross-origin)
    Object.assign(block.element.style, {
      visibility: "hidden"
    })
  }
  return
}

function updatePositionOfRemainingBlocks(blocks: Block[]) {
  for (let i = 0; i < blocks.length; i++) {
    if (!blocks[i].remain) {
      return
    }
    const rect = getRectOfBlock(blocks[i].element)
    Object.assign(blocks[i], { rect })
  }
}
