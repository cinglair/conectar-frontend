import React, { useState, useRef, useCallback } from 'react'
import { Page } from './styles'
import Button from '../../components/UI/Button'
import Input from '../../components/UI/Input'
import { useHistory } from 'react-router'
import api from '../../services/api'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import getValidationErrors from '../../utils/getValidationErrors'
import InputMask from '../../components/UI/InputMask'
import logo from '../../assets/image/logo_icone.svg'
import useLoading from '../../context/hooks/useLoading'
interface FirstFormData {
  email: string
}
interface SecondFormData {
  digito1: number
  digito2: number
  digito3: number
  digito4: number
  digito5: number
  digito6: number
}
interface ThirdFormData {
  senha: string
}
const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const history = useHistory()
  const [shownStep, setShownStep] = useState<1 | 2 | 3>(1)
  const [firstData, setfirstData] = useState<FirstFormData>({ email: `` })
  const loading = useLoading()
  const handleSubmit = useCallback(async (formData: FirstFormData) => {
    console.log(formData)
    try {
      // Remove all previogeus errors
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Não corresponde ao formato exemple@ex.com')
          .required('Email é obrigatório'),
      })
      await schema.validate(formData, {
        abortEarly: false,
      })
      // Validation passed
      loading.start()
      setfirstData(formData)

      setShownStep(2)
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        // Validation failed
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
      }
    } finally {
      loading.stop()
    }
  }, [])

  const handleSecondSubmit = useCallback(async (formData: SecondFormData) => {
    console.log(formData)
    try {
      // Remove all previogeus errors
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        digito1: Yup.string().required('Nenhum dígito inserido!'),
        digito2: Yup.string().required('Nenhum dígito inserido!'),
        digito3: Yup.string().required('Nenhum dígito inserido!'),
        digito4: Yup.string().required('Nenhum dígito inserido!'),
        digito5: Yup.string().required('Nenhum dígito inserido!'),
        digito6: Yup.string().required('Nenhum dígito inserido!'),
      })
      await schema.validate(formData, {
        abortEarly: false,
      })
      // Validation passed
      loading.start()
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
  }, [])
  const handleThirdSubmit = useCallback(async (formData: ThirdFormData) => {
    console.log(formData)
    try {
      // Remove all previogeus errors
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        senha: Yup.string()
          .matches(/(?=.*[!@#$%^&*])/g, 'Deve conter caracteres especiais')
          .matches(/(?=.*[A-Z])/g, 'Deve conter caracteres maiúsculas')
          .matches(/(?=.*[0-9])/g, 'Deve conter caracteres numéricos')
          .matches(/(?=.*[a-z])/g, 'Deve conter caracteres minúsculas')
          .min(8, 'Deve conter no mínimo 8 caracteres')
          .required('Senha é obrigatória'),
      })
      await schema.validate(formData, {
        abortEarly: false,
      })
      // Validation passed
      loading.start()
      await api.put(`/api/v1/pessoas`, formData, {
        withCredentials: true,
      })
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
  }, [])
  return (
    <Page>
      <main>
        <img src={logo} alt="Conectar" />
        <h1>{shownStep === 3 ? `Atualizar senha` : `Recuperar senha`}</h1>
        {(shownStep === 1 && (
          <Form
            ref={formRef}
            className="primeira-etapa"
            onSubmit={handleSubmit}
          >
            <Input name="email" label="Endereço de e-mail" />
            <aside>
              <button
                className="voltar"
                type="button"
                onClick={() => history.goBack()}
              >
                voltar
              </button>
              <Button type="submit" theme="primary">
                Receber código
              </Button>
            </aside>
          </Form>
        )) ||
          (shownStep === 2 && (
            <Form
              ref={formRef}
              className="segunda-etapa"
              onSubmit={handleSecondSubmit}
            >
              <label htmlFor="digito1">
                Código enviado para {` `}
                <strong>{firstData.email}</strong>
              </label>
              <section>
                <InputMask mask="9" name="digito1" />
                <InputMask mask="9" name="digito2" />
                <InputMask mask="9" name="digito3" />
                <InputMask mask="9" name="digito4" />
                <InputMask mask="9" name="digito5" />
                <InputMask mask="9" name="digito6" />
              </section>
              <aside>
                <button
                  className="voltar"
                  type="button"
                  onClick={() => setShownStep(1)}
                >
                  voltar
                </button>
                <Button type="submit" theme="primary">
                  Conferir código
                </Button>
              </aside>
            </Form>
          )) ||
          (shownStep === 3 && (
            <Form
              ref={formRef}
              className="terceira-etapa"
              onSubmit={handleThirdSubmit}
            >
              <Input name="senha" type="password" label="Nova senha" />
              <aside>
                <Button type="submit" theme="primary">
                  atualizar senha
                </Button>
              </aside>
            </Form>
          ))}
      </main>
    </Page>
  )
}
export default ForgotPassword
