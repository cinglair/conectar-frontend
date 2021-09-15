import React from 'react'
import NavBar from '../../components/UI/NavBar'
import { BodySobre } from './styles'
import sobre_1 from '../../assets/image/sobre_1.png'
import sobre_2 from '../../assets/image/sobre_2.png'
import sobre_3 from '../../assets/image/sobre_3.png'
import { FaCheck } from 'react-icons/fa'
import Footer from '../../components/UI/Footer/index'

const Sobre: React.FC = () => {
  return (
    <BodySobre>
      <NavBar />
      <section>
        <div id="parte_um">
          <img src={sobre_1} alt="" />
          <aside>
            <h1>
              Gerencie suas iniciativas de inovação em uma única plataforma.
            </h1>
            <h2>
              Para isso criamos uma oportunidade para você tirar a ideia do
              papel e achar o time ideal: o CONECTAR
            </h2>
          </aside>
        </div>
        <div id="parte_dois">
          <div className="box-information">
            <h1>O que é o Conectar?</h1>
            <h2>
              É uma plataforma e uma rede social de registro de projetos e
              registro de candidatos a vagas, combinando esses candidatos com
              possíveis projetos de acordo com as suas experiências
              educacionais, profissionais, habilidades e características.
            </h2>
          </div>
          <section>
            <p>
              A cultura que estamos construindo no CONECTAR consiste em uma
              plataforma inclusiva que oportuniza diferentes perfis como aqueles
              que possuem uma ideia, aqueles que desejam apoiar essas ideias e
              aqueles que estão em busca de uma oportunidade de aplicar seus
              conhecimentos de forma prática.
            </p>
            <img src={sobre_2} alt="" />
          </section>
        </div>
        <div id="parte_tres">
          <div className="box-information">
            <h1>Nossa Missão:</h1>
            <h2>
              Garantir uma plataforma que forneça ao{' '}
              <strong> idealizador </strong> o registro de suas ideias de uma
              forma segura, além de sugerir um time adequado de acordo com as
              suas necessidades; aos <strong> colaboradores </strong> uma
              maneira rápida de identificar oportunidades de atuação de acordo
              com as suas habilidades e experiências; e aos{' '}
              <strong> aliados </strong> a possibilidade de realizar
              investimentos e apoiar as ideias registradas seja de forma técnica
              ou por meio de consultorias.
            </h2>
          </div>
          <section>
            <p>Atualmente nossa plataforma dispõe dos seguintes recursos:</p>
            <div id="grid">
              <aside className="box-check">
                <FaCheck />
                <div>
                  <h1>Um ou mais tipos de perfis:</h1>
                  <p> • &emsp;Idealizador </p>
                  <p> • &emsp;Colaborador </p>
                  <p> • &emsp;Aliado </p>
                </div>
              </aside>
              <aside className="box-check">
                <FaCheck />
                <div>
                  <h1>Gerenciamento de vagas:</h1>
                  <p>
                    {' '}
                    O Idealizador pode cadastrar as vagas para o projeto criado
                    de forma fácil e ilimitada.{' '}
                  </p>
                </div>
              </aside>
              <aside className="box-check">
                <FaCheck />
                <div>
                  <h1>Rede social:</h1>
                  <p>
                    A plataforma permite que os diferentes perfis interajam e se
                    conectem a partir de seus interesses e/ou habilidades..{' '}
                  </p>
                </div>
              </aside>
              <aside className="box-check">
                <FaCheck />
                <div>
                  <h1>Gerenciamento de acordos:</h1>
                  <p>
                    A plataforma oferece a geração automática de um acordo entre
                    o Idealizador e o Colaborador. Neste acordo é especificado o
                    tipo de vinculado que o Colaborador assumirá no projeto e
                    deve ser assinado por ambas as partes interessadas.{' '}
                  </p>
                </div>
              </aside>
              <aside className="box-check">
                <FaCheck />
                <div>
                  <h1>Notificações:</h1>
                  <p>
                    A plataforma alerta os colaboradores quando um convite para
                    atuar em projeto foi enviado bem como o seu prazo de
                    expiração, e os idealizadores quando um convite foi aceito
                    ou recusado.{' '}
                  </p>
                </div>
              </aside>
              <aside className="box-check">
                <FaCheck />
                <div>
                  <h1>Conexão time ideal e projeto:</h1>
                  <p>
                    O time pode ser sugerido automaticamente com base nas
                    características do projeto e nas características do
                    colaborador ou o colaborador pode se interessar por uma vaga
                    facilitando a identificação do time.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        </div>
        <div id="parte_quatro">
          <strong>
            Quando as pessoas têm uma ideia, é importante viabilizá-la. As
            oportunidades surgem, as portas se abrem e os sonhos se tornam
            realidade. Nosso objetivo é possibilitar que essas ideias se tornem
            produtos!
          </strong>
          <img src={sobre_3} alt="" />
        </div>
        <Footer />
      </section>
    </BodySobre>
  )
}

export default Sobre
