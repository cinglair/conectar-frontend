import React, {
  InputHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  BodyCard,
  ButtonFavorite,
  ButtonInterest,
  ProjectInfo,
  UserInfo,
} from './styles'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { AreaType } from '../UI/SelectArea'
import { ToolType } from '../UI/SelectTools'
import { BsStar, BsFillStarFill } from 'react-icons/bs'
import { IconType } from 'react-icons'
import {
  FaRegHandPointer,
  FaHandPointer,
  FaGalacticSenate,
} from 'react-icons/fa'
import { Context } from '../../context/AuthContext'
import { toMonth } from '../../utils/dates'
interface IPessoa {
  foto_perfil: string
  usuario: string
  nome: string
  id: number
}
export interface IProject {
  nome: string
  descricao: string
  visibilidade: true
  objetivo: string
  pessoa_id: number
  id: string
  areas: AreaType[]
  habilidades: ToolType[]
  data_criacao: string
}
interface IProjectCardProps {
  project: IProject
  hiddeOwner?: true
}

const ProjectCard: React.FC<IProjectCardProps> = ({ project, hiddeOwner }) => {
  const [favoriteId, setFavoriteId] = useState<number>(0)
  const [interesseId, setInteresseId] = useState<number>(0)
  const [user, setUser] = useState<IPessoa>()
  const loggedUser = useContext(Context).user
  const SelectFavorite: any = () => {
    if (favoriteId) {
      return <BsFillStarFill />
    }
    return <BsStar />
  }
  const SelectInteresse: IconType = ({ ...rest }) => {
    if (interesseId) {
      return <FaHandPointer {...rest} />
    }
    return <FaRegHandPointer {...rest} />
  }

  useEffect(() => {
    api.get(`/api/v1/pessoas/${project.pessoa_id}`).then(response => {
      setUser(response.data)
    })
  }, [project.pessoa_id])
  useEffect(() => {
    if (project.id && user?.id)
      api
        .get(`/api/v1/reacoes?pessoa_id=${user?.id}&projeto_id=${project.id}`)
        .then(response => {
          setFavoriteId(response.data.id)
        })
  }, [project.id, user?.id])
  function ToogleFavorite() {
    if (interesseId) {
      api.delete(`/api/v1/reacoes${interesseId}`).then(response => {
        setFavoriteId(0)
      })
    } else {
      api
        .post('/api/v1/reacoes', {
          reacao: 'FAVORITO',
          pessoa_id: loggedUser?.id,
          projeto_id: project.id,
        })
        .then(response => {
          setFavoriteId(response.data.id)
        })
    }
  }
  function ToogleInteresse() {
    if (interesseId) {
      api.delete(`/api/v1/reacoes${interesseId}`).then(response => {
        setInteresseId(0)
      })
    } else {
      api
        .post('/api/v1/reacoes', {
          reacao: 'INTERESSE',
          pessoa_id: loggedUser?.id,
          projeto_id: project.id,
        })
        .then(response => {
          setInteresseId(response.data.id)
        })
    }
  }

  return (
    <BodyCard>
      {!hiddeOwner && (
        <>
          <Link to={`/perfil/${user?.usuario}`}>
            <img
              src="https://upload.wikimedia.org/wikipedia/pt/thumb/4/4d/Clube_do_Remo.png/120px-Clube_do_Remo.png"
              alt={user?.nome}
            />
          </Link>
          <UserInfo>
            <Link to={`/perfil/${user?.usuario}`}>
              <h2>{user?.nome}</h2>
              <p>@{user?.usuario}</p>
            </Link>
          </UserInfo>
        </>
      )}
      <div>
        <ProjectInfo>
          <aside>
            <Link to={`/projeto/${project.id}`}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT9foYOCHad0GC_wSsRh3q3FGuXmjidN0Gq1g&usqp=CAU"
                alt={project.nome}
              />
            </Link>
            <section>
              <Link to={`/projeto/${project.id}`}>{project.nome}</Link>
              <ul>
                {project.habilidades?.map(habilidade => (
                  <li key={habilidade.id}>{habilidade.nome}</li>
                ))}
                {project.areas?.map(area => (
                  <li key={area.id}>{area.descricao}</li>
                ))}
              </ul>
              <p>
                publicado em{' '}
                {`${
                  project.data_criacao?.split('T')[0]?.split('-')[2] +
                  '/' +
                  project.data_criacao?.split('T')[0]?.split('-')[1] +
                  '/' +
                  project.data_criacao?.split('T')[0]?.split('-')[0]
                }`}
              </p>
            </section>
          </aside>
        </ProjectInfo>
        <p>{project.descricao}</p>

        {loggedUser.id !== user?.id && (
          <aside>
            <ButtonFavorite checked={!!favoriteId} onClick={ToogleFavorite}>
              {' '}
              <SelectFavorite /> Favoritar
            </ButtonFavorite>
            <ButtonInterest checked={!!interesseId} onClick={ToogleInteresse}>
              {' '}
              <SelectInteresse />
              Tenho interesse
            </ButtonInterest>
          </aside>
        )}
      </div>
    </BodyCard>
  )
}
export default ProjectCard
