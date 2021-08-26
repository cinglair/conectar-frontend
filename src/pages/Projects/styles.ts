import styled, { css } from 'styled-components'
import { Icon } from '../../assets/icon/style'
import { BodyButton } from '../../components/UI/Button/styles'
import { DivScroll } from '../../components/UI/ContainerScroll/styles'
import { DivModalWindow } from '../../components/UI/Modal/styles'
import { ProfileLink } from '../../components/SuccessfulCreatorsCard/styles'

export const DivTags = styled.div`
  background: white;
  border-radius: 0.6rem;
  box-shadow: var(--boxShadow);
  padding: 0.6rem;
  legend {
    font: 600 1.2rem Raleway;
    margin: 0.4rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  aside {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-left: 0.4rem;
    > span {
      font-size: 0.8rem;
      word-break: normal;
      padding: 0.2rem;
      margin: 0.2rem;
      border-radius: 0.2rem;
      border: solid 1px var(--textGreen);
    }
    & + legend {
      margin-top: 0.8rem;
    }
  }
`
export const DivParticipants = styled.div`
  legend {
    font: 600 1rem Raleway;
    margin: 0.4rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  aside {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    padding-left: 0.4rem;
    ${ProfileLink} {
      flex-direction: column;
      column-gap: 0.2rem;
      h2 {
        font-size: 1rem;
      }
    }
  }
`
export const DivConvite = styled.div`
  background: white;
  border-radius: 0.6rem;
  box-shadow: var(--boxShadow);
  padding: 1rem;
  figure {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 20rem;
    }
    figcaption {
      font-size: 1.4rem;
      font-weight: 700;
      text-align: center;
    }
  }
  aside {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-left: 0.4rem;
  }
`
interface IPropsSobre {
  showSobre: boolean
}
export const DivSobre = styled.div<IPropsSobre>`
  display: none;
  ${props =>
    props.showSobre &&
    css`
      display: flex;
      @media (min-width: 1024px) {
        display: grid;
      }
    `}
  flex-direction: column;
  gap: var(--gap);
  .objdes {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    > section {
      background: white;
      border-radius: 0.6rem;
      box-shadow: var(--boxShadow);
      > legend {
        height: 3rem;
        font: 600 1.2rem Raleway;
        margin: 0.2rem 0;
        border-bottom: solid 1px var(--borderDivision);
        padding: 0.6rem 0.8rem 0.6rem 3rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .icon-objetivo {
          position: absolute;
          left: 0.5rem;
          cursor: initial;
        }
        img {
          font-size: 1.2rem;
          width: 1.6rem;
          margin: 0 0.5rem;
        }
      }
      > p {
        padding: 0.6rem 3rem;
      }
    }
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;

    column-gap: var(--gap);
    > header {
      border-radius: 0.4rem;
      box-shadow: var(--boxShadow);
    }

    .objdes {
      grid-column: 1;
      grid-row: 1;
      aside {
        border-radius: 0.4rem;
      }
    }
  }
`
interface IPropsVagas {
  showVagas: boolean
}
export const DivVagas = styled.div<IPropsVagas>`
  display: none;
  ${props =>
    props.showVagas &&
    css`
      display: flex;
    `}
  width: 100%;

  > section {
    width: 100%;
    > legend {
      display: none;
    }
    strong {
      font-weight: 600;
    }
    & + section {
      border-left: solid 1px var(--borderDivision);
      display: none;
    }
  }

  ${DivScroll} {
    width: 100%;
  }

  @media (min-width: 768px) {
    box-shadow: var(--boxShadow);
    border-radius: var(--borderRadius);
    background: white;
    > section {
      width: 50%;

      & + section {
        border-left: solid 1px var(--borderDivision);
        display: initial;
      }
      > legend {
        font: 600 1.2rem Raleway;
        border-bottom: solid 1px var(--borderDivision);
        padding: 0.6rem 0.8rem;
        display: flex;
        align-items: center;
        position: relative;
        height: 3rem;
        img {
          width: 1.6rem;
          margin: 0 0.5rem;
        }
        svg {
          position: absolute;
          right: 0.5rem;
          color: var(--green);
          cursor: pointer;
          font-weight: 600;
          font-size: 1.6rem;
        }
      }
      ${DivScroll} {
        border-bottom: solid 1px var(--borderDivision);
        padding-bottom: 1rem;
        overflow-y: auto;
        height: calc(100% - 2rem);
        min-height: 500px;
        li {
          border-radius: 0;
          border-bottom: solid 1px var(--borderDivision);
          box-shadow: none;
          margin: 0;
          padding: 0.6rem 2rem;
          cursor: pointer;
          transition: 0.2s;
        }
      }
      > aside {
        font-size: 0.8rem;
        padding: 1.4rem 3rem;
        display: flex;
        flex-direction: column;
        gap: 1.4rem;
        > p {
          line-height: 1.2rem;
        }
        ${DivTags} {
          box-shadow: none;
          padding: 0;
          legend {
            font-size: 0.8rem;
            ${Icon} {
              display: none;
            }
          }
        }
      }
    }
  }
`

export const ButtonFavorite = styled.button<{ checked: boolean }>`
  color: var(--yellow);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2rem;
  font: 600 14px Raleway;
  text-transform: uppercase;
  letter-spacing: 1.25px;
  cursor: pointer;
  border: 2px solid var(--yellow);
  margin: 0;
  padding: 0.6rem;
  outline: 0;
  gap: 0.4rem;
  width: 12rem;
  height: 2.2rem;
  > svg {
    width: 1.2rem;
    height: 1.2rem;
  }
  ${props =>
    props.checked &&
    css`
      color: white;
      background: var(--yellow);
    `}
`

export const BodyProjects = styled.div`
  --gap: 1.2rem;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
  padding-bottom: 2rem;
  ${DivSobre},${DivVagas},${DivConvite} {
    width: var(--container);
  }

  ${DivModalWindow} {
    > form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
      > button {
        align-self: flex-end;
      }
    }
  }
  > header {
    background: white;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    padding: 0 0.6rem; //desktop
    ${ProfileLink} {
      display: none;
      width: auto;
      height: auto;
    }
    > aside,
    ${ProfileLink} {
      position: absolute;
      right: 15px;
      top: 15px;
    }
    > aside {
      display: flex;
      align-items: center;
    }

    > div {
      border-bottom: solid 1px var(--borderDivision);
      padding-top: 1rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      h1 {
        font-size: 2rem;
        width: 60%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      > aside {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      > section {
        width: var(--container);
        display: flex;
        justify-content: space-between;
        align-items: center;

        a {
          font-size: 0.6rem;
          color: var(--gray);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          span {
            display: flex;
            align-items: center;
            gap: 0.2rem;
            img {
              width: 0.6rem;
              filter: grayscale(100%);
            }
          }
        }
      }
    }
    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 0.8fr 2.2fr;
      grid-template-rows: auto;
      column-gap: 1rem;
      box-shadow: var(--boxShadow);
      border-radius: 0.4rem;
      width: var(--container);
      ${ProfileLink} {
        display: flex;
      }
      > img {
        --marginLeft: 1.2rem;
        grid-column: 1;
        border-radius: 0.4rem;
        margin-left: var(--marginLeft);
        width: calc(100% - var(--marginLeft));
      }

      > div {
        border: 0;
        width: auto;
        grid-column: 2;
        gap: 1rem;
        > section {
          padding: 0 3rem 0 2rem;
          width: 100%;
          & + section {
            margin-top: 2.8rem;
          }
        }
      }
    }
  }
`
