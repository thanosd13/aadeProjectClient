import React, {useState} from "react";
import { Button, Modal } from 'react-bootstrap';
import CustomerService from "../../services/CustomerService";
import { useSelector } from "react-redux";
import "./Modal.css";
import ResultModal from "./ResultModal";


const DeleteCustomerModal = (props) => {

    const[status, setStatus] = useState(null);
    const[title, setTitle] = useState("");
    const[body, setBody] = useState("");
    const[resultOpen, setResultOpen] = useState(false);
    const userId = useSelector(state => state.auth.user.user.id);

    const handleResultModalClose = () => {
        setResultOpen(false);
    }

    const deleteCustomer = () => {
        CustomerService.deleteCustomer(userId,props.deleteId)
        .then(response => {
            if(response.status === 204) {
                setResultOpen(true);
                setStatus(response.status);
                setTitle("Επιτυχής διαγραφή");
                setBody("Ο χρήστης διαγράφηκε επιτυχώς!");
                props.onCustomerAdded();
                props.onHide();
            }
        }).catch(error => {
            setResultOpen(true);
            setStatus(error.response.status);
            setTitle("Σφάλμα");
            setBody("Κάποιο σφάκμα προέκυψε κατά τη διαγραφή του χρήστη!");
            setHide(true);
            props.onHide();
        });
    }


    return(
        <React.Fragment>
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">Διαγραφή πελάτη</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    Είστε σίγουροι ότι θέλετε να διαγράψετε το συγκεκριμένο πελάτη;
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>
                    Όχι
                </Button>
                <Button variant="primary" onClick={deleteCustomer}>
                    Ναι
                </Button>
                </Modal.Footer>
            </Modal>
            <ResultModal show={resultOpen} onHide={handleResultModalClose} title={title} body={body} status={status} />
        </React.Fragment>
    )
} 

export default DeleteCustomerModal;