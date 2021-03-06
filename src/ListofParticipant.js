import React, { Component, Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Container, Col, Card, Row, Badge } from 'react-bootstrap'
import firebase from './firebase'
import Nevbar from './Nevbar.js'
import Loading from './Loading.js'

class ListofParticipant extends Component {

    constructor(props) {
        super()
        this.state = {
            events: [],
            event_id: props.match.params.id,
            currentUser: null,
            auth: false,
            participant: []
        }
    }

    componentDidMount() {
        let self = this
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    currentUser: user
                })
            }
            this.setState({
                auth: true
            })
            firebase.database().ref("organizers").orderByChild("email").equalTo(user.email)
                .on("child_added", function (snapshot) {
                    const itemsRef = firebase.database().ref(`organizers/${snapshot.key}/events/${self.state.event_id}/participants`)
                    itemsRef.on("value", (snapshot) => {
                        let items = snapshot.val()
                        let temp = []
                        for (const property in items) {
                            temp.push({
                                id: property,
                                email: items[property].email,
                                imageChecked: items[property].organize_picture_confirm,
                                isCheckMail: items[property].panticipant_picture_confirm
                            })
                        }
                        self.setState({
                            participant: temp
                        })
                    })
                })
        })
    }


    render() {
        const { currentUser, auth, participant, event_id } = this.state
        if (auth) {
            if (currentUser) {
                return (
                    <Fragment>
                        <Nevbar />
                        <Container fluid >
                            <Row>
                                <Col
                                    xs={12}
                                    sm={{ span: 10 }}
                                    md={{ span: 8, offset: 2 }}
                                    lg={{ span: 6, offset: 3 }}
                                    className="mb-4 text-center"
                                >
                                    <h1>รายการผู้เข้าร่วมกิจกรรม</h1>
                                </Col>
                                {
                                    participant.map((i) => {
                                        return (
                                            <Col
                                                xs={12}
                                                sm={{ span: 10 }}
                                                md={{ span: 8, offset: 2 }}
                                                lg={{ span: 6, offset: 3 }}
                                                className="mb-3"
                                            >
                                                <Card style={{ borderRadius: 12}}>
                                                    <Card.Body>
                                                        <Card.Title>
                                                            {i.email}
                                                            {i.isCheckMail ?
                                                                <div
                                                                className="ml-3 " 
                                                                style={{width:12,height:12,backgroundColor:'#28c128',borderRadius:"100%",display:"inline-block"}}
                                                                >
                                                                </div>
                                                                :
                                                                null
                                                            }
                                                        </Card.Title>
                                                        <div className="text-right">
                                                            {i.imageChecked ?
                                                                <Link to={`/ViewPicture/${event_id}/${i.id}`} className="btn-link" >
                                                                    <Button className="btn-custom mr-0" id="primary">ดูภาพถ่าย</Button>
                                                                </Link>
                                                                :
                                                                <Link to={`./${event_id}/ChoosePicture/${i.id}`} className="btn-link" >
                                                                    <Button className="btn-custom mr-0" id="primary" style={{ width: 200 }}>ตรวจสอบภาพถ่าย</Button>
                                                                </Link>
                                                            }
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Container >
                    </Fragment>
                )
            }
            if (!currentUser) {
                return (
                    <Redirect to="/Login" />
                )
            }
        } else {
            return (
                <Loading />
            )
        }
    }
}

export default ListofParticipant
