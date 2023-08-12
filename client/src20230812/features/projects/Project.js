import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetProjectsQuery } from './projectsApiSlice'
import { memo } from 'react'

const Project = ({ projectId }) => {

    const { project } = useGetProjectsQuery("projectsList", {
        selectFromResult: ({ data }) => ({
            project: data?.entities[projectId]
        }),
    })

    const navigate = useNavigate()

    if (project) {
        const created = new Date(project.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const updated = new Date(project.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/projects/${projectId}`)

        return (
            <tr className="">
                <td className="">
                    {project.completed
                        ? <span className="">Completed</span>
                        : <span className="">Open</span>
                    }
                </td>
                <td className="">{created}</td>
                <td className="">{updated}</td>
                <td className="">{project.title}</td>
                <td className="">{project.description}</td>

                <td className="">
                    <button
                        className="btn btn-primary"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}

const memoizedProject = memo(Project)

export default memoizedProject