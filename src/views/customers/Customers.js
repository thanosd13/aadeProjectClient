import { useState } from 'react';
import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CustomerModal from '../../components/Modals/CustomerModal';

const Customers = () => {

const [showModal, setShowModal] = useState(false);
const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
const handleOpenModal = () => setShowModal(true);
const handleCloseModal = () => setShowModal(false);

return (

    <React.Fragment>
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5">Πελάτες</Card.Title>
                <Button variant="primary" className="text-capitalize" onClick={handleOpenModal}>
                    <i className="feather icon-plus"/>
                    Προσθήκη
                </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive className="table-styling">
                <thead className="table-primary">
                  <tr>
                    <th>Κωδικός Πελάτη</th>
                    <th>Όνομα</th>
                    <th>ΑΦΜ</th>
                    <th>ΔΟΥ</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                    <td>@mdo</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
        </Card>
        <CustomerModal showModal={showModal} handleCloseModal={handleCloseModal} />
    </React.Fragment>

    );
}

export default Customers;