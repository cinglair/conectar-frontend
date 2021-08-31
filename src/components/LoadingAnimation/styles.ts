import styled, { css } from 'styled-components'
import Lottie from 'react-lottie'
export const StyledLottie = styled(Lottie)`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background: transparent;
`
interface IBGProps {
  displayIsNone: boolean
}
export const Background = styled.div<IBGProps>`
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(7, 47, 63, 0.3);
  display: ${props => (props.displayIsNone ? css`none` : css`flex`)};
  justify-content: center;
  align-items: center;
`
