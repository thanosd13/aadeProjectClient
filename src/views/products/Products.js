import { useEffect, useState } from 'react';
import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CustomerModal from '../../components/Modals/CustomerModal';
import CustomerService from '../../services/CustomerService';
import {faBan, faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProductModal from '../../components/Modals/ProductModal';

const Products = () => {

const [showModal, setShowModal] = useState(false);
// const [customers, setCustomers] = useState([]);
// const [showDelete, setShowDelete] = useState(false);
// const [deleteId, setDeleteId] = useState(null);
const [isEditing, setIsEditing] = useState(false);
// const [currentCustomer, setCurrentCustomer] = useState(null);
// const id = useSelector(state => state.auth.user.user.id);

const handleOpenModal = (customer) => {
  setShowModal(true);
  setIsEditing(false);
};

const handleCloseModal = () => {
  setShowModal(false);
};

// const handleDelete = (id) => {
//   setDeleteId(id);
//   setShowDelete(true);
// }
// const handleCloseDelete = () => {
//   setShowDelete(false);
// }

// const getCustomers = () => {
//     CustomerService.getByUserId(id)
//     .then(response => {
//         if(response.status === 200) {
//           setCustomers(response.data);
//         }
//     }).catch(error => {
//         console.log(error);
//     });
// }

// const handleCustomerAdded = () => {
//   getCustomers();
// }

// useEffect(()=>{
//   handleCustomerAdded();
// },[])


return (


    <React.Fragment>
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5">Είδη</Card.Title>
              <Button onClick={() => handleOpenModal(null)} variant="primary">Προσθήκη</Button>
            </Card.Header>
            <Card.Body>
            <Table responsive className="table-styling">
              <thead className="table-primary">
                <tr>
                  <th>Όνομα</th>
                  <th>Τιμή</th>
                  <th>Μονάδες μέτρησης</th>
                  <th>Φ.Π.Α</th>
                  <th>Τιμή με Φ.Π.Α</th>
                  <th>Ενέργειες</th>
                </tr>
              </thead>
              {/* <tbody>
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
              </tbody> */}
            </Table>

            </Card.Body>
        </Card>
        <ProductModal showModal={showModal} handleCloseModal={handleCloseModal} isEditing={isEditing} />
    </React.Fragment>

    );
}

export default Products;