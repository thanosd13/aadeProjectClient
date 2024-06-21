import React, {useState} from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { useDispatch } from 'react-redux';
import { register } from '../../../actions/auth';

const SignUp1 = () => {

  const dispatch = useDispatch();
  const[error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  const handleSubmit = () => {

    if(!validateEmail(formData.username)) {
      setError("Μη έγκυρη διεύθυνση ηλεκτρονικού ταχυδρομίου!");
      return;
    }

    if(!formData.username || !formData.password) {
      setError("Συμπληρώστε και τα δύο πεδία!");
      return;
    };

    dispatch(register(formData))
    .then((response) => {
        if(response.status === 201) {
          navigate("/login");
        }
    })
    .catch((error) => {
      console.error("Complete error object:", error);
      if (error && error.response) {
        if (error.response.status === 409) {
          setError("Ο λογαριασμός υπάρχει ήδη!");
        } else {
          setError("Κάποιο λάθος προέκυψε!");
        }
      } else {
        // This case handles network errors or other types of errors that do not produce a standard response object
        setError("Πρόβλημα στην επικοινωνία με τον διακομιστή!");
      }
    });
  }

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>

                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Εγγραφή</h3>
                  {error &&
                    <Col sm={12}>
                      <Alert variant="danger">{error}</Alert>
                    </Col>
                  }
                  <div className="input-group mb-3">
                    <input onChange={handleChange} type="email" className="form-control" placeholder="Διεύθυνση e-mail" name="username" value={formData.username} />
                  </div>
                  <div className="input-group mb-4">
                    <input onChange={handleChange} type="password" className="form-control" placeholder="Κωδικός πρόσβασης" name="password" value={formData.password} />
                  </div>
                  <button onClick={handleSubmit} className="btn btn-primary mb-4">Εγγραφή</button>
                  <p className="mb-2">
                    Έχετε ήδη λογαριασμό;{' '}
                    <NavLink to="/auth/signin-1" className="f-w-400">
                      Σύνδεση
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
