import React, { useContext, useEffect, useState, useRef, isValidElement } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles/dashboard.css'
import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select'
import Table from 'react-bootstrap/Table';
import { userContext } from '../Context/userContext';
import { urlContext } from '../Context/urlContext';
import CustomProgressbar from "./CustomProgressbar";
import 'react-circular-progressbar/dist/styles.css';
import Spinner from 'react-bootstrap/Spinner';
import Form from "react-bootstrap/Form";
const Dashboard = () => {
    const [mounted, setmounted] = useState(false)
    const { user } = useContext(userContext);
    const { url } = useContext(urlContext);
    const [studentData, setStudentData] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [inOutData, setInOutData] = useState();
    const [timer, setTimer] = useState(0);
    const [percentage, setpercentage] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [isTimeLoading, setisTimeLoading] = useState(false)
    const [databaseTime, setdatabaseTime] = useState(0)
    const [totalHrs, settotalHrs] = useState(0.0)
    const [noOfAbsent, setnoOfAbsent] = useState(0)
    const [underTimeHrs, setunderTimeHrs] = useState(0)
    const countRef = useRef(null)
    const [startDate, setstartDate] = useState(0)
    const [endDate, setendDate] = useState(0)
    const [currentDateTime, setcurrentDateTime] = useState(0)
    const handleStart = () => {
        setIsActive(true)
        setIsPaused(true)
        countRef.current = setInterval(() => {
            setTimer((timer) => timer + 1)
        }, 1000)
    }
    const handlePause = () => {
        clearInterval(countRef.current)
        setIsPaused(false)
        setIsActive(false)
    }
    function formatJsDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };

        return date.toLocaleString('en-US', options);
    }
    const formatTime = (timer) => {
        const getSeconds = `0${(timer % 60)}`.slice(-2)
        const minutes = `${Math.floor(timer / 60)}`
        const getMinutes = `0${minutes % 60}`.slice(-2)
        const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

        return `${getHours} : ${getMinutes} : ${getSeconds}`
    }
    const extractTime = (data) => {
        if (!data) {
            return 0
        }
        const date = new Date(Number(data) * 1);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`
    }
    function epochToDate(epoch) {
        const date = new Date(epoch);

        const month = date.getMonth() + 1; // Month is zero-indexed, so add 1
        const day = date.getDate();
        const year = date.getFullYear() % 100; // Use the last two digits of the year

        // Pad single-digit month and day values with a leading zero
        const paddedMonth = month < 10 ? '0' + month : month;
        const paddedDay = day < 10 ? '0' + day : day;

        // Return the date string in the mm/dd/yy format
        return `${paddedMonth}/${paddedDay}/${year}`;
    }
    const runTimer = () => {

    }

    function isEpochToday(epoch) {
        // Convert epoch time to a Date object
        const date = new Date(epoch);

        // Get today's date
        const today = new Date();

        // Compare year, month, and day of month
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    }

    const remarksMaker = (value) => {
        if (isActive && isEpochToday(Number(value.date))) {
            return 'Time Still Running'
        }
        if (value.remarks === 1) {
            return 'Present'
        }
        if (value.remarks === null && isEpochToday(Number(value.date))) {
            return 'Not yet Timed in'
        }
        if (value.remarks === null && !isEpochToday(Number(value.date))) {
            return 'Absent'
        }
        if (value.remarks === 0) {
            return 'Undertime'
        }
    }
    const loadData = async () => {
        try {
            const respo = await fetch(url + "/student/get-info/" + user)
            const jData = await respo.json();
            setStudentData(jData)
            loadBottomData()
            const respo2 = await fetch(url + "/time/get-day-time/" + user)
            const jData2 = await respo2.json();
            setInOutData(jData2)
            const respo3 = await fetch(url + "/time/get-current-duration/" + user)
            const jData3 = await respo3.json();
            setdatabaseTime(jData3)
            const respo5 = await fetch(url + "/student/get-no-absent/" + user)
            const jData5 = await respo5.json();
            setnoOfAbsent(jData5)
            const respo6 = await fetch(url + "/student/get-undertime/" + user)
            const jData6 = await respo6.json();
            setunderTimeHrs(jData6)
            setmounted(true);
        } catch (err) {
            console.error(err.message);
        }
    }
    const loadBottomData = async () => {
        const respo1 = await fetch(url + "/student/get-report/" + user + "/" + startDate + "/" + endDate)
        const jData1 = await respo1.json();
        setReportData(jData1)
        const respo2 = await fetch(url + "/student/get-total-no-hours/" + user + "/" + startDate + "/" + endDate)
        const jData2 = await respo2.json();
        settotalHrs(jData2)
        console.log(jData2);
    }

    const timeIn = async () => {
        setisTimeLoading(true)
        const respo = await fetch(url + "/time-in/" + user, {
            method: "PUT",
        }).then(
            () => {
                // handleStart();
                loadData();
                setisTimeLoading(false)
            }
        );



    }
    const timeOut = async () => {
        setisTimeLoading(true)
        const respo = await fetch(url + "/time-out/" + user, {
            method: "PUT",
        }).then(
            () => {
                handlePause()
                loadData()
                setisTimeLoading(false)
            }
        );;


    }
    function formatDate(dateStr) {
        const date = new Date(dateStr); // create a Date object from the string

        const month = ("0" + (date.getMonth() + 1)).slice(-2); // extract month and pad with leading zero if necessary
        const day = ("0" + date.getDate()).slice(-2); // extract day and pad with leading zero if necessary
        const year = date.getFullYear().toString().slice(-2); // extract last two digits of the year

        return `${month}/${day}/${year}`;
    }
    useEffect(() => {
        if (user) {
            loadData()
        }
    }, [user, url])
    useEffect(() => {
        if (databaseTime) {
            setTimer(databaseTime)
            handleStart()
        }
    }, [databaseTime])
    useEffect(() => {
        if (timer) {
            setpercentage((timer / 28800) * 100)
        }
    }, [timer])
    useEffect(() => {
        console.log(startDate);
    }, [startDate])

    useEffect(() => {
        loadBottomData()
    }, [startDate, endDate])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setcurrentDateTime(formatJsDate(new Date()));
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    return (
        <div>
            {mounted ? (<> <Container style={{ display: 'flex', width: '100%' }}>
                <Row>
                    <Col>
                        <Card style={{ width: '40rem', height: '10rem', marginTop: '20px' }}>
                            <Card.Body>
                                <Container>
                                    <Row>
                                        <Col xs={8}>
                                            <Card.Title style={{ fontSize: '50px' }}>{studentData ? (studentData.required_hrs - studentData.remaining_hrs).toFixed(2) : 0}hrs </Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Total Hours Rendered</Card.Subtitle>
                                            <Card.Title style={{ fontSize: '20px', marginTop: '15px' }}>{studentData ? studentData.establishment : '--------'}</Card.Title>
                                        </Col>
                                        <Col>
                                            <Row>
                                                Status:
                                            </Row>
                                            <Row>
                                                {isActive ? <Button variant="outline-success" style={{ marginTop: '20px', height: '50px' }}>Clocked IN</Button> :
                                                    <Button variant="outline-danger" style={{ marginTop: '20px', height: '50px' }}>Clocked OUT</Button>}
                                            </Row>
                                        </Col>

                                    </Row>
                                </Container>

                            </Card.Body>
                        </Card>
                        <Card style={{ width: '40rem', height: '9rem', marginTop: '30px' }}>
                            <Card.Body>
                                <Container>
                                    <Row>
                                        <Col xs={10}>

                                            <Card.Subtitle className="mb-2 text-muted">Name</Card.Subtitle>
                                            <Card.Title style={{ fontSize: '45px' }}>{studentData ? studentData.fname + ', ' + studentData.lname : '------------'}</Card.Title>
                                            <Card.Title style={{ fontSize: '20px' }}>{studentData ? studentData.position : '------------'}</Card.Title>
                                        </Col>


                                    </Row>
                                </Container>

                            </Card.Body>
                        </Card>
                        <Card style={{ width: '40rem', height: '7rem', marginTop: '30px' }}>
                            <Card.Body>
                                <Container>
                                    <Row>
                                        <Col xs={10}>

                                            <Card.Subtitle className="mb-2 text-muted">Team Department</Card.Subtitle>
                                            <Card.Title style={{ fontSize: '35px' }}>{studentData ? studentData.team_dept : '------------'}</Card.Title>

                                        </Col>


                                    </Row>
                                </Container>

                            </Card.Body>
                        </Card>
                        <Row>
                            <Col>
                                <Card style={{ width: '19rem', marginTop: '35px' }}>
                                    <Card.Body>
                                        <Container>
                                            <Row>
                                                <Col xs={10}>

                                                    <Card.Subtitle className="mb-2 text-muted">No of Days Absent</Card.Subtitle>
                                                    <Card.Title style={{ fontSize: '45px' }}>{noOfAbsent || 0}</Card.Title>

                                                </Col>


                                            </Row>
                                        </Container>

                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card style={{ width: '19rem', marginTop: '35px' }}>
                                    <Card.Body>
                                        <Container>
                                            <Row>
                                                <Col xs={10}>

                                                    <Card.Subtitle className="mb-2 text-muted">No of Hours Undertime</Card.Subtitle>
                                                    <Card.Title style={{ fontSize: '45px' }}>{underTimeHrs ? underTimeHrs : 0}</Card.Title>
                                                </Col>


                                            </Row>
                                        </Container>

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                </Row>
                <Row>
                    <Col style={{ marginTop: '20px', marginLeft: '50px' }}>
                        <div>
                            <div >
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Card style={{ width: '19rem', height: '3rem', }}>
                                        <Card.Body>
                                            <Col xs={10}>
                                                <Card.Subtitle className="mb-1 text-muted">{currentDateTime}</Card.Subtitle>
                                            </Col>
                                        </Card.Body>
                                    </Card>
                                </div>

                                <div className='circular-prog'>
                                    <CustomProgressbar value={percentage} color={percentage < 100 ? `rgba(0, 45, 214,0.6)` : `rgba(255, 101, 5, 0.7)`}>
                                        <div style={{ fontSize: '40px' }}>{formatTime(timer)}
                                            <h6 style={{ marginLeft: '50px', }}>{percentage > 100 ? 'Overtime!' : ''}</h6>
                                        </div>
                                    </CustomProgressbar>
                                </div>

                                <Card style={{ width: '40rem', height: '6rem', marginTop: '20px' }}>
                                    <Card.Body>
                                        <Col xs={12}>
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        <Card.Subtitle className="mb-1 text-muted">Time In:</Card.Subtitle>
                                                        <Card.Title style={{ fontSize: '30px' }}>{inOutData != null ? extractTime(inOutData.time_in) : 0}</Card.Title>
                                                    </Col>
                                                    <Col>
                                                        <Card.Subtitle className="mb-1 text-muted">Time Out:</Card.Subtitle>
                                                        <Card.Title style={{ fontSize: '30px' }}>{inOutData != null ? extractTime(inOutData.time_out) : 0}</Card.Title>
                                                    </Col>
                                                    <Col>

                                                        {isActive ? <Button disabled={isTimeLoading} variant="danger" onClick={timeOut} style={{ width: '170px', height: '50px' }} >{isTimeLoading ? <Spinner animation="border" /> : 'Time Out'}</Button> :
                                                            <Button disabled={isTimeLoading} variant="primary" onClick={timeIn} style={{ width: '170px', height: '50px' }}>{isTimeLoading ? <Spinner animation="border" /> : 'Time IN'}</Button>}
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Col>
                                    </Card.Body>
                                </Card>
                            </div>

                        </div>
                    </Col>

                </Row>
            </Container >
                <Card className='bottom-table-card'>
                    <Card.Body>
                        <Col xs={12}>

                            <Container>
                                <Row>
                                    <Col>
                                        <h1>
                                            Time and Attendance Monitoring
                                        </h1>
                                    </Col>
                                    <Col>
                                        <Card style={{ width: '40rem', marginTop: '5px' }}>
                                            <Card.Body>
                                                <Col xs={12}>
                                                    <Container>
                                                        <Row>
                                                            <Col>
                                                                <Card.Subtitle className="mb-1 text-muted">Payroll Coverage</Card.Subtitle>
                                                            </Col>
                                                            <Col>
                                                                <Form.Control value={startDate} onChange={(e) => setstartDate(e.target.value)} type="date"></Form.Control>
                                                            </Col>
                                                            <Col>
                                                                <Form.Control value={endDate} onChange={(e) => setendDate(e.target.value)} type="date"></Form.Control>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </Col>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                </Row>
                            </Container>
                            <Table className='details-table' striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time IN</th>
                                        <th>Time Out</th>
                                        <th>No. Hours</th>
                                        <th>Required Hours </th>
                                        <th>Overtime Hours</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.length !== 0 && reportData.map((value, index) => (
                                        <tr key={index}>
                                            <td>{epochToDate(Number(value.date))}</td>
                                            <td>{value.time_in ? extractTime(value.time_in) : '--:--:--'}</td>
                                            <td>{value.time_out ? extractTime(value.time_out) : '--:--:--'}</td>
                                            <td>{value.no_of_hrs || '-'}</td>
                                            <td>{value.required_no_hrs || '-'}</td>
                                            <td>{Number(value.overtime).toFixed(2) || '-'}</td>
                                            <td>{remarksMaker(value)}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </Table>

                        </Col>
                    </Card.Body>
                </Card>
                <Container>
                    <Row>
                        <Col>
                            <Card style={{ marginTop: '5px' }}>
                                <Card.Body>
                                    <Col xs={9}>
                                        <Card.Subtitle className="mb-1 text-muted">Total No of Hours {startDate && endDate ? formatDate(startDate) + ' - ' + formatDate(endDate) : ''}</Card.Subtitle>
                                        <Card.Title style={{ fontSize: '30px' }}>{totalHrs ? totalHrs.sum : 0}hrs</Card.Title>
                                    </Col>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card style={{ marginTop: '5px' }}>
                                <Card.Body>
                                    <Col xs={9}>
                                        <Card.Subtitle className="mb-1 text-muted">Hours Deducted</Card.Subtitle>
                                        <Card.Title style={{ fontSize: '30px' }}>0</Card.Title>
                                    </Col>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>

                            <Card style={{ marginTop: '5px' }}>
                                <Card.Body>
                                    <Col xs={9}>
                                        <Card.Subtitle className="mb-1 text-muted">Final No of Hours {startDate && endDate ? formatDate(startDate) + ' - ' + formatDate(endDate) : ''}</Card.Subtitle>
                                        <Card.Title style={{ fontSize: '30px' }}>{totalHrs ? totalHrs.sum : 0}hrs</Card.Title>
                                    </Col>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container></>) : (<><Container style={{ display: 'flex', width: '100%', height: '100vh' }}>
                    <div>Loading...</div>
                </Container> </>)}
        </div >
    )
}

export default Dashboard