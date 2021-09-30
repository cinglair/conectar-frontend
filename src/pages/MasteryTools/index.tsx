import React, { useCallback, useRef } from 'react'
import { BodyMasteryTools } from './styles'
import Button from '../../components/UI/Button'
import { useHistory } from 'react-router-dom'
import SelectTool from '../../components/UI/SelectTools'
import { AxiosError } from 'axios'
import api from '../../services/api'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import getValidationErrors from '../../utils/getValidationErrors'
import useLoading from '../../context/hooks/useLoading'

const MasteryTools: React.FC = () => {
  const history = useHistory()
  const formRef = useRef<FormHandles>(null)
  const loading = useLoading()
  const handleSubmit = useCallback(
    async (formData: { habilidades: string[] }) => {
      console.log(formData)
      try {
        // Remove all previogeus errors
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          habilidades: Yup.array()
            .min(1, 'Selecione pelo menos 1 item')
            .max(5, 'Selecione no máximo 5'),
        })
        await schema.validate(formData, {
          abortEarly: false,
        })
        // Validation passed
        loading.start()
        const data = {
          habilidades: formData.habilidades.map(habilidade => {
            return { nome: habilidade }
          }),
        }
        console.log(data)

        const res = await api
          .put('/api/v1/pessoas', data, {
            withCredentials: true,
          })
          .then(() => {
            history.push('/explorar')
          })
          .catch((err: AxiosError) => {
            return err?.response?.data.detail
          })
        console.log(res)
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          // Validation failed
          loading.start()
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
        }
      } finally {
        loading.stop()
      }
    },
    [history],
  )

  return (
    <BodyMasteryTools onSubmit={handleSubmit} ref={formRef}>
      <div className="area-central container">
        <h1>Selecione suas habilidades e ferramentas de domínio</h1>
        <SelectTool name="habilidades" />
      </div>
      <footer>
        <Button
          theme="secondary"
          onClick={() => {
            history.push('/explorar')
          }}
        >
          Pular
        </Button>
        <Button theme="primary" type="submit">
          Continuar
        </Button>
      </footer>
    </BodyMasteryTools>
  )
}
export default MasteryTools
