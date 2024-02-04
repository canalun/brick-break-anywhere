export function setSoundEffect() {
  // plasmo uses parcel, so we can use url: to import audio files.
  // see: https://github.com/parcel-bundler/parcel/issues/1911#issuecomment-1042854678
  const sound1 = require("url:../../assets/sound/1.mp3")
  const sound2 = require("url:../../assets/sound/2.mp3")
  const sound3 = require("url:../../assets/sound/3.mp3")
  const sound4 = require("url:../../assets/sound/4.mp3")
  const sounds = [sound1, sound2, sound3, sound4]

  for (let i = 0; i < 4; i++) {
    const soundEffect = new Audio(sounds[i])
    soundEffect.id = `se${i + 1}`
    // soundEffect.autoplay = true
    document.body.appendChild(soundEffect)
  }

  let current: HTMLAudioElement | null = null
  const ring = () => {
    const random = Math.floor(Math.random() * 4) + 1
    const audio = document.getElementById(`se${random}`) as HTMLAudioElement // TODO: remove type assertion
    if (current) {
      current.pause()
      current.currentTime = 0
    }
    audio.play()
    current = audio
  }
  return ring
}
