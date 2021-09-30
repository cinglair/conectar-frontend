import React, {
  useState,
  useContext,
  useRef,
  useCallback,
  createContext,
  useEffect,
} from 'react'
import { BodyCreateProject } from './styles'
import Button from '../../components/UI/Button'
import Input from '../../components/UI/Input'
import Textarea from '../../components/UI/Textarea'
import { useHistory } from 'react-router'
import SelectArea, { AreaType } from '../../components/UI/SelectArea'
import SelectTool, { ToolType } from '../../components/UI/SelectTools'
import Dropzone from '../../components/UI/Dropzone'
import Modal from '../../components/UI/Modal'
import api from '../../services/api'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import getValidationErrors from '../../utils/getValidationErrors'
import Vacancy from '../../components/Vacancy'
import Alert from '../../utils/SweetAlert'
import { Context } from '../../context/AuthContext'
import useLoading from '../../context/hooks/useLoading'

export interface ProjectType {
  descricao: string
  objetivo: string
  habilidades: ToolType[]
  nome: string
  visibilidade: string[]
  foto_capa: string
  areas: AreaType[]
  id: number
}
type Step = 1 | 2 | 3
interface IConxtextCreateProject {
  shownStep: Step
  setShownStep(step: Step): void
  firstData: FirstFormData
  setfirstData(firstData: FirstFormData): void
  project: ProjectType
  setProject(project: ProjectType): void
}
const ContextCreateProjectPage = createContext<IConxtextCreateProject>(
  {} as IConxtextCreateProject,
)
interface FirstFormData extends Object {
  nome: string
  descricao: string
  objetivo: string
  areas: string[]
}

const FirstForm: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const history = useHistory()
  const { setShownStep, firstData, setfirstData } = useContext(
    ContextCreateProjectPage,
  )
  const loading = useLoading()
  useEffect(() => {
    if (Object.entries(firstData).length === 0) {
      formRef.current?.reset()
    }
  }, [firstData])
  const handleSubmit = useCallback(
    async (formData: FirstFormData) => {
      try {
        // Remove all previogeus errors
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          nome: Yup.string().required('Insira o nome do projeto!').trim().max(75),
          descricao: Yup.string().required('Descrição é obrigatório').trim(),
          objetivo: Yup.string().required('Objetivo é obrigatório').trim(),
          areas: Yup.array()
            .min(1, 'Seleciono pelo menos 1 item')
            .max(15, 'Seleciono no máximo 15'),
        })
        await schema.validate(formData, {
          abortEarly: false,
        })
        // Validation passed
        Object.entries(formData).forEach(item => {
          const [name, value] = item
          localStorage.setItem('project_create_' + name, value)
        })
        setfirstData(formData)
        setShownStep(2)
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          // Validation failed
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
        }
      }
    },
    [setShownStep, setfirstData],
  )
  return (
    <Form ref={formRef} className="primeira-etapa" onSubmit={handleSubmit}>
      <div className="coluna-um">
        <Input
          name="nome"
          label="Título do projeto"
          defaultValue={firstData?.nome}
        />
        <Textarea
          label="Objetivo do projeto"
          name="objetivo"
          defaultValue={firstData?.objetivo}
        />
        <Textarea
          label="Descrição simples"
          name="descricao"
          defaultValue={firstData?.descricao}
        />
      </div>
      <div className="coluna-dois">
        <SelectArea
          name="areas"
          label="Área de desenvolvimento"
          defaultValue={firstData?.areas}
        />
      </div>
      <section>
        <Button type="button" onClick={history.goBack} theme="secondary">
          Cancelar
        </Button>
        <Button theme="primary" type="submit">
          Continuar
        </Button>
      </section>
    </Form>
  )
}
interface SecondFormData {
  visibilidade: Array<string>
  img: File
  habilidades: string[]
}
const SecondForm: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const id_pessoa = useContext(Context).user.id
  const { setShownStep, firstData, setProject } = useContext(
    ContextCreateProjectPage,
  )
  const loading = useLoading()
  const handleSecondSubmit = useCallback(
    async (formData: SecondFormData) => {
      try {
        // Remove all previogeus errors
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          img: Yup.mixed()
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
            ),
          habilidades: Yup.array()
            .min(1, 'Seleciono pelo menos 1 item')
            .max(15, 'Seleciono no máximo 15'),
        })
        await schema.validate(formData, {
          abortEarly: false,
        })
        loading.start()
        // Validation passed
        const data = new FormData()
        data.append('nome', firstData.nome)
        data.append('visibilidade', JSON.stringify(true))
        data.append('descricao', firstData.descricao)
        data.append('objetivo', firstData.objetivo)
        data.append('foto_capa', formData.img)
        data.append('pessoa_id', id_pessoa.toString())
        const { id } = await (
          await api.post('/api/v1/projeto', data, {
            withCredentials: true,
          })
        ).data
        const dataEspecial = {
          areas: firstData.areas.map(area => {
            return { descricao: area }
          }),
          habilidades: formData.habilidades.map(habilidade => {
            return { nome: habilidade }
          }),
        }

        await api
          .put(`/api/v1/projeto/${id}`, dataEspecial, {
            withCredentials: true,
          })
          .then(response => {
            console.log(response.data)
            setProject(response.data)
          })
        for (const name in firstData) {
          localStorage.removeItem('project_create_' + name)
        }
        setShownStep(3)
      } catch (err) {
        console.log(err)

        if (err instanceof Yup.ValidationError) {
          // Validation failed
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
        }
      } finally {
        loading.stop()
      }
    },
    [firstData, id_pessoa, loading, setProject, setShownStep],
  )
  return (
    <Form ref={formRef} className="segunda-etapa" onSubmit={handleSecondSubmit}>
      <div className="coluna-um">
        <div className="upload-img">
          <Dropzone name="img" />
        </div>
      </div>
      <div className="coluna-dois">
        <SelectTool
          name="habilidades"
          label="Ferramentas, matérias e habilidades que o time precisa dominar"
        />
      </div>
      <section>
        <Button
          className="voltar"
          type="button"
          onClick={() => setShownStep(1)}
          theme="secondary"
        >
          Voltar
        </Button>
        <Button theme="primary" type="submit">
          Continuar
        </Button>
      </section>
    </Form>
  )
}

