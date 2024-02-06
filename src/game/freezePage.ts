import { veilZIndex } from "./settings"
import { isFrameElement, isPenetrableFrame } from "./utils"

export function freezePage() {
  setVeil()
  clearTimeoutAll()
  preventScroll(window.top)
}

// Set veil **not only** to prevent user from clicking the page,
// **but also** to fire mousemove event on the veil to move the bar and ball.
// For example, the web page of Hiroshi Abe is as follows: document > frameset > frame x 2.
// In such a case, document.body indicates the frameset element,
// and setting the veil to document.body does not work.
function setVeil() {
  const veil = document.createElement("div")
  Object.assign(veil.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: `rgba(0, 0, 0, 0)`,
    zIndex: veilZIndex
  })
  document.documentElement.insertAdjacentElement("beforeend", veil)
}

function clearTimeoutAll() {
  for (let i = 0; i < 65535; i++) {
    clearTimeout(i)
  }
}

// Using preventDefault() (e.g. https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily) is not suitable,
// because it disables the ball and bar to move on touchmove event on smartphones.
// So, manipulate the style of the body element (ref: https://xn--nckmepf1g6g.com/2022/06/15/scroll/).
function preventScroll(window: Window) {
  const scrollTop = window.scrollY
  Object.assign(window.document.body.style, {
    top: `${scrollTop * -1}px`,
    left: "0",
    right: "0",
    position: "fixed",
    overflow: "hidden"
  })

  Array.from(window.document.querySelectorAll("iframe, frame")).forEach(
    (frame) => {
      isFrameElement(frame) && isPenetrableFrame(frame)
        ? preventScroll(frame.contentWindow)
        : frame.addEventListener("load", () => {
            // fire preventScroll when iframe is reloaded
            isFrameElement(frame) &&
              isPenetrableFrame(frame) &&
              preventScroll(frame.contentWindow)
          })
    }
  )
}
