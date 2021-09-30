import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react'
import {
  BodyProjects,
  ButtonFavorite,
  DivConvite,
  DivParticipants,
  DivSobre,
  DivTags,
  DivVagas,
} from './styles'
import userDefault from '../../assets/icon/user.svg'
import { FiPlusCircle } from 'react-icons/fi'
import urlConvite from '../../assets/image/convite_dias.svg'
import objetivo from '../../assets/icon/objetivo.svg'
import vagas from '../../assets/icon/vagas.svg'
import like from '../../assets/icon/like.svg'
import { useHistory, useParams } from 'react-router'
import Button from '../../components/UI/Button'
import api from '../../services/api'
import { AxiosError, AxiosResponse } from 'axios'
import SelectArea, { AreaType } from '../../components/UI/SelectArea'
import SelectTool, { ToolType } from '../../components/UI/SelectTools'
import Modal from '../../components/UI/Modal'
import Textarea from '../../components/UI/Textarea'
import Input from '../../components/UI/Input'
import Dropzone from '../../components/UI/Dropzone'
import { Context } from '../../context/AuthContext'
import Login from '../../components/UI/Login'
import NavBar from '../../components/UI/NavBar'
import Vacancy, {
  handleVacancy,
  TypeSituationVacancy,
  VacanciesType,
} from '../../components/Vacancy'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import getValidationErrors from '../../utils/getValidationErrors'
import { ButtonList } from '../Profiles/styles'
import ContainerScroll from '../../components/UI/ContainerScroll'
import VacancieListItem from '../../components/VacancieListItem'
import Skeleton from 'react-loading-skeleton'
import { IconEdit, IconTrash } from '../../assets/icon'
import { ProfileLink } from '../../components/SuccessfulCreatorsCard/styles'
import { showToast } from '../../components/Toast/Toast'
import { IReaction } from '../../components/ProjectCard'
import { BsFillStarFill } from 'react-icons/bs'
import Alert from '../../utils/SweetAlert'
import useLoading from '../../context/hooks/useLoading'

interface ProjectType {
  nome: string
  descricao: string
  visibilidade: Array<string>
  objetivo: string
  foto_capa: string
  data_criacao: string
  areas: AreaType[]
  habilidades: ToolType[]
  projeto_reacoes?: IReaction[]
  id: number
  pessoa_id: number
  mural?: string
}
interface IPeopleLink {
  usuario: string
  foto_perfil: string
  nome: string
  id: number
}

/**
 * @constructor
 * @content is the iten of the modal
 */
