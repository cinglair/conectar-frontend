import styled, { css } from 'styled-components';



interface StepProps {
    showSecondStep: boolean;
}



export const BodyCreateProject = styled.div<StepProps>`
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    width:100vw;
    background:var(--green-bg);
    .area-central{
        background:var(--white);
        padding:2.4rem;
        border-radius:0.8rem;
        border:2px solid var(--green);
        
        h1{
            margin:1.4rem 0;
            color: var(--green-bg);
        }
        section{
            display:flex;
            justify-content:space-between;
            align-items: center;
            margin:0.6rem 0;
            div + div {
                margin-left:0.8rem;
            }
        }
        .primeira-etapa{
            ${props =>
                props.showSecondStep ? css`display:none;` : css`display:grid;`
            } 
        }
        .segunda-etapa {
            ${props =>
                props.showSecondStep ? css`display:grid;` : css`display:none;`
            }  
        }
        main{
            grid-template-columns:2fr 3fr;
            grid-template-rows:1fr;
            grid-gap:2rem;
            >section{
                grid-row:2;
                grid-column:1/-1;
                
            }

            .area-select{
                justify-content:space-around;
            }
                    
            
                    .upload-img{
                        width:100%;
                        >label{
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            font: 400 1rem Roboto;
                            color:var(--orange);
                        }
                        .view-img{
                            margin-top: 0.2rem;
                            border:2px dashed var(--yellow);
                            border-radius:0.4rem;
                            display:flex;
                            flex-direction:column;
                            align-items:center;
                            justify-content:flex-start;
                            padding:0.8rem;
                            outline:0;
                            label{
                                margin-top:1.6rem;
                                padding:0.6em;
                                cursor:pointer;
                                border-radius:0.4rem;
                                background:var(--green-bg);
                                color:white;
                                font:500 1rem Roboto;
                            }
                            input{
                                display:none;
                            }
                            p{
                                margin-top:.8rem;
                                color:gray;
                                font-size:.8rem;
                            }
                        }
                    }
                    
        }

        
    }
`;