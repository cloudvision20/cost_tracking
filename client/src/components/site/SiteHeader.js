import { useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import SiteHeaderForm from './SiteHeaderForm'


const SiteHeader = () => {
  

    const content = (
        <SiteHeaderForm></SiteHeaderForm>
    )

    return content
}
export default SiteHeader