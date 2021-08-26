import React, { useEffect, useState } from 'react'
import { BodyCard, ProjectLink } from './styles'
import { useHistory } from 'react-router-dom'
import twoUsers from '../../assets/icon/twoUsers.svg'
import { AxiosError } from 'axios'
import { AreaType } from '../UI/SelectArea'
import { ToolType } from '../UI/SelectTools'
import api from '../../services/api'
import userDefault from '../../assets/icon/user.svg'
import { IProject } from '../ProjectCard'
import { profile } from 'console'
import { VacanciesType } from '../Vacancy'
import id from '../../assets/icon/id.svg'
import al from '../../assets/icon/al.svg'
import co from '../../assets/icon/co.svg'
interface IPropsProjectLink {
  vacancy: VacanciesType
}
const LiProjectLink: React.FC<IPropsProjectLink> = ({ vacancy }) => {
  const [profile, setProfile] = useState<string>('')

  useEffect(() => {
    api
      .get(`/api/v1/papel/${vacancy.papel_id}`)
      .then(response => {
        setProfile(response.data.descricao)
      })
      .catch((err: AxiosError) => {
        return err?.response?.data.detail
      })
  }, [vacancy.papel_id])

  return (
    <ProjectLink
      key={vacancy.id}
      to={`/projeto/${vacancy.projeto_id}/vagas/${vacancy.id}`}
    >
      <img
        src={
          (profile?.toLowerCase() === 'colaborador' && co) ||
          (profile?.toLowerCase() === 'idealizador' && id) ||
          (profile?.toLowerCase() === 'aliado' && al) ||
          ''
        }
        alt={profile}
      />
      <aside>
        <h2>{vacancy.titulo}</h2>
        <a>ver mais</a>
      </aside>
    </ProjectLink>
  )
}
const RecentesInviteCard: React.FC = () => {
  const history = useHistory()
  const [vacancies, setVacancies] = useState<VacanciesType[]>([])
  useEffect(() => {
    const res = api
      .get(`/api/v1/pessoa_projeto/convites/3`)
      .then(response => {
        setVacancies(response.data)
      })
      .catch((err: AxiosError) => {
        return err?.response?.data.detail
      })
    console.log(res)
  }, [])
  return vacancies.length === 0 ? (
    <></>
  ) : (
    <BodyCard>
      <h2>Convites recentes</h2>
      {vacancies.map(vacancy => (
        <LiProjectLink key={vacancy.id} vacancy={vacancy} />
      ))}

      {/* <button
        onClick={() => {
          history.push('/pesquisar/pessoa/nome/')
        }}
      >
        ver todos os convites
      </button> */}
    </BodyCard>
  )
}
export default RecentesInviteCard
