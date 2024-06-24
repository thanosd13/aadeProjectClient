import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBuilding, FaUsers, FaPenAlt, FaInfoCircle, FaShopify, FaFile} from 'react-icons/fa';


const dashSalesData = [
    { title: 'Daily Sales', amount: '$249.95', icon: 'icon-arrow-up text-c-green', value: 50, class: 'progress-c-theme' },
    { title: 'Monthly Sales', amount: '$2.942.32', icon: 'icon-arrow-down text-c-red', value: 36, class: 'progress-c-theme2' },
    { title: 'Yearly Sales', amount: '$8.638.32', icon: 'icon-arrow-up text-c-green', value: 70, color: 'progress-c-theme' }
  ];

const HomePage = () => {

    return(
        <React.Fragment>
            <Row style={{paddingTop:'8rem'}}>
                <Col xl={6} xxl={3}>
                    <Card style={{padding:'0.4rem'}}>
                        <Card.Body>
                            <h4 style={{color:'#0d6f8d'}} className="mb-4">
                                <span>
                                    <FaBuilding className="me-2" />
                                </span>
                                Η εταιρεία μου
                            </h4>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <span style={{fontWeight:'bold', fontSize:'medium'}}>
                                        ΑΦΜ: 095566320
                                    </span>
                                </div>
                                <div className="col-3 text-end">
                                    <button style={{color: '#ffffff', borderRadius: '10px', padding:'0.6rem !important'}} className="btn btn-warning">
                                        <FaPenAlt />
                                    </button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6} xxl={3}>
                    <Card style={{padding:'0.4rem'}}>
                        <Card.Body>
                            <h4 style={{color:'#0d6f8d'}} className="mb-4">
                                <span>
                                    <FaUsers className="me-2" />
                                </span>
                                Οι πελάτες μου
                            </h4>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <span style={{fontWeight:'bold', fontSize:'medium'}}>
                                        Σύνολο: 40
                                    </span>
                                </div>
                                <div className="col-3 text-end">
                                    <button style={{color: '#ffffff', borderRadius: '10px'}} className="btn btn-info">
                                        <FaInfoCircle />
                                    </button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6} xxl={3}>
                    <Card style={{padding:'0.4rem'}}>
                        <Card.Body>
                            <h4 style={{color:'#0d6f8d'}} className="mb-4">
                                <span>
                                    <FaShopify className="me-2" />
                                </span>
                                Τα προϊόντα μου
                            </h4>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <span style={{fontWeight:'bold', fontSize:'medium'}}>
                                        Σύνολο: 10
                                    </span>
                                </div>
                                <div className="col-3 text-end">
                                    <button style={{color: '#ffffff', borderRadius: '10px', padding:'0.6rem !important'}} className="btn btn-info">
                                        <FaInfoCircle />
                                    </button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6} xxl={3}>
                    <Card style={{padding:'0.4rem'}}>
                        <Card.Body>
                            <h4 style={{color:'#0d6f8d'}} className="mb-4">
                                <span>
                                    <FaFile className="me-2" />
                                </span>
                                Τα παραστατικά μου
                            </h4>
                            <div className="row d-flex align-items-center">
                                <div className="col-9">
                                    <span style={{fontWeight:'bold', fontSize:'medium'}}>
                                        Σύνολο: 10
                                    </span>
                                </div>
                                <div className="col-3 text-end">
                                    <button style={{color: '#ffffff', borderRadius: '10px', padding:'0.6rem !important'}} className="btn btn-info">
                                        <FaInfoCircle />
                                    </button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xl={12} xxl={12}>
                    <Card style={{padding:'0.4rem'}}>
                        <Card.Body>
                            <p>
                                Το <b>Timologio365</b> συνεργάζεται με την ΑΑΔΕ. Κατά την έκδοση του παραστατικού σας ενημερώνεται αυτόματα το σύστημα της ΑΑΔΕ εφόσον το επιθυμείτε. Γι αυτή την ενέργεια απαιτείται να συμπληρώσετε παρακάτω το <b>Όνομα χρήστη</b> και το <b>Subscription key</b> που έχετε δημιουργήσει ή θα δημιουργήσετε στο σύστημα <b>myDATA</b>.
                            </p>
                            <div style={{paddingTop:'2rem'}} className="row d-flex align-items-center">
                                <div className="col-6">
                                    <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
                                        <Form.Control className='form-group-style' type="text" placeholder="Όνομα χρήστη" name="doy" />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
                                        <Form.Control className='form-group-style' type="text" placeholder="Subscription key" name="doy" />
                                    </Form.Group>
                                </div>
                            </div>
                            <div style={{paddingTop:'0.3rem'}} className="row d-flex align-items-center">
                                <div className="col-12">
                                    <Button style={{fontWeight:'bold'}} variant="success" className='btn_success'>
                                        <i className="feather icon-save" />
                                        Αποθήκευση
                                    </Button>
                                    <Button style={{fontWeight:'bold'}} variant="info">
                                        <i className="feather icon-info" />
                                        Πληροφορίες myDATA
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )

}

export default HomePage;