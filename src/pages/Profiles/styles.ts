import styled, { css } from 'styled-components'
import { DivScroll } from '../../components/UI/ContainerScroll/styles'
interface IButtonList {
  borderBottom: boolean
}
export const ButtonList = styled.button<IButtonList>`
  --buttonHeight: 55px;
  width: 50%;
  height: var(--buttonHeight);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.6rem 0;
  border: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--textGreen);
  border-top: solid 1px var(--borderDivision);
  border-left: solid 1px var(--borderDivision);
  background: transparent;
  position: relative;

  ${props =>
    props.borderBottom &&
    css`
      :after {
        width: calc(100% -3.2rem);
        height: 2px;
        content: '';
        background: var(--textGreen);
        position: absolute;
        left: 1.6rem;
        right: 1.6rem;
        bottom: 0;
      }
    `}
`
export const ProjetosSection = styled.section`
  grid-column: 2;
  width: calc(100% - 2rem);
  margin-right: 2rem;
  padding: 2rem 0 2rem 2rem;
  ul {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100% !important;
  }
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h2 {
      margin-top: 1rem;
    }
    h1 {
      margin-top: 0.2rem;
      font-weight: 400;
      font-size: 1rem;
    }

    svg {
      width: 30px;
      height: 30px;
    }
  }
  @media (min-width: 1024px) {
  }
`
export const ExperienciasDiv = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.4rem;
  width: 90vw;
  position: relative;
  word-break: break-word;
  > button {
    background: transparent;
    padding: 0.2rem 0.4rem;
    display: flex;
    align-items: center;
    flex-flow: column nowrap;
    gap: 2rem;
    border-radius: 50%;
    border: solid 2px transparent;
    padding: 0.6rem;
    img {
      width: 3rem;
      height: 2.6rem;
    }
    aside {
      transition: 0.5s;
      position: absolute;
      width: 90vw;
      left: 0;
      top: 3rem;
      opacity: 0;
      visibility: hidden;
      text-align: center;
      padding: 1rem 0.4rem;
      legend {
        font: 500 1.2rem Raleway;
      }
      p {
        margin-top: 0.4rem;
        line-height: 1.2rem;
      }
    }
    &:focus {
      margin-bottom: 8em;
      border: solid 2px var(--borderDivision);

      aside {
        opacity: 1;
        visibility: visible;
        border-radius: 0 0 1rem 1rem;
      }
    }
  }
  @media (min-width: 1024px) {
    flex-flow: column nowrap;
    padding: 1.4rem 0;
    width: 100%;
    > button {
      width: 100%;
      cursor: initial;
      justify-content: flex-start;
      flex-flow: row nowrap;
      word-break: break-all;
      border-radius: 0;
      aside {
        position: initial;
        width: auto;
        height: auto;
        opacity: 1;
        visibility: visible;
        text-align: start;
        padding: 0;
      }
    }
    > button {
      &:focus {
        margin-bottom: 0;
        border: solid 2px transparent;
      }
    }
  }
`
export const PerfilMain = styled.main`
  width: 100%;
  display: flex;
  height: auto;
  > figure {
    width: 100%;
    height: 1fr;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: -5rem;
    gap: 0.8rem;
    > img {
      border-radius: 50%;
      width: 8rem;
      height: 8rem;
      object-fit: cover;
      object-position: center;
      background: white;
      border: solid 2px var(--borderDivision);
      padding: 0.2rem;
    }
    > figcaption {
      display: flex;
      flex-direction: column;
      text-align: center;
    }
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    > svg {
      width: 4px;
      height: 4px;
    }
    > Button {
      font-weight: 400;
      font-size: 10px;
      width: auto;
      height: auto;
    }
  }
  > section {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    height: 1fr;
    gap: 1rem;
    > aside {
      display: flex;
      gap: 1rem;
      > img {
        width: 2rem;
      }
    }
  }
  @media (min-width: 1024px) {
    flex-direction: column;
    gap: 1rem;
    > figure {
      margin: 0;
      align-items: center;
      > img {
        margin: 0;
      }
      > figcaption {
        align-items: center;
      }
    }
  }
`
export const PerfilDiv = styled.div`
  padding: 0.8rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: space-evenly;
  max-height: 90vh;
  width: 90vw;
  ${DivScroll} {
    .view {
      display: flex;
      flex-direction: column;
    }
    ul {
      display: flex;
      flex-flow: row wrap;
      gap: 0.4rem;
      padding: 0.4rem 0;
      width: 100%;
      h3 {
        display: none;
      }

      li {
        list-style: none;
        border: solid 1px var(--textGreen);
        border-radius: 0.8rem;
        padding: 0.2rem 0.4rem;
        font-size: 0.8rem;
      }
    }
  }
  > h4 {
    cursor: pointer;
  }
  @media (min-width: 1024px) {
    border-radius: 0.8rem;
    background: white;
    grid-column: 1;
    padding: 2rem 0.8rem;
    box-shadow: var(--boxShadow);
    width: auto;
    ${DivScroll} {
      ul {
        order: 3;
        h3 {
          display: initial;
          align-self: flex-start;
          width: 100%;
          margin: 0.5rem 0;
        }
      }
      ${ExperienciasDiv} {
        order: 2;
      }
    }

    > h4 {
      order: 4;
    }
  }
`
export const Page = styled.div`
  width: 100%;
  height: 100%;
  min-height: 110vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  --PerfilWidth: 432px;
  > main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 2rem;
    width: 100%;
    position: relative;
    ${PerfilDiv} {
      order: 2;
    }
    > header {
      position: sticky;
      top: calc(-250px + 55px);
      background: white;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      > aside {
        width: 100%;
        height: 250px;
        display: flex;
        justify-content: flex-end;
        padding-right: 1rem;
        border-bottom: solid 2px var(--borderDivision);
        > img {
          width: calc(100% / 4 - 2rem);
          & + img {
            margin-left: -0.5vw;
          }
        }
      }
      > section {
        display: flex;
        align-items: center;
        width: 100%;
        order: 3;
      }
    }
  }
  @media (min-width: 1024px) {
    > main {
      width: min(1100px, 90vw);
      display: grid;
      grid-template-columns: var(--PerfilWidth) 1.4fr;
      grid-template-rows: auto auto;
      align-items: flex-start;
      ${PerfilDiv} {
        grid-column: 1;
        position: sticky;
        top: 45px;
        width: calc(var(--PerfilWidth) - 2rem);
        margin-left: 2rem;
        margin-top: -256px;
      }
      > header {
        grid-column: 1 / -1;
        grid-row: 1;
        border-radius: 0.8rem;
        box-shadow: var(--boxShadow);
        display: grid;
        grid-template-columns: var(--PerfilWidth) 1.4fr;
        grid-template-rows: repeat(2, auto);
        > aside {
          grid-column: 2;
          grid-row: 1;
          padding: 0 2rem;
          border-bottom: 0;
          min-height: 10rem;
          > img {
            width: calc(100% / 3 - 2rem);
          }
        }
        > section {
          grid-column: 2;
          grid-row: 2;
        }
      }
      > ul {
        grid-column: 2;
        grid-row: 2;
      }
    }
  }
`
