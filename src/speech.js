export function speak(text, onEnd) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'id-ID'
  utter.rate = 0.85
  utter.pitch = 1.1

  const voices = window.speechSynthesis.getVoices()
  const idVoice = voices.find(v => v.lang === 'id-ID' || v.lang === 'id')
  if (idVoice) utter.voice = idVoice

  if (onEnd) utter.onend = onEnd
  window.speechSynthesis.speak(utter)
}

export function speakWithVoicesReady(text, onEnd) {
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) {
    speak(text, onEnd)
  } else {
    window.speechSynthesis.onvoiceschanged = () => speak(text, onEnd)
  }
}
