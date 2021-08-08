import React, { HTMLAttributes, useEffect, useState } from 'react'
import { BodyCard, DropdownList } from './styles'
import { Link } from 'react-router-dom'
import userDefault from '../../assets/icon/user.svg'
import { AxiosError } from 'axios'
import { AreaType } from '../UI/SelectArea'
import { ToolType } from '../UI/SelectTools'
import api from '../../services/api'
import Button from '../UI/Button'
import { GiHamburgerMenu } from 'react-icons/gi'
import { TypeSituationVacancy } from '../Vacancy'
import Alert from '../../utils/SweetAlert'
import Swal from 'sweetalert2'
import { Toast } from 'react-toastify/dist/components'
import { toast } from 'react-toastify'
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
const VacancieCard: React.FC<Props> = ({ vacancy, ...rest }) => {
  const [profile, setProfile] = useState<ProfileType>({} as ProfileType)
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
      confirmButtonText: 'Busca Automatica',
      showDenyButton: true,
      denyButtonText: 'Busca Manual',
      denyButtonColor: `var(--green)`,
    })
    if (result.isDenied) {
      Alert({
        title: 'Insira o username',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
        },
        icon: 'info',
        inputPlaceholder: '@',
        showCancelButton: true,
        confirmButtonText: 'Buscar',
        showLoaderOnConfirm: true,
        preConfirm: login => {
          return api
            .get(`/api/v1/pessoas/${login}`)
            .then(response => {
              console.log(response.data)
              if (response.data == null)
                Swal.showValidationMessage(
                  `Request failed: Usuário não encontrado`,
                )
              else return response.data
            })
            .catch(error => {
              Swal.showValidationMessage(`Request failed: ${error}`)
            })
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then(async result => {
        console.log('Result confirmed')

        if (result.isConfirmed) {
          console.log(result.value)
          const find = await Alert({
            title: `${result.value.nome}`,
            imageUrl: result.value.foto_perfil
              ? `https://conectar.s3.sa-east-1.amazonaws.com/uploads/${result.value?.foto_perfil}`
              : userDefault,
            confirmButtonText: 'Confirmar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
          })
          if (find.isConfirmed) {
            await api
              .put(`api/v1/pessoa_projeto/${vacancy.id}`, {
                pessoa_id: result.value.id,
              })
              .then(() => {
                showToast('success', 'Vaga atualizada com Sucesso!')
                setProfile(result.value)
              })
              .catch((err: AxiosError) => {
                Alert({
                  title: `Erro: ${err.message}`,
                  text: 'Não foi possível atualizar a vaga, tente novamente!',
                  icon: 'error',
                })
                return err?.response?.data.detail
              })
          }
        }
      })
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
      <Button onClick={FindPeople} theme="secondary">
        Nova busca
      </Button>
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
