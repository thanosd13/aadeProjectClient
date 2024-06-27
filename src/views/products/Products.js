import { useEffect, useState } from 'react';
import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CustomerModal from '../../components/Modals/CustomerModal';
import CustomerService from '../../services/CustomerService';
import {faBan, faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProductModal from '../../components/Modals/ProductModal';
import ProductService from '../../services/ProductService';

const Products = () => {

const [showModal, setShowModal] = useState(false);
const [products, setProducts] = useState([]);
// const [showDelete, setShowDelete] = useState(false);
// const [deleteId, setDeleteId] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [currentProduct, setCurrentProduct] = useState(null);
const id = useSelector(state => state.auth.user.user.id);

const handleOpenModal = (product) => {
  if (product && Object.keys(product).length > 0) {
      setCurrentProduct(product);
      setIsEditing(true);
  } else {
      setCurrentProduct(null);
      setIsEditing(false);
  }
  setShowModal(true);
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

const getProducts = () => {
    ProductService.getProducts(id)
    .then(response => {
      if(response.status === 200 && Array.isArray(response.data)) {
          setProducts(response.data);
      } else {
          // Handle cases where data is not an array
          console.log('Expected an array, but received:', response.data);
          setProducts([]); // Reset or maintain an empty array
      }
  }).catch(error => {
      console.log(error);
      setProducts([]); // Reset on error
  });
}

const handleProductAdded = () => {
    getProducts();
}

useEffect(()=>{
    handleProductAdded();
},[])


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
                    <th>ΑΑ</th>
                    <th>Όνομα</th>
                    <th>Τιμή</th>
                    <th>Μονάδες μέτρησης</th>
                    <th>Φ.Π.Α</th>
                    <th>Τιμή με Φ.Π.Α</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <th scope="row">{index+1}</th>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.type}</td>
                      <td>{product.fpa}</td>
                      <td>{product.final_price}</td>
                      <td>
                        <button onClick={() => handleOpenModal(product)} style={{color: '#ffffff', borderRadius: '20px'}} className="btn btn-warning">
                            <FontAwesomeIcon icon={faPenToSquare}/>
                        </button>
                        <button onClick={() => handleDelete(product.id)} style={{color: '#ffffff', borderRadius: '20px'}} className="btn btn-danger">
                            <FontAwesomeIcon icon={faBan}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
        </Card>
        <ProductModal 
            showModal={showModal} 
            handleCloseModal={handleCloseModal} 
            isEditing={isEditing} 
            onProductAdded={handleProductAdded}
            productData={currentProduct}
        />
    </React.Fragment>

    );
}

export default Products;