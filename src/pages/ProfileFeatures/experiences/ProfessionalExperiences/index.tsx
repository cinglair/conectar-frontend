import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  OptionHTMLAttributes,
  ChangeEvent,
} from 'react'
import Input from '../../../../components/UI/Input'
import Textarea from '../../../../components/UI/Textarea'
import Select from '../../../../components/UI/Select'
import ToggleSwitch from '../../../../components/UI/ToggleSwitch'
import Button from '../../../../components/UI/Button'
import Modal from '../../../../components/UI/Modal'
import { BodyExperiences } from '../styles'
import {
  yearOptions,
  monthOptions,
  toMonth,
  finalYearOptions,
} from '../../../../utils/dates'
import { AxiosError } from 'axios'
import api from '../../../../services/api'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import getValidationErrors from '../../../../utils/getValidationErrors'
import { IconEdit, IconTrash } from '../../../../assets/icon'
import { showToast } from '../../../../components/Toast/Toast'
import Alert from '../../../../utils/SweetAlert'
import { IExperienceProject } from '../ProjectExperiences'
import useLoading from '../../../../context/hooks/useLoading'

export interface ProfessionalType {
  id: number
  organizacao: string
  descricao: string
  data_inicio: string
  data_fim: string
  cargo: string
  vinculo: string
}
interface ProfessionalDataType {
  id?: number
  vinculo: string
  currentWorking: boolean
  cargo: string
  organizacao: string
  descricao: string
  initialYear: string
  initialMonth: string
  // Supressing "The operand of a 'delete' operator must be optional" warning
  finalYear: any
  finalMonth: any
}
const ProfessionalExperiences: React.FC = () => {
  // Global
  const vinculos: OptionHTMLAttributes<HTMLOptionElement>[] = [
    { label: 'Trainee', value: 'Trainee' },
    { label: 'Terceirizado', value: 'Terceirizado' },
    { label: 'Intermitente', value: 'Intermitente' },
    { label: 'Aprendiz', value: 'Aprendiz' },
    { label: 'Estágio', value: 'Estágio' },
    { label: 'Temporário', value: 'Temporário' },
    { label: 'Freelance', value: 'Freelance' },
    { label: 'Autônomo', value: 'Autônomo' },
    { label: 'Meio Período', value: 'Meio Período' },
    { label: 'Tempo Integral', value: 'Tempo Integral' },
  ]
  const loading = useLoading()
  const [showRegister, setShowRegister] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const formRef = useRef<FormHandles>(null)
  const [stored, setStored] = useState<ProfessionalType[]>([])
  const [initialYear, setInitialYear] = useState<number>(
    new Date().getFullYear() + 1,
  )
  const [currentilyWork, setCurrentilyWork] = useState<boolean>(false)
  const initialProfessionalData = {
    id: 0,
    currentWorking: false,
  } as ProfessionalDataType
  const [editStored, setEditStored] = useState<ProfessionalDataType>(
    initialProfessionalData,
  )
  const [experienceExcluded, setExperienceExcluded] = useState({
    id: 0,
    nome: '',
  })
  useEffect(() => {
    api
      .get('/api/v1/experiencias/profissional/me', {
        withCredentials: true,
      })
      .then(response => {
        setStored(response.data)
      })
      .catch((err: AxiosError) => {
        // Returns error message from backend
        return err?.response?.data.detail
      })
  }, [showRegister, editStored, openModal])
  async function handleDeleteExperience(id: number) {
    if (stored.length === 1) {
      stored.splice(0, 1)
    }
    await api
      .delete(`/api/v1/experiencias/profissional/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        setShowRegister(false)
        setOpenModal(false)
        setEditStored(initialProfessionalData)
      })
      .catch((err: AxiosError) => {
        // Returns error message from backend
        return err?.response?.data.detail
      })
  }

  const handleSubmit = useCallback(
    async (formData: ProfessionalDataType) => {
      console.log(formData)

      formRef.current?.setErrors({})
      try {
        const validations = {
          vinculo: Yup.string().required('Informe o vínculo'),
          organizacao: Yup.string()
            .max(50, 'Excedeu o limite de caractéres (50)')
            .required('Informe a organização'),
          cargo: Yup.string().required('Informe o cargo'),
          descricao: Yup.string()
            .min(20, 'Descreva um pouco mais')
            .max(500, 'Excedeu o limite de caractéres (500)')
            .required('Informe a descrição'),
          finalYear: !currentilyWork
            ? Yup.string().required('Ano final é obrigatório')
            : Yup.string(),
          initialYear: Yup.string().required('Ano inicial é obrigatório'),
          initialMonth: Yup.string().required('Mês inicial é obrigatório'),
          finalMonth: !currentilyWork
            ? Yup.string().required('Mês final é obrigatório')
            : Yup.string(),
        }

        const schema = Yup.object().shape(validations)

        await schema.validate(formData, {
          abortEarly: false,
        })
        // Validation passed
        loading.start()
        const {
          vinculo,
          currentWorking,
          organizacao,
          cargo,
          descricao,
          finalYear,
          initialYear,
          initialMonth,
          finalMonth,
        }: ProfessionalDataType = formData
        // setting to null because if there a update an experience with an existing data_fim it will not send
        const data_inicio = `${initialYear}-${initialMonth}-01`

        let data_fim = null
        if (!currentilyWork) {
          data_fim = `${finalYear}-${finalMonth}-01`
        }

        const data = {
          organizacao,
          descricao,
          data_inicio,
          data_fim,
          cargo,
          vinculo,
        }

        /**
         * Sends data to backend
         * It's important to notice the withCredentials being true here
         * so it will send the JWT token as cookie
         * */
        if (editStored.id)
          await api
            .put(`/api/v1/experiencias/profissional/${editStored.id}`, data, {
              withCredentials: true,
            })
            .then(() => {
              showToast('success', 'Editado com sucesso!')
              setShowRegister(false)
              setEditStored(initialProfessionalData)
            })
            .catch((err: AxiosError) => {
              // Returns error message from backend
              return err?.response?.data.detail
            })
        else
          await api
            .post('/api/v1/experiencias/profissional', data, {
              withCredentials: true,
            })
            .then(() => {
              showToast('success', 'Cadastrado com sucesso!')
              setShowRegister(false)
              setEditStored(initialProfessionalData)
            })
            .catch((err: AxiosError) => {
              // Returns error message from backend
              return err?.response?.data.detail
            })
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          // Validation failed
          const errors = getValidationErrors(error)

          formRef.current?.setErrors(errors)
        }
      } finally {
        loading.stop()
      }

      // Do something
    },
    [currentilyWork, editStored.id, initialProfessionalData],
  )
  // Edit
  function handleEditExperience(experience: ProfessionalType) {
    const {
      id,
      organizacao,
      descricao,
      data_inicio,
      data_fim,
      cargo,
      vinculo,
    }: ProfessionalType = experience

    const [initialYear, initialMonth] = data_inicio.split('-')

    const data = {
      id,
      vinculo,
      organizacao,
      cargo,
      descricao,
      initialYear,
      initialMonth,
      currentWorking: !data_fim,
      finalYear: data_fim ? data_fim.split('-')[0] : data_fim,
      finalMonth: data_fim ? data_fim.split('-')[1] : data_fim,
    }

    setShowRegister(true)
    setEditStored(data)
  }
  useEffect(() => {
    setCurrentilyWork(editStored.currentWorking)
  }, [editStored])

  async function deleteExperience(experience: ProfessionalType) {
    const delet = await Alert({
      title: `Deseja realmente excluir ${experience.cargo}?`,
      text: 'Todas as informações e registros serão perdidos',
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: 'apagar',
      icon: 'warning',
    })
    if (delet.isDenied) {
      console.log(experience)
      handleDeleteExperience(experience.id)
    }
  }

  return (
    <BodyExperiences>
      {/* <Modal setOpen={setOpenModal} open={openModal}>
        <h1>Deseja realmente excluir o projeto {experienceExcluded?.nome}?</h1>
        <footer>
          <Button
            theme="primary"
            onClick={() =>
              experienceExcluded &&
              handleDeleteExperience(experienceExcluded?.id)
            }
          >
            Excluir
          </Button>
          <Button theme="primary" onClick={() => setOpenModal(false)}>
            Manter
          </Button>
        </footer>
      </Modal> */}
      <h2>
        Atuação Profissional
        {!showRegister && (
          <button onClick={() => setShowRegister(true)}>
            <span>+ </span>
            Adicionar
          </button>
        )}
      </h2>
      {!showRegister ? (
        <div className="experiencias">
          {stored?.map((experience: ProfessionalType) => (
            <div
              key={experience.id}
              className="experiencia-cadastrada atuacao-profissional-cadastrada"
            >
              <section className="icones">
                <IconEdit onClick={() => handleEditExperience(experience)} />
                <IconTrash
                  onClick={() => {
                    deleteExperience(experience)
                    // setOpenModal(true)
                    // setExperienceExcluded({
                    //   ...experience,
                    //   nome: experience.cargo,
                    // })
                  }}
                />
              </section>
              <fieldset className="info-experiencias">
                <legend>
                  {`${experience.cargo} | ${experience.organizacao}`}
                </legend>
                <p>
                  {experience.vinculo} <br />
                  {`
                    ${toMonth(experience.data_inicio.split('-')[1])} 
                    de 
                    ${experience.data_inicio.split('-')[0]} 
                    até 
                    ${
                      experience.data_fim
                        ? `${toMonth(experience.data_fim.split('-')[1])} 
                      de 
                      ${experience.data_fim.split('-')[0]}`
                        : 'o momento atual'
                    }
                  `}
                </p>
              </fieldset>
            </div>
          ))}
        </div>
      ) : (
        <Form
          className="form--experiencia"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <aside className="area-registro">
            <section className="bloco-um">
              <Input
                label="Organização"
                name="organizacao"
                defaultValue={editStored?.organizacao}
              />
              <Input
                label="Cargo"
                name="cargo"
                defaultValue={editStored?.cargo}
              />
            </section>
            <section className="bloco-dois">
              <Select
                label="Vínculo"
                name="vinculo"
                options={vinculos}
                defaultValue={
                  editStored.id
                    ? {
                        label: editStored?.vinculo,
                        value: editStored?.vinculo,
                      }
                    : null
                }
              />
              <aside>
                <ToggleSwitch
                  options={[
                    {
                      label: 'Trabalho atual',
                      id: 'currentWorking',
                      value: 'currentWorking',
                    },
                  ]}
                  name="currentWorking"
                  defaultChecked={editStored.currentWorking}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setCurrentilyWork(event.target.checked)
                  }
                />
              </aside>
            </section>
            <section className="bloco-tres">
              <aside>
                <Select
                  label="Mês inicial"
                  name="initialMonth"
                  options={monthOptions}
                  defaultValue={
                    editStored.id
                      ? {
                          label: toMonth(editStored?.initialMonth),
                          value: editStored?.initialMonth,
                        }
                      : null
                  }
                  defaultOption={editStored?.initialMonth}
                />
                <Select
                  label="Ano inicial"
                  name="initialYear"
                  options={yearOptions}
                  onChange={(option: any) => {
                    setInitialYear(Number(option.value))
                  }}
                  defaultValue={
                    editStored.id
                      ? {
                          label: editStored?.initialYear,
                          value: editStored?.initialYear,
                        }
                      : null
                  }
                />
              </aside>
              {!currentilyWork && (
                <aside>
                  <Select
                    label="Mês final"
                    name="finalMonth"
                    options={monthOptions}
                    defaultValue={
                      editStored.id
                        ? {
                            label: toMonth(editStored?.finalMonth),
                            value: editStored?.finalMonth,
                          }
                        : null
                    }
                  />
                  <Select
                    label="Ano final"
                    name="finalYear"
                    options={finalYearOptions(Number(initialYear))}
                    noOptionsMessage={props =>
                      'Selecione primeiro o ano inicial'
                    }
                    defaultValue={
                      editStored.id &&
                      Number(editStored?.finalYear > initialYear)
                        ? {
                            label: editStored?.finalYear,
                            value: editStored?.finalYear,
                          }
                        : null
                    }
                  />
                </aside>
              )}
            </section>
            <section className="bloco-quatro">
              <Textarea
                name="descricao"
                label="Detalhes"
                defaultValue={editStored?.descricao}
              />
            </section>
            <section className="area-botoes">
              <Button type="submit" theme="primary">
                Salvar
              </Button>
              <Button
                theme="secondary"
                onClick={() => {
                  if (editStored.id) {
                    setOpenModal(true)
                    setExperienceExcluded({
                      nome: editStored.cargo,
                      id: editStored?.id,
                    })
                  } else {
                    setShowRegister(false)
                  }
                }}
              >
                Excluir
              </Button>
              <Button
                theme="secondary"
                onClick={() => {
                  setShowRegister(false)
                  setEditStored(initialProfessionalData)
                }}
              >
                Cancelar
              </Button>
            </section>
          </aside>
        </Form>
      )}
    </BodyExperiences>
  )
}

export default ProfessionalExperiences
