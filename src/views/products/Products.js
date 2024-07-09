import React, { useEffect, useState } from "react";
import { Card, Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { faBan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductModal from "../../components/Modals/ProductModal";
import ProductService from "../../services/ProductService";
import DeleteProductModal from "../../components/Modals/DeleteProductModal";
import PaginationComponent from "../../components/Pagination/PaginationComponent";
import "./Products.css";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const id = useSelector((state) => state.auth.user.user.id);

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

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const getProducts = () => {
    ProductService.getProducts(id)
      .then((response) => {
        if (response.status === 200 && Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          // Handle cases where data is not an array
          console.log("Expected an array, but received:", response.data);
          setProducts([]); // Reset or maintain an empty array
        }
      })
      .catch((error) => {
        console.log(error);
        setProducts([]); // Reset on error
      });
  };

  const handleProductAdded = () => {
    getProducts();
  };

  useEffect(() => {
    handleProductAdded();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <React.Fragment>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title as="h5">Είδη</Card.Title>
          <Button onClick={() => handleOpenModal(null)} variant="primary">
            <i className="feather icon-plus" />
            Προσθήκη
          </Button>
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
              {currentItems.map((product, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1 + indexOfFirstItem}</th>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.type}</td>
                  <td>{product.fpa}</td>
                  <td>{product.final_price}</td>
                  <td>
                    <button
                      onClick={() => handleOpenModal(product)}
                      style={{ color: "#ffffff", borderRadius: "20px" }}
                      className="btn btn-warning"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{ color: "#ffffff", borderRadius: "20px" }}
                      className="btn btn-danger"
                    >
                      <FontAwesomeIcon icon={faBan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="pagination-products">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </Card.Body>
      </Card>
      <ProductModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        isEditing={isEditing}
        onProductAdded={handleProductAdded}
        productData={currentProduct}
      />
      <DeleteProductModal
        deleteId={deleteId}
        show={showDelete}
        onProductAdded={handleProductAdded}
        onHide={handleCloseDelete}
      />
    </React.Fragment>
  );
};

export default Products;
