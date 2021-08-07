import styled, { createGlobalStyle } from 'styled-components'
import backgroud from '../image/background.svg'
export const GlobalStyle = createGlobalStyle`
:root {
    /* font-size: 60%; */


    --yellow:  #ebae3c;
    --yellow-dark: #fea81b;
    --green: #99b876;
    --textGreen: #072f3f;
    --red: #d8252c;
    --red-dark: #c92228;
    --backgroundElevation: #fafafa;
    --gray: #999999;
    --background: #f1f1f1ff;
    --borderDivision: #f0eeee;
    --borderRadius: 0.6rem;
    --container: min(1156px, 90vw);
    --boxShadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
    
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    
}

.container {
    width: var(--container);
}

#root {
    font-family: Raleway !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color:var(--background);
    /* background-image:url(${backgroud});
    background-position:center;
    background-attachment:fixed;
    background-size:100%;
    background-repeat:no-repeat; */
    color: var(--textGreen);
    position: relative;
    
}

@media (min-width: 700px) {
    /* :root {
        font-size: 62.5%;
    } */
}

fieldset {
    border: 0;
}

button {
    cursor: pointer;
}
a{
    color: var(--textGreen);
    text-decoration: none;
}
input,
button,
select,
textarea {
    outline: none;
}

.swal2-popup {
  font-family: Raleway !important;
  width: auto;
  padding: 1.5rem;

}
.confirmButtonSweet, .cancelButtonSweet, .denyButtonSweet {
  width: 12rem;
  height: 2.2rem;
  padding: 0.6rem;
}


.confirmButtonSweet {
  /* background: var(--green)!important; */
  color: white !important;
  box-shadow: none!important;
  font-weight: 600;
  border-radius: 2rem!important;
  text-transform: uppercase;
}

.cancelButtonSweet {
  border-radius: 2rem!important;
  box-shadow: none!important;
  text-transform: uppercase;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  
}

.denyButtonSweet {
  border-radius: 2rem!important;
  box-shadow: none!important;
  text-transform: uppercase;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
#loadingContainer{
    position:absolute;
    z-index:1000;
    width: 100%;
    height: 100%;
    background:rgba(0, 0, 0, 0.5);;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
        height: 8rem;
        width: 8rem;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background: transparent;
    }
}

`