interface IParmsProps {
  id: string
  step?: string
  vaga?: string
}
const Projects: React.FC = () => {
  const { loading: userLoading, isAuthenticated, user } = useContext(Context)
  const projeto_id = useParams<IParmsProps>().id
  const { step, vaga } = useParams<IParmsProps>()
  // const [modalContent, setModalContent] = useState<ReactNode>(null);
  const initialModalContent = {
    nome: false,
    descricao: false,
    objetivo: false,
    vaga: false,
    areas: false,
    habilidades: false,
    mural: false,
  }
  const loading = useLoading()
  const [modalContent, setModalContent] = useState(initialModalContent)
  const history = useHistory()
  const [openModal, setOpenModal] = useState<boolean>(
    userLoading && isAuthenticated,
  )
  const [projectOwner, setProjectOwner] = useState({} as IPeopleLink)
  const [project, setProject] = useState({} as ProjectType)
  const [storedAreas, setStoredAreas] = useState<Array<AreaType>>([])
  const [storedTools, setStoredTools] = useState<Array<ToolType>>([])
  const [vacanciesList, setVacanciesList] = useState<boolean>(step === 'vagas')
  const [favorited, setFavorited] = useState<boolean>(false)
  const [vacancies, setVacancies] = useState<Array<VacanciesType>>([])
  const [likeCount, setLikeCount] = useState<Number>(0)
  const vacancyComponentRef = useRef<handleVacancy>(null)
  const [vacancyDetail, setVacancyDetail] = useState<VacanciesType>(
    {} as VacanciesType,
  )
  useEffect(() => {
    let detail
    if (
      vaga &&
      (detail = vacancies.find(vacancy => vacancy.id === Number(vaga)))
    ) {
      setVacancyDetail(detail)
    } else if (vacancies.length > 0) {
      setVacancyDetail(vacancies[0])
    }
  }, [vacancies, vaga])
  const getset_pessoa_projeto = useCallback(async () => {
    if (projeto_id)
      await api
        .get(`/api/v1/pessoa_projeto/projeto/${projeto_id}`)
        .then((response: AxiosResponse<VacanciesType[]>) => {
          console.log(response.data)

          setVacancies(response.data)
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 404) {
            setVacancies([])
          } else {
            showToast(
              'error',
              err?.response?.data.detail ||
                'Ocorreu um erro inesperado. Tente novamente mais tarde.',
            )
          }
          return err?.response?.data.detail
        })
    return true
  }, [projeto_id])
  const handleDeclineInvitation = useCallback(
    async (pessoa_projeto_id: number) => {
      await api
        .put(`api/v1/pessoa_projeto/${pessoa_projeto_id}`, {
          situacao: 'RECUSADO',
        })
        .then(() => getset_pessoa_projeto())
    },
    [getset_pessoa_projeto],
  )
  const handleAcceptInvitation = useCallback(
    async (pessoa_projeto_id: number) => {
      await api
        .put(`api/v1/pessoa_projeto/${pessoa_projeto_id}`, {
          situacao: 'ACEITO',
        })
        .then(() => getset_pessoa_projeto())
    },
    [getset_pessoa_projeto],
  )

  useEffect(() => {
    if (project.projeto_reacoes && isAuthenticated) {
      setFavorited(
        !!project.projeto_reacoes.find(reaction => {
          return (
            reaction.pessoa_id === user.id && reaction.reacao === 'FAVORITO'
          )
        }),
      )
    }
  }, [user.id, project.id, project.projeto_reacoes, isAuthenticated])

  function ToogleFavorite() {
    if (favorited) {
      api
        .delete(
          `/api/v1/reacoes?pessoa_id=${user.id}&projeto_id=${project.id}&reacao=FAVORITO`,
        )
        .then(response => {
          setFavorited(false)
        })
    } else {
      api
        .post('/api/v1/reacoes', {
          reacao: 'FAVORITO',
          pessoa_id: user?.id,
          projeto_id: project.id,
        })
        .then(response => {
          setFavorited(true)
        })
    }
  }

  const formRef = useRef<FormHandles>(null)

  const handleFindTeam = useCallback(async () => {
    const search = Alert({
      title: `Deseja realmente buscar um time para o seu projeto?`,
      confirmButtonText: 'Buscar Time',
      showCancelButton: true,
      icon: 'warning',
    })
    if ((await search).isConfirmed) {
      const res = await api
        .get(`/api/v1/pessoa_projeto/similaridade_projeto/${projeto_id}`)
        .finally(() => {
          history.push(`/projeto-conectado/${projeto_id}`)
        })
        .catch((error: AxiosError) => {
          return error?.response?.data.detail
        })
      console.log(res)
    }
  }, [history, projeto_id])

  const handleSubmit = useCallback(
    async (formData: ProjectType) => {
      console.log(formData)

      try {
        // Remove all previogeus errors
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          nome: modalContent.nome
            ? Yup.string().required('Nome é obrigatório').trim().max(75)
            : Yup.string(),
          img: modalContent.nome
            ? Yup.mixed()
                .required('Insira a capa do projeto!')
                .test(
                  'tipo do arquivo',
                  'Insira arquivos com a extensão .png ou .jpg',
                  file => {
                    let valid = true
                    if (file) {
                      if (!['image/jpeg', 'image/png'].includes(file.type)) {
                        valid = false
                      }
                    }
                    return valid
                  },
                )
            : Yup.mixed(),
          descricao: modalContent.descricao
            ? Yup.string().required('Descrição é obrigatória').trim()
            : Yup.string(),
          objetivo: modalContent.objetivo
            ? Yup.string().required('Objetivo é obrigatório').trim()
            : Yup.string(),
          habilidades: modalContent.habilidades
            ? Yup.array()
                .min(1, 'Seleciono pelo menos 1 item')
                .max(5, 'Seleciono no máximo 5')
            : Yup.array(),
          areas: modalContent.areas
            ? Yup.array()
                .min(1, 'Seleciono pelo menos 1 item')
                .max(5, 'Seleciono no máximo 5')
            : Yup.array(),
        })
        await schema.validate(formData, {
          abortEarly: false,
        })
        // Validation passed
        loading.start()
        if (modalContent.areas) {
          const data = {
            areas: formData.areas.map(area => {
              return { descricao: area }
            }),
          }
          await api
            .put(`/api/v1/projeto/${projeto_id}`, data, {
              withCredentials: true,
            })
            .then(() => {
              setOpenModal(false)
              showToast('success', 'Editado com Sucesso!')
            })
        } else if (modalContent.habilidades) {
          const data = {
            habilidades: formData.habilidades.map(tool => {
              return { nome: tool }
            }),
          }
          await api
            .put(`/api/v1/projeto/${projeto_id}`, data, {
              withCredentials: true,
            })
            .then(() => {
              setOpenModal(false)
              showToast('success', 'Editado com Sucesso!')
            })
        } else {
          await api.put(`/api/v1/projeto/${projeto_id}`, formData).then(() => {
            setOpenModal(false)
          })
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          // Validation failed
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
        }
      } finally {
        loading.stop()
      }
    },
    [modalContent, projeto_id],
  )
  function isOwner() {
    if (project.pessoa_id && user.id) {
      return !!(project.pessoa_id === user.id)
    } else return false
  }
  useEffect(() => {
    const res = api
      .get(`/api/v1/projeto/${projeto_id}`)
      .then((response: AxiosResponse<ProjectType>) => {
        setProject(response.data)
        setLikeCount(
          response.data.projeto_reacoes?.filter(project => {
            return project.reacao === 'FAVORITO'
          }).length || 0,
        )
        setStoredTools(response.data.habilidades)
        setStoredAreas(response.data.areas)
        api.get(`/api/v1/pessoas/${response.data.pessoa_id}`).then(response => {
          setProjectOwner(response.data)
        })
      })
      .catch((error: AxiosError) => {
        return error?.response?.data.detail
      })

    getset_pessoa_projeto()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projeto_id, openModal, favorited])

  const handleDeleteVacancy = useCallback(async (vacancy: VacanciesType) => {
    await vacancyComponentRef.current?.handleDeleteVacancy(vacancy)
    await getset_pessoa_projeto()
  }, [])
  useEffect(() => {
    const res = api
      .get(`/api/v1/pessoas/${project.pessoa_id}`)
      .then(response => {
        setProjectOwner(response.data)
      })
      .catch((error: AxiosError) => {
        return error?.response?.data.detail
      })
    console.log(res)
  }, [project.pessoa_id, openModal])

  async function deleteProject() {
    const delet = await Alert({
      title: `Deseja realmente apagar o projeto ${project.nome}?`,
      text: 'Todas as informações e registros do projeto serão perdidos',
      showCancelButton: true,
      denyButtonText: 'apagar',
      icon: 'warning',
    })
    if (delet.isConfirmed) {
      const res = api
        .delete(`/api/v1/projeto/${project.id}`)
        .then(async () => {
          await Alert({
            title: 'Projeto Apagado com Sucesso',
            icon: 'success',
          })
          history.push('/')
        })
        .catch((err: AxiosError) => {
          Alert({
            title: `Erro: ${err.message}`,
            text: 'Não foi possível apagar o projeto, tente novamente!',
            icon: 'error',
          })
        })
      console.log(res)
    }
  }

  function buttonMatchContent(option?: TypeSituationVacancy) {
    switch (option) {
      case 'FINALIZADO':
        return (
          <Button
            theme="primary"
            onClick={() => history.push(`/projeto-conectado/${projeto_id}`)}
          >
            Relatório do Time
          </Button>
        )
      case 'PENDENTE_IDEALIZADOR':
        return (
          <Button theme="primary" onClick={handleFindTeam}>
            Buscar Time
          </Button>
        )
      default:
        return (
          <Button
            theme="primary"
            onClick={() => history.push(`/projeto-conectado/${projeto_id}`)}
          >
            Status do time
          </Button>
        )
    }
  }
  async function deleteVacancy(vacancy: VacanciesType) {
    const delet = Alert({
      title: `Deseja realmente apagar a vaga ${vacancy.titulo}?`,
      text: 'Todas as informações e registros serão perdidos',
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: 'apagar',
      icon: 'warning',
    })
    if ((await delet).isDenied) handleDeleteVacancy(vacancy)
  }

  return (
    <BodyProjects>
      <NavBar />
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        onAfterClose={() => {
          setOpenModal(!isAuthenticated)
          vacancyComponentRef.current?.setShowRegister(false)
          vacancyComponentRef.current?.setEditVacancy({} as VacanciesType)
        }}
      >
        {!userLoading && !isAuthenticated ? (
          <>
            <h1>Para prosseguir, você precisa estar logado</h1>
            <Login onSuccessLogin={() => setOpenModal(isAuthenticated)} />
          </>
        ) : (
          <>
            {!modalContent.vaga && (
              <Form ref={formRef} onSubmit={handleSubmit}>
                {modalContent.nome && (
                  <>
                    <Input
                      name="nome"
                      label="Nome do projeto"
                      defaultValue={project.nome}
                    />
                    <Dropzone
                      name="img"
                      defaultValue={`https://conectar.s3.sa-east-1.amazonaws.com/uploads/${project.foto_capa}`}
                    />
                  </>
                )}
                {modalContent.objetivo && (
                  <Textarea
                    name="objetivo"
                    label="Objetivo breve do projeto"
                    defaultValue={project.objetivo}
                  />
                )}
                {modalContent.descricao && (
                  <Textarea
                    name="descricao"
                    label="Descrição sobre o projeto"
                    defaultValue={project.descricao}
                  />
                )}
                {modalContent.mural && (
                  <Textarea
                    name="mural"
                    label="Insira informações importantes para os participantes"
                    defaultValue={project.mural}
                  />
                )}
                {modalContent.areas && (
                  <SelectArea
                    name="areas"
                    label="Selecione as àreas de atuação"
                    defaultValue={storedAreas.map(area => {
                      return area.descricao
                    })}
                  />
                )}
                {modalContent.habilidades && (
                  <SelectTool
                    name="habilidades"
                    label="Selecione as ferramentas ou habilidades"
                    defaultValue={storedTools.map(tool => {
                      return tool.nome
                    })}
                  />
                )}
                <Button theme="primary" type="submit">
                  Salvar
                </Button>
              </Form>
            )}
            {
              <Vacancy
                project={project}
                ref={vacancyComponentRef}
                dontRender={!modalContent.vaga}
              />
            }
          </>
        )}
      </Modal>

      <header>
        {project.foto_capa ? (
          <img
            src={`https://conectar.s3.sa-east-1.amazonaws.com/uploads/${project.foto_capa}`}
            alt="imagem de capa do projeto"
          />
        ) : (
          <Skeleton height={180} />
        )}
        {isOwner() ? (
          <aside>
            <IconEdit
              onClick={() => {
                setModalContent({ ...initialModalContent, nome: true })
                setOpenModal(true)
              }}
            />
            <IconTrash onClick={deleteProject} />
          </aside>
        ) : (
          <ProfileLink to={`/perfil/${projectOwner?.usuario}`}>
            <img
              src={
                projectOwner?.foto_perfil
                  ? `https://conectar.s3.sa-east-1.amazonaws.com/uploads/${projectOwner?.foto_perfil}`
                  : userDefault
              }
              alt={projectOwner?.nome}
            />
            <aside>
              <h2>{projectOwner?.nome?.split(' ')[0]}</h2>
              <p>@{projectOwner?.usuario}</p>
            </aside>
          </ProfileLink>
        )}

        <div>
          <section>
            <h1>{project.nome || <Skeleton width="200px" />} </h1>
          </section>

          <section>
            {isOwner() && user.id === project.pessoa_id ? (
              vacancies.length > 0 ? (
                buttonMatchContent(vacancies[0].situacao)
              ) : (
                <div></div>
              )
            ) : (
              <ButtonFavorite
                checked={!!favorited}
                onClick={ToogleFavorite}
                theme="secondary"
              >
                <BsFillStarFill />
                Favoritar
              </ButtonFavorite>
            )}
            <a>
              {likeCount !== 0 && (
                <span>
                  {<img src={like} alt="curtidas" />}
                  {likeCount}
                </span>
              )}

              {
                <p>
                  Publicado em:{' '}
                  {`${
                    project.data_criacao?.split('T')[0]?.split('-')[2] +
                    '/' +
                    project.data_criacao?.split('T')[0]?.split('-')[1] +
                    '/' +
                    project.data_criacao?.split('T')[0]?.split('-')[0]
                  }`}
                </p>
              }
            </a>
          </section>
          <aside>
            <ButtonList
              borderBottom={!vacanciesList}
              onClick={() => {
                setVacanciesList(false)
              }}
            >
              Sobre
            </ButtonList>
            <ButtonList
              borderBottom={vacanciesList}
              onClick={() => {
                setVacanciesList(true)
              }}
            >
              Vagas
            </ButtonList>
          </aside>
        </div>
      </header>

      <DivSobre showSobre={!vacanciesList}>
        <div className="objdes">
          <section>
            <legend>
              <img className="icon-objetivo" src={objetivo} alt="objetivo" />
              Objetivo
              {isOwner() && (
                <IconEdit
                  onClick={() => {
                    setModalContent({ ...initialModalContent, objetivo: true })
                    setOpenModal(true)
                  }}
                />
              )}
            </legend>

            <p>{project.objetivo || <Skeleton width={350} />}</p>
          </section>
          <section>
            <legend>
              Descrição
              {isOwner() && (
                <IconEdit
                  onClick={() => {
                    setModalContent({ ...initialModalContent, descricao: true })
                    setOpenModal(true)
                  }}
                />
              )}
            </legend>

            <p>
              {project.descricao || (
                <>
                  <Skeleton width={300} />
                  <Skeleton width={300} />
                  <Skeleton width={300} />
                </>
              )}
            </p>
          </section>

          <section>
            <legend>
              Mural de informações
              {isOwner() && (
                <IconEdit
                  onClick={() => {
                    setModalContent({ ...initialModalContent, mural: true })
                    setOpenModal(true)
                  }}
                />
              )}
            </legend>

            <p>
              {project.mural || (
                <>
                  <Skeleton width={300} />
                  <Skeleton width={300} />
                  <Skeleton width={300} />
                </>
              )}
            </p>
          </section>
        </div>
        <DivTags>
          <legend>
            Áreas de desenvolvimento
            {isOwner() && (
              <IconEdit
                onClick={() => {
                  setModalContent({ ...initialModalContent, areas: true })
                  setOpenModal(true)
                }}
              />
            )}
          </legend>
          {project.areas?.length ? (
            <aside>
              {project.areas?.map(area => (
                <span key={area.id}>{area.descricao}</span>
              ))}
            </aside>
          ) : (
            <Skeleton width={50} />
          )}
          <legend>
            Habilidades e ferramentas
            {isOwner() && (
              <IconEdit
                onClick={() => {
                  setModalContent({ ...initialModalContent, habilidades: true })
                  setOpenModal(true)
                }}
              />
            )}
          </legend>
          {project.habilidades?.length ? (
            <aside>
              {project.habilidades?.map(habilidade => (
                <span key={habilidade.id}>{habilidade.nome}</span>
              ))}
            </aside>
          ) : (
            <Skeleton width={50} />
          )}
        </DivTags>
      </DivSobre>
      {vacanciesList &&
        vacancyDetail?.situacao === 'PENDENTE_COLABORADOR' &&
        vacancyDetail?.pessoa_id === user.id && (
          <DivConvite>
            <figure>
              <img
                src={urlConvite}
                alt="Mulher apertando a mão de um homem simbolizando um acordo"
              />
              <figcaption>
                Você tem apenas {3} dias para responder este convite
              </figcaption>
            </figure>
            <aside>
              <Button
                theme="secondary"
                onClick={() => {
                  showToast('error', 'Vaga recusada com sucesso!')
                  handleDeclineInvitation(vacancyDetail.id)
                }}
              >
                Recusar
              </Button>
              <Button
                theme="primary"
                onClick={() => {
                  showToast('success', 'Vaga aceita com sucesso!')
                  handleAcceptInvitation(vacancyDetail.id)
                }}
              >
                Aceitar
              </Button>
            </aside>
          </DivConvite>
        )}
      <DivVagas showVagas={vacanciesList}>
        <section>
          <legend>
            <img src={vagas} alt="vagas" />
            Vagas
            {isOwner() && (
              <FiPlusCircle
                onClick={() => {
                  if (vacancies.length >= 5) {
                    showToast(
                      'error',
                      'Não é possível adicionar mais que 5 vagas',
                    )
                  } else {
                    setModalContent({ ...initialModalContent, vaga: true })
                    vacancyComponentRef.current?.setShowRegister(true)
                    setOpenModal(true)
                  }
                }}
              />
            )}
          </legend>

          <ContainerScroll>
            {vacancies.map(vacancy => (
              <VacancieListItem
                dontShowOption={isOwner() ? undefined : true}
                key={vacancy.id}
                vacancy={vacancy}
                onDelete={() => deleteVacancy(vacancy)}
                onEdit={() => {
                  setOpenModal(true)
                  setModalContent({ ...initialModalContent, vaga: true })
                  vacancyComponentRef.current?.setShowRegister(true)
                  vacancyComponentRef.current?.setEditVacancy(vacancy)
                }}
                onClick={() => {
                  setVacancyDetail(vacancy)
                }}
                clicked={vacancyDetail.id === vacancy.id}
              />
            ))}
          </ContainerScroll>
        </section>
        <section>
          <legend>Descrição da vaga</legend>
          <aside>
            <p>{vacancyDetail?.descricao}</p>
            <DivTags>
              <legend>
                Áreas de desenvolvimento
                {isOwner() && (
                  <IconEdit
                    onClick={() => {
                      setModalContent({ ...initialModalContent, areas: true })
                      setOpenModal(true)
                    }}
                  />
                )}
              </legend>
              <aside>
                {vacancyDetail?.areas?.map(area => (
                  <span key={area.id}>{area.descricao}</span>
                ))}
              </aside>
              <legend>
                Habilidades e ferramentas
                {isOwner() && (
                  <IconEdit
                    onClick={() => {
                      setModalContent({
                        ...initialModalContent,
                        habilidades: true,
                      })
                      setOpenModal(true)
                    }}
                  />
                )}
              </legend>
              <aside>
                {vacancyDetail?.habilidades?.map(habilidade => (
                  <span key={habilidade.id}>{habilidade.nome}</span>
                ))}
              </aside>
            </DivTags>
            {(vacancyDetail?.situacao === 'ACEITO' ||
              vacancyDetail?.situacao === 'FINALIZADO') && (
              <DivParticipants>
                <legend>Participando dessa vaga:</legend>
                <aside>
                  <ProfileLink
                    key={vacancyDetail.pessoa?.usuario}
                    to={`/perfil/${vacancyDetail.pessoa?.usuario}`}
                  >
                    <img
                      src={`https://conectar.s3.sa-east-1.amazonaws.com/uploads/${vacancyDetail.pessoa?.foto_perfil}`}
                      alt={vacancyDetail.pessoa?.nome}
                    />
                    <h2>{vacancyDetail.pessoa?.nome}</h2>
                  </ProfileLink>
                </aside>
              </DivParticipants>
            )}
          </aside>
        </section>
      </DivVagas>
    </BodyProjects>
  )
}
export default Projects
