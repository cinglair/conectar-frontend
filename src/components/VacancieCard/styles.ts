import styled, { css } from 'styled-components'
import { TypeStatusVacancy } from '.'
import Dropdown from '../UI/Dropdown'
import { BodyButton as DropdownStyle } from '../UI/Dropdown/styles'
import { DivModalWindow } from '../UI/Modal/styles'
interface CardProps {
  isAvailable: boolean
  status?: TypeStatusVacancy
}
export const DropdownList = styled(Dropdown)`
  position: absolute;
  right: 0;

  li {
    list-style: none;
    width: 100%;
    cursor: pointer;
    :hover {
      background: var(--borderDivision);
    }
  }
`
export const ProfileButton = styled.button`
  background: transparent;
  border: none;
  width: 90%;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: flex-start;
  gap: 0.6rem;
  margin: 0.4rem;
  margin-left: 2rem;
  > img {
    border-radius: 50%;
    border: solid 1px var(--borderDivision);
    width: 2.4rem;
    height: 2.4rem;
    object-fit: cover;
    object-position: center;
  }
  > aside {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > h2 {
      font-size: 1rem;
      word-break: keep-all;
    }
    > p {
      text-align: center;
      color: var(--gray);
      font-size: 0.8rem;
    }
  }
  &:hover {
    background: var(--backgroundElevation);
  }
`

export const StyleInput = styled.form`
  background: white;
  box-shadow: var(--boxShadow);
  height: 2.4rem;
  width: 60%;
  margin: 0.2rem 0 2rem;
  padding: 0 0.2rem;
  border-radius: 0.2rem;
  display: flex;
  align-items: center;
  > input {
    border: 0;
    width: max-content;
    background: transparent;
    height: 2rem;
    outline: 0;
    padding: 0 0.6rem;
    flex: 1;
  }
  > button {
    display: flex;
    align-items: center;
    border: 0;
    background: transparent;
    padding: 0 0.4rem;
    border-right: 2px solid var(--borderDivision);
    cursor: pointer;
    width: 2rem;
    img {
      width: 16px;
    }
  }
`
export const BodyCard = styled.li<CardProps>`
  width: 168px;
  border-radius: var(--borderRadius);
  border: solid 1px var(--borderDivision);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 0.6rem;
  text-align: center;
  position: relative;
  ${DropdownStyle} {
    width: 100%;
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
  > label {
    position: absolute;
    right: 0.6rem;
  }
  > a {
    > img {
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }
    > h2 {
      font-size: 1.4rem;
    }
  }
  > h3,
  h4 {
    font-size: 1rem;
  }
  > aside {
    > span {
      opacity: 0;
      font: 600 0.8rem Raleway;
      ${({ status }) =>
        (status === 'Aceito' &&
          css`
            opacity: 1;
            color: var(--green);
          `) ||
        (status === 'Pendente' &&
          css`
            opacity: 1;
            color: var(--yellow);
          `) ||
        (status === 'Recusado' &&
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
          `
        : css`
            background: var(--textGreen);
            color: white;
          `}
    //border-radius: var(--borderRadius);
    font: 600 1rem Raleway;
    padding: 0.1rem 0.4rem;
  }
  > button {
    width: 100%;
    font-size: 0.8rem;
    height: 2rem;
  }
  ${DivModalWindow} {
    min-height: 400px;
  }
`
