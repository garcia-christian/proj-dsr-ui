import React, { useState, useContext } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { urlContext } from '../Context/urlContext';
import toast, { Toaster } from 'react-hot-toast';

const Register = ({ setAuthent }) => {
    const { url } = useContext(urlContext);
    const [loginstatus, setloginstatus] = useState(false)
    const [fname, setfname] = useState()
    const [lname, setlname] = useState()
    const [position, setposition] = useState()
    const [team_department, setteam_department] = useState()
    const [required_hrs, setrequired_hrs] = useState()
    const [establishment, setEstablishment] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()





    const onSubmitForm = async (e) => {
        e.preventDefault();
        setloginstatus(true)
        const loadToast = toast.loading('Please Wait...')

        try {
            const body = { email, password }

            const response = await fetch(url + `/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fname, lname, position, team_department, required_hrs, establishment, email, password })
            })

            const parseRes = await response.json()
            console.log(parseRes.access);
            if (parseRes.access) {
                localStorage.setItem("token", parseRes.access)
                setAuthent(true)
                setloginstatus(false)
                            
            } else {
                setAuthent(false)
                toast.error(parseRes)
                setloginstatus(false)
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
                                    <h2 className="fw-bold mb-2 text-uppercase ">Daily Time REcord</h2>
                                    <p className=" mb-5">Registration</p>
                                    <div className="mb-3">
                                        <Form>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    First Name
                                                </Form.Label>
                                                <Form.Control value={fname} onChange={e => setfname(e.target.value)} type="text" placeholder="Juan " />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Last Name
                                                </Form.Label>
                                                <Form.Control value={lname} onChange={e => setlname(e.target.value)} type="text" placeholder="Dela Cruz" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Position
                                                </Form.Label>
                                                <Form.Control value={position} onChange={e => setposition(e.target.value)} type="text" placeholder="Technical Support" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Team/Department
                                                </Form.Label>
                                                <Form.Control value={team_department} onChange={e => setteam_department(e.target.value)} type="text" placeholder="IT Department" />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Required Hours
                                                </Form.Label>
                                                <Form.Control value={required_hrs} onChange={e => setrequired_hrs(e.target.value)} type="number" placeholder="450" />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Company/Establishment
                                                </Form.Label>
                                                <Form.Control value={establishment} onChange={e => setEstablishment(e.target.value)} type="text" placeholder="Google" />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Email address
                                                </Form.Label>
                                                <Form.Control value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter Email" />
                                            </Form.Group>

                                            <Form.Group
                                                className="mb-3"
                                                controlId="formBasicPassword"
                                            >
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter Password  " />
                                            </Form.Group>

                                            <div className="d-grid">
                                                <Button disabled={loginstatus} onClick={onSubmitForm} variant="primary" type="submit">
                                                    Sign Up
                                                </Button>
                                            </div>
                                        </Form>
                                        <div className="mt-3">
                                            <p className="mb-0  text-center">
                                                Allready have an account?{" "}
                                                <a href="/login" className="text-primary fw-bold">
                                                    Sign In
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

export default Register