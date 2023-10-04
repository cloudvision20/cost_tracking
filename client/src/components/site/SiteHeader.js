
import SiteHeaderForm from './SiteHeaderForm'
import useTitle from "../../hooks/useTitle"


const SiteHeader = () => {
    useTitle('Site Page')

   // const { id } = useParams()

   

    //const { data: res, isSuccess } = useGetActivityByIdQuery(id);

    let content

  //  if (isSuccess) {

       // if (!res.activity || !res.users?.length) return <PulseLoader color={"#FFF"} />

       // if (!isManager && !isAdmin) {
       //     if (res.activity.userId.username !== username) {
       //         return <p className="errmsg">No access</p>
        //    }
        //}
        content = <SiteHeaderForm />
       
   // }

  
    return content
}
export default SiteHeader