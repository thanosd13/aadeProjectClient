import { useEffect, useState } from "react";
import React from "react";
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import CustomerService from "../../services/CustomerService";
import CountryDropdown from "../../components/Generic/CountryDropDown";
import { CSSTransition } from "react-transition-group";
import Spinner from "react-bootstrap/Spinner";
import CreatableSelect from "react-select/creatable";
import PriceDropDownMenu from "../../components/Generic/PriceDropDownMenu";
import "./Invoices.css";
import {
  faBan,
  faPenToSquare,
  faPlus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductService from "../../services/ProductService";
import FpaDropDownMenu from "../../components/Generic/FpaDropDownMenu";
import PdfService from "../../services/PdfService";

const Invoices = () => {
  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const id = useSelector((state) => state.auth.user.user.id);

  const [customerData, setCustomerData] = useState({
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
    tel_number: "",
    date: "",
  });

  const [invoiceData, setInvoiceData] = useState({
    customerData: {},
    products: []
  });

  const menuPortalTarget = document.body;

  const handleOpenForm = () => {
    setShowForm((prevState) => !prevState);
  };

  const handleInputName = (event) => {
    const name = event.target.value;
    const customer = customers.find((c) => c.name === name);

    if (customer) {
      const updatedCustomerData = {
        afm: customer.afm,
        name: customer.name,
        country: customer.country,
        city: customer.city,
        address: customer.address,
        street_number: customer.street_number,
        postal_code: customer.postal_code,
        doy: customer.doy,
        work: customer.work,
        email: customer.email,
        tel_number: customer.tel_number,
        date: customerData.date, // Ensure the date is carried over
      };
      setCustomerData(updatedCustomerData);
      setInvoiceData((prevInvoiceData) => ({
        ...prevInvoiceData,
        customerData: updatedCustomerData,
      }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedCustomerData = { ...customerData, [name]: value };
    setCustomerData(updatedCustomerData);
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      customerData: updatedCustomerData,
    }));
  };

  const getCustomers = () => {
    CustomerService.getByUserId(id)
      .then((response) => {
        if (response.status === 200) {
          setCustomers(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProducts = () => {
    ProductService.getProducts(id)
      .then((response) => {
        if (response.status === 200) {
          setProductsList(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchWithAfm = () => {
    setError("");
    if (!customerData.afm) {
      setError("Συμπληρώστε το ΑΦΜ που επιθυμείτε!");
      return;
    }
    setLoading(true);
    CustomerService.getByAfm(customerData.afm)
      .then((response) => {
        if (response.status === 200) {
          const updatedCustomerData = {
            afm: response.data.afm[0],
            name: response.data.onomasia[0],
            country: "GR",
            city: response.data.postal_area_description[0],
            address: response.data.postal_address[0],
            street_number: response.data.postal_address_no[0],
            postal_code: response.data.postal_zip_code[0],
            doy: response.data.doy_descr[0],
            work: response.data.firm_act.firm_act_descr,
            date: customerData.date, // Ensure the date is carried over
          };
          setCustomerData(updatedCustomerData);
          setInvoiceData((prevInvoiceData) => ({
            ...prevInvoiceData,
            customerData: updatedCustomerData,
          }));
          setError("");
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 404) {
          setError("Δεν βρέθηκαν αποτελέσματα με το συγκεκριμένο ΑΦΜ!");
        } else {
          setError("Κάποιο σφάλμα προέκυψε!");
        }
      });
  };

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().substring(0, 10); // formats to "YYYY-MM-DD"
    setToday(formattedDate);
    setCustomerData((prev) => ({ ...prev, date: formattedDate })); // Ensure the form's date is also set

    if (showForm) {
      getCustomers();
      getProducts();
    }
  }, [showForm]);

  useEffect(() => {
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      customerData,
      products,
    }));
  }, [customerData, products]);

  const addProduct = () => {
    const newProduct = {
      id: products.length + 1, // Increment the product id
      name: "",
      price: 0.0,
      type: "",
      fpa: "",
      final_price: 0.0,
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      products: updatedProducts,
    }));
  };

  const handleProductChange = (event, index) => {
    const { name, value } = event.target;
    const updatedProducts = products.map((product, i) => {
      if (i === index) {
        let updatedProduct = { ...product, [name]: value };
        if (name === "price" || name === "fpa") {
          const price = parseFloat(updatedProduct.price) || 0;
          const fpa = parseFloat(updatedProduct.fpa) || 0;
          const finalPrice = price + price * (fpa / 100);
          updatedProduct.final_price = finalPrice.toFixed(2);
        }
        return updatedProduct;
      }
      return product;
    });
    setProducts(updatedProducts);
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      products: updatedProducts,
    }));
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      products: updatedProducts,
    }));
  };

  const handleProductSelect = (newValue, actionMeta, index) => {
    if (!Array.isArray(products)) return;

    const selectedProduct = productsList.find((c) => c.name === newValue?.value);

    const updatedProducts = products.map((product, i) => {
      if (i === index) {
        const price = selectedProduct ? parseFloat(selectedProduct.price) : 0.0;
        const fpa = selectedProduct ? parseFloat(selectedProduct.fpa) : 0.0;
        const finalPrice = price + price * (fpa / 100);
        return {
          ...product,
          name: newValue ? newValue.value : "",
          price: price.toFixed(2),
          type: selectedProduct ? selectedProduct.type : "",
          fpa: fpa,
          final_price: finalPrice.toFixed(2),
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      products: updatedProducts,
    }));
  };

  const handleTypeChange = (value, index) => {
    const updatedProducts = products.map((product, i) => {
      if (i === index) {
        return { ...product, type: value };
      }
      return product;
    });
    setProducts(updatedProducts);
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      products: updatedProducts,
    }));
  };

  const handleFpaChange = (value, index) => {
    const updatedProducts = products.map((product, i) => {
      if (i === index) {
        const price = parseFloat(product.price) || 0;
        const fpa = parseFloat(value) || 0;
        const finalPrice = price + price * (fpa / 100);
        return { ...product, fpa: value, final_price: finalPrice.toFixed(2) };
      }
      return product;
    });
    setProducts(updatedProducts);
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      products: updatedProducts,
    }));
  };

  const productOptions = productsList.map((product) => ({
    value: product.name,
    label: product.name,
  }));

  const customStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (provided) => ({ ...provided, zIndex: "9999 !important" }),
  };

  const createInvoice = () => {
    PdfService.createInvoice(invoiceData, id)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'invoice.pdf'); // or any other extension
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title as="h5">Παραστατικά</Card.Title>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <i className="feather icon-plus" />
            Έκδοση παραστατικού
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive className="table-styling">
            <thead className="table-primary">
              <tr>
                <th>Όνομα πελάτη</th>
                <th>Ημ.έκδοσης</th>
                <th>ΑΦΜ</th>
                <th>Τύπος παραστατικού</th>
                <th>Τιμή χωρίς Φ.Π.Α</th>
                <th>Φ.Π.Α</th>
                <th>Τιμή με Φ.Π.Α</th>
                <th>Κωδικός myDATA</th>
                <th>Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{customer.name}</td>
                    <td>{customer.afm}</td>
                    <td>{customer.doy}</td>
                    <td>
                    </td>
                  </tr> */}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <CSSTransition
        in={showForm}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="form-container">
          <Row>
            <Col xl={12} xxl={12}>
              <Card style={{ padding: "0.4rem" }}>
                <Card.Body>
                  <h4 className="header-category">
                    <i className="feather icon-user icon" />
                    Πελάτης
                  </h4>
                  <Form>
                    <Row gy={3}>
                      <Form.Group as={Col} controlId="formGridCustomerName">
                        <Form.Label>Όνομα πελάτη</Form.Label>
                        <Form.Control
                          as="select"
                          value={customerData.name}
                          onChange={handleInputName}
                          name="name"
                          className="custom-dropdown"
                        >
                          <option value="">Επιλέξτε</option>
                          {customers.map((customer, index) => (
                            <option key={index} value={customer.name}>
                              {customer.name}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        as={Col}
                        controlId="formGridEmail"
                      >
                        <Form.Label>ΑΦΜ</Form.Label>
                        <InputGroup>
                          <Form.Control
                            className="form-group-style"
                            type="text"
                            placeholder="ΑΦΜ"
                            name="afm"
                            value={customerData.afm}
                            onChange={handleInputChange}
                          />
                          <Button
                            type="button"
                            style={{
                              borderColor: "#dee2e6",
                              padding: "0.4rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            variant="outline-secondary"
                            onClick={searchWithAfm}
                            className="cursor-pointer"
                          >
                            {!loading && (
                              <i
                                style={{ paddingLeft: "0.6rem" }}
                                className="feather icon-search"
                              ></i>
                            )}
                            {loading && (
                              <Spinner
                                style={{
                                  marginLeft: "0.5rem",
                                  marginRight: "0.6rem !important",
                                }}
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            )}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                      <CountryDropdown
                        className="mb-3"
                        formData={customerData}
                        setFormData={setCustomerData}
                      />
                      <Form.Group
                        className="mb-3"
                        as={Col}
                        controlId="formGridPassword"
                      >
                        <Form.Label>Πόλη</Form.Label>
                        <Form.Control
                          className="form-group-style"
                          type="text"
                          placeholder="Πόλη"
                          name="city"
                          value={customerData.city}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Row>
                    <Row gy={3}>
                      <Form.Group
                        className="mb-2"
                        as={Col}
                        controlId="formGridEmail"
                      >
                        <Form.Label>Διεύθυνση</Form.Label>
                        <Form.Control
                          className="form-group-style"
                          type="text"
                          placeholder="Διεύθυνση"
                          name="address"
                          value={customerData.address}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-2"
                        as={Col}
                        controlId="formGridEmail"
                      >
                        <Form.Label>Αριθμός</Form.Label>
                        <Form.Control
                          className="form-group-style"
                          type="number"
                          placeholder="Αριθμός"
                          name="street_number"
                          value={customerData.street_number}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-2"
                        as={Col}
                        controlId="formGridPassword"
                      >
                        <Form.Label>Ταχυδρομικός κώδικας</Form.Label>
                        <Form.Control
                          className="form-group-style"
                          type="number"
                          placeholder="ΤΚ"
                          name="postal_code"
                          value={customerData.postal_code}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        as={Col}
                        controlId="formGridEmail"
                      >
                        <Form.Label>ΔΟΥ</Form.Label>
                        <Form.Control
                          className="form-group-style"
                          type="text"
                          placeholder="ΔΟΥ"
                          name="doy"
                          value={customerData.doy}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Row>
                    <Row style={{ paddingBottom: "2rem" }} gy={3}>
                      <Form.Group
                        className="mb-3"
                        as={Col}
                        controlId="formGridPassword"
                      >
                        <Form.Label>Αντικείμενο απασχόλησης</Form.Label>
                        <Form.Control
                          className="form-group-style"
                          type="text"
                          placeholder="Αντικείμενο"
                          name="work"
                          value={customerData.work}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        as={Col}
                        controlId="formGridEmail"
                      >
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                          className="form-group-style"
                          type="email"
                          placeholder="E-mail"
                          name="email"
                          value={customerData.email}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        as={Col}
                        controlId="formGridPassword"
                      >
                        <Form.Label>Τηλέφωνο επικοινωνίας</Form.Label>
                        <Form.Control
                          className="form-group-style"
                          type="number"
                          placeholder="Τηλέφωνο"
                          name="tel_number"
                          value={customerData.tel_number}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        as={Col}
                        controlId="formGridPassword"
                      >
                        <Form.Label>Η/νία έκδοσης</Form.Label>
                        <Form.Control
                          className="form-group-style"
                          type="date"
                          placeholder="Η/νία έκδοσης"
                          name="date"
                          value={customerData.date}
                          max={getTodayDate()}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Row>
                    <h4 className="header-category">
                      <i className="feather icon-shopping-cart icon" />
                      Προϊόντα
                    </h4>
                    <div className="products">
                      <div className="d-flex justify-content-end mb-3">
                        <Button variant="primary" onClick={addProduct}>
                          <i className="feather icon-plus" />
                          Προσθήκη προϊόντος
                        </Button>
                      </div>
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
                          {Array.isArray(products) && products.map((product, index) => (
                            <tr key={index}>
                              <td>{product.id}</td>
                              <td>
                                <CreatableSelect
                                  isClearable
                                  onChange={(newValue, actionMeta) =>
                                    handleProductSelect(
                                      newValue,
                                      actionMeta,
                                      index
                                    )
                                  }
                                  options={productOptions}
                                  placeholder="Επιλέξτε ή πληκτρολογήστε"
                                  styles={customStyles}
                                  menuPortalTarget={menuPortalTarget}
                                />
                              </td>
                              <td>
                                <input
                                  className="table-input"
                                  step="0.01"
                                  type="text"
                                  value={parseFloat(product.price).toFixed(2)}
                                  name="price"
                                  onChange={(e) =>
                                    handleProductChange(e, index)
                                  }
                                />
                              </td>
                              <td>
                                <PriceDropDownMenu
                                  value={product.type}
                                  onChange={(value) => handleTypeChange(value, index)}
                                />
                              </td>
                              <td>
                                <FpaDropDownMenu
                                  value={product.fpa}
                                  onChange={(value) => handleFpaChange(value, index)}
                                />
                              </td>
                              <td>
                                <input
                                  className="table-input"
                                  type="text"
                                  value={product.final_price}
                                  name="final_price"
                                  onChange={(e) =>
                                    handleProductChange(e, index)
                                  }
                                />
                              </td>
                              <td>
                                <button
                                  onClick={() => removeProduct(index)}
                                  style={{
                                    color: "#ffffff",
                                    borderRadius: "20px",
                                  }}
                                  className="btn btn-danger"
                                >
                                  <FontAwesomeIcon icon={faBan} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    <Button className="btn_success" onClick={createInvoice}>
                      <i className="feather icon-save" />
                      Έκδοση
                      {loading && (
                        <Spinner
                          style={{ marginLeft: "0.5rem" }}
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowForm(!showForm)}
                      className="btn_danger"
                      variant="danger"
                    >
                      <i className="feather icon-slash mx-1" />
                      Ακύρωση
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </CSSTransition>
    </React.Fragment>
  );
};

export default Invoices;
