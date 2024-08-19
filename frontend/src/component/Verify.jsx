import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Alert from "./admin/Alert"
import useLocalState from "../hook/LocalState"
import { axiosPrivate } from "../api/axios"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

const Verify = () => {
    const { alert, showAlert } = useLocalState()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        verificationToken: ""
    })

    const changeHandler = (e) => {
        setFormData(prev => {
            return { ...prev, [e.target.name]: e.target.value}
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axiosPrivate.post("/auth/verify", formData)
        .then(res => {
            // This isn't the handy solution for production level application
            // Users must automatically signed in when verification is succeed
            showAlert({ msg: res?.data?.msg, type: "success" })
            setTimeout(() => {
                navigate("/signin")
            }, 4000)
        })
        .catch(err => {
            showAlert({ msg: err?.response?.data?.msg, type: "danger" })
        })
    }


    return (
        <>
            <Alert alert={alert} />
            <section>
                <Container>
                    <div className="container text-dark">
                    <div className="card mt-4 form-container" yle={{ width: 30+"rem" }}>
                        <div className="card-title text-center bg-light">
                        <h2 className="text p-3 text-info">Verify</h2>
                        </div>
                        <Form className="px-5 pb-5" onSubmit={ submitHandler }>   
                            <Form.Group>
                                <Form.Label>Token</Form.Label>
                                <Form.Control 
                                type="text"
                                name="verificationToken"
                                placeholder="verification token"
                                value={formData.verificationToken}
                                onChange={ changeHandler }
                                />
                            </Form.Group>
                            
                            <Button variant="primary" type="submit" className="mt-2">Verify</Button>
                        </Form>
                    </div>
                    </div>
                </Container>
            </section>
        </>
    )
}

export default Verify
