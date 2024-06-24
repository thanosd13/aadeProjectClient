import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
import ProductService from '../../services/ProductService';
import './Modal.css';
import { useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import ResultModal from './ResultModal';
import PriceDropDownMenu from '../Generic/PriceDropDownMenu';
import FpaDropDownMenu from '../Generic/FpaDropDownMenu';

const ProductModal = ({ showModal, handleCloseModal, onProductAdded, isEditing, productData }) => {

    const [error, setError] = useState("");
    const [id, setId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultOpen, setResultOpen] = useState(false);
    const [status, setStatus] = useState(null);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const userId = useSelector(state => state.auth.user.user.id);
    
    const initialFormData = {
        name: "",
        price: 0.0,
        type: "",
        fpa: "",
        final_price: 0.0

    }

    const [formData, setFormData] = useState({
        name: "",
        price: 0.0,
        type: "",
        fpa: "",
        final_price: 0.0
    });

    useEffect(() => {
        if (showModal && isEditing) {
            setId(productData.id);
            setFormData(productData);
        } else if (showModal) {
            setFormData({ name: "", price: 0.0, fpa: "", final_price: 0.0 });
        }
    }, [showModal, isEditing, productData, userId]);

    useEffect(() => {
        if (document.activeElement.name !== "final_price") {
            const price = parseFloat(formData.price) || 0;
            const fpa = parseFloat(formData.fpa) || 0;
            const finalPrice = price + (price * (fpa / 100));
            setFormData(formData => ({ ...formData, final_price: finalPrice.toFixed(2) }));
        }
    }, [formData.price, formData.fpa]);

    useEffect(() => {
        if (document.activeElement.name === "final_price") {
            const finalPrice = parseFloat(formData.final_price) || 0;
            const fpa = parseFloat(formData.fpa) || 0;
            const price = finalPrice / (1 + (fpa / 100));
            setFormData(formData => ({ ...formData, price: price.toFixed(2) }));
        }
    }, [formData.final_price, formData.fpa]);

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleClose = () => {
        setResultOpen(false);
    };

    const handleSubmit = () => {
        setLoading(true);
        const serviceFunction =  isEditing ? ProductService.updateProduct : ProductService.addProduct;
        
        serviceFunction(formData, id)
        .then(response => {   
            if(response.status === 200 || response.status === 201) {
                setLoading(false);
                setStatus(response.status);
                setResultOpen(true);
                setTitle(isEditing ? "Επιτυχής ενημέρωση" : "Επιτυχής ενέργεια");
                setBody(isEditing ? "Το είδος ενημερώθηκε επιτυχώς." : "Το είδος αποθηκεύτηκε επιτυχώς.");
                onProductAdded();
                handleCloseModal();
            }
        })
        .catch(error => {
            setLoading(false);
            setStatus(error.response.status);
            setResultOpen(true);
            setTitle("Σφάλμα");
            setBody(`${error.response.data.error}`);
            handleCloseModal();
        });
      } 
    


    return (
    <React.Fragment>
      <Modal
        size="lg"
        show={showModal}
        onHide={handleCloseModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {isEditing? "Επξεργασία είδους" : "Προσθήκη είδους"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding:'1rem'}}>
          <Form>
                <Row gy={3}>
                    <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
                        <Form.Label>Όνομα είδους</Form.Label>
                        <Form.Control className='form-group-style' type="text" placeholder="Όνομα" name="name" value={formData.name} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
                        <Form.Label>Τιμή</Form.Label>
                        <Form.Control className='form-group-style' type="number" step="0.01" placeholder="Τιμή" name="price" value={formData.price} onChange={handleInputChange} />
                    </Form.Group>
                </Row>
                <Row gy={3} style={{paddingBottom: '1rem'}}>
                    <PriceDropDownMenu className="mb-3" formData={formData} setFormData={setFormData} />
                    <FpaDropDownMenu className="mb-3" formData={formData} setFormData={setFormData} />
                    <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
                            <Form.Label>Τελική τιμή(Με Φ.Π.Α)</Form.Label>
                            <Form.Control className='form-group-style' placeholder="Τελική τιμή" type="number" step="0.01" name="final_price" value={formData.final_price} onChange={handleInputChange} />
                    </Form.Group>
                </Row>
                <Button onClick={handleSubmit   } variant="success">
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
      <ResultModal show={resultOpen} status={status} title={title} body={body} onHide={handleClose} />
    </React.Fragment>
    );
}

export default ProductModal;
