import React, { useState, useContext } from "react";
import { Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { urlContext } from '../Context/urlContext';


const Login = ({ setAuthent }) => {
    const { url } = useContext(urlContext);
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loginstatus, setloginstatus] = useState(false)


    const onSubmitForm = async (e) => {
        const loadToast = toast.loading('Please Wait...')
      //      e.preventDefault();
        setloginstatus(true)


        try {
            const body = { email, password }

            const response = await fetch(url + `/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })

            const parseRes = await response.json()
            console.log(parseRes.access);
            if (parseRes.access) {
                localStorage.setItem("token", parseRes.access)
                setAuthent(true)
                setloginstatus(false)



            } else {
                if (email == "") {
                    toast.error("Input Email")
                    setloginstatus(false)



                } else if (password == "") {
                    toast.error("Input Password")
                } else {
                    setAuthent(false)
                    toast.error(parseRes)
                    setloginstatus(false)



                }

            }

            toast.dismiss(loadToast)

        } catch (error) {
            console.error(error.message)
            setloginstatus(false)
            toast.dismiss(loadToast)

        }

    }

    return (
        <div>
            <Container>
                <Row className="vh-100 d-flex justify-content-center align-items-center">
                    <Col md={8} lg={6} xs={12}>
                        <div className="border border-3 border-primary"></div>
                        <Card className="shadow">
                            <Card.Body>
                                <div className="mb-3 mt-md-4">
                                    <h2 className="fw-bold mb-2 text-uppercase ">Daily Time Record</h2>
                                    <p className=" mb-5">Login</p>
                                    <div className="mb-3">
                                        <Form>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Email address
                                                </Form.Label>
                                                <Form.Control value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                                            </Form.Group>

                                            <Form.Group
                                                className="mb-3"
                                                controlId="formBasicPassword"
                                            >
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
                                            </Form.Group>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="formBasicCheckbox"
                                            >

                                            </Form.Group>
                                            <div className="d-grid">
                                                <Button disabled={loginstatus} onClick={onSubmitForm} variant="primary" type="submit">
                                                    Login
                                                </Button>
                                            </div>
                                        </Form>
                                        <div className="mt-3">
                                            <p className="mb-0  text-center">
                                                Don't have an account?{" "}

                                                <a href="/register" className="text-primary fw-bold">
                                                    Sign Up
                                                </a>


                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login