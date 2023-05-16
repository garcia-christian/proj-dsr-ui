import React, { useEffect, useState, useContext } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { urlContext } from '../Context/urlContext';
const Login = ({ setAuthent }) => {
    const { url } = useContext(urlContext);
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()


    const onSubmitForm = async (e) => {
        e.preventDefault();
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

            } else {
                if (email == "") {


                } else if (password == "") {

                } else {
                    setAuthent(false)
                    if (parseRes == 'Invalid Password') {

                    }
                }

            }



        } catch (error) {
            console.error(error.message)

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
                                                <Button onClick={onSubmitForm} variant="primary" type="submit">
                                                    Login
                                                </Button>
                                            </div>
                                        </Form>
                                        <div className="mt-3">
                                            <p className="mb-0  text-center">
                                                Don't have an account?{" "}
                                                <a href="{''}" className="text-primary fw-bold">
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