import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import useLocalState from "../../hook/LocalState"
import { useGlobalContext } from "../../context/GlobalContext"
import { axiosPrivate } from "../../api/axios"
import Alert from "./Alert"

import Container from 'react-bootstrap/Container'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"


const Signin = () => {
    const { showAlert, alert } = useLocalState()
    const { auth, setAuth, setUser } = useGlobalContext()
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: ""
    })

    const navigate = useNavigate()

    const changeHandler = (e) => {
        setFormData(prev => {
            return { ...prev, [e.target.name]: e.target.value}
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axiosPrivate.post("/auth/signin", formData)
        .then(res => {
            setAuth(res?.data?.data?.accessToken)
            setUser(res?.data?.data?.user)
            showAlert({ msg: `Redirected to ${2 + 2} home  page...`, type: "success" })
            setTimeout(() => {
                navigate("/")
            }, 2000)
        }).catch(err => {
            showAlert({ msg: err?.response?.data?.msg, type: "danger" })
        })
    }

    return (
        <>
           { !auth ? (
                <>
                     <Alert alert={alert} />
                    <header className="py-2 bg-warning text-white">
                        <Container>
                        <div className="row">
                            <div className="col-md-6">
                            <h1><i className="fa fa-user"></i> Login</h1>
                            </div>
                        </div>
                        </Container>
                    </header>

                    <section>
                        <Container>
                        <div className="card mt-4 form-container" style={{ width: 30+"rem" }}>
                            <div className="card-title text-center bg-light">
                                <h1 className="text text-primary">Login form</h1>
                            </div>
                            <Form className="px-5 pb-5" onSubmit={submitHandler}>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                    type="email"
                                    name="email"
                                    placeholder="example@mail.com"
                                    value={formData.email}
                                    onChange={ changeHandler }
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control  
                                    type="text"
                                    name="phone"
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={ changeHandler }
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control  
                                    type="password"
                                    name="password"
                                    placeholder="********"
                                    value={formData.password}
                                    onChange={ changeHandler }
                                    />
                                </Form.Group>
                                
                                <Form.Check type="checkbox" label="Remember me"/>
                                
                                <Button type="submit" variant="primary">Signin</Button>
                            </Form>
                        </div>
                        </Container>
                    </section>
                </>
           ) : (
                <>
                    <Navigate to="/" />
                </>
           ) }
        </>
    )
}

export default Signin
