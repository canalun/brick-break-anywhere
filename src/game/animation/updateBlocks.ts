import { getRectOfBlock, type Block } from "../object/blocks"
import type { Scoreboard } from "../object/scoreboard"
import {
  assert,
  getComputedStyleWithCache,
  isFrameElement,
  isPenetrableFrame,
  isSVGElement,
  isTextareaElement
} from "../utils/dom"

// TODO: Changing the value of `remain` of a block to `false` is done in `detectCollision.ts`.
//       It might be better to move the logic to here.
export function startBlockAndScoreUpdate(
  blocks: Block[],
  scoreboard: Scoreboard | null
) {
  let id = requestAnimationFrame(removeBlockAndUpdateScore)
  function removeBlockAndUpdateScore() {
    let score = 0
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      if (!block.remain) {
        !block.removed && removeBlockAndUpdateBlocksPosition(block, blocks)
        scoreboard && score++
      }
    }
    scoreboard &&
      (scoreboard.textContent = `Score: ${score} / ${blocks.length} (${Math.round((score / blocks.length) * 100)}%)`)

    id = requestAnimationFrame(removeBlockAndUpdateScore)
  }

  const stopBlockRemoveAnimation = () => cancelAnimationFrame(id)
  if (process.env.NODE_ENV === "development") {
    window.addEventListener("click", stopBlockRemoveAnimation)
  }
  return stopBlockRemoveAnimation
}

// TODO: separate removal and position update
function removeBlockAndUpdateBlocksPosition(block: Block, blocks: Block[]) {
  // make to-be-removed element red just a moment before removing it
  const element = block.element as HTMLElement // TODO: remove type assertion
  const originalOutlineWidth = getComputedStyleWithCache(element).outlineWidth
  element.style.outline = `${originalOutlineWidth === "0px" ? "1px" : originalOutlineWidth} solid red`

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
  block.removed = true

  const element = block.element

  if (isFrameElement(element)) {
    removeBlockOfFrameElement(block)
    return
  }

  if (isSVGElement(element)) {
    removeBlockOfSVGElement(block)
    return
  }

  if (isTextareaElement(element)) {
    removeBlockOfTextareaElement(block)
    return
  }

  const originalVisibilities: string[] = []
  Array.from(block.element.children).forEach((childEl) => {
    originalVisibilities.push(getComputedStyleWithCache(childEl).visibility)
  })
  ;(block.element as HTMLElement).style && // TODO: remove type assertion
    Object.assign((block.element as HTMLElement).style, {
      visibility: "hidden"
    })
  Array.from(block.element.children).forEach((childEl, i) => {
    ;(childEl as HTMLElement).style && // TODO: remove type assertion
      Object.assign((childEl as HTMLElement).style, {
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
  assert(isSVGElement(block.element), "block's element must be svg")
  Object.assign(block.element.style, {
    visibility: "hidden"
  })
}

function removeBlockOfTextareaElement(block: Block) {
  assert(isTextareaElement(block.element), "block's element must be textarea")
  Object.assign(block.element.style, {
    visibility: "hidden"
  })
  block.element.placeholder = ""
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
