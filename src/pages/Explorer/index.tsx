import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useContext,
  Fragment,
  useCallback,
} from 'react'
import { Page } from './styles'

import { Context } from '../../context/AuthContext'
import NavBar from '../../components/UI/NavBar'
import ProjectCard, { IProject } from '../../components/ProjectCard'
import ProfileLink from '../../components/ProfileLink'
import LinksCard from '../../components/LinksCard'
import SuccessfulCreatorsCard from '../../components/SuccessfulCreatorsCard'
import api from '../../services/api'
import { AxiosError } from 'axios'
import Skeleton from 'react-loading-skeleton'
import SuccessfulProjectsCard from '../../components/SuccessfulProjectsCard'
import RecentesInviteCard from '../../components/RecentesInviteCard'

const Explorer: React.FC = () => {
  const { loading, isAuthenticated } = useContext(Context)
  const [projects, setProjects] = useState<IProject[]>([])
  useEffect(() => {
    api
      .get(`/api/v1/projetos?visibilidade=true`)
      .then(response => {
        setProjects(response.data)
      })
      .catch((err: AxiosError) => {
        return err?.response?.data.detail
      })
  }, [])
  return (
    <Fragment>
      <NavBar />
      <Page>
        <nav>
          <ProfileLink />
          <RecentesInviteCard />
        </nav>
        <ul>
          {projects.length ? (
            projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <Skeleton width="100%" height="200px" />
          )}
        </ul>
        <section>
          <LinksCard />
          {isAuthenticated && (
            <>
              <SuccessfulCreatorsCard />
              <SuccessfulProjectsCard />
            </>
          )}
        </section>
      </Page>
    </Fragment>
  )
}
export default Explorer
