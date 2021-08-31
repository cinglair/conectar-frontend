import { useContext } from 'react'

import { LoadingContext } from '../LoadingContext'
export interface ILoadingContext {
  start(): void
  stop(): void
  loadingPlaying: boolean
}
export default function useLoading(): ILoadingContext {
  const { start, stop, loadingPlaying } = useContext(LoadingContext)
  return { start, stop, loadingPlaying }
}
