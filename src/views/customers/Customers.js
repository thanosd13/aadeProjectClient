import { useEffect, useState } from 'react';
import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CustomerModal from '../../components/Modals/CustomerModal';
import CustomerService from '../../services/CustomerService';
import {faBan, faInfo, faMagnifyingGlass, faPenToSquare, faPlus, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DeleteCustomerModal from '../../components/Modals/DeleteCustomerModal';

const Customers = () => {

const [showModal, setShowModal] = useState(false);
const [customers, setCustomers] = useState([]);
const [showDelete, setShowDelete] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [currentCustomer, setCurrentCustomer] = useState(null);
const id = useSelector(state => state.auth.user.user.id);

const handleOpenModal = (customer) => {
  if (customer && Object.keys(customer).length > 0) {
      setCurrentCustomer(customer);
      setIsEditing(true);
  } else {
      setCurrentCustomer(null);
      setIsEditing(false);
  }
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
  setCurrentCustomer(null);
  setIsEditing(false);
};

const handleDelete = (id) => {
  setDeleteId(id);
  setShowDelete(true);
}
const handleCloseDelete = () => {
  setShowDelete(false);
}

const getCustomers = () => {
    CustomerService.getByUserId(id)
    .then(response => {
        if(response.status === 200) {
          setCustomers(response.data);
        }
    }).catch(error => {
        console.log(error);
    });
}

const handleCustomerAdded = () => {
  getCustomers();
}

useEffect(()=>{
  handleCustomerAdded();
},[])


return (


    <React.Fragment>
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5">Πελάτες</Card.Title>
              <Button variant="primary" onClick={() => handleOpenModal(null)}>Προσθήκη πελάτη</Button>
            </Card.Header>
            <Card.Body>
            <Table responsive className="table-styling">
              <thead className="table-primary">
                <tr>
                  <th>Κωδικός πελάτη</th>
                  <th>Όνομα</th>
                  <th>ΑΦΜ</th>
                  <th>ΔΟΥ</th>
                  <th>Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{customer.name}</td>
                    <td>{customer.afm}</td>
                    <td>{customer.doy}</td>
                    <td>
                      <button onClick={() => handleOpenModal(customer)} style={{color: '#ffffff', borderRadius: '20px'}} className="btn btn-warning">
                          <FontAwesomeIcon icon={faPenToSquare}/>
                      </button>
                      <button onClick={() => handleDelete(customer.id)} style={{color: '#ffffff', borderRadius: '20px'}} className="btn btn-danger">
                          <FontAwesomeIcon icon={faBan}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            </Card.Body>
        </Card>
        <CustomerModal
            showModal={showModal}
            handleCloseModal={handleCloseModal}
            onCustomerAdded={handleCustomerAdded}
            isUser={false}
            isEditing={isEditing}
            customerData={currentCustomer}
        />
        <DeleteCustomerModal 
            deleteId={deleteId}
            show={showDelete}
            onCustomerAdded={handleCustomerAdded}
            onHide={handleCloseDelete}
        />
    </React.Fragment>

    );
}

export default Customers;