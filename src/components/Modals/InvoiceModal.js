import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Modal, InputGroup } from 'react-bootstrap';
import CountryDropDown from '../Generic/CountryDropDown';
import CustomerService from "../../services/CustomerService";
import './Modal.css';
import { useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import ResultModal from './ResultModal';
import UserService from '../../services/UserService';

const InvoiceModal = ({ showModal, handleCloseModal, isEditing }) => {

      const [error, setError] = useState("");
      const [id, setId] = useState(null);
      const [loading, setLoading] = useState(false);
      const [resultOpen, setResultOpen] = useState(false);
      const [status, setStatus] = useState(null);
      const [modalTitle, setModalTitle] = useState("");
      const [title, setTitle] = useState("");
      const [body, setBody] = useState("");
      const userId = useSelector(state => state.auth.user.user.id);

      const initialFormData = {
          afm: "",
          name: "",
          country: "",
          city: "",
          address: "",
          street_number: "",
          postal_code: "",
          doy: "",
          work: "",
          email: "",
          tel_number: ""
      }

      const [formData, setFormData] = useState({
          afm: "",
          name: "",
          country: "",
          city: "",
          address: "",
          street_number: "",
          postal_code: "",
          doy: "",
          work: "",
          email: "",
          tel_number: ""
      });

    //   useEffect(() => {
    //       if (showModal && isEditing && !isUser) {
    //           setId(customerData.id);
    //           setFormData(customerData);
    //           setModalTitle("Επεξεργασία πελάτη");
    //       } else if (showModal && !isEditing && !isUser) {
    //           setId(userId);
    //           setFormData(initialFormData);
    //           setModalTitle("Προσθήκη πελάτη");
    //       } else if (showModal && !isEditing && isUser) {
    //           setId(userId);
    //           setFormData(initialFormData);
    //           setModalTitle("Προσθήκη εταιρείας")
    //       } else if (showModal && isEditing && isUser) {
    //           setId(userData.id);
    //           setFormData(userData);
    //           setModalTitle("Επεξεργασία εταιρείας");
    //       }
    //       setError("");
    //   }, [showModal, isEditing, customerData]);

      const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
      };

      const handleClose = () => {
        setResultOpen(false);
      };

      const searchWithAfm = () => {
        setError("");
        if(!formData.afm) {
          setError("Συμπληρώστε το ΑΦΜ που επιθυμείτε!");
          return;
        }
        setLoading(true);
        CustomerService.getByAfm(formData.afm)
        .then(response => {
            if(response.status === 200) {
              setFormData({
                ...formData,
                afm: response.data.afm[0],
                name: response.data.onomasia[0],
                country: "GR",
                city: response.data.postal_area_description[0],
                address: response.data.postal_address[0],
                street_number: response.data.postal_address_no[0],
                postal_code: response.data.postal_zip_code[0],
                doy: response.data.doy_descr[0],
                work: response.data.firm_act.firm_act_descr
              })

              setError("");
            }
            setLoading(false);
        }).catch(error => {
            setLoading(false);
            if(error.response.status === 404) {
              setError("Δεν βρέθηκαν αποτελέσματα με το συγκεκριμένο ΑΦΜ!")
            } else {
              setError("Κάποιο σφάλμα προέκυψε!");
            }
        });
      }

    //   const handleSubmit = () => {
    //       setLoading(true);

    //       let serviceFunction;

    //       if(isEditing && !isUser) {
    //         serviceFunction = CustomerService.updateCustomer;
    //       } else if(!isEditing && !isUser) {
    //         serviceFunction = CustomerService.addCustomer;
    //       } else if(!isEditing && isUser) {
    //         serviceFunction = UserService.createUserData;
    //       } else if(isEditing && isUser) {
    //         serviceFunction = UserService.updateUserData;
    //       }
           
    //       serviceFunction(formData, id)
    //       .then(response => {
    //           setLoading(false);
    //           setStatus(response.status);
    //           setResultOpen(true);
    //           setTitle(isEditing ? "Επιτυχής ενημέρωση" : "Επιτυχής ενέργεια");

    //           if (!isEditing && !isUser) {
    //             setBody("Ο πελάτης προστέθηκε επιτυχώς!");
    //           } else if (isEditing && !isUser) {
    //             setBody("Ο πελάτης ενημερώθηκε επιτυχώς!");
    //           } else if (!isEditing && isUser) {
    //             setBody("Η εταιρεία προστέθηκε επιτυχώς!");
    //           } else if (isEditing && isUser) {
    //             setBody("Η εταιρεία ενημερώθηκε επιτυχώς!");
    //           }

    //           if(!isUser) {
    //             onCustomerAdded();
    //           }             
              
    //           if(isUser) {
    //             companyChange();
    //           }
              
    //           handleCloseModal();
    //       })
    //       .catch(error => {
    //           setLoading(false);
    //           setResultOpen(true);
    //           setTitle("Σφάλμα");
    //           setStatus(error.response.status);
    //           setBody(`${error.response.data.error}`);
    //           handleCloseModal();
    //       });
    //   } 
    


    return (<React.Fragment>
      <Modal
        size="xl"
        show={showModal}
        onHide={handleCloseModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Έκδοση παραστατικού
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
                <Row gy={3}>
                    {error &&
                      <span className='result'>
                        {error}
                      </span>
                    }
                    <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
                        <Form.Label>ΑΦΜ</Form.Label>
                        <InputGroup>
                            <Form.Control className='form-group-style' type="text" placeholder="ΑΦΜ" name="afm" value={formData.afm} onChange={handleInputChange} />
                            <Button type="button" style={{borderColor:'#dee2e6', padding:'0.4rem', display:'flex', alignItems:'center', justifyContent:'center'}} variant="outline-secondary" onClick={searchWithAfm} className="cursor-pointer">
                                {!loading &&
                                  <i style={{paddingLeft:'0.6rem'}} className="feather icon-search"></i>
                                }
                                {loading &&
                                  <Spinner
                                    style={{marginLeft:'0.5rem', marginRight:'0.6rem !important'}}
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                }
                            </Button>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
                        <Form.Label>Όνομα</Form.Label>
                        <Form.Control className='form-group-style' type="text" placeholder="Όνομα" name="name" value={formData.name} onChange={handleInputChange} />
                    </Form.Group>
                    <CountryDropDown className="mb-3" formData={formData} setFormData={setFormData} />
                    <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
                      <Form.Label>Πόλη</Form.Label>
                      <Form.Control className='form-group-style' type="text" placeholder="Πόλη" name="city" value={formData.city} onChange={handleInputChange} />
                    </Form.Group>
                </Row>
                  <Row gy={3}>
                    <Form.Group className="mb-2" as={Col} controlId="formGridEmail">
                      <Form.Label>Διεύθυνση</Form.Label>
                      <Form.Control className='form-group-style' type="text" placeholder="Διεύθυνση" name="address" value={formData.address} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-2" as={Col} controlId="formGridEmail">
                      <Form.Label>Αριθμός</Form.Label>
                      <Form.Control className='form-group-style' type="number" placeholder="Αριθμός" name="street_number" value={formData.street_number} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-2" as={Col} controlId="formGridPassword">
                      <Form.Label>Ταχυδρομικός κώδικας</Form.Label>
                      <Form.Control className='form-group-style' type="number" placeholder="ΤΚ" name="postal_code" value={formData.postal_code} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
                        <Form.Label>ΔΟΥ</Form.Label>
                        <Form.Control className='form-group-style' type="text" placeholder="ΔΟΥ" name="doy" value={formData.doy} onChange={handleInputChange} />
                    </Form.Group>
                  </Row>
                  <Row style={{paddingBottom:'2rem'}} gy={3}>
                    <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
                        <Form.Label>Αντικείμενο απασχόλησης</Form.Label>
                        <Form.Control className='form-group-style' type="text" placeholder="Αντικείμενο" name="work" value={formData.work} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control className='form-group-style' type="email" placeholder="E-mail" name="email" value={formData.email} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
                        <Form.Label>Τηλέφωνο επικοινωνίας</Form.Label>
                        <Form.Control className='form-group-style' type="number" placeholder="Τηλέφωνο" name="tel_number" value={formData.tel_number} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
                        <Form.Label>Η/νία έκδοσης</Form.Label>
                        <Form.Control className='form-group-style' type="date" placeholder="Η/νία έκδοσης" name="date" value={formData.date} onChange={handleInputChange} />
                    </Form.Group>
                  </Row>
                  <Button className='btn_success'>
                      <i className="feather icon-save" />
                        Έκδοση
                      {loading &&
                        <Spinner
                          style={{marginLeft:'0.5rem'}}
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      }
                  </Button>
                  <Button className='btn_danger' variant="danger" onClick={handleCloseModal}>
                      <i className="feather icon-slash mx-1" />
                      Ακύρωση
                  </Button>
            </Form>
        </Modal.Body>
      </Modal>
      <ResultModal show={resultOpen} status={status} title={title} body={body} onHide={handleClose} />
    </React.Fragment>
    );
}

export default InvoiceModal;
