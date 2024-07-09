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
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
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
import PaginationComponent from "../../components/Pagination/PaginationComponent";

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
  const [serialNumDisabled, setSerialNumDisabled] = useState(false);
  const [date, setDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [series, setSeries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
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
    products: [],
    informations: {
      payment_way: "",
      invoice_type: "",
      notes: "",
      my_data: false,
      invoice_serie: "",
      serial_number: "",
    },
    only_view: false,
  });

  const invoiceTypes = {
    1: "Τιμολόγιο πώλησης",
    2: "Απόδειξη",
  };

  const [shouldGeneratePdf, setShouldGeneratePdf] = useState(false);

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

  const handleInformationsChange = (event) => {
    const { name, value } = event.target;
    const updatedInformations = { ...invoiceData.informations, [name]: value };
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      informations: updatedInformations,
    }));
  };

  const handleMyDataChange = (event) => {
    const { checked } = event.target;
    const updatedInformations = {
      ...invoiceData.informations,
      my_data: checked,
    };
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      informations: updatedInformations,
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

  useEffect(() => {
    if (shouldGeneratePdf) {
      if (invoiceData.only_view) {
        generateInvoicePreview();
      } else {
        generateInvoice();
      }
      setShouldGeneratePdf(false); // Reset the flag
    }
  }, [shouldGeneratePdf]);

  useEffect(() => {
    PdfService.getInvoices(id)
      .then((response) => {
        if (response.status === 200) {
          setInvoices(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    PdfService.getSeries(id)
      .then((response) => {
        if (response.status === 200) {
          setSeries(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

    const selectedProduct = productsList.find(
      (c) => c.name === newValue?.value
    );

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

  const seriesOptions = series.map((serie) => ({
    value: serie.invoice_serie,
    label: serie.invoice_serie,
  }));

  const customStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (provided) => ({ ...provided, zIndex: "9999 !important" }),
  };

  function saveDocument(response) {
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function previewDocument(response) {
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

  const generateInvoice = () => {
    PdfService.createInvoice(invoiceData, id)
      .then((response) => {
        saveDocument(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const generateInvoicePreview = () => {
    PdfService.createInvoice(invoiceData, id)
      .then((response) => {
        previewDocument(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDocument = (userId, idDocument) => {
    PdfService.getDocument(userId, idDocument)
      .then((response) => {
        saveDocument(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const printDocument = (userId, idDocument) => {
    PdfService.getDocument(userId, idDocument)
      .then((response) => {
        previewDocument(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createInvoice = () => {
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      only_view: false,
    }));
    setShouldGeneratePdf(true);
  };

  const previewInvoice = () => {
    setInvoiceData((prevInvoiceData) => ({
      ...prevInvoiceData,
      only_view: true,
    }));
    setShouldGeneratePdf(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(invoices.length / itemsPerPage);

  const handleSelectChange = async (newValue) => {
    const value = newValue ? newValue.value : "";
    try {
      const response = await PdfService.getMaxSerialNumber(
        { serie: value },
        id
      );
      const maxSerialNumber = response.data.data
        ? parseInt(response.data.data) + 1
        : "";

      if (maxSerialNumber) {
        setSerialNumDisabled(true);
      } else {
        setSerialNumDisabled(false);
      }

      setInvoiceData((prevInvoiceData) => ({
        ...prevInvoiceData,
        informations: {
          ...prevInvoiceData.informations,
          invoice_serie: value,
          serial_number: maxSerialNumber,
        },
      }));
    } catch (error) {
      console.log(error);
    }
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
              {currentItems.map((invoice, index) => (
                <tr key={index}>
                  <td>{invoice.cutsomer_name}</td>
                  <td>{invoice.published_date}</td>
                  <td>{invoice.afm}</td>
                  <td>{invoiceTypes[invoice.invoice_type]}</td>
                  <td>{invoice.price}</td>
                  <td>{invoice.fpa}</td>
                  <td>{invoice.total_price}</td>
                  <td>-</td>
                  <td className="menu-actions">
                    <DropdownButton id="dropdown-item-button" title="Ενέργειες">
                      <Dropdown.Item
                        onClick={() => printDocument(id, invoice.id)}
                        as="button"
                      >
                        <i className="feather icon-printer icon" />
                        Εκτύπωση
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => getDocument(id, invoice.id)}
                        as="button"
                      >
                        <i className="feather icon-save icon" />
                        Aποθήκευση
                      </Dropdown.Item>
                      <Dropdown.Item as="button">
                        <i className="feather icon-copy icon" />
                        Αντιγραφή
                      </Dropdown.Item>
                      <Dropdown.Item as="button">
                        <i className="feather icon-mail icon" />
                        Αποστολή
                      </Dropdown.Item>
                      <Dropdown.Item as="button">
                        <i className="feather icon-x-square icon" />
                        Ακύρωση
                      </Dropdown.Item>
                    </DropdownButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="pagination-invoices">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
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
                    <i className="feather icon-info icon" />
                    Πληροφορίες παραστατικού
                  </h4>
                  <div className="invoice-info">
                    <Row gy={4}>
                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label>Τρόπος πληρωμής</Form.Label>
                        <Form.Select
                          value={invoiceData.informations.payment_way}
                          name="payment_way"
                          onChange={handleInformationsChange}
                        >
                          <option>Επιλέξτε</option>
                          <option value="1">
                            Επαγ. Λογαριασμός Πληρωμών Ημεδαπής
                          </option>
                          <option value="2">
                            Επαγ. Λογαριασμός Πληρωμών Αλλοδαπής
                          </option>
                          <option value="3">Μετρητά</option>
                          <option value="4">Επιταγή</option>
                          <option value="5">Επί Πιστώσει</option>
                          <option value="6">Web Banking</option>
                          <option value="7">POS / e-POS</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label>Τύπος παραστατικού</Form.Label>
                        <Form.Select
                          value={invoiceData.informations.invoice_type}
                          name="invoice_type"
                          onChange={handleInformationsChange}
                        >
                          <option>Επιλέξτε</option>
                          <option value="1.1">Τιμολόγιο Πώλησης</option>
                          <option value="1.2">
                            Τιμολόγιο Πώλησης / Ενδοκοινοτικές Παραδόσεις
                          </option>
                          <option value="1.3">
                            Τιμολόγιο Πώλησης / Παραδόσεις Τρίτων Χωρών
                          </option>
                          <option value="1.4">
                            Τιμολόγιο Πώλησης / Πώληση για Λογαριασμό Τρίτων
                          </option>
                          <option value="1.5">
                            Τιμολόγιο Πώλησης / Εκκαθάριση Πωλήσεων Τρίτων -
                            Αμοιβή από Πωλήσεις Τρίτων
                          </option>
                          <option value="1.6">
                            Τιμολόγιο Πώλησης / Συμπληρωματικό Παραστατικό
                          </option>
                          <option value="2.1">Τιμολόγιο Παροχής</option>
                          <option value="2.2">
                            Τιμολόγιο Παροχής / Ενδοκοινοτική Παροχή Υπηρεσιών
                          </option>
                          <option value="2.3">
                            Τιμολόγιο Παροχής / Παροχή Υπηρεσιών σε λήπτη Τρίτης
                            Χώρας
                          </option>
                          <option value="2.4">
                            Τιμολόγιο Παροχής / Συμπληρωματικό Παραστατικό
                          </option>
                          <option value="3.1">
                            Τίτλος Κτήσης (μη υπόχρεος Εκδότης)
                          </option>
                          <option value="3.2">
                            Τίτλος Κτήσης (άρνηση έκδοσης από υπόχρεο Εκδότη)
                          </option>
                          <option value="5.1">
                            Πιστωτικό Τιμολόγιο / Συσχετιζόμενο
                          </option>
                          <option value="5.2">
                            Πιστωτικό Τιμολόγιο / Μη Συσχετιζόμενο
                          </option>
                          <option value="6.1">Στοιχείο Αυτοπαράδοσης</option>
                          <option value="6.2">
                            Στοιχείο Ιδιοχρησιμοποίησης
                          </option>
                          <option value="7.1">Συμβόλαιο - Έσοδο</option>
                          <option value="8.1">Ενοίκια - Έσοδο</option>
                          <option value="8.2">
                            Ειδικό Στοιχείο – Απόδειξης Είσπραξης Φόρου Διαμονής
                          </option>
                          <option value="8.4">Απόδειξη Είσπραξης POS</option>
                          <option value="8.5">Απόδειξη Επιστροφής POS</option>
                          <option value="8.6">
                            Δελτίο Παραγγελίας Εστίασης
                          </option>
                          <option value="9.3">Δελτίο Αποστολής</option>
                          <option value="11.1">ΑΛΠ</option>
                          <option value="11.2">ΑΠΥ</option>
                          <option value="11.3">Απλοποιημένο Τιμολόγιο</option>
                          <option value="11.4">
                            Πιστωτικό Στοιχ. Λιανικής
                          </option>
                          <option value="11.5">
                            Απόδειξη Λιανικής Πώλησης για Λογ/σμό Τρίτων
                          </option>
                          <option value="13.1">
                            Έξοδα - Αγορές Λιανικών Συναλλαγών ημεδαπής /
                            αλλοδαπής
                          </option>
                          <option value="13.2">
                            Παροχή Λιανικών Συναλλαγών ημεδαπής / αλλοδαπής
                          </option>
                          <option value="13.3">Κοινόχρηστα</option>
                          <option value="13.4">Συνδρομές</option>
                          <option value="13.30">
                            Παραστατικά Οντότητας ως Αναγράφονται από την ίδια
                            (Δυναμικό)
                          </option>
                          <option value="13.31">
                            Πιστωτικό Στοιχ. Λιανικής ημεδαπής / αλλοδαπής
                          </option>
                          <option value="14.1">
                            Τιμολόγιο / Ενδοκοινοτικές Αποκτήσεις
                          </option>
                          <option value="14.2">
                            Τιμολόγιο / Αποκτήσεις Τρίτων Χωρών
                          </option>
                          <option value="14.3">
                            Τιμολόγιο / Ενδοκοινοτική Λήψη Υπηρεσιών
                          </option>
                          <option value="14.4">
                            Τιμολόγιο / Λήψη Υπηρεσιών Τρίτων Χωρών
                          </option>
                          <option value="14.5">
                            ΕΦΚΑ και λοιποί Ασφαλιστικοί Οργανισμοί
                          </option>
                          <option value="14.30">
                            Παραστατικά Οντότητας ως Αναγράφονται από την ίδια
                            (Δυναμικό)
                          </option>
                          <option value="14.31">
                            Πιστωτικό ημεδαπής / αλλοδαπής
                          </option>
                          <option value="15.1">Συμβόλαιο - Έξοδο</option>
                          <option value="16.1">Ενοίκιο Έξοδο</option>
                          <option value="17.1">Μισθοδοσία</option>
                          <option value="17.2">Αποσβέσεις</option>
                          <option value="17.3">
                            Λοιπές Εγγραφές Τακτοποίησης Εσόδων - Λογιστική Βάση
                          </option>
                          <option value="17.4">
                            Λοιπές Εγγραφές Τακτοποίησης Εσόδων - Φορολογική
                            Βάση
                          </option>
                          <option value="17.5">
                            Λοιπές Εγγραφές Τακτοποίησης Εξόδων - Λογιστική Βάση
                          </option>
                          <option value="17.6">
                            Λοιπές Εγγραφές Τακτοποίησης Εξόδων - Φορολογική
                            Βάση
                          </option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label>Παρατηρήσεις</Form.Label>
                        <Form.Control
                          value={invoiceData.informations.notes}
                          name="notes"
                          onChange={handleInformationsChange}
                          as="textarea"
                          rows={1}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label>myData</Form.Label>
                        <Form.Check
                          value={invoiceData.informations.my_data}
                          checked={invoiceData.informations.my_data}
                          name="my_data"
                          onChange={handleMyDataChange}
                          type="switch"
                          id="custom-switch"
                        />
                      </Form.Group>
                    </Row>
                    <Row gy={4}>
                      <Col xl={3} xxl={3}>
                        <Form.Label>Σειρά παραστατικού</Form.Label>
                        <CreatableSelect
                          isClearable
                          options={seriesOptions}
                          placeholder="Επιλέξτε ή πληκτρολογήστε"
                          styles={customStyles}
                          menuPortalTarget={menuPortalTarget}
                          onChange={handleSelectChange}
                        />
                      </Col>
                      <Col xl={3} xxl={3}>
                        <Form.Group
                          className="mb-3"
                          as={Col}
                          controlId="formGridPassword"
                        >
                          <Form.Label>ΑΑ παραστατικού</Form.Label>
                          <Form.Control
                            className="form-group-style"
                            type="text"
                            placeholder="ΑΑ"
                            name="serial_number"
                            disabled={serialNumDisabled}
                            value={invoiceData.informations.serial_number}
                            onChange={handleInformationsChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
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
                    <h4 className="header-category header-products">
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
                          {Array.isArray(products) &&
                            products.map((product, index) => (
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
                                    onChange={(value) =>
                                      handleTypeChange(value, index)
                                    }
                                  />
                                </td>
                                <td>
                                  <FpaDropDownMenu
                                    value={product.fpa}
                                    onChange={(value) =>
                                      handleFpaChange(value, index)
                                    }
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
                      className="btn_info"
                      onClick={previewInvoice}
                      variant="info"
                    >
                      <i className="feather icon-printer" />
                      Προεπισκόπηση
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
