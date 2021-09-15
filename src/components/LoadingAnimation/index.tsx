import React, { useEffect, useState } from 'react'
import { Background, StyledLottie } from './styles'
import loopAnimationData from '../../assets/json/LOOP.json'
import inAnimationData from '../../assets/json/IN.json'
import outAnimationData from '../../assets/json/OUT.json'
import useLoading from '../../context/hooks/useLoading'
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
      setAnimationState({
        isPaused: false,
        isStopped: true,
      })
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
    </Background>
  )
}

export default LoadingAnimation
