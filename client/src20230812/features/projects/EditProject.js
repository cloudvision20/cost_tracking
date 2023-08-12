import { useParams } from 'react-router-dom'
import EditProjectForm from './EditProjectForm'
import { useGetProjectsQuery } from './projectsApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditProject = () => {
    useTitle('Cost Tracking: Edit Project')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    const { project } = useGetProjectsQuery("projectsList", {
        selectFromResult: ({ data }) => ({
            project: data?.entities[id]
        }),
    })
    // const { projects } = useGetProjectsQuery("projectsList", {
    //     selectFromResult: ({ data }) => ({
    //         projects: data?.ids.map(id => data?.entities[id])
    //     }),
    // })
    // const project = projects.filter((product) => product._id === id)[0]

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!project || !users?.length) return <PulseLoader color={"#FFF"} />


    if (!isManager && !isAdmin) {
        if (project.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditProjectForm project={project} users={users} />

    return content
}
export default EditProject