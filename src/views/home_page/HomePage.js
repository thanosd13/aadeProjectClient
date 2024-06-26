import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaBuilding, FaUsers, FaPenAlt, FaShopify, FaFile, FaPlus, FaEye} from 'react-icons/fa';
import UserService from '../../services/UserService';
import CustomerModal from '../../components/Modals/CustomerModal';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {

    const[userData, setUserData] = useState([]);
    const[showModal, setShowModal] = useState(false);
    const[isEditing, setIsEditing] = useState(false);

    const id = useSelector(state => state.auth.user.user.id);
    const navigate = useNavigate();

    const handleOpenModal = (isEditing) => {
        setShowModal(true);
        setIsEditing(isEditing);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
      

    const findUserData = () => {

        UserService.findUserData(id)
        .then(response => {
            if(response.status === 200) {
                setUserData(response.data);
            }
        }).catch(error => {
            if(error.response.status === 404) {
                setUserData([]); 
            }
        });
    }

    useEffect(() => {
        findUserData();
    }, []);

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
                                        ΑΦΜ: {userData.length>0 ? userData[0].afm : '-'}
                                    </span>
                                </div>
                                <div className="col-3 text-end">
                                    {userData.length>0 ?
                                        <button onClick={()=>handleOpenModal(true)} style={{color: '#ffffff', borderRadius: '10px', padding:'0.6rem !important'}} className="btn btn-warning">
                                            <FaPenAlt />
                                        </button>
                                        :
                                        <button onClick={()=>handleOpenModal(false)} style={{color: '#ffffff', borderRadius: '10px', padding:'0.6rem !important'}} className="btn btn_success">
                                            <FaPlus />
                                        </button>
                                    }
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
                                    <button onClick={()=> navigate("/app/epafes")} style={{color: '#ffffff', borderRadius: '10px'}} className="btn btn-info">
                                        <FaEye />
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
                                    <button onClick={()=> navigate("/app/eidh")} style={{color: '#ffffff', borderRadius: '10px', padding:'0.6rem !important'}} className="btn btn-info">
                                        <FaEye />
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
                                        <FaEye />
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
            <CustomerModal
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                isEditing={isEditing}
                isUser={true}
                userData={userData[0]}
                companyChange={findUserData}
            />
        </React.Fragment>
    )

}

export default HomePage;