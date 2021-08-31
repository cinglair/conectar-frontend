import React, { FormEvent, useState, useCallback, useRef } from 'react'
import { BodyLogin } from './styles'
import { Link } from 'react-router-dom'
import Input from '../Input'
import FacebookLogin, {
  ReactFacebookLoginInfo,
  ReactFacebookFailureResponse,
} from 'react-facebook-login'
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import Button from '../Button'
import api from '../../../services/api'
import { AxiosError } from 'axios'
import { useHistory } from 'react-router'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import getValidationErrors from '../../../utils/getValidationErrors'
import useAuth from '../../../context/hooks/useAuth'
import getBackendErrors from '../../../utils/getBackendErros'
import useLoading from '../../../context/hooks/useLoading'

interface loginProps {
  onSuccessLogin(): void
}
interface SignInFormData {
  email: string
  senha: string
}

const Login: React.FC<loginProps> = ({ onSuccessLogin }) => {
  const history = useHistory()
  const loading = useLoading()
  const formRef = useRef<FormHandles>(null)
  const { handleLogin } = useAuth()
  /** This function checks the profile is idealizer, collaborator or ally, then redirects to registration these */
  async function checkProfileType() {
    const { aliado, colaborador, idealizador } = (
      await api.get('/api/v1/pessoas/me')
    ).data
    if (!aliado && !colaborador && !idealizador) {
      history.push('/cadastrar/2')
    }
  }
  /** Send email name and profile_pic to backend through the login route with provider=facebook then check profile type */
  const responseFacebook = async (resposta: ReactFacebookLoginInfo) => {
    const { email, name } = resposta
    const foto_perfil = resposta.picture?.data.url

    console.log(resposta)

    const res = await api
      .post(`/api/login?provider=facebook`, {
        email,
        nome: name,
      })
      .then(response => {
        checkProfileType()
        handleLogin(true)
        api.post('/api/refresh_token').then(async req => {
          const accessToken = await req.data.access_token
          api.defaults.headers.Authorization = `Bearer ${accessToken}`
        })
        onSuccessLogin()
        console.log(response)
      })
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
      .then(() => {
        checkProfileType()
        onSuccessLogin()
        handleLogin(true)
      })
      .catch((err: AxiosError) => {
        // Returns error message from backend
        return err?.response?.data.detail
      })
    console.log(res)
  }
  const handleSubmit = useCallback(
    async (formData: SignInFormData) => {
      formRef.current?.setErrors({})
      try {
        const schema = Yup.object().shape({
          email: Yup.string().required('E-mail ou usuário obrigatório'),
          senha: Yup.string().required('Senha obrigatória'),
        })

        await schema.validate(formData, {
          abortEarly: false,
        })
        // validation passed
        loading.start()
        const data = new FormData()
        data.append('username', formData.email)
        data.append('password', formData.senha)

        await api.post('/api/token', data)
        onSuccessLogin()
        handleLogin(true)
        loading.stop()
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
          console.log(err)
        } else {
          const { fieldName, error } = getBackendErrors(err)

          formRef.current?.setFieldError(fieldName, error)
          console.log(err.response)
        }
      }
    },
    [handleLogin, onSuccessLogin],
  )

  return (
    <BodyLogin onSubmit={handleSubmit} ref={formRef}>
      <Input name="email" label="E-mail ou nome de usuário" />
      <Input
        name="senha"
        type="password"
        label="Senha"
        subLabel="Esqueceu a senha?"
        pathSubLabel="/esqueceu-senha"
      />
      <Button type="submit" theme="primary">
        Entrar
      </Button>
      <p>ou</p>
      <aside>
        <FacebookLogin
          textButton=""
          appId="364709984736964"
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          cssClass="facebook-button"
          icon={<FaFacebook />}
        />
        {/* <GoogleLogin
          clientId="1027346829762-a6tjn6i5a8r50nn0cskrg4sholipvt5j.apps.googleusercontent.com"
          render={renderProps => (
            <button
              className="google-button"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <FcGoogle />
            </button>
          )}
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={res => {
            console.log(res)
          }}
          cookiePolicy={'single_host_origin'}
        /> */}
      </aside>
      <p>
        Novo no Conectar? <Link to="/cadastrar/1">Crie uma conta</Link>
      </p>
    </BodyLogin>
  )
}

export default Login
