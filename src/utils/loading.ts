import inGif from '../assets/gif/IN.gif'
import loopGif from '../assets/gif/LOOP.gif'
import outGif from '../assets/gif/OUT.gif'

export const loading = {
  start: (): void => {
    const loadingContainer = document.createElement('div')
    loadingContainer.id = 'loadingContainer'

    const gifLoading = document.createElement('img')
    gifLoading.src = inGif
    loadingContainer.appendChild(gifLoading) // adiciona o nó de texto à nova div criada
    setTimeout(() => {
      gifLoading.src = loopGif
    }, 850)
    // adiciona o novo elemento criado e seu conteúdo ao DOM
    const root = document.getElementById('root')
    document.body.insertBefore(loadingContainer, root)
  },
  stop: (): void => {
    const loadingContainer = document.getElementById('loadingContainer')
    if (loadingContainer) {
      const gifImage = loadingContainer.getElementsByClassName('img')[0]
      if (gifImage) {
        gifImage.setAttribute('src', outGif)
      }
      setTimeout(() => {
        loadingContainer?.parentNode?.removeChild(loadingContainer)
      }, 850)
    }
  },
}
