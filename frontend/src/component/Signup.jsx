import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { axiosPrivate } from "../api/axios"
import Alert from "./admin/Alert"
import useLocalState from "../hook/LocalState"
import { useGlobalContext } from "../context/GlobalContext"

import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"

const SignupU = () => {
    const navigate = useNavigate()
    const { auth } = useGlobalContext()
    const { alert, showAlert } = useLocalState()
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        email: "",
        phone: "",
        password: "",
        rePassword: ""
    })

    const changeHandler = (e) => {
        setFormData(prev => {
            return { ...prev, [e.target.name]: e.target.value}
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        console.log(formData)
        axiosPrivate.post("/auth/signup", formData)
        .then(res => {
            showAlert({ msg: res?.data?.msg, type: "success" })
            console.log("Debugging from signup component: ", res?.data)
            setTimeout(() => {
                navigate("/verify")
            }, 5000)
        })
        .catch(err => {
            showAlert({ msg: err?.response?.data?.msg, type: "danger" })
        })
    }

    useEffect(() => {
        if (auth) {
            navigate("/")
        }
    })

    return (
        <>
          <Alert alert={alert} />
          <section>
            <Container>
                <div className="container text-dark">
                <div className="card mt-4 form-container" yle={{ width: 30+"rem" }}>
                    <div className="card-title text-center bg-light">
                    <h2 className="text p-3 text-info">Sign Up</h2>
                    </div>
                    <Form className="px-5 pb-5" onSubmit={ submitHandler }>
                        <Row>
                            <Form.Group className="col-md-6">
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="John"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={ changeHandler }
                                    required />
                            </Form.Group>
                            <Form.Group className="col-md-6">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="middleName"
                                    placeholder="Deo"
                                    value={formData.middleName}
                                    onChange={ changeHandler }
                                    required />
                            </Form.Group>
                        </Row>
                        
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

                        <Form.Group>
                            <Form.Label>Repeat password</Form.Label>
                            <Form.Control  
                            type="password"
                            name="rePassword"
                            placeholder="********"
                            value={formData.rePassword}
                            onChange={ changeHandler }
                            />
                        </Form.Group>
                        <p className="text-muted pt-1">Already have an account? <a href="/signin">SignIn</a></p>

                        
                        <Button variant="primary" type="submit" className="mt-2">Signup</Button>
                    </Form>
                </div>
                </div>
            </Container>
        </section>  
        </>
    )
}

export default SignupU
