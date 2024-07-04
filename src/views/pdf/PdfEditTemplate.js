import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Sketch } from "@uiw/react-color";
import UserService from "../../services/UserService";
import "./pdf.css";
import PdfService from "../../services/PdfService";
import ResultModal from "../../components/Modals/ResultModal";
import { MIDDLEWARE_ULR } from "../../config/constant";

const PdfEditTemplate = () => {
  const [formData, setFormData] = useState({
    textSize: 15,
    logoSize: 7,
    colors: ["#000000", "#444444"],
    logoImage: null,
    logoImageUrl: null,
    notes: ""
  });
  const [editData, setEditData] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const id = useSelector(state => state.auth.user.user.id);
  const user = useSelector(state => state.auth.user);
  const [userData, setUserData] = useState([]);
  const [invoice, setInvoice] = useState({
    invoice_nr: 123,
    subtotal: 100,
    paid: 50,
    items: [
      { item: "test", description: "test", quantity: 1, amount: "test" },
      { item: "test", description: "test", quantity: 2, amount: "test" }
    ]
  });

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${MIDDLEWARE_ULR}/pdf/image/${id}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const imageBlob = response.data;
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setImageSrc(imageObjectUrl);
    } catch (error) {
      console.error('Failed to fetch image:', error);
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--text-size', `${formData.textSize}px`);
  }, [formData.textSize]);

  useEffect(() => {
    const findUserData = async () => {
      try {
        const response = await UserService.findUserData(id);
        if (response.status === 200) {
          setUserData(response.data);
          setEditData(true);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUserData([]);
      }
    };

    const getPdfData = async () => {
      try {
        const response = await PdfService.getPdfData(id);
        if (response.status === 200) {
          setFormData(response.data);
          setEditData(true);
          setFormData(prev => ({
            ...prev,
            colors: [response.data.firstColor, response.data.secondColor],
            textSize: response.data.textSize * 4 / 3,
            logoSize: response.data.logoSize * 4 / 3
          }));
          fetchImage(); // Fetch the image
        }
      } catch (error) {
        setEditData(false);
        console.error('Failed to fetch PDF data:', error);
      }
    };

    findUserData();
    getPdfData();
  }, [id]);

  const handleColorChange = (color, index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((c, idx) => idx === index ? color.hex : c)
    }));
  };

  const handleSettingChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logoImage: file,
          logoImageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('textSize', formData.textSize*72/96);
    data.append('logoSize', formData.logoSize);
    data.append('notes', formData.notes);
    data.append('firstColor', formData.colors[0]);
    data.append('secondColor', formData.colors[1]); 
   
    if (formData.logoImage) {
      data.append('logoImage', formData.logoImage);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`
        }
      };
      const url = `${MIDDLEWARE_ULR}/pdf/${id}`;
      const method = editData ? 'put' : 'post';
      const response = await axios[method](url, data, config);

      if (response.status === 200 || response.status === 201) {
        setResultOpen(true);
        setStatus(response.status);
        setTitle("Επιτυχία");
        setBody("Επιτυχής αποθήκευση");
        fetchImage(); // Fetch the updated image
      }
    } catch (error) {
      console.error('Error uploading the image', error);
      setStatus(error.response?.status);
      setTitle("Σφάλμα");
      setBody("Ανεπιτυχής αποθήκευση");
    }
  };

  const handleClose = () => {
    setResultOpen(false);
  }

  return (
    <React.Fragment>
      <Row>
        <Col xl={12} xxl={12}>
          <Card>
            <Card.Body className="header-template">
              <h3>Επεξεργασία παραστατικού</h3>
              <p>(Το Timologio365 σας δίνει τη δυνατότητα να προσαρμόσετε το template του παραστατικού σας όπως εσείς επιθυμείτε.)</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="edit-template">
        <Col xl={5} xxl={5}>
          <Card style={{ padding: "0.4rem", height: "72rem" }}>
            <Card.Body className="card-form-inputs">
              <div className="colors-body">
                <Row>
                  <Col xl={12} xxl={12}>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Λογότυπο επιχείρησης</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xl={6} xxl={6}>
                    <Form.Label htmlFor="exampleColorInput">
                      Πρωτεύον χρώμα
                    </Form.Label>
                    <Sketch
                      color={formData.colors[0]}
                      onChange={(color) => handleColorChange(color, 0)}
                    />
                  </Col>
                  <Col xl={6} xxl={6}>
                    <Form.Label htmlFor="exampleColorInput">
                      Δευτερεύον χρώμα
                    </Form.Label>
                    <Sketch
                      color={formData.colors[1]}
                      onChange={(color) => handleColorChange(color, 1)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Form.Label>Μέγεθος κειμένου</Form.Label>
                  <Form.Range
                    name="textSize"
                    value={formData.textSize}
                    className="range"
                    onChange={handleSettingChange}
                  />
                </Row>
                <Row>
                  <Form.Label>Μέγεθος logo</Form.Label>
                  <Form.Range
                    name="logoSize"
                    value={formData.logoSize}
                    className="range"
                    onChange={handleSettingChange}
                  />
                </Row>
                <Row>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Παρατηρήσεις</Form.Label>
                    <Form.Control name="notes" value={formData.notes} onChange={handleSettingChange} as="textarea" rows={3} />
                  </Form.Group>
                </Row>
                <Row className="btn_save">
                  <Button onClick={handleSubmit} variant="success" className='btn_success'>
                    <i className="feather icon-save" />
                    Αποθήκευση αλλαγών
                  </Button>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={7} xxl={7}>
          <Card style={{ padding: "0.4rem", height: "72rem" }}>
            <Card.Body>
              <div>
                <Row className="template-header" style={{ alignItems: "center" }}>
                  <Col xl={6} xxl={6}>
                    {formData.logoImageUrl && (
                      <img src={formData.logoImageUrl} alt="Logo" style={{ width: `${formData.logoSize}rem`, height: `${formData.logoSize}rem` }} />
                    )}
                    {(imageSrc && !formData.logoImageUrl) ? (<img src={imageSrc} alt="Uploaded Logo" style={{ width: `${formData.logoSize}rem`, height: `${formData.logoSize}rem` }} />):null}
                  </Col>
                  <Col xl={6} xxl={6}>
                    <div style={{ textAlign: "right", color: formData.colors[0] }}>
                      {userData.length > 0 && (
                        <>
                          <h1 style={{ margin: 0, fontSize: `${formData.textSize}px`, color: formData.colors[0] }}>
                            {userData[0].name}
                          </h1>
                          <div>{userData[0].address} {userData[0].street_number}</div>
                          <div>ΑΦΜ: {userData[0].afm}, ΔΟΥ: {userData[0].doy}</div>
                          <div>ΤΗΛ: {userData[0].tel_number}, E-MAIL: {userData[0].email}</div>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row className="title-type">
                  <Col xl={9} xxl={9}>
                    <h4 style={{ color: formData.colors[0], fontWeight: 'bold' }}>Τύπος παραστατικού</h4>
                  </Col>
                  <Col xl={3} xxl={3}>
                    <span className="invoice-date">dd/mm/yyyy</span>
                  </Col>
                </Row>
                <div className="customer-data">
                  <Row>
                    <Col xl={6} xxl={6}>
                      <span style={{ color: formData.colors[1] }}>Επωνυμία:</span>
                    </Col>
                    <Col xl={6} xxl={6}>
                      <span style={{ color: formData.colors[1] }}>Χώρα:</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={6} xxl={6}>
                      <span style={{ color: formData.colors[1] }}>ΑΦΜ:</span>
                    </Col>
                    <Col xl={6} xxl={6}>
                      <span style={{ color: formData.colors[1] }}>Πόλη:</span>
                    </Col>
                  </Row>
                  <Row className="title-type">
                    <Col xl={6} xxl={6}>
                      <span style={{ color: formData.colors[1] }}>Επάγγελμα:</span>
                    </Col>
                    <Col xl={6} xxl={6}>
                      <span style={{ color: formData.colors[1] }}>Διεύθυνση:</span>
                    </Col>
                  </Row>
                </div>
                <div style={{ marginTop: 90 }}>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ color: formData.colors[0] }}>Προϊόν</th>
                        <th style={{ color: formData.colors[0] }}>Ποσότητα</th>
                        <th style={{ color: formData.colors[0] }}>Μ.Μ</th>
                        <th style={{ color: formData.colors[0] }}>Τιμή προ ΦΠΑ</th>
                        <th style={{ color: formData.colors[0] }}>ΦΠΑ</th>
                        <th style={{ color: formData.colors[0] }}>Τελική τιμή</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr className="data" style={{ color: formData.colors[1] }} key={index}>
                          <td>{item.item}</td>
                          <td>{item.quantity}</td>
                          <td>test</td>
                          <td>{item.amount}</td>
                          <td>test</td>
                          <td>{item.amount}</td>
                        </tr>
                      ))}
                      <tr className="total">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Καθαρή αξία:</td>
                        <td></td>
                        <td>test</td>
                      </tr>
                      <tr className="total">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Έκπτωση:</td>
                        <td></td>
                        <td>test</td>
                      </tr>
                      <tr className="total">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Σύνολο ΦΠΑ:</td>
                        <td></td>
                        <td>test</td>
                      </tr>
                      <tr className="total">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ color: '#000000' }}>Σύνολο:</td>
                        <td></td>
                        <td style={{ color: '#000000' }}>test</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ResultModal show={resultOpen} status={status} title={title} body={body} onHide={handleClose} />
    </React.Fragment>
  );
};

export default PdfEditTemplate;
