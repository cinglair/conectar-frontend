import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useContext,
  Fragment,
  useCallback,
} from 'react'
import { Link } from 'react-router-dom'
import { BodyProjects, DivConvite, DivSobre, DivTags, DivVagas } from './styles'
import edit from '../../assets/icon/editar.svg'
import TrashIcon from '../../assets/icon/lixeira.svg'
import { Scrollbars } from 'react-custom-scrollbars'
import urlConvite from '../../assets/image/convite_dias.svg'
// import clone from '../../assets/icon/clone.svg'
import config from '../../assets/icon/config.svg'
import no_couver from '../../assets/image/no_couver.svg'
import objetivo from '../../assets/icon/objetivo.svg'
import id from '../../assets/icon/id.svg'
import al from '../../assets/icon/al.svg'
import co from '../../assets/icon/co.svg'
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
import Vacancy, { VacanciesType } from '../../components/Vacancy'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import getValidationErrors from '../../utils/getValidationErrors'
import { ButtonList } from '../Profiles/styles'
import ContainerScroll from '../../components/UI/ContainerScroll'
import VacancieListItem from '../../components/VacancieListItem'
import Skeleton from 'react-loading-skeleton'
import { IconEdit } from '../../assets/icon'
import { ProfileLink } from '../../components/SuccessfulCreatorsCard/styles'
interface routeParms {
  id: string
}
interface ProjectType {
  nome: string
  descricao: string
  visibilidade: Array<string>
  objetivo: string
  foto_capa: string
  areas: AreaType[]
  habilidades: ToolType[]
  id: number
  pessoa_id: number
}
interface IProjectOwner {
  usuario: string
  foto_perfil: string
  nome: string
  id: number
}
interface IGroupedVacancy {
  [index: number]: VacanciesType[][]
}
/**
 * @constructor
 * @content is the iten of the modal
 */
