import React, {useState} from "react";
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import "./Modal.css";


const ResultModal = (props) => {

    return(
        <React.Fragment>
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-result">
                    {(props.status === 200 || props.status === 201 || props.status === 204) ?
                        <span className="success-icon">
                            <FontAwesomeIcon icon={faCheck} />
                        </span> 
                        :
                        <span className="error-icon">
                            <FontAwesomeIcon icon={faXmark} />
                        </span>
                    }
                    {props.body}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={props.onHide}>
                    Οκ
                </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
} 

export default ResultModal;