const Forms: React.FC = () => {
  const history = useHistory()
  const { project, shownStep } = useContext(ContextCreateProjectPage)
  switch (shownStep) {
    case 1:
      return (
        <BodyCreateProject>
          <main>
            <h1>Criar Projeto</h1>
            <FirstForm />
          </main>
        </BodyCreateProject>
      )
    case 2:
      return (
        <BodyCreateProject>
          <main>
            <h1>Criar Projeto</h1>

            <SecondForm />
          </main>
        </BodyCreateProject>
      )
    case 3:
      return (
        <BodyCreateProject>
          <main>
            <aside className="terceira-etapa">
              <Vacancy project={project} />
              <Button
                theme="primary"
                onClick={() => history.push(`/projeto/${project.id}`)}
              >
                Concluir
              </Button>
            </aside>
          </main>
        </BodyCreateProject>
      )
  }
}
const CreateProject: React.FC = () => {
  const [shownStep, setShownStep] = useState<1 | 2 | 3>(1)
  const { isAuthenticated } = useContext(Context)
  const [firstData, setfirstData] = useState<FirstFormData>({
    areas: localStorage.getItem('project_create_areas')?.split(',') || [],
    nome: localStorage.getItem('project_create_nome') || '',
    objetivo: localStorage.getItem('project_create_objetivo') || '',
    descricao: localStorage.getItem('project_create_descricao') || '',
  })
  useEffect(() => {
    if (localStorage.length > 0 && isAuthenticated) {
      const projectName = localStorage.getItem('project_create_nome')
      Alert({
        icon: 'question',
        title: projectName
          ? `Você inciou a criação do projeto ${projectName}, deseja continuar?`
          : 'Você inciou a criação de um projeto, deseja continuar?',
        confirmButtonText: 'Sim',
        showDenyButton: true,
      }).then(result => {
        if (result.isDenied) {
          Object.entries(firstData).forEach(item => {
            const [name] = item
            localStorage.removeItem('project_create_' + name)
          })
          setfirstData({} as FirstFormData)
        }
      })
    }
  }, [isAuthenticated])
  const [project, setProject] = useState<ProjectType>({} as ProjectType)
  return (
    <ContextCreateProjectPage.Provider
      value={{
        firstData,
        setfirstData,
        project,
        setProject,
        shownStep,
        setShownStep,
      }}
    >
      <Forms />
    </ContextCreateProjectPage.Provider>
  )
}
export default CreateProject
