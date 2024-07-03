import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Sketch } from "@uiw/react-color";
import UserService from "../../services/UserService";
import "./pdf.css";
import PdfService from "../../services/PdfService";

const PdfEditTemplate = () => {
  const [templateSettings, setTemplateSettings] = useState({
    textSize: 15,
    logoSize: 7,
    colors: ["#000000", "#444444"],
    logoImage: null,
    logoImageUrl: null 
  });
  
  
  const id = useSelector(state => state.auth.user.user.id);
  const [userData, setUserData] = useState([]);
  const [invoice, setInvoice] = useState({
    invoice_nr: 123,
    subtotal: 100,
    paid: 50,
    items: [
      { item: "DELL", description: "A sample item", quantity: 1, amount: 50 },
      { item: "Lenovo", description: "Another sample item", quantity: 2, amount: 250 }
    ],
    shipping: {
      name: "John Doe",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
    }
  });

  useEffect(() => {
    const findUserData = async () => {
      try {
        const response = await UserService.findUserData(id);
        if (response.status === 200) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUserData([]);
      }
    };

    document.documentElement.style.setProperty('--text-size', `${templateSettings.textSize}px`);
    findUserData();
  }, [id, templateSettings.textSize]);

  const handleColorChange = (color, index) => {
    setTemplateSettings(prev => ({
      ...prev,
      colors: prev.colors.map((c, idx) => idx === index ? color.hex : c)
    }));
  };

  const handleSettingChange = (event) => {
    const { name, value } = event.target;
    setTemplateSettings(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Δημιουργία Data URL για προβολή
      const reader = new FileReader();
      reader.onloadend = () => {
        setTemplateSettings(prev => ({
          ...prev,
          logoImage: file,  // Κράτα το αρχείο για την αποστολή
          logoImageUrl: reader.result // Κράτα το URL για προβολή στο frontend
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("textSize", templateSettings.textSize);
    formData.append("logoSize", templateSettings.logoSize);
    formData.append("firstColor", templateSettings.colors[0]);
    formData.append("secondColor", templateSettings.colors[1]);
    if (templateSettings.logoImage) {
      formData.append("logoImage", templateSettings.logoImage);
    }
  
    PdfService.insertPdfData(formData,id)
    .then(response => {
        if(response.status === 201) {
          console.log(response);
        }
    }).catch(error => {
        console.log(error);
    });
  };
  
  

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
                      color={templateSettings.colors[0]} 
                      onChange={(color) => handleColorChange(color, 0)}
                    />
                  </Col>
                  <Col xl={6} xxl={6}>
                    <Form.Label htmlFor="exampleColorInput">
                      Δευτερεύον χρώμα
                    </Form.Label>
                    <Sketch
                      color={templateSettings.colors[1]} 
                      onChange={(color) => handleColorChange(color, 1)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Form.Label>Μέγεθος κειμένου</Form.Label>
                  <Form.Range 
                    name="textSize"
                    value={templateSettings.textSize}
                    className="range" 
                    onChange={handleSettingChange} 
                  />
                </Row>
                <Row>
                  <Form.Label>Μέγεθος logo</Form.Label>
                  <Form.Range 
                    name="logoSize"
                    value={templateSettings.logoSize}
                    className="range" 
                    onChange={handleSettingChange} 
                  />
                </Row>
                <Row>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Παρατηρήσεις</Form.Label>
                    <Form.Label>Παρατηρήσεις</Form.Label>
                    <Form.Control as="textarea" rows={3} />
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
                    {templateSettings.logoImageUrl && (
                      <img src={templateSettings.logoImageUrl} alt="Logo" style={{ width: `${templateSettings.logoSize}rem`, height: `${templateSettings.logoSize}rem` }} />
                    )}
                  </Col>
                  <Col xl={6} xxl={6}>
                    <div style={{ textAlign: "right", color: templateSettings.colors[0] }}>
                      {userData.length > 0 && (
                        <>
                          <h1 style={{ margin: 0, fontSize: `${templateSettings.textSize}px`, color: templateSettings.colors[0] }}>
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
                    <h4 style={{ color: templateSettings.colors[0], fontWeight: 'bold' }}>Τιμολόγιο</h4>
                  </Col>
                  <Col xl={3} xxl={3}>
                    <span className="invoice-date">10/06/2024</span>
                  </Col>
                </Row>
                <div className="customer-data">
                  <Row>
                    <Col xl={6} xxl={6}>
                      <span style={{ color: templateSettings.colors[1] }}>Επωνυμία:</span>
                    </Col>
                    <Col xl={6} xxl={6}>
                      <span style={{ color: templateSettings.colors[1] }}>Χώρα:</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={6} xxl={6}>
                      <span style={{ color: templateSettings.colors[1] }}>ΑΦΜ:</span>
                    </Col>
                    <Col xl={6} xxl={6}>
                      <span style={{ color: templateSettings.colors[1] }}>Πόλη:</span>
                    </Col>
                  </Row>
                  <Row className="title-type">
                    <Col xl={6} xxl={6}>
                      <span style={{ color: templateSettings.colors[1] }}>Επάγγελμα:</span>
                    </Col>
                    <Col xl={6} xxl={6}>
                      <span style={{ color: templateSettings.colors[1] }}>Διεύθυνση:</span>
                    </Col>
                  </Row>
                </div>
                <div style={{ marginTop: 90 }}>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ color: templateSettings.colors[0] }}>Προϊόν</th>
                        <th style={{ color: templateSettings.colors[0] }}>Ποσότητα</th>
                        <th style={{ color: templateSettings.colors[0] }}>Μ.Μ</th>
                        <th style={{ color: templateSettings.colors[0] }}>Τιμή προ ΦΠΑ</th>
                        <th style={{ color: templateSettings.colors[0] }}>ΦΠΑ</th>
                        <th style={{ color: templateSettings.colors[0] }}>Τελική τιμή</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr className="data" style={{ color: templateSettings.colors[1] }} key={index}>
                          <td>{item.item}</td>
                          <td>{item.quantity}</td>
                          <td>τεμ.</td>
                          <td>{item.amount}€</td>
                          <td>24%</td>
                          <td>{item.amount}€</td>
                        </tr>
                      ))}
                      <tr className="total">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Καθαρή αξία:</td>
                        <td></td>
                        <td>200</td>
                      </tr>
                      <tr className="total">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Έκπτωση:</td>
                        <td></td>
                        <td>200</td>
                      </tr>
                      <tr className="total">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Σύνολο ΦΠΑ:</td>
                        <td></td>
                        <td>200</td>
                      </tr>
                      <tr className="total">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ color: '#000000' }}>Σύνολο:</td>
                        <td></td>
                        <td style={{ color: '#000000' }}>200</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default PdfEditTemplate;
