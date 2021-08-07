import styled from 'styled-components'
import { BodyButton } from '../UI/Button/styles'
export const BodyCard = styled.div`
  display: grid;
  --gridColumn1: 35%;
  gap: 0.6rem;
  --gridColumn2: calc(65% - 0.6rem);
  grid-template-columns: var(--gridColumn1) var(--gridColumn2);
  grid-template-rows: 2fr 1fr;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: var(--boxShadow);
  border-radius: 0.8rem;
  a > img {
    background: var(--borderDivision);
    grid-column: 1;
    grid-row: 1 / -1;
    border: solid 1px var(--borderDivision);
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
    object-position: center;
    z-index: 2;
    margin: 10%;
  }
  > section {
    grid-column: 2;
    grid-row: 1;
  }
  > aside {
    border-top: solid 2px var(--borderDivision);
    grid-column: 1 / -1;
    grid-row: 2;
    display: grid;
    align-items: center;
    grid-template-columns: var(--gridColumn1) calc(var(--gridColumn2) / 2) calc(
        var(--gridColumn2) / 2
      );
    > ${BodyButton} {
      width: 90%;
      grid-column: 2;
      margin: 0.5rem 5%;
      grid-row: 1;
    }
    > span {
      grid-column: 2 / -1;
      grid-row: 1;

      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0;
      img {
        width: 1.4rem;
      }
    }
    ${BodyButton} + span {
      grid-column: 3;
      width: 50%;
      margin: 0.5rem 25%;
    }
  }
`
