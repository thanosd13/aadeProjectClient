import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Form, Button, Modal, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import CountryDropdown from '../Generic/CountryDropdown';
import CustomerService from "../../services/CustomerService";
import './Modal.css';
import { useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';

const CustomerModal = ({ showModal, handleCloseModal }) => {

      const [error, setError] = useState("");
      const id = useSelector(state => state.auth.user.user.id);
      const [loading, setLoading] = useState(false);
      
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

      useEffect(()=>{
        if (showModal) {
          setFormData(initialFormData);
        }
      },[showModal])

      const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
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

      const addCustomer = () => {
          setLoading(true);
          CustomerService.addCustomer(formData,id)
          .then(response => {
              setLoading(false);
              console.log(response);
          }).catch(error => {
              setLoading(false);
              console.log(error);
          });
          handleCloseModal();
      }
    


    return (<React.Fragment>
      <Modal
        size="lg"
        show={showModal}
        onHide={handleCloseModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Προσθήκη Πελάτη
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
                            <Form.Control className='form-group-style' type="text" placeholder="ΑΦΜ πελάτη" name="afm" value={formData.afm} onChange={handleInputChange} />
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
                </Row>
                  <Row gy={3}>
                    <CountryDropdown className="mb-3" formData={formData} setFormData={setFormData} />
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
                  </Row>
                  <Row gy={3}>
                      <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
                          <Form.Label>ΔΟΥ</Form.Label>
                          <Form.Control className='form-group-style' type="text" placeholder="ΔΟΥ" name="doy" value={formData.doy} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
                          <Form.Label>Αντικείμενο απασχόλησης</Form.Label>
                          <Form.Control className='form-group-style' type="text" placeholder="Αντικείμενο" name="work" value={formData.work} onChange={handleInputChange} />
                      </Form.Group>
                  </Row>
                  <Row style={{paddingBottom:'2rem'}} gy={3}>
                      <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
                          <Form.Label>E-mail</Form.Label>
                          <Form.Control className='form-group-style' type="email" placeholder="E-mail" name="email" value={formData.email} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
                          <Form.Label>Τηλέφωνο επικοινωνίας</Form.Label>
                          <Form.Control className='form-group-style' type="number" placeholder="Τηλέφωνο" name="tel_number" value={formData.tel_number} onChange={handleInputChange} />
                      </Form.Group>
                  </Row>
                  <Button onClick={addCustomer} variant="success">
                      <i className="feather icon-save" />
                      Αποθήκευση
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
                  <Button variant="danger" onClick={handleCloseModal}>
                      <i className="feather icon-slash mx-1" />
                      Ακύρωση
                  </Button>
            </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
    );
}

export default CustomerModal;
