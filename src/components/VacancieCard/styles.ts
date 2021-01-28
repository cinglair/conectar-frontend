import styled, { css } from 'styled-components'
import Dropdown from '../Dropdown'
import { BodyButton } from '../Dropdown/styles'
interface CardProps {
  isAvailable: boolean
  status?: 'accepted' | 'pending' | 'refused'
}
export const DropdownList = styled(Dropdown)`
  position: absolute;
  right: 0;
  color: var(--green-bg);
  li {
    list-style: none;
    width: 100%;
    cursor: pointer;
    :hover {
      background: var(--borderDivision);
    }
  }
`
export const BodyCard = styled.li<CardProps>`
  width: 168px;
  color: var(--green-bg);
  border-radius: var(--borderRadius);
  border: solid 1px var(--borderDivision);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 0.6rem;
  text-align: center;
  position: relative;
  ${BodyButton} {
    aside {
      li {
        text-align: start;
        list-style: none;
        width: 10rem;
        padding: 0.6rem;
        cursor: pointer;
        transition: 0.5s;
        font: 500 0.8rem Raleway;
        & + li {
          border-top: solid 1px var(--borderDivision);
        }
        :hover {
          background: var(--borderDivision);
        }
      }
    }
  }
  label {
    position: absolute;
    right: 0.6rem;
  }
  img {
    border-radius: 50%;
    width: 40%;
  }
  h2 {
    font-size: 1.4rem;
  }
  h3,
  h4 {
    font-size: 1rem;
  }
  aside {
    > span {
      opacity: 0;
      font: 600 0.8rem Raleway;
      ${({ status }) =>
        (status === 'accepted' &&
          css`
            opacity: 1;
            color: var(--green);
          `) ||
        (status === 'pending' &&
          css`
            opacity: 1;
            color: var(--yellow);
          `) ||
        (status === 'refused' &&
          css`
            opacity: 1;
            color: var(--red);
          `)};
    }
  }
  > legend {
    ${({ isAvailable }) =>
      isAvailable
        ? css`
            background: var(--green);
            color: var(--green-bg);
          `
        : css`
            background: var(--green-bg);
            color: white;
          `}
    //border-radius: var(--borderRadius);
    font: 600 1rem Raleway;
    padding: 0.1rem 0.4rem;
  }
  button {
    width: 100%;
    font-size: 1rem;
    height: 2rem;
  }
`
