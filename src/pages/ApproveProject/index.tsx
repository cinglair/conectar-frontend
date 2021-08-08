import React, { useState, useEffect, useCallback } from 'react'
import { BodyApproveProject } from './styles'
import Button from '../../components/UI/Button'
import { AxiosError } from 'axios'
import NavBar from '../../components/UI/NavBar'
import ProjectCard, { IProject } from '../../components/ProjectCard'
import api from '../../services/api'
import ProfileLink from '../../components/ProfileLink'
import LinksCard from '../../components/LinksCard'
import SuccessfulCreatorsCard from '../../components/SuccessfulCreatorsCard'
import SuccessfulProjectsCard from '../../components/SuccessfulProjectsCard'
import VacancieCard, { IVacancyCard } from '../../components/VacancieCard'
import { useParams } from 'react-router-dom'
import hero from '../../assets/image/temos_um_time_para_seu_projeto.svg'
import { IProfile } from '../../components/ProfileCard'
import Swal from 'sweetalert2'
import Alert from '../../utils/SweetAlert'
interface routeParms {
  id: string
}
const ApproveProject: React.FC = () => {
  const project_id = useParams<routeParms>().id
  const [project, setProject] = useState<IProject>({} as IProject)
  const [vacancies, setVacancies] = useState<Array<IVacancyCard>>([])
  const [possibleDeal, setPossibleDeal] = useState(false)
  const [finalizedDeal, setFinalizedDeal] = useState(false)

  useEffect(() => {
    const res = [
      api
        .get(`/api/v1/projeto/${project_id}`)
        .then(response => {
          setProject(response.data)
        })
        .catch((err: AxiosError) => {
          return err?.response?.data.detail
        }),
      api
        .get(`/api/v1/pessoa_projeto/projeto/${project_id}`)
        .then(resDisponiveis => {
          setVacancies(resDisponiveis.data)
        })
        .catch((err: AxiosError) => {
          console.log(err?.response?.data.detail)
        }),
    ]
    console.log(res)
  }, [project_id])
  useEffect(() => {
    setPossibleDeal(!vacancies.find(vacancy => vacancy.situacao !== 'ACEITO'))
    setFinalizedDeal(
      !vacancies.find(vacancy => vacancy.situacao !== 'FINALIZADO'),
    )
  }, [vacancies])
  const handleInvite = useCallback(() => {
    setVacancies(currentVacancy =>
      vacancies.map((vacancy, index) => {
        vacancy.situacao === 'PENDENTE_IDEALIZADOR' &&
          api
            .put(`/api/v1/pessoa_projeto/${vacancy.id}`, {
              situacao: 'PENDENTE_COLABORADOR',
            })
            .catch((err: AxiosError) => {
              console.log(err?.response?.data.detail)
            })
        return {
          ...vacancy,
          situacao:
            vacancy.situacao === 'PENDENTE_IDEALIZADOR'
              ? 'PENDENTE_COLABORADOR'
              : currentVacancy[index].situacao,
        }
      }),
    )
  }, [vacancies])

  const handleFinalizeDeal = useCallback(() => {
    if (possibleDeal) {
      setVacancies(
        vacancies.map(vacancy => {
          api
            .put(`/api/v1/pessoa_projeto/${vacancy.id}`, {
              situacao: 'FINALIZADO',
            })
            .then(() => {
              Alert({
                title: 'Insira Informações importantes para os participantes',
                input: 'text',
                inputAttributes: {
                  autocapitalize: 'off',
                },
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Buscar',
                showLoaderOnConfirm: true,
                preConfirm: info => {
                  return api
                    .put(`/api/v1/projeto/${project_id}`, { mural: info })
                    .catch(error => {
                      Swal.showValidationMessage(error)
                    })
                },
                allowOutsideClick: () => !Swal.isLoading(),
              })
            })
            .catch((err: AxiosError) => {
              console.log(err?.response?.data.detail)
            })
          return {
            ...vacancy,
            situacao: 'FINALIZADO',
          }
        }),
      )
    }
  }, [possibleDeal, vacancies])
  const handleDealPDF = useCallback(() => {
    console.log('pdf')
  }, [vacancies])
  return (
    <>
      <NavBar />
      <BodyApproveProject>
        <ProfileLink />
        <main>
          <figure>
            <img src={hero} alt="Confira as vagas" />
            <figcaption>
              Confira o resumo da conexão do seu projeto com os candidatos
            </figcaption>
          </figure>
          <section>
            <ProjectCard project={project} hiddeOwner />
          </section>
          <section>
            <ul>
              {vacancies.map(vacancy => (
                <VacancieCard key={vacancy.id} vacancy={vacancy} />
              ))}
            </ul>
          </section>
          <aside>
            <Button
              theme="secondary"
              disabled={!possibleDeal || finalizedDeal}
              onClick={handleFinalizeDeal}
            >
              Finalizar acordos
            </Button>

            <Button
              theme="primary"
              onClick={handleInvite}
              disabled={possibleDeal || finalizedDeal}
            >
              Enviar convites
            </Button>
          </aside>
        </main>
        <section>
          <LinksCard />
          <SuccessfulCreatorsCard />
          <SuccessfulProjectsCard />
        </section>
      </BodyApproveProject>
    </>
  )
}
export default ApproveProject
