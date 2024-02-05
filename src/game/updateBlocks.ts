import { getRectOfBlock, type Block } from "./blocks"
import { getComputedStyleWithCache } from "./getComputedStyleWithCache"
import {
  assert,
  isFrameElement,
  isPenetrableFrame,
  isSVGElement
} from "./utils"

// TODO: Changing the value of `remain` of a block to `false` is done in `detectCollision.ts`.
//       It might be better to move the logic to here.
export function requestBlockRemoveAnimation(blocks: Block[]) {
  let id = null
  requestAnimationFrame(() => {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      if (!block.remain) {
        removeBlockAndUpdateBlocksPosition(block, blocks)
        blocks.splice(i, 1)
      }
    }
    id = requestAnimationFrame(() => requestBlockRemoveAnimation(blocks))
  })

  if (process.env.NODE_ENV === "development") {
    window.addEventListener("click", () => {
      id && cancelAnimationFrame(id)
    })
  }
}

// TODO: separate removal and position update
function removeBlockAndUpdateBlocksPosition(block: Block, blocks: Block[]) {
  // make to-be-removed element red just a moment before removing it
  const element = block.element as HTMLElement // TODO: remove type assertion
  const originalBorderWidth = getComputedStyleWithCache(element).borderWidth
  element.style.border = `${originalBorderWidth === "0px" ? "1px" : originalBorderWidth} solid red`

  setTimeout(() => {
    removeBlock(block)
    // edge case
    if (element.tagName === "TH" || element.tagName === "TD") {
      element.style.borderWidth = "0px"
    }
    updatePositionOfRemainingBlocks(blocks)
  }, 100)
}

function removeBlock(block: Block) {
  const element = block.element

  if (isFrameElement(element)) {
    removeBlockOfFrameElement(block)
    return
  }

  if (isSVGElement(element)) {
    removeBlockOfSVGElement(block)
    return
  }

  const originalVisibilities = []
  Array.from(block.element.children).forEach((childEl) => {
    originalVisibilities.push(getComputedStyleWithCache(childEl).visibility)
  })
  Object.assign(block.element.style, {
    visibility: "hidden"
  })
  Array.from(block.element.children).forEach((childEl, i) => {
    Object.assign(childEl.style, {
      visibility: originalVisibilities[i]
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

function removeBlockOfSVGElement(block: Block) {
  Object.assign(block.element.style, {
    visibility: "hidden"
  })
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
