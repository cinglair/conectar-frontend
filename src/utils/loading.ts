import inGif from '../assets/video/LOOP.gif'

export const loading = {
  start: (): void => {
    const loadingContainer = document.createElement('div')
    loadingContainer.id = 'loadingContainer'

    const gifLoading = document.createElement('img')
    gifLoading.src = inGif
    loadingContainer.appendChild(gifLoading) // adiciona o nó de texto à nova div criada
    setTimeout(() => {
      gifLoading.src = ''
      console.log('ed')
    }, 1000)
    // adiciona o novo elemento criado e seu conteúdo ao DOM
    const root = document.getElementById('root')
    document.body.insertBefore(loadingContainer, root)
  },
  stop: (): void => {
    const loadingContainer = document.getElementById('loadingContainer')
    if (loadingContainer) {
      loadingContainer?.parentNode?.removeChild(loadingContainer)
    }
  },
}
