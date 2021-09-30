import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  useCallback,
} from 'react'
import { BodySelectTool } from './styles'
import { GoCheck, GoPlus } from 'react-icons/go'
import { AxiosError } from 'axios'
import api from '../../../services/api'
import { useField } from '@unform/core'
import { IconTrash } from '../../../assets/icon'
import Alert from '../../../utils/SweetAlert'
interface SelectToolProps {
  name: string
  defaultValue?: string[]
  label?: string
}

export interface ToolType {
  nome: string
  id?: number
}
/**
 * This component shows all tools and habilities making possible the user to select their experiences
 *
 * @component
 * @param {string} name is the name on the form data
 * @param {string} label is the title that is displayed above the component
 * @param {Array<string>} defaultValue are the values ​​that arrive with the standard
 * @example
 * return (
 *   <SelectTool name="habilidades" label="Ferramentas, matérias e habilidades que o time precisa dominar" />
 * )
 */
const SelectTool: React.FC<SelectToolProps> = ({
  label,
  name,
  defaultValue,
}) => {
  const [newTool, setNewTool] = useState<ToolType>({ nome: '' })
  const [tools, setTools] = useState<ToolType[]>([])
  const [selectedTools, setSelectedTools] = useState<string[]>(
    defaultValue || [],
  )
  const inputRefs = useRef<HTMLInputElement[]>([])
  const { fieldName, registerField, error } = useField(name)
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRefs.current,
      getValue: (refs: HTMLInputElement[]) => {
        return refs.filter(ref => ref.checked).map(ref => ref.value)
      },
      clearValue: (refs: HTMLInputElement[]) => {
        refs.forEach(ref => {
          ref.checked = false
        })
      },
      setValue: (refs: HTMLInputElement[], values: string[]) => {
        refs.forEach(ref => {
          if (values.includes(ref.id)) {
            ref.checked = true
          }
        })
      },
    })
  }, [defaultValue, fieldName, registerField])
  const handleInputCheckChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      if (selectedTools?.includes(value)) {
        setSelectedTools(selectedTools.filter(atual => atual !== value))
      } else {
        setSelectedTools([...selectedTools, value])
      }
    },
    [selectedTools],
  )
  const get_set_habilidades = useCallback(async () => {
    await api
      .get('/api/v1/habilidades', {
        withCredentials: true,
      })
      .then(response => {
        setTools(response.data)
      })
      .catch((err: AxiosError) => {
        // Returns error message from backend
        return err?.response?.data.detail
      })
  }, [])
  const handleAddNewTool = useCallback(
    async (tool: ToolType) => {
      console.log(newTool)
      if (!tools.includes(tool) && tool.nome.replace(/\s/g, '') !== '') {
        const res = await api
          .post('/api/v1/habilidades', tool, {
            withCredentials: true,
          })
          .then(async () => {
            await get_set_habilidades()
            const inputCheck: HTMLInputElement = document.getElementById(
              tool.nome,
            ) as HTMLInputElement
            inputCheck.checked = true
            setSelectedTools(tools => tools.concat(tool.nome))
          })
          .catch((err: AxiosError) => {
            return err?.response?.data.detail
          })
        console.log(res)
      }
      setNewTool({ nome: '' })
    },
    [get_set_habilidades, newTool, tools],
  )

  useEffect(() => {
    get_set_habilidades()
  }, [newTool])
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      if (name === 'newTool') {
        value.length < 30? setNewTool({ nome: value }) : 
        Alert({
          title: `Nome muito grande`,
          text: 'Insira uma habilidade, ferramenta ou matéria com ate 30 caracteres',
          showCancelButton: true,
          showConfirmButton: true,
          icon: 'warning',
        })
      }
    },
    [],
  )
  return (
    <BodySelectTool>
      <label>{label}</label>
      <div>
        <div className="area-selecionadas">
          <legend>Habilidades e Ferramentas selecionadas</legend>
          <ul>
            {selectedTools?.map(nome => (
              <li key={nome}>
                <legend>{nome}</legend>
                <label htmlFor={nome}>
                  <IconTrash />
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="area-selecao">
          <legend>Habilidades e Ferramentas</legend>
          <ul>
            {tools.map((tool, index) => (
              <li
                key={tool.nome}
                style={{
                  display:
                    newTool &&
                    tool.nome
                      .toLowerCase()
                      .includes(newTool?.nome.toLowerCase())
                      ? 'initial'
                      : 'none',
                }}
              >
                <label htmlFor={tool.nome}>
                  <span>
                    {selectedTools?.includes(tool.nome) && (
                      <GoCheck size={20} />
                    )}
                  </span>
                  <legend>{tool.nome}</legend>
                  <GoPlus size={15} />
                </label>
                <input
                  type="checkbox"
                  id={tool.nome}
                  value={tool.nome}
                  defaultChecked={
                    defaultValue ? selectedTools.includes(tool.nome) : false
                  }
                  ref={ref => {
                    inputRefs.current[index] = ref as HTMLInputElement
                  }}
                  onChange={handleInputCheckChange}
                />
              </li>
            ))}
          </ul>
          <fieldset className="area-insercao">
            <legend>
              <label htmlFor="newTool">ou insira abaixo</label>
            </legend>
            <input
              placeholder="Habilidade, ferramenta ou matéria..."
              name="newTool"
              id="newTool"
              onChange={handleInputChange}
            />
            <button
              type="reset"
              onClick={() => newTool && handleAddNewTool(newTool)}
            >
              <GoPlus size={15} />
            </button>
          </fieldset>
        </div>
      </div>
      <span>{error}</span>
    </BodySelectTool>
  )
}
export default SelectTool
