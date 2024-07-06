import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./Modal.css";
import ResultModal from "./ResultModal";
import ProductService from "../../services/ProductService";

const DeleteProductModal = (props) => {
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [resultOpen, setResultOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const userId = useSelector((state) => state.auth.user.user.id);

  const handleResultModalClose = () => {
    setResultOpen(false);
  };

  const deleteProduct = () => {
    ProductService.deleteProduct(userId, props.deleteId)
      .then((response) => {
        if (response.status === 204) {
          setResultOpen(true);
          setStatus(response.status);
          setTitle("Επιτυχής διαγραφή");
          setBody("Το προϊόν διαγράφηκε επιτυχώς!");
          props.onProductAdded();
          props.onHide();
        }
      })
      .catch((error) => {
        setResultOpen(true);
        setStatus(error.response.status);
        setTitle("Σφάλμα");
        setBody("Κάποιο σφάλμα προέκυψε κατά τη διαγραφή του προϊόντος!");
        setHide(true);
        props.onHide();
      });
  };

  return (
    <React.Fragment>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Διαγραφή προϊόντος</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          Είστε σίγουροι ότι θέλετε να διαγράψετε το συγκεκριμένο προϊόν;
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Όχι
          </Button>
          <Button variant="primary" onClick={deleteProduct}>
            Ναι
          </Button>
        </Modal.Footer>
      </Modal>
      <ResultModal
        show={resultOpen}
        onHide={handleResultModalClose}
        title={title}
        body={body}
        status={status}
      />
    </React.Fragment>
  );
};

export default DeleteProductModal;
