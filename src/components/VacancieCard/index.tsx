import React, {
  HTMLAttributes,
  useContext,
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
  FormEvent,
} from 'react'
import { BodyCard, DropdownList, StyleInput, ProfileButton } from './styles'
import { Link, useHistory, useLocation } from 'react-router-dom'
import userDefault from '../../assets/icon/user.svg'
import lupa from '../../assets/icon/lupa.svg'
import { AxiosError } from 'axios'
import { AreaType } from '../UI/SelectArea'
import { ToolType } from '../UI/SelectTools'
import api from '../../services/api'
import Button from '../UI/Button'
import { TypeSituationVacancy } from '../Vacancy'
import Alert from '../../utils/SweetAlert'
import { Context } from '../../context/AuthContext'
import Modal from '../UI/Modal'
import { showToast } from '../Toast/Toast'
export interface IVacancyCard {
  projeto_id: number
  pessoa_id: number
  papel_id: number
  tipo_acordo_id: number
  descricao: string
  situacao?: TypeSituationVacancy
  id: number
}
interface Props extends HTMLAttributes<HTMLLIElement> {
  vacancy: IVacancyCard
}
interface ProfileType {
  data_nascimento: string
  usuario: string
  email: string
  ativo: boolean
  nome: string
  telefone: string
  colaborador: boolean
  idealizador: boolean
  aliado: boolean
  foto_perfil: string
  habilidades: ToolType[]
  areas: AreaType[]
  id: number
  data_criacao: string
  data_atualizacao: string
}
export type TypeStatusVacancy = 'Aceito' | 'Pendente' | 'Recusado'
interface ISituationVacancy {
  [key: string]: {
    status?: TypeStatusVacancy
    invite: string
    isAvaliable: boolean
  }
}
interface IModalProps {
  open: boolean
  setOpen(isOpen: boolean): void
  selectedPeople: ProfileType
  setSelectedPeople(people: ProfileType): void
  vacancyId: number
}
const ModalFindPeople: React.FC<IModalProps> = props => {
  const history = useHistory()
  const location = useLocation()
  const [searchKey, setSearchKey] = useState<string>('')
  const [peoplesFounds, setPeoplesFounds] = useState<ProfileType[]>([])
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target
    api.get(`/api/v1/pessoa/nome/${value}`).then(response => {
      setPeoplesFounds(response.data)
    })
  }, [])
  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault()
  }, [])
  async function newPeople(profile: ProfileType) {
    if (profile.id !== 0) {
      console.log(profile)
      const find = await Alert({
        title: `${profile?.nome}`,
        imageUrl: profile?.foto_perfil
          ? `https://conectar.s3.sa-east-1.amazonaws.com/uploads/${profile?.foto_perfil}`
          : userDefault,
        confirmButtonText: 'Confirmar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      })
      if (find.isConfirmed) {
        await api
          .put(`api/v1/pessoa_projeto/${props.vacancyId}`, {
            pessoa_id: profile?.id,
          })
          .then(() => {
            showToast('success', 'Vaga atualizada com Sucesso!')
            props.setSelectedPeople(profile)
          })
          .catch((err: AxiosError) => {
            Alert({
              title: `Erro: ${err.message}`,
              text: 'Não foi possível atualizar a vaga, tente novamente!',
              icon: 'error',
            })
            return err?.response?.data.detail
          })
        props.setOpen(false)
      }
    }
  }

  return (
    <Modal {...props}>
      <StyleInput onSubmit={handleSubmit}>
        <button type="submit">
          <img src={lupa} alt="botao de pesquisa" />
        </button>

        <input placeholder="Nome ou usuário" onChange={handleChange} />
      </StyleInput>
      {peoplesFounds
        .filter((_, index) => index <= 10)
        .map(profile => (
          <ProfileButton
            key={profile.id}
            type="button"
            onClick={() => {
              newPeople(profile)
            }}
          >
            <img
              src={
                profile?.foto_perfil
                  ? `https://conectar.s3.sa-east-1.amazonaws.com/uploads/${profile?.foto_perfil}`
                  : userDefault
              }
              alt={profile?.nome}
            />
            <aside>
              <h2>{profile?.nome}</h2>
              <p>@{profile?.usuario}</p>
            </aside>
          </ProfileButton>
        ))}
    </Modal>
  )
}

const VacancieCard: React.FC<Props> = ({ vacancy, ...rest }) => {
  const { user } = useContext(Context)
  const [possibleDeal, setPossibleDeal] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [finalizedDeal, setFinalizedDeal] = useState(false)
  const [profile, setProfile] = useState<ProfileType>({} as ProfileType)
  const [selectedPeople, setSelectedPeople] = useState<ProfileType>(
    {} as ProfileType,
  )
  const [agreement, setAgreement] = useState<string>('')
  const [office, setOffice] = useState<string>('')
  const situation: ISituationVacancy = {
    FINALIZADO: {
      invite: 'Acordo Finalizado',
      isAvaliable: false,
    },
    PENDENTE_IDEALIZADOR: {
      status: 'Pendente',
      invite: 'Sem convite',
      isAvaliable: true,
    },
    PENDENTE_COLABORADOR: {
      status: 'Pendente',
      invite: 'Convite enviado',
      isAvaliable: true,
    },
    ACEITO: {
      status: 'Aceito',
      invite: 'Convite enviado',
      isAvaliable: true,
    },
    RECUSADO: {
      status: 'Recusado',
      invite: 'Convite enviado',
      isAvaliable: true,
    },
  }
  async function FindPeople() {
    const result = await Alert({
      title: 'Como deseja efetuar a nova busca?',
      text: `${
        profile?.nome?.split(` `)[0]
      } não aparecerá mais para preencher essa vaga`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Busca Automática',
      showDenyButton: true,
      denyButtonText: 'Busca Manual',
      denyButtonColor: `var(--green)`,
    })
    if (result.isDenied) {
      setModalIsOpen(true)
    }
    if (result.isConfirmed)
      api
        .get(`/api/v1/pessoa_projeto/similaridade_vaga/${vacancy.id}`)
        .then(response => {
          setProfile(response.data)
          Alert({
            title: 'Novo Usuário encontrado',
            icon: 'success',
          })
        })
        .catch((err: AxiosError) => {
          Alert({
            title: `Erro: ${err.message}`,
            text: 'Não foi possível efetuar a busca, tente novamente!',
            icon: 'error',
          })
          return err?.response?.data.detail
        })
  }
  console.log(vacancy.situacao)

  useEffect(() => {
    setPossibleDeal(vacancy.situacao ? vacancy.situacao === 'ACEITO' : false)
    setFinalizedDeal(
      vacancy.situacao ? vacancy.situacao === 'FINALIZADO' : false,
    )
  }, [vacancy])

  useEffect(() => {
    const res = [
      api
        .get(`/api/v1/pessoas/${vacancy.pessoa_id}`)
        .then(response => {
          setProfile(response.data)
        })
        .catch((err: AxiosError) => {
          return err?.response?.data.detail
        }),
      api
        .get(`/api/v1/tipoAcordo?tipo_acordo_id=${vacancy.tipo_acordo_id}`)
        .then(response => {
          setAgreement(response.data.descricao)
        })
        .catch((err: AxiosError) => {
          return err?.response?.data.detail
        }),
      api
        .get(`/api/v1/papel/${vacancy.papel_id}`)
        .then(response => {
          setOffice(response.data.descricao)
        })
        .catch((err: AxiosError) => {
          return err?.response?.data.detail
        }),
    ]
  }, [vacancy.papel_id, vacancy.pessoa_id, vacancy.tipo_acordo_id])

  return (
    <BodyCard
      isAvailable={situation[`${vacancy.situacao}`].isAvaliable}
      status={situation[`${vacancy.situacao}`].status}
      {...rest}
    >
      <ModalFindPeople
        open={modalIsOpen}
        setOpen={setModalIsOpen}
        selectedPeople={profile}
        setSelectedPeople={setProfile}
        vacancyId={vacancy.id}
      />
      <Link to={`/perfil/${profile?.usuario}`}>
        <img
          src={
            profile?.foto_perfil
              ? `https://conectar.s3.sa-east-1.amazonaws.com/uploads/${profile?.foto_perfil}`
              : userDefault
          }
          alt=""
        />
        <h2>{profile?.nome?.split(` `)[0]}</h2>
      </Link>
      <h3>
        {office}
        <br />
        {agreement}
      </h3>

      {/* <Button theme="primary">Ver currículo</Button> */}
      {/* <DropdownList IconButton={ */}
      {!finalizedDeal && (
        <Button onClick={FindPeople} theme="secondary">
          Nova busca
        </Button>
      )}

      {/* <li>Perfis similares</li>
        <li>Perfis interessados</li>
        <li>Perfis interessados</li>
        <li>Perfis interessados</li> */}
      {/* </DropdownList> */}
      <aside>
        <h4>{situation[`${vacancy.situacao}`].invite}</h4>
        <span>{situation[`${vacancy.situacao}`].status}</span>
      </aside>
      <legend>
        Vaga{' '}
        {situation[`${vacancy.situacao}`].isAvaliable
          ? 'disponível'
          : 'preenchida'}
      </legend>
    </BodyCard>
  )
}
export default VacancieCard
