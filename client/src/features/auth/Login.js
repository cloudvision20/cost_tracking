import { useRef, useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import useTitle from '../../hooks/useTitle'
//import useAuth from '../../hooks/useAuth'
import jwtDecode from 'jwt-decode'
import PulseLoader from 'react-spinners/PulseLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser, faLock
} from "@fortawesome/free-solid-svg-icons"

const Login = () => {
    useTitle('Employee Login')

    const userRef = useRef()
    const errRef = useRef()
    const pwdRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])


    const handleSubmit = async (e) => {
        e.preventDefault()
        let decoded
        try {
            setUsername('')
            setPassword('')
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            try {
                decoded = await jwtDecode(accessToken)
            } catch (err) {
                console.log(err.message)
            }

            if (decoded.UserInfo.roles.includes('Site')) {
                navigate(`/site`)
            } else {
                navigate(`/dash`)
            }


        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    }

    const handleNext = async (e) => {
        pwdRef.current.focus();
    }
    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const errClass = errMsg ? "errmsg" : "offscreen"

    if (isLoading) return <PulseLoader color={"#FFF"} />

    const content = (
        <section>
            <div className="container">
                <div id="loginbox" style={{ marginTop: "50px", textAlign: "left" }} className="mainbox col-md-4 col-md-offset-2 col-sm-6 col-sm-offset-2">
                    <div className="panel panel-info">
                        {/* <div className="panel-heading">
                            <div className="panel-title">Sign In</div>
                            <div style={{ float: "right", fontSize: "80%", position: "relative", top: "-10px" }}><a href="#">Forgot password?</a></div>
                        </div> */}
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <div className="panel-title"><h2>Employee Login</h2></div>
                                {/* <div style="float:right; font-size: 80%; position: relative; top:-10px"><a href="#">Forgot password?</a></div> */}
                            </div>
                            <div style={{ paddingTop: "30px" }} className="panel-body">
                                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                                <div style={{ display: "none" }} id="login-alert" className="alert alert-danger col-sm-12"></div>

                                <form id="loginform" className="form-horizontal" >

                                    <div style={{ marginBottom: "25px" }} className="input-group col-sm-2">
                                        <span style={{ marginRight: "20px" }} className="input-group-addon"><FontAwesomeIcon icon={faUser} /></span>
                                        <input
                                            className="form-control"
                                            style={{ textAlign: "left" }}
                                            type="text"
                                            id="username"
                                            placeholder="username"
                                            ref={userRef}
                                            value={username}
                                            onChange={handleUserInput}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    handleNext(e);
                                                }
                                            }}
                                            autoComplete="off"
                                            required
                                        />
                                    </div>

                                    <div style={{ marginBottom: "25px" }} className="input-group  col-sm-2">
                                        <span style={{ marginRight: "20px" }} className="input-group-addon"><FontAwesomeIcon icon={faLock} /></span>
                                        <input
                                            className="form-control"
                                            style={{ textAlign: "left" }}
                                            type="password"
                                            id="password"
                                            placeholder="password"
                                            onChange={handlePwdInput}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    handleSubmit(e);
                                                }
                                            }}
                                            ref={pwdRef}
                                            value={password}
                                            required
                                        />
                                    </div>

                                    {/* <button className="form__submit-button">Sign In</button> */}
                                    <div style={{ marginTop: "10px" }} className="form-group">
                                        <div className="col-sm-12 controls dash-header__nav">
                                            {/* <a id="btn-login" onClick={handleSubmit} className="btn btn-success">Login  </a> */}
                                            <button type="button" className="btn btn-primary" onClick={handleSubmit} >Sign In</button>
                                        </div>
                                    </div>

                                    <br /> <br />

                                </form>
                            </div>
                        </div>
                        <footer>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-4">
                                        <p>Trust This Device</p>
                                    </div>
                                    <div className="checkbox col-2">
                                        <input
                                            type="checkbox"
                                            id="persist"
                                            onChange={handleToggle}
                                            checked={persist}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <Link to="/">Back to Home</Link>
                                </div>
                            </div>

                        </footer>
                    </div>
                </div>
            </div>
        </section >
    )

    return content
}
export default Login