interface IVacancyDetail extends VacanciesType {
  pessoas_ids: number[]
  pessoas_projeto_ids: number[]
}
const Projects: React.FC = () => {
  const { loading, isAuthenticated, user } = useContext(Context)

  // const [modalContent, setModalContent] = useState<ReactNode>(null);
  const initialModalContent = {
    nome: false,
    descricao: false,
    objetivo: false,
    vaga: false,
    areas: false,
    habilidades: false,
  }
  const [modalContent, setModalContent] = useState(initialModalContent)
  const history = useHistory()
  const [openModal, setOpenModal] = useState<boolean>(
    loading && isAuthenticated,
  )

  const projeto_id = useParams<routeParms>().id
  const [projectOwner, setProjectOwner] = useState({} as IProjectOwner)
  const [project, setProject] = useState({} as ProjectType)
  const [storedAreas, setStoredAreas] = useState<Array<AreaType>>([])
  const [storedTools, setStoredTools] = useState<Array<ToolType>>([])
  const [selectedImage, setSelectedImage] = useState<File>()
  const [vacanciesList, setVacanciesList] = useState<boolean>(false)
  const [vacancies, setVacancies] = useState<Array<VacanciesType>>([])
  const [groupedVacancies, setGroupedVacancies] = useState<
    Array<VacanciesType[]>
  >([])
  const [vacancyDetail, setVacancyDetail] = useState<IVacancyDetail>({
    ...vacancies[0],
    pessoas_ids: [],
    pessoas_projeto_ids: [],
  })
  function a(arr: any) {
    // eslint-disable-next-line no-var
    var newArr: Array<any> = []
    for (let index = 0; index < arr.length; index++) {
      for (let jndex = 0; jndex < index; jndex++) {
        if (
          !(
            JSON.stringify(arr[index]) === JSON.stringify(arr[jndex]) &&
            jndex !== index
          )
        ) {
          newArr[index] = arr[index]
        }
      }
    }
    return newArr
  }
  const getset_pessoa_projeto = useCallback(async () => {
    await api
      .get(`/api/v1/pessoa_projeto/projeto/${projeto_id}`)
      .then((response: AxiosResponse<VacanciesType[]>) => {
        setVacancies(response.data)

        const GroupResponse = response.data.map(vacancy => {
          return response.data.filter(data => {
            return (
              JSON.stringify(data.areas) === JSON.stringify(vacancy.areas) &&
              JSON.stringify(data.habilidades) ===
                JSON.stringify(vacancy.habilidades) &&
              data.remunerado === vacancy.remunerado &&
              data.tipo_acordo_id === vacancy.tipo_acordo_id &&
              data.papel_id === vacancy.papel_id &&
              data.titulo === vacancy.titulo
            )
          })
        })

        setGroupedVacancies(
          GroupResponse.filter((vacancies, index, self) => {
            let indexOfDuplicated = -1
            for (let i = 0; i < self.length; i++) {
              if (JSON.stringify(self[i]) === JSON.stringify(vacancies)) {
                indexOfDuplicated = i
              }
            }
            return index === indexOfDuplicated
          }),
        )
      })
      .catch((error: AxiosError) => {
        return error?.response?.data.detail
      })
    return true
  }, [projeto_id])
  const handleDeclineInvitation = useCallback(
    (pessoa_projeto_id: number) => {
      api
        .put(`api/v1/pessoa_projeto/${pessoa_projeto_id}`, {
          situacao: 'RECUSADO',
        })
        .then(() => getset_pessoa_projeto())
    },
    [getset_pessoa_projeto],
  )
  const handleAcceptInvitation = useCallback(
    (pessoa_projeto_id: number) => {
      api
        .put(`api/v1/pessoa_projeto/${pessoa_projeto_id}`, {
          situacao: 'ACEITO',
        })
        .then(() => getset_pessoa_projeto())
    },
    [getset_pessoa_projeto],
  )
  const formRef = useRef<FormHandles>(null)

  useEffect(() => {
    const res = api
      .get(`/api/v1/projeto/${projeto_id}`)
      .then(response => {
        setProject(response.data)
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
  }, [projeto_id, openModal])
  useEffect(() => {
    if (groupedVacancies.length > 0) {
      setVacancyDetail({
        ...groupedVacancies[0][0],
        pessoas_ids: groupedVacancies[0].map(vacancy => {
          return vacancy.pessoa_id
        }),
        pessoas_projeto_ids: groupedVacancies[0].map(vacancy => {
          return vacancy.id
        }),
      })
    }
  }, [groupedVacancies])
  const handleDeleteVacancy = useCallback(
    (vacancies: VacanciesType[]) => {
      vacancies.forEach(vacancy => {
        const res = api
          .delete(`/api/v1/pessoa_projeto/${vacancy.id}`)
          .then(getset_pessoa_projeto)
          .catch((error: AxiosError) => {
            return error?.response?.data.detail
          })
        console.log(res)
      })
    },
    [getset_pessoa_projeto],
  )
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

  const handleFindTeam = useCallback(() => {
    const res = api
      .get(`/api/v1/pessoa_projeto/similaridade/${projeto_id}`)
      .finally(() => {
        history.push(`/projeto-conectado/${projeto_id}`)
      })
      .catch((error: AxiosError) => {
        return error?.response?.data.detail
      })
    console.log(res)
  }, [history, projeto_id])
  const handleSubmit = useCallback(
    async (formData: ProjectType) => {
      console.log(formData)

      try {
        // Remove all previogeus errors
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          nome: modalContent.nome
            ? Yup.string().required('Nome é obrigatório')
            : Yup.string(),
          descricao: modalContent.descricao
            ? Yup.string().required('Descrição é obrigatória')
            : Yup.string(),
          objetivo: modalContent.objetivo
            ? Yup.string().required('Objetivo é obrigatório')
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
      }
    },
    [modalContent, projeto_id],
  )
  function isOwner() {
    if (project.pessoa_id && user.id) {
      return !!(project.pessoa_id === user.id)
    } else return false
  }

  return (
    <BodyProjects>
      <NavBar />
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        onAfterClose={() => {
          setOpenModal(!isAuthenticated)
        }}
      >
        {!loading && !isAuthenticated ? (
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
                    <Dropzone name="capa" />
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
            {modalContent.vaga && <Vacancy project={project} />}
          </>
        )}
      </Modal>

      <header>
        {/* <img src={no_couver} alt="imagem de capa do projeto" /> */}
        <Skeleton height={180} />
        {isOwner() ? (
          <IconEdit
            onClick={() => {
              setModalContent({ ...initialModalContent, nome: true })
              setOpenModal(true)
            }}
          />
        ) : (
          <ProfileLink to={`/perfil/${projectOwner.id}`}>
            <img
              src="https://upload.wikimedia.org/wikipedia/pt/thumb/4/4d/Clube_do_Remo.png/120px-Clube_do_Remo.png"
              alt=""
            />
            <aside>
              <h2>{projectOwner.nome}</h2>
              <p>@{projectOwner.usuario}</p>
            </aside>
          </ProfileLink>
        )}
        <div>
          <section>
            <h1>{project.nome || <Skeleton width="200px" />} </h1>
          </section>

          <section>
            {isOwner() ? (
              <Button theme="primary" onClick={handleFindTeam}>
                Buscar Time
              </Button>
            ) : (
              <Button theme="secondary" className="fav-button">
                <img src={like} alt="curtidas" /> Favoritar
              </Button>
            )}
            <a>
              <span>
                <img src={like} alt="curtidas" />
                194
              </span>
              <p>Publicado em:</p>
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
        vacancyDetail?.pessoas_ids?.includes(user.id) && (
          <DivConvite>
            <figure>
              <img
                src={urlConvite}
                alt="Mulher apertando a mão de um homem simbolizando um acordo"
              />
              <figcaption>
                Você tem apenas {3} dias para responder este covnite
              </figcaption>
            </figure>
            <aside>
              <Button
                theme="secondary"
                onClick={() =>
                  handleDeclineInvitation(
                    vacancyDetail?.pessoas_projeto_ids[
                      vacancyDetail.pessoas_ids.indexOf(user.id)
                    ],
                  )
                }
              >
                Recusar
              </Button>
              <Button
                theme="primary"
                onClick={() =>
                  handleAcceptInvitation(
                    vacancyDetail?.pessoas_projeto_ids[
                      vacancyDetail.pessoas_ids.indexOf(user.id)
                    ],
                  )
                }
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
              <IconEdit
                onClick={() => {
                  setModalContent({ ...initialModalContent, vaga: true })
                  setOpenModal(true)
                }}
              />
            )}
          </legend>

          <ContainerScroll>
            {groupedVacancies.map(vacancies => (
              <VacancieListItem
                key={vacancies[0].id}
                vacancy={{
                  ...vacancies[0],
                  quantidade: vacancies.length,
                }}
                onDelete={() => handleDeleteVacancy(vacancies)}
                onEdit={() => console.log('sas')}
                onClick={() =>
                  setVacancyDetail({
                    ...vacancies[0],
                    pessoas_ids: vacancies.map(vacancy => {
                      return vacancy.pessoa_id
                    }),
                    pessoas_projeto_ids: vacancies.map(vacancy => {
                      return vacancy.id
                    }),
                  })
                }
                style={
                  vacancyDetail.titulo === vacancies[0].titulo
                    ? { background: 'var(--backgroundElevation)' }
                    : { background: 'transparent' }
                }
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
          </aside>
        </section>
      </DivVagas>
    </BodyProjects>
  )
}
export default Projects
