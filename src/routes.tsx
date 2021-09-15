import React, { useContext, useState } from 'react'
import { Route, BrowserRouter, RouteProps } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import ProfileFeatures from './pages/ProfileFeatures'
import ExperienceAreas from './pages/ExperienceAreas'
import MasteryTools from './pages/MasteryTools'
import CreateProject from './pages/CreateProject'
import ApproveProject from './pages/ApproveProject'
import Projects from './pages/Projects'
import Profiles from './pages/Profiles'
import Sobre from './pages/Sobre'
import { GlobalStyle } from './assets/style/global'
import { AuthProvider, Context } from './context/AuthContext'
import Explorer from './pages/Explorer'
import Search from './pages/Search'
import NavBar from './components/UI/NavBar'
import EditProfile from './pages/EditProfile'
import ForgotPassword from './pages/ForgotPassword'
import Modal from './components/UI/Modal'
import Login from './components/UI/Login'
import ToastAnimated from './components/Toast/Toast'
import LoadingProvider from './context/LoadingContext'
const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useContext(Context)
  const [modalOpen, setModalOpen] = useState(!isAuthenticated)
  console.log(isAuthenticated)

  return (
    <Route
      {...rest}
      render={() => (
        <>
          {!isAuthenticated && (
            <Modal
              open={modalOpen}
              setOpen={setModalOpen}
              onAfterClose={() => setModalOpen(!isAuthenticated)}
            >
              <Login onSuccessLogin={() => setModalOpen(false)} />
            </Modal>
          )}
          {children}
        </>
      )}
    />
  )
}
const Routes: React.FC = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <ToastAnimated />
          <Route exact path="/" component={Home} />
          <Route path="/cadastrar/:parte" component={SignUp} />
          <Route path="/esqueceu-senha" component={ForgotPassword} />
          <Route path="/experiencias-do-usuario" component={ProfileFeatures} />
          <Route path="/areas-de-atuacao" component={ExperienceAreas} />
          <Route path="/habilidades-e-ferramentas" component={MasteryTools} />
          <Route path="/main" component={NavBar} />
          <PrivateRoute path="/criar-um-projeto">
            <CreateProject />
          </PrivateRoute>
          <Route path="/projeto-conectado/:id" component={ApproveProject} />
          <Route path="/projeto/:id/:step?/:vaga?" component={Projects} />
          <Route path="/editar-perfil/:id" component={EditProfile} />
          <Route path="/perfil/:id" component={Profiles} />
          <Route path="/explorar" component={Explorer} />
          <Route path="/pesquisar/:for?/:attribute?/:key?" component={Search} />
          <Route path="/sobre" component={Sobre} />
        </BrowserRouter>
      </LoadingProvider>
      <GlobalStyle />
    </AuthProvider>
  )
}
export default Routes
