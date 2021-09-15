import React, { useRef, useCallback } from 'react'
import { BodyExperienceAreas } from './styles'
import Button from '../../components/UI/Button'
import { useHistory } from 'react-router-dom'
import SelectArea from '../../components/UI/SelectArea'

import { AxiosError } from 'axios'
import api from '../../services/api'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import getValidationErrors from '../../utils/getValidationErrors'
import useLoading from '../../context/hooks/useLoading'

const ExperienceAreas: React.FC = () => {
  const history = useHistory()
  const formRef = useRef<FormHandles>(null)
  const loading = useLoading()
  const handleSubmit = useCallback(
    async (formData: { areas: string[] }) => {
      console.log(formData)
      try {
        // Remove all previogeus errors
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          areas: Yup.array()
            .min(1, 'Seleciono pelo menos 1 área')
            .max(5, 'Seleciono no máximo 5'),
        })
        await schema.validate(formData, {
          abortEarly: false,
        })
        // Validation passed
        loading.start()
        const data = {
          areas: formData.areas.map(area => {
            return { descricao: area }
          }),
        }
        const res = await api
          .put('/api/v1/pessoas', data, {
            withCredentials: true,
          })
          .then(() => {
            history.push('/habilidades-e-ferramentas')
          })
          .catch((err: AxiosError) => {
            return err?.response?.data.detail
          })
        console.log(res)
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
    [history],
  )

  return (
    <BodyExperienceAreas onSubmit={handleSubmit} ref={formRef}>
      <div className="area-central container">
        <h1>Selecione até 5 áreas de atuação de seu conhecimento</h1>
        <SelectArea name="areas" />
      </div>
      <footer>
        <Button
          theme="secondary"
          onClick={() => {
            history.push('/habilidades-e-ferramentas')
          }}
        >
          Pular
        </Button>
        <Button type="submit" theme="primary">
          Continuar
        </Button>
      </footer>
    </BodyExperienceAreas>
  )
}
export default ExperienceAreas
