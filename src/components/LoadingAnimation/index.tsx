import React, {
  useContext,
  useEffect,
  useState,
  AllHTMLAttributes,
  createContext,
  useCallback,
} from 'react'
import { Background, StyledLottie } from './styles'
import loopAnimationData from '../../assets/json/LOOP.json'
import inAnimationData from '../../assets/json/IN.json'
import outAnimationData from '../../assets/json/OUT.json'
import useLoading, { ILoadingContext } from '../../context/hooks/useLoading'
interface IProps {
  loadingPlaying: boolean
}
interface IAnimationState {
  isStopped: boolean
  isPaused: boolean
}
const LoadingAnimation: React.FC<IProps> = ({ loadingPlaying, children }) => {
  const [animation, setAnimation] = useState(inAnimationData)
  const defaultOptions: any = {
    loop: true,
    autoplay: false,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  const loading = useLoading()
  const [animationState, setAnimationState] = useState<IAnimationState>({
    isPaused: false,
    isStopped: true,
  } as IAnimationState)
  useEffect(() => {
    if (loadingPlaying) {
      setAnimationState({
        isPaused: false,
        isStopped: false,
      })
      setTimeout(() => {
        setAnimation(loopAnimationData)
      }, 1000)
    } else {
      setAnimation(outAnimationData)
      setTimeout(() => {
        setAnimationState({
          isPaused: false,
          isStopped: true,
        })
      }, 5000)
    }
  }, [loadingPlaying])
  return (
    <Background displayIsNone={animationState.isStopped}>
      <StyledLottie
        options={defaultOptions}
        height={400}
        width={400}
        {...animationState}
      />
      {loadingPlaying}
    </Background>
  )
}

export default LoadingAnimation
