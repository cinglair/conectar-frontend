import React, { useContext } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import NavBar from '../../components/UI/NavBar'
import { BodyHome } from './styles'
import Login from '../../components/UI/Login'
import hero from '../../assets/image/landing_page.svg'
import lamp from '../../assets/image/lampada.svg'
import card_colaborador from '../../assets/image/card_colaborador.svg'
import card_idealizador from '../../assets/image/card_idealizador.svg'
import card_aliado from '../../assets/image/card_aliado.svg'
import colaborador from '../../assets/image/colaborador.svg'
import idealizador from '../../assets/image/idealizador.svg'
import aliado from '../../assets/image/aliado.svg'
import curtiu from '../../assets/image/curtiu.svg'
import { IoIosArrowDown } from 'react-icons/io'
import { Context } from '../../context/AuthContext'
import Button from '../../components/UI/Button'
import Footer from '../../components/UI/Footer'

const Home: React.FC = () => {
  const { AMAZON_URL } = process.env
  console.log(AMAZON_URL)
  const { handleLogin, isAuthenticated } = useContext(Context)
  const history = useHistory()

  return isAuthenticated ? (
    <Redirect to="/explorar" />
  ) : (
    <BodyHome>
      <main>
        <div className="topo-background">
          <NavBar />
          <div className="container topo">
            <section className="hero">
              <img src={hero} alt="imagem de redes neurais" />
            </section>
            <section className="area-login">
              <h1>
                <strong>
                  Encontre o <br />
                </strong>
                time ideal
              </h1>

              <Login
                onSuccessLogin={() => {
                  history.push('/explorar')
                  handleLogin(true)
                }}
              />
            </section>

            <a className="arrow-bottom" href="#introducao">
              <IoIosArrowDown />
            </a>
          </div>
        </div>
        <div id="introducao">
          <aside>
            <h3>Se liga em como tudo acontece</h3>
          </aside>
          <main>
            <section className="intro-box">
              <h4>Você já teve uma ideia brilhante e pensou:</h4>
              <p>
                “Acho que com uma equipe qualificada, um(a) mentor(a) com
                experiência e um belo investimento esse projeto poderia ajudar
                muita gente e ainda me traria grandes benefícios?” Ou já se
                imaginou em uma oportunidade de trabalhar com o que realmente
                domina e se sente feliz?
              </p>
            </section>
            <section className="texto">
              <img src={lamp} alt="ideia" />
              <h4>
                Imagina quantos projetos cheios de potencial estão “mofando na
                gaveta” neste exato momento
              </h4>
              <p>
                Nós do Conectar estamos aqui para tirar a poeira dessas ideias e
                impulsionar o surgimento de novos projetos, conectando essas
                ideias brilhantes e inovadoras aos times perfeitos e à incríveis
                aliados para que sejam finalmente colocados em prática.
              </p>
            </section>
          </main>

          <a className="arrow-bottom" href="#perfis">
            <IoIosArrowDown />
          </a>
        </div>
        <div id="perfis">
          <legend>
            Para fazer isso de forma <strong>automatizada</strong> nossos
            usuários podem escolher aquele(s) tipo(s) de perfil que mais se
            identificam dentre as seguintes opções:
          </legend>
          <main>
            <section className="area-cards">
              <input
                type="radio"
                id="radIdea"
                name="perfil"
                value="idealizador"
                defaultChecked
              />
              <aside>
                <label htmlFor="radIdea">
                  <div>
                    <img src={card_idealizador} alt="Idealizador" />
                    <legend>Idealizador</legend>
                  </div>
                </label>
                <div className="descricao">
                  <p>
                    O idealizador disponibiliza aquela ideia inovadora, descreve
                    os detalhes do seu projeto e busca o time perfeito para
                    tirar sua ideia do papel colocando-a em prática.
                  </p>
                  <a href="#idealizador">
                    <Button theme="primary">Saiba mais</Button>
                  </a>
                </div>
              </aside>
              <input
                type="radio"
                id="radColab"
                name="perfil"
                value="colaborador"
              />
              <aside className="teste">
                <label htmlFor="radColab">
                  <div>
                    <img src={card_colaborador} alt="Colaborador" />
                    <legend>Colaborador</legend>
                  </div>
                </label>
                <div className="descricao">
                  <p>
                    Preenchendo o seu perfil com relatos de suas experiências e
                    habilidades, o colaborador pode ser selecionado para fazer
                    parte de um time incrível, com uma ideia e uma função que
                    você sempre sonhou, além de aumentar as suas aptidões e
                    embelezar o seu currículo com essa ótima oportunidade.
                  </p>
                  <a href="#colaborador">
                    <Button theme="primary">Saiba mais</Button>
                  </a>
                </div>
              </aside>
              <input type="radio" id="radAlia" name="perfil" value="aliado" />
              <aside>
                <label htmlFor="radAlia">
                  <div>
                    <img src={card_aliado} alt="Aliado" />
                    <legend>Aliado</legend>
                  </div>
                </label>
                <div className="descricao">
                  <p>
                    Com suas experiências e habilidades o aliado pode apoiar
                    empreendedores e acompanhar a transformação de pequenas
                    ideias em grandes realizações.
                  </p>
                  <a href="#aliado">
                    <Button theme="primary">Saiba mais</Button>
                  </a>
                </div>
              </aside>
            </section>
          </main>

          <a className="arrow-bottom" href="#idealizador">
            <IoIosArrowDown />
          </a>
        </div>
        <div id="idealizador">
          <h3>Idealizador</h3>

          <section>
            <img src={idealizador} alt="Avatar fictício do idealizador" />
            <div className="area-texto">
              <p>
                Basicamente, o idealizador é o ponto principal do projeto, é
                quem propõe a ideia visando fazer dela um projeto ou até mesmo
                um produto. Se identificou com esse perfil? Possui ideias
                brilhantes que foram deixadas de lado? Nós podemos te ajudar a
                encontrar um time de colaboradores com as habilidades
                necessárias para fazer acontecer, o apoio que precisa de um
                aliado com experiência e até um investimento. Tudo isso de forma
                automatizada. Basta seguir o tutorial:
              </p>
              <aside>
                <section>
                  <legend>Passo 01</legend>
                  <p>Crie uma conta e um novo projeto com a sua ideia</p>
                </section>
                <section>
                  <legend>Passo 02</legend>
                  <p>
                    Adiciona as vagas disponíveis no projeto e as habilidades
                    que os candidatos devem dominar para a realização do projeto
                  </p>
                </section>
                <section>
                  <legend>Passo 03</legend>
                  <p>
                    Faça um convite para os candidatos que foram selecionados, e
                    após o aceite o time estará completo e pronto para essa nova
                    jornada
                  </p>
                </section>
              </aside>
            </div>
            <Button
              onClick={() => history.push(`/cadastrar/a`)}
              theme="primary"
            >
              Criar sua conta
            </Button>
          </section>

          <a className="arrow-bottom" href="#colaborador">
            <IoIosArrowDown />
          </a>
        </div>

        <div id="colaborador">
          <h3>Coladorador</h3>

          <section>
            <div className="area-texto">
              <p>
                Os colaboradores são responsáveis pelo desenvolvimento do
                projeto. Se identificou com esse perfil? Uma equipe pode estar
                esperando pelas suas habilidades. O Conectar pode ajudar a
                encontrar esse projeto que se encaixa perfeitamente com você,
                além disso é possível demonstrar interesse em projetos públicos
                da aba “Explorar” e concorrer por vagas em áreas diferentes da
                sua linha de atuação, mas que podem compensar o esforço para
                aprender algo novo. Basta seguir o tutorial:
              </p>
              <aside>
                <section>
                  <legend>Passo 01</legend>
                  <p>
                    Crie uma conta e nos conte sobre você e suas experiências
                  </p>
                </section>
                <section>
                  <legend>Passo 02</legend>
                  <p>
                    Adicione suas áreas de atuação, suas habilidades e as
                    ferramentas que possui domínio
                  </p>
                </section>
                <section>
                  <legend>Passo 03</legend>
                  <p>
                    Além de se tornar um candidato, passa a ser possível
                    demonstrar interesse em projetos diferentes
                  </p>
                </section>
              </aside>
            </div>

            <Button
              onClick={() => history.push(`/cadastrar/a`)}
              theme="primary"
            >
              Criar sua conta
            </Button>
            <img src={colaborador} alt="Avatar fictício do colaborador" />
          </section>

          <a className="arrow-bottom" href="#aliado">
            <IoIosArrowDown />
          </a>
        </div>
        <div id="aliado">
          <h3>Aliado</h3>

          <section>
            <img src={aliado} alt="Avatar fictício do colaborador" />
            <div className="area-texto">
              <p>
                O aliado é o apoiador do projeto, este apoio pode vir em forma
                de mentoria, consultoria, apoio técnico ou até mesmo financeiro
                com uma proposta de investimento ao projeto. Se identificou com
                esse perfil? Nós podemos te ajudar a encontrar um projeto que
                mereça a sua atenção, com grandes potencias e que possam render
                bons frutos para a comunidade e até financeiramente. Basta
                seguir o tutorial:
              </p>
              <aside>
                <section>
                  <legend>Passo 01</legend>
                  <p>
                    Crie uma conta e nos conte sobre você e suas experiências
                  </p>
                </section>
                <section>
                  <legend>Passo 02</legend>
                  <p>
                    Adicione sua área de atuação, suas habilidades e ferramentas
                    que possui domínio
                  </p>
                </section>
                <section>
                  <legend>Passo 03</legend>
                  <p>
                    Agora sim, você pode encontrar ideias promissoras e começar
                    a transforma-las em grandes projetos
                  </p>
                </section>
              </aside>
            </div>
            <Button
              onClick={() => history.push(`/cadastrar/a`)}
              theme="primary"
            >
              Criar sua conta
            </Button>
          </section>

          <a className="arrow-bottom" href="#rodape">
            <IoIosArrowDown />
          </a>
        </div>

        <div id="rodape">
          <p>
            E ainda dá pra
            <strong> explorar </strong>e<strong> interagir </strong>
            com os projetos publicados por aqui.
            <br />
            Sinceramente, só falta
            <strong> você </strong>
          </p>
          <aside>
            <img src={curtiu} alt="e aí curtiu? vem pra cá!" />

            <Button
              onClick={() => history.push(`/cadastrar/a`)}
              theme="primary"
            >
              Crie sua conta
            </Button>
          </aside>
          <Footer />
        </div>
      </main>
    </BodyHome>
  )
}
export default Home
