import styled, { css } from 'styled-components'
import Tooltip from '../Tooltip'

export const Error = styled(Tooltip)`
  svg {
    margin: 0;
    color: var(--red);
    cursor: pointer;
  }
  span {
    background: var(--red);
    color: white;
    &::before {
      border-color: var(--red) transparent;
    }
  }
`
export const BodyField = styled.label<{ isEmpty: boolean }>`
  --fieldHeight: 2.4rem;
  --marginTop: 1.6rem;
  --fontSize: 0.8rem;
  --iconSize: 1.2rem;
  width: max(100%, 10rem);
  min-height: var(--fieldHeight);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 0.2rem;
  margin-top: var(--marginTop) !important;
  padding: 0 0.4rem 0 0.8rem;
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  cursor: text;
  font: 400 0.8rem Raleway;
  ${Error} {
    align-self: flex-start;
    margin-top: calc(
      (var(--fieldHeight) - var(--marginTop) + var(--iconSize) / 2) / 2
    );
    svg {
      font-size: var(--iconSize);
    }
  }
  a {
    text-decoration: none;
    position: absolute;
    top: -1rem;
    right: 0.2rem;
    color: var(--gray);
    font-size: 0.7rem;
  }

  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: calc((var(--fieldHeight) - var(--marginTop) + var(--fontSize)) / 2);
    color: gray;
    left: 0.8rem;
    transition: 0.5s;
    cursor: text;
  }

  :focus-within {
    label {
      top: -1rem;
      left: 0.2rem;
      color: var(--green-bg);
    }
    span {
      opacity: 1;
      visibility: visible;
    }
  }
  ${props =>
    !props.isEmpty &&
    css`
      label {
        top: -1rem;
        left: 0.2rem;
        color: var(--green-bg);
      }
      span {
        opacity: 0;
        visibility: hidden;
      }
    `}

  :focus-within::after {
    width: calc(100% -3.2rem);
    height: 1.92px;
    content: '';
    background: var(--green-bg);
    position: absolute;
    left: 1.6rem;
    right: 1.6rem;
    bottom: 0;
  }
`
