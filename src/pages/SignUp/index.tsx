import React, { useState, useCallback, useRef, ChangeEvent } from 'react'
import { BodySignUp } from './styles'
import logo from '../../assets/image/logo_fundoClaro.svg'
import cadastro_banner from '../../assets/image/cadastro_banner.svg'
import Input from '../../components/UI/Input'
import Select from '../../components/UI/Select'
import ToggleSwitch from '../../components/UI/ToggleSwitch'
import InputMask from '../../components/UI/InputMask'
import { Link, Redirect } from 'react-router-dom'
import Button from '../../components/UI/Button'
import { ReactFacebookLoginInfo } from 'react-facebook-login'
import FacebookLogin from 'react-facebook-login'
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookF } from 'react-icons/fa'
import { useHistory, useParams } from 'react-router'
import { daysOptions, monthOptions, yearOptions } from '../../utils/dates'
import { AxiosError } from 'axios'
import api from '../../services/api'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import getValidationErrors from '../../utils/getValidationErrors'
import { IoMdAlert } from 'react-icons/io'
import { useContext, useEffect } from 'react'
import { Context } from '../../context/AuthContext'
import ProfileTypeToogleSwitch from '../../components/UI/ProfileTypeToggleSwitch'
import Alert from '../../utils/SweetAlert'
import { OptionTypeBase } from 'react-select'
import useLoading from '../../context/hooks/useLoading'

