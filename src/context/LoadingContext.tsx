import React, {
  useContext,
  useEffect,
  useState,
  AllHTMLAttributes,
  createContext,
  useCallback,
} from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import { ILoadingContext } from './hooks/useLoading'

export const LoadingContext = createContext({} as ILoadingContext)
const LoadingProvider: React.FC = ({ children }) => {
  const [loadingPlaying, setLoadingPlaying] = useState(false)
  const start = useCallback(() => {
    setLoadingPlaying(true)
  }, [])
  const stop = (): void => {
    setLoadingPlaying(false)
  }

  return (
    <LoadingContext.Provider value={{ start, stop, loadingPlaying }}>
      <LoadingAnimation loadingPlaying={loadingPlaying} />
      {children}
    </LoadingContext.Provider>
  )
}

export default LoadingProvider