interface routeParms {
  parte: string
}
interface PessoaType {
  email: string
  telefone: string
  nome: string
  username: string
  password: string
  year: string
  month: string
  day: string
  idealizador: string
  colaborador: string
  aliado: string
  profileType: string[]
}
const SignUp: React.FC = () => {
  const history = useHistory()
  const { handleLogin, isAuthenticated } = useContext(Context)
  const params = useParams<routeParms>()
  const formRef = useRef<FormHandles>(null)
  const loading = useLoading()
  const [daysOption, setDaysOption] = useState<OptionTypeBase[]>([])
  const defaultFormData: PessoaType = {
    nome: '',
    email: '',
    aliado: 'false',
    colaborador: 'false',
    idealizador: 'false',
    day: '',
    year: '2001',
    month: '3',
    password: '',
    telefone: '',
    username: '',
    profileType: [],
  }
  const [firstFormData, setFirstData] = useState<PessoaType>(defaultFormData)
  const [showNextStep, setShowNextStep] = useState<boolean>(
    params.parte === '2' && (isAuthenticated || firstFormData !== undefined),
  )
  const handleSubmit = useCallback(async (formData: PessoaType) => {
    try {
      // Remove all previous errors
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Não corresponde ao formato exemple@ex.com')
          .required('Email é obrigatório'),
        password: Yup.string()
          .matches(
            /(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/g,
            'Deve conter letras maiúsculas e minúsculas números e símbolos',
          )
          .min(8, 'Deve conter no mínimo 8 caracteres')
          .required('Senha é obritória'),
        username: Yup.string()
          .min(4, 'Deve conter no mínimo 4 caracteres')
          .max(20, 'Deve conter no máximo 20 caracteres')
          .matches(
            /(^[a-zA-Z0-9_]*$)/g,
            'Não pode conter espaços em branco ou simbolos',
          )
          .required('Usuário é obrigatório'),
        nome: Yup.string()
          .max(80)
          .matches(/(?=.*[ ])/g, 'Informe o nome completo')
          .trim()
          .matches(
            /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/,
            'Informe um nome válido',
          )
          .required('Usuário é obrigatório'),
      })

      await schema.validate(formData, {
        abortEarly: false,
      })
      // Validation passed
      loading.start()
      setFirstData(formData)

      setShowNextStep(true)
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        // Validation failed
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
        // alert(errors);
      }
    } finally {
      loading.stop()
    }
  }, [])
  const handleSecondSubmit = useCallback(
    async (formData: PessoaType) => {
      console.log(formData)
      console.log(JSON.stringify(formData.profileType.includes('aliado')))

      try {
        // Remove all previogeus errors
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          telefone: Yup.string()
            .required('Telefone é obrigatório!')
            .min(15, 'Telefone inválido'),
          year: Yup.string().required('Ano é obrigatório!'),
          month: Yup.string().required('Mês é obrigatório!'),
          day: Yup.string().required('Dia é obrigatório!'),
          profileType: Yup.array().min(
            1,
            'Deve ser selecionado ao menos um tipo de perfil abaixo!',
          ),
        })

        await schema.validate(formData, {
          abortEarly: false,
        })
        // Validation passed
        loading.start()
        if (firstFormData) {
          const aliado = formData.profileType.includes('aliado')
          const colaborador = formData.profileType.includes('colaborador')
          const idealizador = formData.profileType.includes('idealizador')
          const { year, month, day } = formData
          const data = new FormData()
          data.append('email', firstFormData.email)
          data.append('nome', firstFormData.nome)
          data.append('username', firstFormData.username)
          data.append('password', firstFormData.password)
          data.append('telefone', formData.telefone)
          data.append('data_nascimento', `${year}-${month}-${day}`)

          await api.post('/api/signup', data).then(async res => {
            await api.put('/api/v1/pessoas', {
              aliado,
              colaborador,
              idealizador,
            })
          })

          handleLogin(true)
          history.push('/experiencias-do-usuario')
        } else {
          Alert({
            icon: 'error',
            title: 'Não consegui encontrar a primeiras informações',
          })
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          // Validation failed
          console.log(err)

          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
        }
      } finally {
        loading.stop()
      }
    },
    [firstFormData, handleLogin, history],
  )

  useEffect(() => {
    const finalDay = [
      31,
      Number(firstFormData.year) % 4 === 0 ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ]

    const days = [
      {
        label: '01',
        value: 1,
      },
    ]
    for (
      let index = 2;
      index <= finalDay[Number(firstFormData.month) - 1];
      index++
    ) {
      days.push({
        value: index,
        label: index < 10 ? `0${index}` : `${index}`,
      })
    }
    setDaysOption(days)
  }, [firstFormData.month, firstFormData.year])

  /** This function checks if the profile is idealizer, collaborator or ally then advances to the next form and set name and email in formData */
  async function checkProfileType() {
    const { aliado, colaborador, idealizador } = (
      await api.get('/api/v1/pessoas/me')
    ).data
    if (!aliado || !colaborador || !idealizador) {
      setShowNextStep(true)
    }
    // setFormData({ ...formData, nome, email });
  }
  const responseFacebook = async (resposta: ReactFacebookLoginInfo) => {
    const { email, name } = resposta
    const foto_perfil = resposta.picture?.data.url
    const res = await api
      .post(`/api/login?provider=facebook`, {
        email,
        nome: name,
        foto_perfil,
      })
      .then(checkProfileType)
      .catch((err: AxiosError) => {
        // Returns error message from backend
        return err?.response?.data.detail
      })

    console.log(res)
  }
  const responseGoogle = async (response: GoogleLoginResponse | any) => {
    const { tokenId } = response
    const res = await api
      .post(`/api/login?provider=google&token=${tokenId}`)
      .then(checkProfileType)
      .catch((err: AxiosError) => {
        // Returns error message from backend
        return err?.response?.data.detail
      })
    console.log(res)
  }

  return (
    <BodySignUp>
      {!showNextStep && (
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className="area-central container"
        >
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
          <div className="primeira-etapa">
            <img src={cadastro_banner} alt="cadastro" />

            <div className="area-form">
              <h1>Criar sua conta</h1>
              <Input
                name="nome"
                label="Nome Completo"
                defaultValue={firstFormData?.nome}
              />
              <Input
                name="email"
                label="E-mail"
                defaultValue={firstFormData?.email}
              />
              <section>
                <Input
                  name="username"
                  label="Nome de usuário"
                  defaultValue={firstFormData?.username}
                />
                <Input
                  type="password"
                  name="password"
                  label="Senha"
                  defaultValue={firstFormData?.password}
                />
              </section>
              <p>
                Ao prosseguir, você concorda com os{' '}
                <Link to="#">Termos de Uso</Link> e{' '}
                <Link to="#">Política de Privacidade.</Link>
              </p>

              <section>
                <Link to="login">Já tem uma conta?</Link>
                <Button theme="primary" type="submit">
                  Continuar
                </Button>
              </section>
              {/* <section>
                <FacebookLogin
                  appId="1088597931155576"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={responseFacebook}
                  cssClass="facebook-button"
                  textButton="Cadastre-se com Facebook"
                  icon={<FaFacebookF />}
                />
                <GoogleLogin
                  clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                  render={renderProps => (
                    <button
                      className="google-button"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <FcGoogle />
                      Inscreva-se com Google
                    </button>
                  )}
                  buttonText="Login"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                />
              </section> */}
            </div>
          </div>
        </Form>
      )}
      {showNextStep && (
        <Form
          ref={formRef}
          onSubmit={handleSecondSubmit}
          className="area-central container"
        >
          <div className="segunda-etapa">
            <legend>
              <h1>Bem vindo(a) ao Conectar</h1>
            </legend>
            <section>
              <InputMask
                type="tel"
                name="telefone"
                label="Celular"
                mask="(99) 99999-9999 "
              />
              <Select
                label="Ano de Nascimento"
                name="year"
                options={yearOptions}
                onChange={(option: OptionTypeBase) => {
                  setFirstData({
                    ...firstFormData,
                    year: option?.value,
                  })
                }}
              />
              <Select
                label="Mês de Nascimento"
                name="month"
                options={monthOptions}
                onChange={(option: OptionTypeBase) => {
                  setFirstData({
                    ...firstFormData,
                    month: option?.value,
                  })
                }}
              />
              <Select
                label="Dia de Nascimento"
                name="day"
                options={daysOption}
                onChange={(option: OptionTypeBase) => {
                  setFirstData({
                    ...firstFormData,
                    day: option?.value,
                  })
                }}
              />
            </section>
            <ProfileTypeToogleSwitch
              name="profileType"
              options={[
                {
                  id: 'idealizador',
                  value: 'idealizador',
                  label: 'Idealizador',
                  message: 'Interessado em criar projetos',
                },
                {
                  id: 'colaborador',
                  value: 'colaborador',
                  label: 'Colaborador',
                  message: 'Interessado em participar de projetos',
                },
                {
                  id: 'aliado',
                  value: 'aliado',
                  label: 'Aliado',
                  message: 'Interessado em apoiar projetos',
                },
              ]}
            />
            <section>
              <Button
                theme="secondary"
                type="submit"
                onClick={() => setShowNextStep(false)}
              >
                Voltar
              </Button>
              <Button theme="primary" type="submit">
                Continuar
              </Button>
            </section>
          </div>
        </Form>
      )}
    </BodySignUp>
  )
}
export default SignUp
